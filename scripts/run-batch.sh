#!/usr/bin/env bash
# Rate-limit-aware batch runner for fetch-crossword.mjs.
# Reads theme|difficulty|id|title lines from batch-manifest.txt, calls the
# API for each, retrying on transient rate-limit errors and stopping
# cleanly (not erroring the whole batch) on real credit exhaustion.
set -uo pipefail
cd "$(dirname "$0")/.."

LOG=/tmp/claude-1000/-home-benm-repos-blomscrosswordbonanza/c584a96a-3ee3-4ce3-90df-d81b7f32c2bf/scratchpad/batch.log
: > "$LOG"

while IFS='|' read -r theme difficulty id title; do
  [ -z "$theme" ] && continue
  attempt=0
  while :; do
    attempt=$((attempt + 1))
    out=$(node scripts/fetch-crossword.mjs --theme "$theme" --difficulty "$difficulty" --id "$id" --title "$title" 2>&1)
    echo "$out" >> "$LOG"
    if echo "$out" | grep -q "Wrote "; then
      echo "OK: $id" >> "$LOG"
      break
    elif echo "$out" | grep -q "Rate limit"; then
      echo "RATE LIMITED on $id, waiting 15s (attempt $attempt)" >> "$LOG"
      sleep 15
      continue
    else
      echo "STOP: $id failed with non-retryable error, halting batch" >> "$LOG"
      echo "BATCH_HALTED" >> "$LOG"
      exit 1
    fi
  done
  sleep 13
done < scripts/batch-manifest.txt

echo "BATCH_COMPLETE" >> "$LOG"
