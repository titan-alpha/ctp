/**
 * Resource: subreddit://{name}/state
 *
 * Subreddit engagement metrics and recommended posting frequency
 */

import type { RedditMarketingDatabase } from '../state/database.js';
import type { SubredditState } from '../types/index.js';

export interface SubredditStateResource {
  uri: string;
  name: string;
  description: string;
  mimeType: string;
  text: string;
}

/**
 * Get subreddit state resource
 */
export async function getSubredditStateResource(
  db: RedditMarketingDatabase,
  subredditName: string
): Promise<SubredditStateResource> {
  let state = db.getSubredditState(subredditName);

  if (!state) {
    // Create initial state
    state = db.updateSubredditState(subredditName, {
      lastScanned: new Date().toISOString(),
      opportunitiesFound: 0,
      avgEngagement: 0,
      recommendedFrequency: 1,
    });
  }

  const resourceData = {
    state,
    metrics: calculateSubredditMetrics(state),
    recommendations: generateSubredditRecommendations(state),
    postingSchedule: calculatePostingSchedule(state),
  };

  return {
    uri: `subreddit://${subredditName}/state`,
    name: `r/${subredditName} State`,
    description: `Engagement metrics and posting recommendations for r/${subredditName}`,
    mimeType: 'application/json',
    text: JSON.stringify(resourceData, null, 2),
  };
}

/**
 * List all subreddit state resources
 */
export async function listSubredditStateResources(
  db: RedditMarketingDatabase
): Promise<SubredditStateResource[]> {
  const subreddits = db.listSubreddits();

  return Promise.all(
    subreddits.map(sub => getSubredditStateResource(db, sub.name))
  );
}

/**
 * Calculate subreddit metrics
 */
function calculateSubredditMetrics(state: SubredditState) {
  const lastScanDate = state.lastScanned ? new Date(state.lastScanned) : null;
  const lastPostDate = state.lastPosted ? new Date(state.lastPosted) : null;
  const now = new Date();

  const hoursSinceLastScan = lastScanDate
    ? (now.getTime() - lastScanDate.getTime()) / (1000 * 60 * 60)
    : null;

  const hoursSinceLastPost = lastPostDate
    ? (now.getTime() - lastPostDate.getTime()) / (1000 * 60 * 60)
    : null;

  return {
    hoursSinceLastScan,
    hoursSinceLastPost,
    isStale: hoursSinceLastScan ? hoursSinceLastScan > 24 : true,
    canPostNow: canPostNow(state),
    nextPostAvailable: calculateNextPostTime(state),
  };
}

/**
 * Generate subreddit recommendations
 */
function generateSubredditRecommendations(state: SubredditState): string[] {
  const recommendations: string[] = [];

  // Scan freshness
  const lastScanDate = state.lastScanned ? new Date(state.lastScanned) : null;
  if (!lastScanDate || (new Date().getTime() - lastScanDate.getTime()) > 24 * 60 * 60 * 1000) {
    recommendations.push('Subreddit data is stale - run a fresh scan');
  }

  // Opportunity level
  if (state.opportunitiesFound === 0) {
    recommendations.push('No opportunities found - consider adjusting targeting criteria');
  } else if (state.opportunitiesFound > 20) {
    recommendations.push('High opportunity count - consider increasing posting frequency');
  }

  // Engagement level
  if (state.avgEngagement < 2) {
    recommendations.push('Low engagement - review comment quality or targeting');
  } else if (state.avgEngagement > 10) {
    recommendations.push('High engagement - excellent performance, maintain strategy');
  }

  // Posting frequency
  if (state.recommendedFrequency < 1) {
    recommendations.push('Low recommended frequency - focus on other subreddits');
  } else if (state.recommendedFrequency > 5) {
    recommendations.push('High activity level - ensure compliance with subreddit rules');
  }

  return recommendations;
}

/**
 * Calculate posting schedule
 */
function calculatePostingSchedule(state: SubredditState) {
  const hoursPerPost = state.recommendedFrequency > 0
    ? 24 / state.recommendedFrequency
    : 24;

  const nextPostTime = calculateNextPostTime(state);

  return {
    recommendedFrequency: `${state.recommendedFrequency} posts per day`,
    hoursPerPost,
    nextPostTime,
    canPostNow: canPostNow(state),
  };
}

/**
 * Check if we can post now
 */
function canPostNow(state: SubredditState): boolean {
  if (!state.lastPosted) {
    return true;
  }

  const lastPostDate = new Date(state.lastPosted);
  const now = new Date();
  const hoursSinceLastPost = (now.getTime() - lastPostDate.getTime()) / (1000 * 60 * 60);

  const minHoursBetweenPosts = 24 / state.recommendedFrequency;

  return hoursSinceLastPost >= minHoursBetweenPosts;
}

/**
 * Calculate next available post time
 */
function calculateNextPostTime(state: SubredditState): string | null {
  if (!state.lastPosted) {
    return 'now';
  }

  const lastPostDate = new Date(state.lastPosted);
  const minHoursBetweenPosts = 24 / state.recommendedFrequency;
  const nextPostDate = new Date(lastPostDate.getTime() + minHoursBetweenPosts * 60 * 60 * 1000);

  const now = new Date();
  if (nextPostDate <= now) {
    return 'now';
  }

  return nextPostDate.toISOString();
}
