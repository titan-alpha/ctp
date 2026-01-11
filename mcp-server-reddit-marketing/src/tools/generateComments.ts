/**
 * Tool: generate_helpful_comments
 *
 * Calls conversation-analyzer system to generate helpful comments
 * with behavioral metadata for Reddit posts.
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { readFile } from 'fs/promises';
import { readdir } from 'fs/promises';
import path from 'path';
import type { CommentOpportunity, GenerateCommentsResult } from '../types/index.js';

const execAsync = promisify(exec);

const CONVERSATION_ANALYZER_PATH = '/Users/titan-2/Documents/workspace/convenience-pro/convenience-pro-website/corporate/marketing/channels/reddit/conversation-analyzer';

export interface GenerateCommentsOptions {
  phase?: 'accountWarming' | 'reputationBuilding' | 'gradualPromotional' | 'stableOperation';
  maxResults?: number;
  subreddits?: string[];
}

/**
 * Generate helpful comments using the conversation-analyzer system
 */
export async function generateHelpfulComments(
  options: GenerateCommentsOptions = {}
): Promise<GenerateCommentsResult> {
  const { phase = 'accountWarming', maxResults = 10, subreddits = [] } = options;

  try {
    // Run the conversation-analyzer (index-helpful.ts)
    const { stdout, stderr } = await execAsync(
      'npm run generate:helpful',
      { cwd: CONVERSATION_ANALYZER_PATH }
    );

    if (stderr) {
      console.error('Conversation analyzer stderr:', stderr);
    }

    // Read generated opportunities from output directory
    const outputDir = path.join(CONVERSATION_ANALYZER_PATH, 'output', 'helpful');
    const files = await readdir(outputDir);
    const jsonFiles = files.filter(f => f.endsWith('.json'));

    const opportunities: CommentOpportunity[] = [];

    for (const file of jsonFiles) {
      const filePath = path.join(outputDir, file);
      const content = await readFile(filePath, 'utf-8');
      const opportunity = JSON.parse(content) as CommentOpportunity;

      // Filter by phase if needed
      if (phase === 'accountWarming' || phase === 'reputationBuilding') {
        // Only helpful comments
        if (opportunity.commentType === 'helpful-only') {
          opportunities.push(opportunity);
        }
      } else {
        // All comment types
        opportunities.push(opportunity);
      }

      // Filter by subreddits if specified
      if (subreddits.length > 0 && !subreddits.includes(opportunity.subreddit)) {
        continue;
      }
    }

    // Sort by helpfulness score
    opportunities.sort(
      (a, b) => b.suggestedResponse.estimatedHelpfulness - a.suggestedResponse.estimatedHelpfulness
    );

    // Limit results
    const limitedOpportunities = opportunities.slice(0, maxResults);

    return {
      opportunities: limitedOpportunities,
      totalFetched: jsonFiles.length,
      totalQualified: limitedOpportunities.length,
      phase,
    };
  } catch (error) {
    console.error('Error generating helpful comments:', error);
    throw new Error(`Failed to generate comments: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Load a specific comment opportunity by ID
 */
export async function loadCommentOpportunity(opportunityId: string): Promise<CommentOpportunity | null> {
  try {
    const outputDir = path.join(CONVERSATION_ANALYZER_PATH, 'output', 'helpful');
    const filePath = path.join(outputDir, `${opportunityId}.json`);

    const content = await readFile(filePath, 'utf-8');
    return JSON.parse(content) as CommentOpportunity;
  } catch (error) {
    console.error('Error loading opportunity:', error);
    return null;
  }
}

/**
 * Filter opportunities by criteria
 */
export function filterOpportunities(
  opportunities: CommentOpportunity[],
  filters: {
    minHelpfulness?: number;
    subreddits?: string[];
    includeCodeExamples?: boolean;
    maxAge?: string; // e.g., "2 hours ago"
  }
): CommentOpportunity[] {
  return opportunities.filter(opp => {
    // Filter by helpfulness score
    if (filters.minHelpfulness !== undefined) {
      if (opp.suggestedResponse.estimatedHelpfulness < filters.minHelpfulness) {
        return false;
      }
    }

    // Filter by subreddit
    if (filters.subreddits && filters.subreddits.length > 0) {
      if (!filters.subreddits.includes(opp.subreddit)) {
        return false;
      }
    }

    // Filter by code examples
    if (filters.includeCodeExamples !== undefined) {
      if (opp.suggestedResponse.includesCodeExample !== filters.includeCodeExamples) {
        return false;
      }
    }

    return true;
  });
}
