#!/bin/bash
# Register a new instance in coordination.json

set -e

INSTANCE_ID="${1:-}"

if [ -z "$INSTANCE_ID" ]; then
  echo "Usage: $0 <instance-id>"
  echo "Example: $0 alpha"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FUTURE_TOOLS_DIR="$(dirname "$SCRIPT_DIR")"
cd "$FUTURE_TOOLS_DIR"

echo "Registering instance: $INSTANCE_ID"

# Pull latest
git pull origin main --rebase --quiet

# Check if instance already exists
exists=$(jq -r --arg instance "$INSTANCE_ID" '.instances[$instance] // empty' coordination.json)

if [ -n "$exists" ]; then
  echo "Instance $INSTANCE_ID already registered"
  echo "Current status: $(echo "$exists" | jq -r '.status')"
  exit 1
fi

# Get timestamp
timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Register instance
jq --arg instance "$INSTANCE_ID" \
   --arg timestamp "$timestamp" '
  .instances[$instance] = {
    "status": "active",
    "startedAt": $timestamp,
    "lastHeartbeat": $timestamp,
    "currentTool": null,
    "toolsCompleted": 0
  } |
  .stats.activeInstances += 1
' coordination.json > coordination.tmp && mv coordination.tmp coordination.json

# Commit and push
git add coordination.json
git commit -m "Instance $INSTANCE_ID: Register" --quiet
git push origin main

echo "✓ Instance $INSTANCE_ID registered"
echo ""
echo "Next steps:"
echo "  1. Start heartbeat: ./scripts/heartbeat.sh $INSTANCE_ID &"
echo "  2. Claim a tool: ./scripts/claim-tool.sh $INSTANCE_ID"
