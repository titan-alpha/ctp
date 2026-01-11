# MCP Server: Reddit Marketing Orchestration

A Model Context Protocol (MCP) server that wraps the conversation-analyzer and behavior-automation systems, enabling Claude to orchestrate Reddit engagement with visual feedback via computer-control-2.

## Overview

This MCP server provides tools and resources for managing Reddit marketing campaigns with human-like behavioral patterns. It integrates with the conversation-analyzer to generate helpful comments and maintains state about accounts, comment queues, and subreddit engagement metrics.

## Features

- **Comment Generation**: Generate helpful, non-promotional comments for Reddit posts
- **Account Management**: Track karma, phases, shadow-ban status, and metrics
- **RSS Monitoring**: Analyze subreddit opportunities in real-time
- **Behavioral Metadata**: Convert LLM-generated behavioral patterns to actionable instructions
- **State Management**: SQLite database for persistent state tracking
- **Queue Management**: Prioritize and schedule comments for posting

## Installation

```bash
npm install
npm run build
```

## Usage

### As MCP Server

Add to your MCP client configuration (e.g., Claude Desktop):

```json
{
  "mcpServers": {
    "reddit-marketing": {
      "command": "node",
      "args": ["/path/to/mcp-server-reddit-marketing/dist/index.js"]
    }
  }
}
```

### Database Location

The SQLite database is stored at `./reddit-marketing.db` by default.

## MCP Tools

### `generate_helpful_comments`

Generate helpful comments for Reddit posts using conversation-analyzer.

**Parameters:**
- `phase` (optional): Account phase - accountWarming, reputationBuilding, gradualPromotional, stableOperation
- `maxResults` (optional): Maximum results (default: 10)
- `subreddits` (optional): Filter by specific subreddits

**Returns:** List of comment opportunities with behavioral metadata

### `get_account_state`

Get Reddit account state including karma, age, phase, and metrics.

**Parameters:**
- `accountId` or `username`: Account identifier
- `includeMetrics` (optional): Include metrics (default: true)
- `includeActivity` (optional): Include activity history (default: true)

**Returns:** Account state with metrics and recent activity

### `update_account_state`

Update account state (karma, phase, shadow-ban status).

**Parameters:**
- `accountId`: Account ID to update
- `karma` (optional): New karma value
- `accountAge` (optional): Account age in days
- `currentPhase` (optional): New phase
- `shadowBanStatus` (optional): Shadow-ban status
- `cqsScore` (optional): Content Quality Score (0-100)

**Returns:** Updated account state

### `create_account`

Create a new Reddit account in the tracking database.

**Parameters:**
- `username`: Reddit username

**Returns:** New account state

### `analyze_subreddit_opportunities`

Analyze subreddit(s) for comment opportunities using RSS feeds.

**Parameters:**
- `subreddit` (optional): Specific subreddit (analyzes all if not specified)
- `maxAgeHours` (optional): Maximum post age (default: 24)
- `minRelevanceScore` (optional): Minimum relevance (default: 85)

**Returns:** List of opportunities by subreddit

### `get_typing_instructions`

Convert behavioral metadata to step-by-step typing instructions.

**Parameters:**
- `opportunityId` or `behavioralMetadata`: Source of behavioral data

**Returns:** Formatted typing instructions for Claude

### `get_mouse_workflow_instructions`

Convert mouse workflow to browser action instructions.

**Parameters:**
- `opportunityId` or `behavioralMetadata`: Source of behavioral data

**Returns:** Formatted mouse workflow instructions

### `queue_comment`

Add a comment to the posting queue with priority and scheduling.

**Parameters:**
- `accountId`: Account to post from
- `opportunityId`: Comment opportunity ID
- `priority` (optional): low, medium, high, urgent (default: medium)
- `scheduledFor` (optional): ISO timestamp to schedule

**Returns:** Queued comment details

### `recalculate_metrics`

Recalculate account metrics from activity history.

**Parameters:**
- `accountId`: Account ID to recalculate

**Returns:** Updated metrics

## MCP Resources

### `account://{accountId}`

Account profile data including history and metrics.

**Data includes:**
- Account state (karma, phase, CQS score)
- Metrics (total comments, success rate, engagement)
- Recent activity history
- Recommendations for phase progression

### `queue://pending-comments`

Comments waiting to be posted, organized by priority.

**Data includes:**
- Comments grouped by priority (urgent, high, medium, low)
- Statistics by type and subreddit
- Next recommended comment to post

### `queue://scheduled-comments`

Comments scheduled for future posting.

**Data includes:**
- All scheduled comments sorted by time
- Next 24-hour statistics

### `subreddit://{name}/state`

Subreddit engagement metrics and posting recommendations.

**Data includes:**
- Last scan time and opportunities found
- Average engagement and recommended frequency
- Posting schedule and next available post time
- Recommendations for optimization

## Database Schema

### Tables

- **accounts**: Account state (karma, phase, shadow-ban status, CQS score)
- **account_metrics**: Calculated metrics (comments, upvotes, success rate)
- **activity_log**: Activity history (comments, karma changes, phase changes)
- **comment_queue**: Pending and scheduled comments
- **subreddit_state**: Subreddit metrics and recommendations

### Account Phases

1. **accountWarming** (Days 1-30): 100% helpful comments, target 100 karma
2. **reputationBuilding** (Days 31-60): 100% helpful comments, target 500 karma
3. **gradualPromotional** (Days 61-90): 95% helpful, 5% promotional
4. **stableOperation** (Days 91+): 90% helpful, 10% promotional

## Integration with Conversation Analyzer

This MCP server wraps the conversation-analyzer located at:
```
/Users/titan-2/Documents/workspace/convenience-pro/convenience-pro-website/corporate/marketing/channels/reddit/conversation-analyzer
```

It calls the following scripts:
- `npm run generate:helpful` - Generate helpful comments
- RSS fetcher for subreddit monitoring

## Architecture

```
MCP Server (this)
├── Tools (Actions Claude can take)
│   ├── Generate Comments (calls conversation-analyzer)
│   ├── Account Management (read/write DB)
│   ├── RSS Monitoring (analyze opportunities)
│   └── Behavioral Helpers (convert metadata to instructions)
├── Resources (Data Claude can read)
│   ├── Account State
│   ├── Comment Queue
│   └── Subreddit State
└── State (SQLite DB)
    ├── Accounts
    ├── Metrics
    ├── Activity Log
    ├── Comment Queue
    └── Subreddit State
```

## Error Handling

All tools include comprehensive error handling and logging:
- Database errors are caught and reported
- Missing resources return clear error messages
- Invalid parameters are validated before execution
- All errors include context for debugging

## Development

```bash
# Watch mode (auto-rebuild on changes)
npm run watch

# Build only
npm run build
```

## License

MIT
