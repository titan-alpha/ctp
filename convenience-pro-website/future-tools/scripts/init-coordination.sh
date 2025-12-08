#!/bin/bash
# Initialize coordination.json from high-priority/ tools

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FUTURE_TOOLS_DIR="$(dirname "$SCRIPT_DIR")"
cd "$FUTURE_TOOLS_DIR"

echo "Initializing coordination from high-priority tools..."

# Extract tool metadata from markdown files
tools_json="{"

for file in high-priority/*.md; do
  [ -e "$file" ] || continue

  tool_name=$(basename "$file" .md)

  # Extract estimated hours (default 4 if not found)
  hours=$(grep -E "Total.*hours" "$file" | grep -oE '[0-9]+' | head -1 || echo "4")

  # Extract priority score (default high)
  priority="high"

  tools_json+="\"$tool_name\":{\"status\":\"available\",\"priority\":\"$priority\",\"estimatedHours\":$hours},"
done

# Remove trailing comma
tools_json="${tools_json%,}}"

# Count tools
total=$(echo "$tools_json" | jq 'length')

# Update coordination.json
jq --argjson tools "$tools_json" --argjson total "$total" '
  .tools = $tools |
  .stats.totalTools = $total |
  .stats.available = $total
' coordination.json > coordination.tmp && mv coordination.tmp coordination.json

echo "Initialized $total tools"
echo ""
echo "Next steps:"
echo "  1. git add coordination.json"
echo "  2. git commit -m 'Initialize coordination state'"
echo "  3. git push origin main"
