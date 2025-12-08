#!/bin/bash
# Atomically claim next available tool using git push as lock

set -e

INSTANCE_ID="${1:-}"
MAX_RETRIES="${2:-10}"

if [ -z "$INSTANCE_ID" ]; then
  echo "Usage: $0 <instance-id> [max-retries]"
  echo "Example: $0 alpha 10"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FUTURE_TOOLS_DIR="$(dirname "$SCRIPT_DIR")"
cd "$FUTURE_TOOLS_DIR"

attempt=0

while [ $attempt -lt $MAX_RETRIES ]; do
  attempt=$((attempt + 1))

  # Pull latest state
  git pull origin main --rebase --quiet 2>/dev/null || true

  # Find first available high-priority tool
  available_tool=$(jq -r '
    .tools |
    to_entries |
    map(select(.value.status == "available" and .value.priority == "high")) |
    sort_by(.value.estimatedHours) |
    .[0].key // empty
  ' coordination.json)

  if [ -z "$available_tool" ]; then
    echo "No available tools"
    exit 1
  fi

  echo "[Attempt $attempt/$MAX_RETRIES] Claiming: $available_tool"

  # Get current timestamp
  timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

  # Claim the tool
  jq --arg tool "$available_tool" \
     --arg instance "$INSTANCE_ID" \
     --arg timestamp "$timestamp" '
    .tools[$tool].status = "in-progress" |
    .tools[$tool].assignedTo = $instance |
    .tools[$tool].claimedAt = $timestamp |
    .instances[$instance].currentTool = $tool |
    .instances[$instance].lastHeartbeat = $timestamp |
    .stats.available -= 1 |
    .stats.inProgress += 1
  ' coordination.json > coordination.tmp && mv coordination.tmp coordination.json

  # Atomic claim via push
  git add coordination.json
  git commit -m "Instance $INSTANCE_ID: Claim $available_tool" --quiet

  if git push origin main --quiet 2>/dev/null; then
    echo "✓ Successfully claimed: $available_tool"
    echo "$available_tool"
    exit 0
  else
    # Conflict - someone else pushed first
    echo "✗ Conflict detected, retrying..."
    git reset --hard origin/main --quiet

    # Random backoff 1-3 seconds
    sleep $((RANDOM % 3 + 1))
  fi
done

echo "Failed to claim tool after $MAX_RETRIES attempts"
exit 1
