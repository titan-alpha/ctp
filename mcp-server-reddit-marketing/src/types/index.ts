/**
 * Type definitions for MCP Reddit Marketing Server
 */

// ============================================================================
// Account State Types
// ============================================================================

export interface AccountState {
  id: number;
  username: string;
  karma: number;
  accountAge: number; // days
  currentPhase: 'accountWarming' | 'reputationBuilding' | 'gradualPromotional' | 'stableOperation';
  shadowBanStatus: 'clear' | 'suspected' | 'confirmed';
  cqsScore: number; // Content Quality Score (0-100)
  lastActivity: string; // ISO timestamp
  createdAt: string;
  updatedAt: string;
}

export interface AccountMetrics {
  accountId: number;
  totalComments: number;
  helpfulComments: number;
  promotionalComments: number;
  avgKarmaPerComment: number;
  totalUpvotes: number;
  totalDownvotes: number;
  successRate: number; // percentage
  lastCalculated: string;
}

// ============================================================================
// Activity Log Types
// ============================================================================

export type ActivityType =
  | 'comment_posted'
  | 'comment_helpful'
  | 'comment_promotional'
  | 'upvote_received'
  | 'downvote_received'
  | 'karma_gained'
  | 'karma_lost'
  | 'phase_changed'
  | 'shadowban_detected'
  | 'error';

export interface ActivityLog {
  id: number;
  accountId: number;
  actionType: ActivityType;
  timestamp: string;
  metadata: Record<string, any>;
}

// ============================================================================
// Comment Queue Types
// ============================================================================

export type CommentPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface QueuedComment {
  id: number;
  accountId: number;
  subreddit: string;
  postUrl: string;
  postTitle: string;
  commentType: 'helpful-only' | 'promotional';
  commentData: {
    responseText: string;
    tone: string;
    valueProvided: string;
    estimatedHelpfulness: number;
    behavioralMetadata?: any;
  };
  priority: CommentPriority;
  scheduledFor?: string; // ISO timestamp
  createdAt: string;
  postedAt?: string;
  status: 'pending' | 'posted' | 'failed' | 'skipped';
}

// ============================================================================
// Subreddit State Types
// ============================================================================

export interface SubredditState {
  name: string;
  lastScanned: string;
  opportunitiesFound: number;
  avgEngagement: number;
  recommendedFrequency: number; // posts per day
  lastPosted?: string;
  notes?: string;
}

// ============================================================================
// Opportunity Types (from conversation-analyzer)
// ============================================================================

export interface CommentOpportunity {
  id: string;
  timestamp: string;
  subreddit: string;
  commentType: 'helpful-only' | 'promotional';
  postUrl: string;
  postTitle: string;
  postContent: string;
  postAge: string;
  postAuthor?: string;
  analysis: {
    isHelpfulOpportunity: boolean;
    helpfulnessScore: number;
    topicCategory: string;
    userSkillLevel: string;
    problemType: string;
    conversationalTone: string;
    shouldRespond: boolean;
    responseRationale: string;
  };
  suggestedResponse: {
    responseText: string;
    tone: string;
    valueProvided: string;
    technicalDepth: string;
    includesCodeExample: boolean;
    includesExternalLinks: boolean;
    estimatedHelpfulness: number;
    redditCompliance: string[];
    behavioralMetadata?: any;
  };
  status: 'pending' | 'reviewed' | 'responded' | 'skipped';
}

// ============================================================================
// Behavioral Metadata Types
// ============================================================================

export interface TypingInstruction {
  step: number;
  action: 'type' | 'pause' | 'correct' | 'hesitate';
  text?: string;
  duration?: number;
  rationale: string;
}

export interface MouseWorkflowInstruction {
  step: number;
  action: 'scroll' | 'click' | 'hover' | 'select-text' | 'move-away' | 'read-comments';
  target?: string;
  duration: number;
  rationale: string;
}

// ============================================================================
// MCP Tool Response Types
// ============================================================================

export interface GenerateCommentsResult {
  opportunities: CommentOpportunity[];
  totalFetched: number;
  totalQualified: number;
  phase: string;
}

export interface AccountStateResult {
  account: AccountState;
  metrics?: AccountMetrics;
  recentActivity?: ActivityLog[];
}

export interface SubredditOpportunitiesResult {
  subreddit: string;
  opportunities: Array<{
    postUrl: string;
    postTitle: string;
    relevanceScore: number;
    postAge: string;
  }>;
  totalFound: number;
  scannedAt: string;
}

export interface TypingInstructionsResult {
  instructions: TypingInstruction[];
  estimatedDuration: number; // milliseconds
  baseSpeed: number; // WPM
}

export interface MouseInstructionsResult {
  instructions: MouseWorkflowInstruction[];
  estimatedDuration: number; // milliseconds
}
