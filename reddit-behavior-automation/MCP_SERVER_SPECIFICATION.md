# MCP Server Specification: Reddit Marketing Orchestrator
## Intelligent AI-Driven Reddit Engagement System

**Version:** 1.0.0
**Date:** 2025-12-07
**Purpose:** Enable Claude to orchestrate Reddit guerrilla marketing with human-like behavioral patterns, visual feedback, and adaptive decision-making

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [MCP Tools Specification](#mcp-tools-specification)
4. [MCP Resources Specification](#mcp-resources-specification)
5. [State Management](#state-management)
6. [Integration with computer-control-2](#integration-with-computer-control-2)
7. [Orchestration Workflows](#orchestration-workflows)
8. [Security & Safety](#security--safety)
9. [Deployment Guide](#deployment-guide)

---

## Overview

### The Problem

Traditional Reddit automation fails because:
- ❌ Static scripts can't adapt to UI changes
- ❌ No visual feedback (blind execution)
- ❌ Can't handle unexpected scenarios (CAPTCHAs, popups)
- ❌ Lacks human-level judgment
- ❌ Follows rigid patterns (detectable)

### The Solution

**MCP-Orchestrated System:**
```
Claude (Intelligence Layer)
    ↓
MCP Server (Tool/Resource Layer)
    ↓
computer-control-2 (Execution Layer)
    ↓
Browser (Interaction Layer)
    ↓
Reddit (Target Platform)
```

**Key Capabilities:**
- ✅ Claude sees browser screen in real-time
- ✅ Adapts to visual changes instantly
- ✅ Makes human-level decisions
- ✅ Executes behavioral metadata as browser actions
- ✅ Monitors results and adjusts strategy
- ✅ Manages account state across sessions

---

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                    Claude (Orchestrator)                     │
│  - Generates comments                                        │
│  - Makes posting decisions                                   │
│  - Monitors account health                                   │
│  - Adapts strategy based on results                          │
└─────────────────────────────────────────────────────────────┘
                            ↓ MCP Protocol
┌─────────────────────────────────────────────────────────────┐
│              MCP Server: reddit-marketing                    │
│  Tools:                          Resources:                  │
│  - generate_helpful_comments     - account://{id}           │
│  - get_account_state              - queue://pending         │
│  - update_account_state           - subreddit://{name}      │
│  - analyze_opportunities                                    │
│  - get_typing_instructions                                  │
│  - get_mouse_workflow_instructions                          │
└─────────────────────────────────────────────────────────────┘
         ↓                    ↓                    ↓
┌──────────────┐   ┌──────────────────┐   ┌──────────────┐
│ Conversation │   │ State Management │   │   Behavior   │
│   Analyzer   │   │   (SQLite DB)    │   │  Automation  │
└──────────────┘   └──────────────────┘   └──────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    computer-control-2                        │
│  - Browser automation                                        │
│  - Mouse/keyboard control with behavioral patterns           │
│  - Screenshot/vision feedback                                │
│  - Bezier curves, Fitts's Law, realistic timing             │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                       Browser → Reddit                       │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

**Comment Generation Flow:**
```
1. Claude: "Generate 2 helpful comments for r/selfhosted"
2. MCP Tool: generate_helpful_comments({subreddits: ['selfhosted'], maxComments: 2})
3. Server → Conversation Analyzer: Fetch RSS, analyze with GPT-5-nano
4. Server ← Returns: Comments with behavioral metadata
5. Claude receives: Comment text + typing metadata + mouse workflow
6. Claude decides: "Comment 1 is perfect, Comment 2 needs adjustment"
```

**Posting Flow:**
```
1. Claude: "Post comment 1 for account reddit_001"
2. MCP Tool: get_account_state('reddit_001') → Check if ready to post
3. MCP Tool: get_typing_instructions(metadata) → Convert to actionable steps
4. MCP Tool: get_mouse_workflow_instructions(metadata) → Browser actions
5. Claude → computer-control-2: Execute browser automation with instructions
6. Claude observes: Watches screen, validates comment appears correctly
7. Claude → MCP Tool: update_account_state({commentsPosted: +1, karma: +3})
```

---

## MCP Tools Specification

### Tool 1: `generate_helpful_comments`

**Purpose:** Generate helpful Reddit comments with behavioral metadata

**Input Schema:**
```typescript
{
  subreddits: string[];           // e.g., ['selfhosted', 'webdev']
  maxComments: number;            // Max comments to generate
  phase: 'accountWarming' | 'reputationBuilding' | 'gradualPromotional' | 'stableOperation';
  minRelevanceScore?: number;     // Default: 85
  lookbackHours?: number;         // Default: 24
}
```

**Output Schema:**
```typescript
{
  comments: Array<{
    id: string;
    subreddit: string;
    postUrl: string;
    postTitle: string;
    postContent: string;
    responseText: string;
    behavioralMetadata: {
      typing: TypingBehavior;
      session: SessionContext;
      mouseWorkflow: MouseWorkflowStep[];
    };
    analysis: {
      helpfulnessScore: number;
      topicCategory: string;
      userSkillLevel: string;
      conversationalTone: string;
    };
  }>;
  metadata: {
    totalOpportunities: number;
    generatedCount: number;
    avgRelevanceScore: number;
    bySubreddit: Record<string, number>;
  };
}
```

**Implementation:**
```typescript
async function generateHelpfulComments(input: GenerateCommentsInput) {
  // 1. Get current phase config
  const phaseConfig = getCurrentPhaseConfig();

  // 2. Fetch RSS opportunities
  const opportunities = await analyzeSubredditOpportunities({
    subreddits: input.subreddits,
    lookbackHours: input.lookbackHours || 24
  });

  // 3. Generate comments via conversation-analyzer
  const results = await conversationAnalyzer.generateHelpfulComments(
    opportunities.slice(0, input.maxComments)
  );

  // 4. Return with metadata
  return {
    comments: results,
    metadata: {
      totalOpportunities: opportunities.length,
      generatedCount: results.length,
      avgRelevanceScore: calculateAverage(results.map(r => r.analysis.helpfulnessScore)),
      bySubreddit: groupBySubreddit(results)
    }
  };
}
```

---

### Tool 2: `get_account_state`

**Purpose:** Retrieve current state of a Reddit account

**Input Schema:**
```typescript
{
  accountId: string;              // e.g., 'reddit_001'
}
```

**Output Schema:**
```typescript
{
  accountId: string;
  username: string;
  karma: number;
  accountAge: number;             // Days since creation
  currentPhase: 'accountWarming' | 'reputationBuilding' | 'gradualPromotional' | 'stableOperation';
  commentsPosted: number;
  lastActivity: string;           // ISO timestamp
  shadowBanStatus: 'unknown' | 'clean' | 'suspected' | 'confirmed';
  cqsScore: number | null;        // Contributor Quality Score estimate
  metrics: {
    avgUpvotesPerComment: number;
    commentVisibilityRate: number;  // % of comments that aren't shadow-banned
    engagementRate: number;         // % of comments that get replies
    preferredSubreddits: string[];  // Where account performs best
  };
  history: Array<{
    timestamp: string;
    action: 'comment_posted' | 'upvotes_received' | 'shadow_ban_detected' | 'phase_changed';
    details: Record<string, any>;
  }>;
}
```

**Implementation:**
```typescript
async function getAccountState(input: { accountId: string }) {
  const db = getDatabase();

  // Fetch account data
  const account = db.prepare(`
    SELECT * FROM accounts WHERE id = ?
  `).get(input.accountId);

  // Fetch recent activity
  const history = db.prepare(`
    SELECT * FROM activity_log
    WHERE account_id = ?
    ORDER BY timestamp DESC
    LIMIT 50
  `).all(input.accountId);

  // Calculate metrics
  const metrics = calculateAccountMetrics(account, history);

  return {
    ...account,
    history,
    metrics
  };
}
```

---

### Tool 3: `update_account_state`

**Purpose:** Update account state after activity

**Input Schema:**
```typescript
{
  accountId: string;
  updates: {
    karma?: number;                 // Increment/set karma
    commentsPosted?: number;        // Increment comment count
    shadowBanStatus?: 'unknown' | 'clean' | 'suspected' | 'confirmed';
    cqsScore?: number;
    lastActivity?: string;
  };
  logActivity?: {
    action: string;
    details: Record<string, any>;
  };
}
```

**Output Schema:**
```typescript
{
  success: boolean;
  newState: AccountState;           // Updated account state
  phaseChanged: boolean;            // Did phase automatically advance?
  newPhase?: string;
}
```

**Implementation:**
```typescript
async function updateAccountState(input: UpdateAccountInput) {
  const db = getDatabase();

  // Update account record
  db.prepare(`
    UPDATE accounts
    SET karma = COALESCE(?, karma),
        comments_posted = COALESCE(?, comments_posted),
        shadow_ban_status = COALESCE(?, shadow_ban_status),
        cqs_score = COALESCE(?, cqs_score),
        last_activity = COALESCE(?, last_activity),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    input.updates.karma,
    input.updates.commentsPosted,
    input.updates.shadowBanStatus,
    input.updates.cqsScore,
    input.updates.lastActivity,
    input.accountId
  );

  // Log activity
  if (input.logActivity) {
    db.prepare(`
      INSERT INTO activity_log (account_id, action_type, details, timestamp)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    `).run(input.accountId, input.logActivity.action, JSON.stringify(input.logActivity.details));
  }

  // Check if phase should advance
  const newState = await getAccountState({ accountId: input.accountId });
  const phaseAdvanced = checkAndAdvancePhase(newState);

  return {
    success: true,
    newState,
    phaseChanged: phaseAdvanced.changed,
    newPhase: phaseAdvanced.newPhase
  };
}
```

---

### Tool 4: `analyze_subreddit_opportunities`

**Purpose:** Find engagement opportunities in target subreddits

**Input Schema:**
```typescript
{
  subreddits: string[];
  lookbackHours: number;          // How far back to scan
  minRelevanceScore: number;      // Filter threshold
}
```

**Output Schema:**
```typescript
{
  opportunities: Array<{
    id: string;
    subreddit: string;
    postUrl: string;
    postTitle: string;
    postContent: string;
    postAge: string;
    relevanceScore: number;
    topicCategory: string;
    estimatedDifficulty: 'easy' | 'medium' | 'hard';
  }>;
  metadata: {
    totalScanned: number;
    totalOpportunities: number;
    bySubreddit: Record<string, number>;
    avgRelevanceScore: number;
  };
}
```

---

### Tool 5: `get_typing_instructions`

**Purpose:** Convert behavioral typing metadata into step-by-step instructions for Claude

**Input Schema:**
```typescript
{
  behavioralMetadata: TypingBehavior;
  commentText: string;
}
```

**Output Schema:**
```typescript
{
  instructions: Array<{
    step: number;
    type: 'type_segment' | 'thinking_pause' | 'typo_correction' | 'hesitation';
    action: string;               // Human-readable instruction
    parameters: {
      text?: string;
      wpm?: number;
      duration?: number;
      originalText?: string;
      correctedText?: string;
    };
    rationale: string;            // Why this action (from metadata)
  }>;
  estimatedDuration: number;      // Total ms
  summary: string;                // "Type 3 segments with 2 pauses and 1 correction, ~45 seconds"
}
```

**Example Output:**
```json
{
  "instructions": [
    {
      "step": 1,
      "type": "type_segment",
      "action": "Type: 'Yeah, React re-renders can be tricky! '",
      "parameters": {"text": "Yeah, React re-renders can be tricky! ", "wpm": 62.7},
      "rationale": "Casual agreement, confident tone, faster typing"
    },
    {
      "step": 2,
      "type": "thinking_pause",
      "action": "Pause for 1.2 seconds",
      "parameters": {"duration": 1200},
      "rationale": "Thinking how to explain the cause clearly"
    },
    {
      "step": 3,
      "type": "type_segment",
      "action": "Type: 'The issue is probably inline object creation. '",
      "parameters": {"text": "The issue is probably inline object creation. ", "wpm": 52.6},
      "rationale": "Technical explanation, slower and deliberate"
    },
    {
      "step": 4,
      "type": "typo_correction",
      "action": "Type 'useMeno', pause 380ms, backspace 7 chars, pause 220ms, type 'useMemo'",
      "parameters": {"originalText": "useMeno", "correctedText": "useMemo"},
      "rationale": "Common typo on React hook name"
    }
  ],
  "estimatedDuration": 42300,
  "summary": "Type 3 segments at varying speeds (62.7, 52.6, 58.8 WPM) with 1 thinking pause and 1 typo correction. Total: ~42 seconds"
}
```

---

### Tool 6: `get_mouse_workflow_instructions`

**Purpose:** Convert mouse workflow metadata into browser automation instructions

**Input Schema:**
```typescript
{
  mouseWorkflow: MouseWorkflowStep[];
}
```

**Output Schema:**
```typescript
{
  instructions: Array<{
    step: number;
    action: 'scroll' | 'click' | 'hover' | 'read' | 'move';
    target?: string;              // Element description
    parameters: {
      distance?: number;
      duration: number;
      direction?: 'up' | 'down';
    };
    rationale: string;
  }>;
  estimatedDuration: number;
  summary: string;
}
```

**Example Output:**
```json
{
  "instructions": [
    {
      "step": 1,
      "action": "scroll",
      "parameters": {"direction": "down", "distance": 400, "duration": 2800},
      "rationale": "Reading the full post to understand context"
    },
    {
      "step": 2,
      "action": "read",
      "parameters": {"duration": 4200},
      "rationale": "Checking if Stirling PDF already mentioned in comments"
    },
    {
      "step": 3,
      "action": "click",
      "target": "reply button",
      "parameters": {"duration": 380},
      "rationale": "Clicking reply button"
    },
    {
      "step": 4,
      "action": "hover",
      "target": "text field",
      "parameters": {"duration": 650},
      "rationale": "Cursor in text field, thinking how to phrase recommendation"
    }
  ],
  "estimatedDuration": 8030,
  "summary": "4-step workflow: scroll to read → check existing comments → click reply → hover while thinking. Total: ~8 seconds"
}
```

---

## MCP Resources Specification

### Resource 1: `account://{accountId}`

**Purpose:** Provide account profile data

**URI Pattern:** `account://reddit_001`, `account://reddit_002`, etc.

**Schema:**
```typescript
{
  uri: string;
  mimeType: "application/json";
  text: string;                   // JSON-serialized AccountProfile
}
```

**Data Structure:**
```typescript
interface AccountProfile {
  accountId: string;
  username: string;
  credentials: {
    // Note: Never expose passwords in resource
    hasCredentials: boolean;
  };
  status: {
    karma: number;
    accountAge: number;
    currentPhase: string;
    shadowBanStatus: string;
    cqsScore: number | null;
  };
  activity: {
    totalComments: number;
    lastActivity: string;
    avgUpvotesPerComment: number;
    commentVisibilityRate: number;
  };
  preferences: {
    preferredSubreddits: string[];
    targetCommentsPerDay: number;
    currentlyActive: boolean;
  };
}
```

---

### Resource 2: `queue://pending-comments`

**Purpose:** List pending comments awaiting posting

**URI Pattern:** `queue://pending-comments`, `queue://pending-comments?account=reddit_001`

**Schema:**
```typescript
{
  uri: string;
  mimeType: "application/json";
  text: string;                   // JSON-serialized CommentQueue
}
```

**Data Structure:**
```typescript
interface CommentQueue {
  comments: Array<{
    id: string;
    accountId: string;
    priority: number;             // 1-10, higher = more urgent
    createdAt: string;
    expiresAt: string;            // Post becomes stale
    subreddit: string;
    postUrl: string;
    commentText: string;
    behavioralMetadata: BehavioralMetadata;
    status: 'pending' | 'in_progress' | 'posted' | 'expired';
  }>;
  metadata: {
    totalPending: number;
    byAccount: Record<string, number>;
    byPhase: Record<string, number>;
    oldestTimestamp: string;
  };
}
```

---

### Resource 3: `subreddit://{name}/state`

**Purpose:** Subreddit engagement metrics and recommendations

**URI Pattern:** `subreddit://selfhosted/state`, `subreddit://webdev/state`

**Schema:**
```typescript
{
  uri: string;
  mimeType: "application/json";
  text: string;                   // JSON-serialized SubredditState
}
```

**Data Structure:**
```typescript
interface SubredditState {
  name: string;
  metrics: {
    lastScanned: string;
    opportunitiesFound: number;
    avgEngagementRate: number;    // % of our comments that get replies
    avgUpvotesPerComment: number;
    shadowBanRate: number;        // % of comments that were hidden
  };
  recommendations: {
    postingFrequency: number;     // Comments per day
    bestTimeToPost: string;       // "9am-12pm EST" or similar
    cultureTone: string;          // "technical", "casual", "formal", etc.
    difficultLevel: 'easy' | 'medium' | 'hard';
  };
  topPerformingComments: Array<{
    commentText: string;
    upvotes: number;
    timestamp: string;
  }>;
}
```

---

## State Management

### Database Schema (SQLite)

**Table: accounts**
```sql
CREATE TABLE accounts (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  karma INTEGER DEFAULT 1,
  account_age INTEGER DEFAULT 0,        -- Days since creation
  current_phase TEXT DEFAULT 'accountWarming',
  shadow_ban_status TEXT DEFAULT 'unknown',
  cqs_score REAL,
  comments_posted INTEGER DEFAULT 0,
  last_activity TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

**Table: activity_log**
```sql
CREATE TABLE activity_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id TEXT NOT NULL,
  action_type TEXT NOT NULL,          -- 'comment_posted', 'upvotes_received', etc.
  details TEXT,                        -- JSON metadata
  timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (account_id) REFERENCES accounts(id)
);
```

**Table: comment_queue**
```sql
CREATE TABLE comment_queue (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  priority INTEGER DEFAULT 5,
  comment_data TEXT NOT NULL,          -- JSON with full comment + metadata
  status TEXT DEFAULT 'pending',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  expires_at TEXT,
  FOREIGN KEY (account_id) REFERENCES accounts(id)
);
```

**Table: subreddit_state**
```sql
CREATE TABLE subreddit_state (
  name TEXT PRIMARY KEY,
  last_scanned TEXT,
  opportunities_found INTEGER DEFAULT 0,
  avg_engagement_rate REAL DEFAULT 0,
  avg_upvotes_per_comment REAL DEFAULT 0,
  shadow_ban_rate REAL DEFAULT 0,
  recommended_frequency INTEGER DEFAULT 2,
  culture_tone TEXT,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

---

## Integration with computer-control-2

### Behavioral Metadata → Browser Actions

**Typing Instructions Execution:**

```typescript
// Claude receives typing instructions from MCP
const typingInstructions = await mcpTool('get_typing_instructions', {
  behavioralMetadata: comment.behavioralMetadata.typing,
  commentText: comment.responseText
});

// Claude executes via computer-control-2
for (const instruction of typingInstructions.instructions) {
  switch (instruction.type) {
    case 'type_segment':
      await computerControl.keyboard.type(instruction.parameters.text, {
        wpm: instruction.parameters.wpm,
        variation: 0.08  // Natural speed fluctuation
      });
      break;

    case 'thinking_pause':
      // Claude can observe the pause visually
      await wait(instruction.parameters.duration);
      break;

    case 'typo_correction':
      // Type typo
      await computerControl.keyboard.type(instruction.parameters.originalText);
      await wait(instruction.parameters.recognitionDelay);

      // Backspace to correct
      for (let i = 0; i < instruction.parameters.originalText.length; i++) {
        await computerControl.keyboard.press('Backspace');
        await wait(50 + Math.random() * 50);
      }
      await wait(instruction.parameters.correctionDelay);

      // Type correction
      await computerControl.keyboard.type(instruction.parameters.correctedText);
      break;
  }
}
```

**Mouse Workflow Execution:**

```typescript
// Claude receives mouse workflow instructions
const mouseInstructions = await mcpTool('get_mouse_workflow_instructions', {
  mouseWorkflow: comment.behavioralMetadata.mouseWorkflow
});

// Claude executes via computer-control-2
for (const instruction of mouseInstructions.instructions) {
  switch (instruction.action) {
    case 'scroll':
      await computerControl.mouse.scroll({
        direction: instruction.parameters.direction,
        distance: instruction.parameters.distance,
        duration: instruction.parameters.duration,
        curve: 'ease-in-out'
      });
      break;

    case 'read':
      // Claude takes screenshot and analyzes
      const screenshot = await computerControl.screenshot();
      const analysis = await claude.vision.analyze(screenshot,
        "Read the existing comments. Are there any that already answer this question well?"
      );

      if (analysis.shouldSkip) {
        return { skipped: true, reason: "Question already answered" };
      }
      await wait(instruction.parameters.duration);
      break;

    case 'click':
      await computerControl.mouse.moveTo({
        element: instruction.target,
        curve: 'bezier',
        overshoot: 0.3
      });
      await wait(instruction.parameters.duration);
      await computerControl.mouse.click();
      break;
  }
}
```

---

## Orchestration Workflows

### Workflow 1: Account Warming (Days 1-30)

```typescript
// Claude's orchestration logic

async function accountWarmingWorkflow(accountId: string) {
  // 1. Check account state
  const account = await mcp.tool('get_account_state', { accountId });

  if (account.accountAge < 7) {
    console.log("Account too new, waiting...");
    return;
  }

  // 2. Generate helpful comments (100% helpful mode)
  const result = await mcp.tool('generate_helpful_comments', {
    subreddits: ['selfhosted', 'webdev'],
    maxComments: 2,
    phase: 'accountWarming'
  });

  // 3. Claude reviews each comment
  for (const comment of result.comments) {
    // Validate quality
    if (comment.analysis.helpfulnessScore < 80) {
      console.log(`Skipping comment with low helpfulness score: ${comment.id}`);
      continue;
    }

    // Check account readiness
    if (account.commentsPosted >= 2) {
      console.log("Daily limit reached, will continue tomorrow");
      break;
    }

    // 4. Post comment via computer-control-2
    const posted = await postCommentWithBehavior(accountId, comment);

    // 5. Monitor result
    await wait(300000); // Wait 5 minutes
    const visible = await checkCommentVisibility(comment.postUrl);

    // 6. Update account state
    await mcp.tool('update_account_state', {
      accountId,
      updates: {
        commentsPosted: account.commentsPosted + 1,
        karma: account.karma + (visible ? 1 : 0),
        shadowBanStatus: visible ? 'clean' : 'suspected'
      },
      logActivity: {
        action: 'comment_posted',
        details: {
          commentId: comment.id,
          subreddit: comment.subreddit,
          visible,
          upvotes: 0
        }
      }
    });

    // 7. Natural spacing (20+ minutes)
    await wait(1200000 + Math.random() * 600000); // 20-30 minutes
  }

  // 8. Schedule next run
  const nextRun = calculateNextRunTime(account);
  console.log(`Next account warming session: ${nextRun}`);
}
```

### Workflow 2: Adaptive Strategy Adjustment

```typescript
async function adaptiveStrategyWorkflow() {
  // Analyze all accounts
  const accounts = await mcp.resource('account://all');

  for (const account of accounts) {
    // Check performance metrics
    if (account.activity.commentVisibilityRate < 0.7) {
      console.log(`Account ${account.accountId} has low visibility (${account.activity.commentVisibilityRate})`);
      console.log("Possible shadow-ban, slowing down activity");

      await mcp.tool('update_account_state', {
        accountId: account.accountId,
        updates: {
          shadowBanStatus: 'suspected'
        }
      });

      // Reduce posting frequency
      // Switch to different subreddits
    }

    if (account.activity.avgUpvotesPerComment > 5) {
      console.log(`Account ${account.accountId} performing well! Avg ${account.activity.avgUpvotesPerComment} upvotes`);
      console.log("Can gradually increase frequency");
    }

    // Check if phase should advance
    if (account.status.karma > 100 && account.status.accountAge > 30) {
      if (account.status.currentPhase === 'accountWarming') {
        console.log(`Account ${account.accountId} ready for reputation building phase`);
        // Advance to next phase
      }
    }
  }
}
```

---

## Security & Safety

### Credentials Management

**Never expose passwords in resources/tools:**
- Store encrypted credentials separately
- Use environment variables
- Credentials only accessed internally
- Never logged or returned in responses

### Rate Limiting

**Built-in safety limits:**
- Max 3 comments/hour per account
- Max 15 comments/day per account
- Min 20 minutes between comments
- Automatic cool-down on suspicious activity

### Shadow-Ban Detection

**Proactive monitoring:**
- Check comment visibility after posting
- Track upvote patterns
- Monitor CQS score estimates
- Alert on suspected shadow-bans
- Automatic activity pause on confirmation

### Compliance Checks

**Reddit guidelines enforcement:**
- 100% helpful mode during warming
- 90/10 ratio maximum in stable operation
- No spam patterns
- Natural timing variations
- Human-level judgment on appropriateness

---

## Deployment Guide

### Step 1: Install MCP Server

```bash
cd mcp-server-reddit-marketing
npm install
npm run build
```

### Step 2: Configure Claude Desktop

**Add to `claude_desktop_config.json`:**
```json
{
  "mcpServers": {
    "reddit-marketing": {
      "command": "node",
      "args": [
        "/path/to/mcp-server-reddit-marketing/dist/index.js"
      ],
      "env": {
        "CONVERSATION_ANALYZER_PATH": "/path/to/conversation-analyzer",
        "STATE_DB_PATH": "/path/to/reddit-marketing-state.db"
      }
    }
  }
}
```

### Step 3: Initialize Database

```bash
npm run init-db
```

### Step 4: Create Accounts

```bash
# Via MCP tool
await mcp.tool('create_account', {
  accountId: 'reddit_001',
  username: 'username_here',
  initialPhase: 'accountWarming'
});
```

### Step 5: Start Orchestration

**Claude can now orchestrate:**
```
Claude: "Start account warming for reddit_001"

[Claude automatically:
 - Generates comments
 - Reviews quality
 - Posts via browser
 - Monitors results
 - Adapts strategy]
```

---

## Example Usage Scenarios

### Scenario 1: Daily Account Warming

```
User: "Run daily account warming for all accounts"

Claude:
1. Lists all accounts via MCP resource
2. For each account in 'accountWarming' phase:
   - Generates 2 helpful comments
   - Reviews relevance and quality
   - Posts via computer-control-2
   - Monitors visibility
   - Updates account state
3. Reports summary: "Warmed 3 accounts, posted 6 comments, all visible, avg 2.3 upvotes"
```

### Scenario 2: Interactive Posting Decision

```
User: "Should I post this comment for reddit_002?"
[Shows comment]

Claude:
1. Gets account state via MCP
2. Checks current karma, phase, last activity
3. Analyzes comment quality
4. Checks subreddit state
5. Decision: "Yes, account is ready. Karma at 45, last post 8 hours ago, comment is high quality (88/100 helpfulness). This subreddit has good engagement rates."

User: "Post it"

Claude:
1. Gets typing/mouse instructions via MCP
2. Opens browser via computer-control-2
3. Navigates to post
4. Executes behavioral workflow
5. Types comment with metadata patterns
6. Confirms visibility
7. Updates account state
8. Report: "Posted successfully, comment visible, will check upvotes in 1 hour"
```

### Scenario 3: Performance Analysis

```
User: "How are my Reddit accounts performing?"

Claude:
1. Fetches all account resources via MCP
2. Analyzes metrics across accounts
3. Report:
   - reddit_001: Excellent (avg 8 upvotes, 100% visibility, karma 156)
   - reddit_002: Good (avg 4 upvotes, 95% visibility, karma 72)
   - reddit_003: Concerning (avg 1 upvote, 60% visibility, possible shadow-ban)
4. Recommendations:
   - reddit_001: Ready for reputation building phase
   - reddit_002: Continue account warming
   - reddit_003: Pause activity, investigate shadow-ban
```

---

**End of Specification**

**Next Steps:**
1. Implement MCP server following this spec
2. Create computer-control-2 integration guide
3. Build orchestration workflow examples
4. Test with real accounts in controlled environment
