#!/bin/bash
# Live monitoring dashboard for coordination state

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FUTURE_TOOLS_DIR="$(dirname "$SCRIPT_DIR")"

cd "$FUTURE_TOOLS_DIR"

# Pull latest before display
git pull origin main --rebase --quiet 2>/dev/null || true

echo "================================"
echo "Multi-Instance Coordination"
echo "Updated: $(date)"
echo "================================"
echo ""

# Overall stats
echo "STATS:"
jq -r '
  "  Total Tools: \(.stats.totalTools)",
  "  Available: \(.stats.available)",
  "  In Progress: \(.stats.inProgress)",
  "  Completed: \(.stats.completed)",
  "  Failed: \(.stats.failed)",
  "  Active Instances: \(.stats.activeInstances)"
' coordination.json

echo ""
echo "INSTANCES:"

# Active instances
jq -r '
  .instances |
  to_entries |
  map({
    id: .key,
    status: .value.status,
    tool: (.value.currentTool // "none"),
    completed: (.value.toolsCompleted // 0),
    heartbeat: (.value.lastHeartbeat // "never")
  }) |
  .[] |
  "  [\(.status)] \(.id) - Tool: \(.tool) | Completed: \(.completed) | HB: \(.heartbeat)"
' coordination.json

echo ""
echo "IN PROGRESS:"

# Tools in progress
jq -r '
  .tools |
  to_entries |
  map(select(.value.status == "in-progress")) |
  .[] |
  "  \(.key) - Assigned: \(.value.assignedTo) | Claimed: \(.value.claimedAt)"
' coordination.json

echo ""
echo "AVAILABLE (Next 5):"

# Next available tools
jq -r '
  .tools |
  to_entries |
  map(select(.value.status == "available")) |
  sort_by(.value.estimatedHours) |
  .[0:5] |
  .[] |
  "  \(.key) - Priority: \(.value.priority) | Est: \(.value.estimatedHours)h"
' coordination.json

echo ""
echo "================================"
