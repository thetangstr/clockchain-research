#!/usr/bin/env bash
# Branch, commit, push, and open a PR for a new brief JSON file.
# Usage: ./open-pr.sh <path-to-new-brief.json>

set -euo pipefail
NEW_BRIEF="${1:-}"
if [ -z "$NEW_BRIEF" ] || [ ! -f "$NEW_BRIEF" ]; then
  echo "ERROR: pass the path to the new brief JSON as the first argument." >&2; exit 2
fi

PKG_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REPO_DIR="$(cd "$PKG_DIR/../.." && pwd)"
cd "$REPO_DIR"

REPO_SLUG="${REPO_SLUG:-}"

SLUG="$(python3 -c "import json,sys;print(json.load(open(sys.argv[1]))['slug'])" "$NEW_BRIEF")"
TITLE="$(python3 -c "import json,sys;print(json.load(open(sys.argv[1]))['title'])" "$NEW_BRIEF")"
DATE="$(python3 -c "import json,sys;print(json.load(open(sys.argv[1]))['date'])" "$NEW_BRIEF")"
TLDR="$(python3 -c "import json,sys;print(json.load(open(sys.argv[1]))['tldr'])" "$NEW_BRIEF")"
NEXT_UP="$(python3 -c "import json,sys
b=json.load(open(sys.argv[1]))
for q in b['nextUp']: print(f'- {q}')" "$NEW_BRIEF")"

BRANCH="brief/${SLUG}"
COMMIT_MSG="Brief — ${DATE} — ${TITLE}"

# Don't create a duplicate branch if one already exists locally
if git show-ref --verify --quiet "refs/heads/$BRANCH"; then
  echo "WARN: local branch $BRANCH already exists; switching to it."
  git checkout "$BRANCH"
else
  git checkout -b "$BRANCH"
fi

# Stage ONLY the new brief — do not pick up any other modifications
git add "$NEW_BRIEF"
if git diff --cached --quiet; then
  echo "ERROR: nothing staged. Did the brief already exist on this branch?" >&2; exit 3
fi

git commit -m "$COMMIT_MSG"
git push -u origin "$BRANCH"

# Open PR (best-effort; if gh fails, print the manual command)
PR_BODY=$(cat <<BODY
## Topic
${TITLE}

## TL;DR
${TLDR}

## Ask me next
${NEXT_UP}

## Notes
Merging this PR triggers Vercel auto-deploy. The new brief becomes live at /brief within roughly sixty seconds of merge.
BODY
)

if command -v gh >/dev/null 2>&1; then
  if gh pr create --base main --head "$BRANCH" --title "$COMMIT_MSG" --body "$PR_BODY"; then
    echo "PR opened."
  else
    echo "WARN: gh pr create failed. Branch is pushed; open the PR manually."
    if [ -n "$REPO_SLUG" ]; then
      echo "  https://github.com/${REPO_SLUG}/compare/main...${BRANCH}?expand=1"
    fi
  fi
else
  echo "gh CLI not installed. Branch pushed. Open the PR manually."
  if [ -n "$REPO_SLUG" ]; then
    echo "  https://github.com/${REPO_SLUG}/compare/main...${BRANCH}?expand=1"
  fi
fi

# Return to main for the next run
git checkout main >/dev/null 2>&1 || true
