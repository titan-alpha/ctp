#!/bin/bash
# Background heartbeat - run this in background to keep instance alive

INSTANCE_ID="${1:-}"
INTERVAL="${2:-300}"  # Default 5 minutes

if [ -z "$INSTANCE_ID" ]; then
  echo "Usage: $0 <instance-id> [interval-seconds]"
  echo "Example: $0 alpha 300"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FUTURE_TOOLS_DIR="$(dirname "$SCRIPT_DIR")"

echo "Starting heartbeat for instance: $INSTANCE_ID (interval: ${INTERVAL}s)"

while true; do
  sleep "$INTERVAL"

  cd "$FUTURE_TOOLS_DIR"

  # Pull latest (ignore conflicts)
  git pull origin main --rebase --quiet 2>/dev/null || {
    git reset --hard origin/main --quiet 2>/dev/null
  }

  # Update heartbeat timestamp
  timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

  jq --arg instance "$INSTANCE_ID" \
     --arg timestamp "$timestamp" '
    .instances[$instance].lastHeartbeat = $timestamp
  ' coordination.json > coordination.tmp && mv coordination.tmp coordination.json

  # Commit and push (ignore push failures)
  git add coordination.json
  git commit -m "Instance $INSTANCE_ID: Heartbeat" --quiet 2>/dev/null
  git push origin main --quiet 2>/dev/null || {
    # Push failed - reset and try again next cycle
    git reset --hard origin/main --quiet 2>/dev/null
  }

  echo "[$(date -u +"%Y-%m-%d %H:%M:%S")] Heartbeat sent"
done
