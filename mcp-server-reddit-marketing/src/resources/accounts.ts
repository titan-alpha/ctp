/**
 * Resource: account://{accountId}
 *
 * Provides account profile data including history and metrics
 */

import type { RedditMarketingDatabase } from '../state/database.js';

export interface AccountResource {
  uri: string;
  name: string;
  description: string;
  mimeType: string;
  text: string;
}

/**
 * Get account resource by account ID
 */
export async function getAccountResource(
  db: RedditMarketingDatabase,
  accountId: number
): Promise<AccountResource> {
  const account = db.getAccount(accountId);
  if (!account) {
    throw new Error(`Account not found: ${accountId}`);
  }

  const metrics = db.getAccountMetrics(accountId);
  const recentActivity = db.getRecentActivity(accountId, 50);

  const resourceData = {
    account,
    metrics,
    recentActivity: recentActivity.slice(0, 10), // Last 10 activities
    statistics: {
      totalActivities: recentActivity.length,
      phaseInfo: getPhaseInfo(account.currentPhase),
      recommendations: generateRecommendations(account, metrics),
    },
  };

  return {
    uri: `account://${accountId}`,
    name: `Account: ${account.username}`,
    description: `Profile data for Reddit account ${account.username}`,
    mimeType: 'application/json',
    text: JSON.stringify(resourceData, null, 2),
  };
}

/**
 * List all account resources
 */
export async function listAccountResources(
  db: RedditMarketingDatabase
): Promise<AccountResource[]> {
  const accounts = db.listAccounts();

  return Promise.all(
    accounts.map(account => getAccountResource(db, account.id))
  );
}

/**
 * Get phase information
 */
function getPhaseInfo(phase: string) {
  const phaseData: Record<string, any> = {
    accountWarming: {
      name: 'Account Warming',
      description: 'Building initial reputation with pure helpful comments',
      targetKarma: 100,
      targetDays: 30,
      helpfulRatio: 1.0,
      promotionalRatio: 0.0,
    },
    reputationBuilding: {
      name: 'Reputation Building',
      description: 'Establishing credibility and positive CQS score',
      targetKarma: 500,
      targetDays: 60,
      helpfulRatio: 1.0,
      promotionalRatio: 0.0,
    },
    gradualPromotional: {
      name: 'Gradual Promotional',
      description: 'Gradually introducing promotional content',
      targetKarma: 1000,
      targetDays: 90,
      helpfulRatio: 0.95,
      promotionalRatio: 0.05,
    },
    stableOperation: {
      name: 'Stable Operation',
      description: 'Sustainable long-term operation',
      targetKarma: null,
      targetDays: null,
      helpfulRatio: 0.90,
      promotionalRatio: 0.10,
    },
  };

  return phaseData[phase] || phaseData.accountWarming;
}

/**
 * Generate recommendations based on account state
 */
function generateRecommendations(account: any, metrics: any): string[] {
  const recommendations: string[] = [];

  // Phase progression recommendations
  if (account.currentPhase === 'accountWarming' && account.karma >= 100) {
    recommendations.push('Consider moving to Reputation Building phase');
  }

  if (account.currentPhase === 'reputationBuilding' && account.karma >= 500) {
    recommendations.push('Consider moving to Gradual Promotional phase');
  }

  // Shadow-ban recommendations
  if (account.shadowBanStatus === 'suspected') {
    recommendations.push('Shadow-ban suspected - reduce activity and monitor');
  }

  if (account.shadowBanStatus === 'confirmed') {
    recommendations.push('Shadow-ban confirmed - pause all activity');
  }

  // CQS recommendations
  if (metrics && metrics.cqsScore < 50) {
    recommendations.push('Low CQS score - focus on higher quality comments');
  }

  // Success rate recommendations
  if (metrics && metrics.successRate < 70) {
    recommendations.push('Low success rate - review comment quality and targeting');
  }

  // Activity level recommendations
  if (metrics && metrics.totalComments < 10 && account.accountAge > 7) {
    recommendations.push('Low activity - increase commenting frequency');
  }

  return recommendations;
}
