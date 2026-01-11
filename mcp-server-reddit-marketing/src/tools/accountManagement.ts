/**
 * Tools: get_account_state, update_account_state
 *
 * Manages Reddit account state including karma, phase, and metrics.
 */

import type { RedditMarketingDatabase } from '../state/database.js';
import type {
  AccountState,
  AccountMetrics,
  ActivityLog,
  AccountStateResult,
} from '../types/index.js';

/**
 * Get complete account state including metrics and recent activity
 */
export async function getAccountState(
  db: RedditMarketingDatabase,
  accountId: number,
  options: {
    includeMetrics?: boolean;
    includeActivity?: boolean;
    activityLimit?: number;
  } = {}
): Promise<AccountStateResult> {
  const {
    includeMetrics = true,
    includeActivity = true,
    activityLimit = 50,
  } = options;

  const account = db.getAccount(accountId);
  if (!account) {
    throw new Error(`Account not found: ${accountId}`);
  }

  const result: AccountStateResult = { account };

  if (includeMetrics) {
    const metrics = db.getAccountMetrics(accountId);
    if (metrics) {
      result.metrics = metrics;
    }
  }

  if (includeActivity) {
    result.recentActivity = db.getRecentActivity(accountId, activityLimit);
  }

  return result;
}

/**
 * Get account state by username
 */
export async function getAccountByUsername(
  db: RedditMarketingDatabase,
  username: string
): Promise<AccountStateResult> {
  const account = db.getAccountByUsername(username);
  if (!account) {
    throw new Error(`Account not found: ${username}`);
  }

  return getAccountState(db, account.id);
}

/**
 * Update account state (karma, phase, shadow-ban status, etc.)
 */
export async function updateAccountState(
  db: RedditMarketingDatabase,
  accountId: number,
  updates: {
    karma?: number;
    accountAge?: number;
    currentPhase?: AccountState['currentPhase'];
    shadowBanStatus?: AccountState['shadowBanStatus'];
    cqsScore?: number;
  }
): Promise<AccountState> {
  const account = db.updateAccount(accountId, updates);

  // Log phase change if applicable
  if (updates.currentPhase) {
    db.logActivity(accountId, 'phase_changed', {
      newPhase: updates.currentPhase,
      timestamp: new Date().toISOString(),
    });
  }

  // Log shadow-ban detection if applicable
  if (updates.shadowBanStatus === 'suspected' || updates.shadowBanStatus === 'confirmed') {
    db.logActivity(accountId, 'shadowban_detected', {
      status: updates.shadowBanStatus,
      timestamp: new Date().toISOString(),
    });
  }

  // Log karma changes
  if (updates.karma !== undefined) {
    const oldKarma = db.getAccount(accountId)?.karma || 0;
    const karmaChange = updates.karma - oldKarma;

    if (karmaChange > 0) {
      db.logActivity(accountId, 'karma_gained', {
        amount: karmaChange,
        newTotal: updates.karma,
      });
    } else if (karmaChange < 0) {
      db.logActivity(accountId, 'karma_lost', {
        amount: Math.abs(karmaChange),
        newTotal: updates.karma,
      });
    }
  }

  return account;
}

/**
 * Create a new account
 */
export async function createAccount(
  db: RedditMarketingDatabase,
  username: string
): Promise<AccountState> {
  const account = db.createAccount(username);

  db.logActivity(account.id, 'comment_posted', {
    action: 'account_created',
    timestamp: new Date().toISOString(),
  });

  return account;
}

/**
 * Calculate and update account metrics
 */
export async function recalculateAccountMetrics(
  db: RedditMarketingDatabase,
  accountId: number
): Promise<AccountMetrics> {
  const activity = db.getRecentActivity(accountId, 1000);

  let totalComments = 0;
  let helpfulComments = 0;
  let promotionalComments = 0;
  let totalUpvotes = 0;
  let totalDownvotes = 0;

  for (const log of activity) {
    if (log.actionType === 'comment_posted') {
      totalComments++;
    } else if (log.actionType === 'comment_helpful') {
      helpfulComments++;
    } else if (log.actionType === 'comment_promotional') {
      promotionalComments++;
    } else if (log.actionType === 'upvote_received') {
      totalUpvotes += log.metadata.count || 1;
    } else if (log.actionType === 'downvote_received') {
      totalDownvotes += log.metadata.count || 1;
    }
  }

  const avgKarmaPerComment = totalComments > 0
    ? (totalUpvotes - totalDownvotes) / totalComments
    : 0;

  const successRate = totalComments > 0
    ? ((totalUpvotes / (totalUpvotes + totalDownvotes)) * 100)
    : 0;

  const metrics: AccountMetrics = {
    accountId,
    totalComments,
    helpfulComments,
    promotionalComments,
    avgKarmaPerComment,
    totalUpvotes,
    totalDownvotes,
    successRate,
    lastCalculated: new Date().toISOString(),
  };

  db.updateAccountMetrics(accountId, metrics);

  return metrics;
}

/**
 * Determine recommended phase based on account metrics
 */
export function recommendPhase(
  account: AccountState,
  metrics: AccountMetrics
): AccountState['currentPhase'] {
  // Phase 1: Account Warming (karma < 100)
  if (account.karma < 100 || account.accountAge < 30) {
    return 'accountWarming';
  }

  // Phase 2: Reputation Building (karma 100-500)
  if (account.karma < 500 || account.accountAge < 60) {
    return 'reputationBuilding';
  }

  // Phase 3: Gradual Promotional (karma 500+, age 60-90 days)
  if (account.accountAge < 90) {
    return 'gradualPromotional';
  }

  // Phase 4: Stable Operation (karma 500+, age 90+ days)
  return 'stableOperation';
}
