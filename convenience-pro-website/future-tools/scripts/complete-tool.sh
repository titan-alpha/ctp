#!/bin/bash
# Mark tool as completed and move to completed/ directory

set -e

TOOL="${1:-}"
INSTANCE_ID="${2:-}"

if [ -z "$TOOL" ] || [ -z "$INSTANCE_ID" ]; then
  echo "Usage: $0 <tool-name> <instance-id>"
  echo "Example: $0 pdf-merger alpha"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FUTURE_TOOLS_DIR="$(dirname "$SCRIPT_DIR")"
cd "$FUTURE_TOOLS_DIR"

# Pull latest
git pull origin main --rebase --quiet

# Verify tool is assigned to this instance
assigned=$(jq -r --arg tool "$TOOL" '.tools[$tool].assignedTo // empty' coordination.json)

if [ "$assigned" != "$INSTANCE_ID" ]; then
  echo "Error: Tool $TOOL is not assigned to instance $INSTANCE_ID"
  exit 1
fi

echo "Completing tool: $TOOL"

# Get timestamp
timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Update coordination
jq --arg tool "$TOOL" \
   --arg instance "$INSTANCE_ID" \
   --arg timestamp "$timestamp" '
  .tools[$tool].status = "completed" |
  .tools[$tool].completedAt = $timestamp |
  .instances[$instance].currentTool = null |
  .instances[$instance].toolsCompleted += 1 |
  .stats.inProgress -= 1 |
  .stats.completed += 1
' coordination.json > coordination.tmp && mv coordination.tmp coordination.json

# Move analysis file to completed/
mkdir -p completed
if [ -f "high-priority/${TOOL}.md" ]; then
  mv "high-priority/${TOOL}.md" "completed/${TOOL}.md"
  echo "Moved analysis to completed/"
fi

# Commit and push
git add coordination.json high-priority/ completed/
git commit -m "Instance $INSTANCE_ID: Complete $TOOL" --quiet
git push origin main

echo "✓ Tool $TOOL marked as completed"
