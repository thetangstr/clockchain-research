#!/usr/bin/env bash
# Pick a topic key from config/topics.yaml that was NOT used in the last 2 briefs.
# If multiple are eligible, pick deterministically by hashing today's date so
# Tue and Fri the same week tend to pick different tracks.

set -euo pipefail
PKG_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REPO_DIR="$(cd "$PKG_DIR/../.." && pwd)"
TOPICS="$PKG_DIR/config/topics.yaml"
BRIEFS="$REPO_DIR/src/data/briefs"

# All track keys (top-level keys under "tracks:")
# Portable to bash 3.2 (macOS default) — no mapfile.
ALL_KEYS=()
while IFS= read -r line; do
  [ -n "$line" ] && ALL_KEYS+=("$line")
done < <(awk '
  /^tracks:/ {in_tracks=1; next}
  in_tracks && /^  [a-z][a-z0-9-]*:/ {
    sub(/:.*/,""); sub(/^  /,""); print
  }
' "$TOPICS")

if [ "${#ALL_KEYS[@]}" -eq 0 ]; then
  echo "ERROR: no track keys found in $TOPICS" >&2; exit 2
fi

# Last 2 brief files by slug (newest first)
LATEST_BRIEFS=()
while IFS= read -r line; do
  [ -n "$line" ] && LATEST_BRIEFS+=("$line")
done < <(ls -1 "$BRIEFS" 2>/dev/null | grep -v '^\.gitkeep$' | sort -r | head -2)

# Match each track's keywords against the last 2 brief slugs.
# A track is "covered" if ANY keyword from its keywords list appears in EITHER recent slug.
is_covered() {
  local key="$1"
  local kws
  kws="$(awk -v k="$key" '
    BEGIN {in_track=0}
    $0 ~ "^  "k":$" {in_track=1; next}
    in_track && /^  [a-z][a-z0-9-]*:$/ {in_track=0}
    in_track && /^    keywords:/ {
      sub(/^    keywords: */,"")
      gsub(/[\[\]]/,"")
      print; exit
    }
  ' "$TOPICS")"
  [ -z "$kws" ] && return 1
  local IFS=','
  for kw in $kws; do
    kw="$(echo "$kw" | tr -d ' ')"
    [ -z "$kw" ] && continue
    for slug in "${LATEST_BRIEFS[@]:-}"; do
      if [[ "$slug" == *"$kw"* ]]; then
        return 0
      fi
    done
  done
  return 1
}

ELIGIBLE=()
for k in "${ALL_KEYS[@]}"; do
  if ! is_covered "$k"; then ELIGIBLE+=("$k"); fi
done

# Fallback: if all are "covered" (rare), fall back to all keys.
if [ "${#ELIGIBLE[@]}" -eq 0 ]; then
  ELIGIBLE=("${ALL_KEYS[@]}")
fi

# Deterministic pick: use today's UTC date as a hash seed.
DATE_HASH="$(date -u +%Y%j | cksum | awk '{print $1}')"
INDEX=$(( DATE_HASH % ${#ELIGIBLE[@]} ))
echo "${ELIGIBLE[$INDEX]}"
