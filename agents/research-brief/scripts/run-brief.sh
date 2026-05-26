#!/usr/bin/env bash
# Entry point for the Clockchain Research Brief generator.
# Orchestrates: pull → pick topic → run last30days → hand off to agent for synthesis → validate → PR.
#
# Usage:
#   ./run-brief.sh                  # full run: research, synthesize (agent), validate, push, open PR
#   ./run-brief.sh --dry-run        # full run except no push and no PR (writes JSON locally only)
#   ./run-brief.sh --topic=KEY      # force a specific topic key from config/topics.yaml
#   ./run-brief.sh --no-research    # skip last30days; useful when re-synthesizing from existing raw output

set -euo pipefail

PKG_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REPO_DIR="$(cd "$PKG_DIR/../.." && pwd)"
LAST30="$PKG_DIR/tools/last30days/scripts/last30days.py"
RAW_DIR="${HOME}/Documents/Last30Days"
LOG_DIR="$PKG_DIR/.logs"
mkdir -p "$RAW_DIR" "$LOG_DIR"

DRY_RUN=false
FORCE_TOPIC=""
SKIP_RESEARCH=false
for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN=true ;;
    --topic=*) FORCE_TOPIC="${arg#--topic=}" ;;
    --no-research) SKIP_RESEARCH=true ;;
    *) echo "Unknown arg: $arg"; exit 2 ;;
  esac
done

# Load .env
if [ -f "$PKG_DIR/.env" ]; then
  set -a
  # shellcheck disable=SC1091
  . "$PKG_DIR/.env"
  set +a
fi

REPO_BRANCH="${REPO_BRANCH:-main}"
DATE_UTC="$(date -u +%Y-%m-%d)"
DAY_OF_WEEK="$(date -u +%A)"
RUN_LOG="$LOG_DIR/${DATE_UTC}-run.log"

log() { printf '[%s] %s\n' "$(date -u +%H:%M:%SZ)" "$*" | tee -a "$RUN_LOG"; }

log "==> Clockchain brief run started (date=${DATE_UTC} day=${DAY_OF_WEEK} dry_run=${DRY_RUN})"

# 1. Refresh the repo
cd "$REPO_DIR"
log "==> git pull origin ${REPO_BRANCH}"
git fetch origin "$REPO_BRANCH" >>"$RUN_LOG" 2>&1 || log "WARN: git fetch failed; continuing"
git checkout "$REPO_BRANCH" >>"$RUN_LOG" 2>&1 || log "WARN: git checkout failed; continuing"
git pull --ff-only origin "$REPO_BRANCH" >>"$RUN_LOG" 2>&1 || log "WARN: git pull failed; continuing"

# 2. Pick a topic (or use forced one)
if [ -n "$FORCE_TOPIC" ]; then
  TOPIC_KEY="$FORCE_TOPIC"
  log "==> Topic forced via flag: $TOPIC_KEY"
else
  TOPIC_KEY="$("$PKG_DIR/scripts/pick-topic.sh")"
  log "==> Topic picked: $TOPIC_KEY"
fi

# Extract topic title from topics.yaml
TOPIC_TITLE="$(awk -v key="$TOPIC_KEY" '
  $0 ~ "^  "key":" {found=1; next}
  found && /^    title:/ { sub(/^    title: */,""); gsub(/^"|"$/,""); print; exit }
' "$PKG_DIR/config/topics.yaml")"

if [ -z "$TOPIC_TITLE" ]; then
  log "ERROR: topic '$TOPIC_KEY' not found in topics.yaml"; exit 3
fi

log "==> Topic title: $TOPIC_TITLE"

# 3. Run last30days research (unless skipped)
TOPIC_SLUG="$(echo "$TOPIC_TITLE" | tr '[:upper:]' '[:lower:]' | tr -c 'a-z0-9' '-' | sed 's/--*/-/g; s/^-\|-$//g' | cut -c1-60)"
RAW_FILE="${RAW_DIR}/${TOPIC_SLUG}-raw.md"

if [ "$SKIP_RESEARCH" = true ]; then
  log "==> Skipping research (--no-research). Using existing $RAW_FILE if present."
elif [ ! -f "$LAST30" ]; then
  log "ERROR: last30days entry point not found at $LAST30"; exit 4
else
  log "==> Running last30days for: $TOPIC_TITLE"
  if ! python3 "$LAST30" "$TOPIC_TITLE" --emit=compact --no-native-web --save-dir="$RAW_DIR" >>"$RUN_LOG" 2>&1; then
    log "WARN: last30days exited non-zero. Continuing with whatever was saved."
  fi
  RAW_FILE="$(ls -t "${RAW_DIR}"/*-raw.md 2>/dev/null | head -1 || true)"
  if [ -z "$RAW_FILE" ]; then
    log "ERROR: no raw research file produced"; exit 5
  fi
  log "==> Raw research saved: $RAW_FILE"
fi

# 4. Hand off to the agent (synthesis step)
# This script does NOT call an LLM directly. The agent (Hermes / Claude / etc.) is the runtime.
cat <<HANDOFF
========== AGENT SYNTHESIS HANDOFF ==========
TOPIC_KEY=$TOPIC_KEY
TOPIC_TITLE=$TOPIC_TITLE
RAW_FILE=$RAW_FILE
DATE_UTC=$DATE_UTC
DAY_OF_WEEK=$DAY_OF_WEEK
EXPECTED_OUTPUT=$REPO_DIR/src/data/briefs/${DATE_UTC}-<short-slug>.json
SYNTHESIS_PROMPT=$PKG_DIR/prompts/synthesize.md
GOLD_REFERENCE_DIR=$PKG_DIR/examples
SCHEMA=$PKG_DIR/schema/brief.schema.json
STYLE=$PKG_DIR/style.md
CONTEXT_CLOCKCHAIN=$PKG_DIR/context/clockchain-overview.md
CONTEXT_PRODUCTS=$PKG_DIR/context/products-overview.md
=============================================
HANDOFF

# If running interactively without an agent runtime, the script pauses here.
if [ -t 0 ] && [ -z "${CLOCKCHAIN_BRIEF_NONINTERACTIVE:-}" ]; then
  log "==> Waiting for agent synthesis. Set CLOCKCHAIN_BRIEF_NONINTERACTIVE=1 to skip this prompt."
  printf "Press <enter> when the brief JSON has been written to src/data/briefs/, or Ctrl-C to abort: "
  read -r _ </dev/tty || true
fi

# 5. Validate
NEW_BRIEF="$(ls -t "$REPO_DIR/src/data/briefs/${DATE_UTC}-"*.json 2>/dev/null | head -1 || true)"
if [ -z "$NEW_BRIEF" ]; then
  log "ERROR: no new brief found at $REPO_DIR/src/data/briefs/${DATE_UTC}-*.json"; exit 6
fi
log "==> New brief: $NEW_BRIEF"

log "==> python3 -c json.load (syntax check)"
python3 -c "import json,sys; json.load(open(sys.argv[1]))" "$NEW_BRIEF" >>"$RUN_LOG" 2>&1

log "==> npx tsc --noEmit"
( cd "$REPO_DIR" && npx tsc --noEmit ) >>"$RUN_LOG" 2>&1

log "==> npx tsx src/lib/validate-data.ts"
( cd "$REPO_DIR" && npx tsx src/lib/validate-data.ts ) >>"$RUN_LOG" 2>&1 || log "WARN: validator reported failures; check manually."

# 6. Branch, commit, push, open PR (unless dry-run)
if [ "$DRY_RUN" = true ]; then
  log "==> Dry run — skipping push and PR."
  log "==> Brief written: $NEW_BRIEF"
  exit 0
fi

"$PKG_DIR/scripts/open-pr.sh" "$NEW_BRIEF" | tee -a "$RUN_LOG"
log "==> Done."
