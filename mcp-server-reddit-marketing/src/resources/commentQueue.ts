/**
 * Resource: queue://pending-comments
 *
 * Lists pending comments to post, organized by priority/phase
 */

import type { RedditMarketingDatabase } from '../state/database.js';
import type { QueuedComment } from '../types/index.js';

export interface CommentQueueResource {
  uri: string;
  name: string;
  description: string;
  mimeType: string;
  text: string;
}

/**
 * Get pending comments queue resource
 */
export async function getPendingCommentsResource(
  db: RedditMarketingDatabase,
  accountId?: number
): Promise<CommentQueueResource> {
  const pendingComments = db.getPendingComments(accountId, 100);

  // Organize by priority
  const organizedQueue = {
    urgent: pendingComments.filter(c => c.priority === 'urgent'),
    high: pendingComments.filter(c => c.priority === 'high'),
    medium: pendingComments.filter(c => c.priority === 'medium'),
    low: pendingComments.filter(c => c.priority === 'low'),
  };

  // Statistics
  const statistics = {
    total: pendingComments.length,
    byPriority: {
      urgent: organizedQueue.urgent.length,
      high: organizedQueue.high.length,
      medium: organizedQueue.medium.length,
      low: organizedQueue.low.length,
    },
    byType: {
      helpful: pendingComments.filter(c => c.commentType === 'helpful-only').length,
      promotional: pendingComments.filter(c => c.commentType === 'promotional').length,
    },
    bySubreddit: countBySubreddit(pendingComments),
  };

  // Next recommended comment to post
  const nextComment = getNextRecommendedComment(pendingComments, db);

  const resourceData = {
    queue: organizedQueue,
    statistics,
    nextRecommended: nextComment,
    metadata: {
      lastUpdated: new Date().toISOString(),
      accountFilter: accountId || 'all',
    },
  };

  const uri = accountId
    ? `queue://pending-comments/account/${accountId}`
    : 'queue://pending-comments';

  return {
    uri,
    name: 'Pending Comments Queue',
    description: 'Comments waiting to be posted, organized by priority',
    mimeType: 'application/json',
    text: JSON.stringify(resourceData, null, 2),
  };
}

/**
 * Count comments by subreddit
 */
function countBySubreddit(comments: QueuedComment[]): Record<string, number> {
  const counts: Record<string, number> = {};

  for (const comment of comments) {
    counts[comment.subreddit] = (counts[comment.subreddit] || 0) + 1;
  }

  return counts;
}

/**
 * Get next recommended comment to post
 */
function getNextRecommendedComment(
  comments: QueuedComment[],
  db: RedditMarketingDatabase
): QueuedComment | null {
  if (comments.length === 0) {
    return null;
  }

  // Priority order: urgent > high > medium > low
  const priorityOrder = ['urgent', 'high', 'medium', 'low'];

  for (const priority of priorityOrder) {
    const priorityComments = comments.filter(c => c.priority === priority);

    if (priorityComments.length > 0) {
      // Check subreddit frequency rules
      for (const comment of priorityComments) {
        const subredditState = db.getSubredditState(comment.subreddit);

        if (subredditState) {
          // Check if we should post to this subreddit
          const shouldPost = shouldPostToSubreddit(subredditState);

          if (shouldPost) {
            return comment;
          }
        } else {
          // No state = can post
          return comment;
        }
      }
    }
  }

  // Return highest priority comment even if frequency check fails
  return comments[0];
}

/**
 * Check if we should post to a subreddit based on frequency rules
 */
function shouldPostToSubreddit(subredditState: {
  recommendedFrequency: number;
  lastPosted?: string;
}): boolean {
  if (!subredditState.lastPosted) {
    return true;
  }

  const lastPostedTime = new Date(subredditState.lastPosted).getTime();
  const now = Date.now();
  const hoursSinceLastPost = (now - lastPostedTime) / (1000 * 60 * 60);

  const minHoursBetweenPosts = 24 / subredditState.recommendedFrequency;

  return hoursSinceLastPost >= minHoursBetweenPosts;
}

/**
 * Get scheduled comments resource
 */
export async function getScheduledCommentsResource(
  db: RedditMarketingDatabase
): Promise<CommentQueueResource> {
  const allPending = db.getPendingComments(undefined, 1000);
  const scheduled = allPending.filter(c => c.scheduledFor);

  // Sort by scheduled time
  scheduled.sort((a, b) => {
    const timeA = new Date(a.scheduledFor!).getTime();
    const timeB = new Date(b.scheduledFor!).getTime();
    return timeA - timeB;
  });

  const resourceData = {
    scheduled,
    statistics: {
      total: scheduled.length,
      next24Hours: scheduled.filter(c => {
        const scheduledTime = new Date(c.scheduledFor!).getTime();
        const now = Date.now();
        return scheduledTime - now < 24 * 60 * 60 * 1000;
      }).length,
    },
  };

  return {
    uri: 'queue://scheduled-comments',
    name: 'Scheduled Comments',
    description: 'Comments scheduled for future posting',
    mimeType: 'application/json',
    text: JSON.stringify(resourceData, null, 2),
  };
}
