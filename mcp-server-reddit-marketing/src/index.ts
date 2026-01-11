#!/usr/bin/env node

/**
 * MCP Server for Reddit Marketing Orchestration
 *
 * This server wraps the conversation-analyzer and behavior-automation systems,
 * enabling Claude to orchestrate Reddit engagement with visual feedback.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { RedditMarketingDatabase } from './state/database.js';
import { generateHelpfulComments, loadCommentOpportunity } from './tools/generateComments.js';
import {
  getAccountState,
  getAccountByUsername,
  updateAccountState,
  createAccount,
  recalculateAccountMetrics,
} from './tools/accountManagement.js';
import {
  analyzeSubredditOpportunities,
  getSubredditState,
  listSubreddits,
} from './tools/rssMonitoring.js';
import {
  getTypingInstructions,
  getMouseWorkflowInstructions,
  formatTypingInstructionsForClaude,
  formatMouseInstructionsForClaude,
  validateBehavioralMetadata,
} from './tools/behavioralHelpers.js';
import { getAccountResource, listAccountResources } from './resources/accounts.js';
import { getPendingCommentsResource, getScheduledCommentsResource } from './resources/commentQueue.js';
import { getSubredditStateResource, listSubredditStateResources } from './resources/subredditState.js';

// Initialize database
const db = new RedditMarketingDatabase('./reddit-marketing.db');

// Initialize MCP server
const server = new Server(
  {
    name: 'reddit-marketing-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// ============================================================================
// TOOLS
// ============================================================================

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'generate_helpful_comments',
        description: 'Generate helpful comments for Reddit posts using conversation-analyzer. Filters by phase (accountWarming, etc.) and returns comments with behavioral metadata.',
        inputSchema: {
          type: 'object',
          properties: {
            phase: {
              type: 'string',
              enum: ['accountWarming', 'reputationBuilding', 'gradualPromotional', 'stableOperation'],
              description: 'Account phase to filter for (default: accountWarming)',
            },
            maxResults: {
              type: 'number',
              description: 'Maximum number of results to return (default: 10)',
            },
            subreddits: {
              type: 'array',
              items: { type: 'string' },
              description: 'Filter by specific subreddits (optional)',
            },
          },
        },
      },
      {
        name: 'get_account_state',
        description: 'Get Reddit account state including karma, age, phase, shadow-ban status, and CQS score. Optionally includes metrics and recent activity.',
        inputSchema: {
          type: 'object',
          properties: {
            accountId: {
              type: 'number',
              description: 'Account ID to retrieve',
            },
            username: {
              type: 'string',
              description: 'Username to retrieve (alternative to accountId)',
            },
            includeMetrics: {
              type: 'boolean',
              description: 'Include account metrics (default: true)',
            },
            includeActivity: {
              type: 'boolean',
              description: 'Include recent activity (default: true)',
            },
          },
        },
      },
      {
        name: 'update_account_state',
        description: 'Update Reddit account state (karma, phase, shadow-ban status, etc.). Logs changes to activity history.',
        inputSchema: {
          type: 'object',
          properties: {
            accountId: {
              type: 'number',
              description: 'Account ID to update',
            },
            karma: {
              type: 'number',
              description: 'New karma value',
            },
            accountAge: {
              type: 'number',
              description: 'Account age in days',
            },
            currentPhase: {
              type: 'string',
              enum: ['accountWarming', 'reputationBuilding', 'gradualPromotional', 'stableOperation'],
              description: 'New phase',
            },
            shadowBanStatus: {
              type: 'string',
              enum: ['clear', 'suspected', 'confirmed'],
              description: 'Shadow-ban status',
            },
            cqsScore: {
              type: 'number',
              description: 'Content Quality Score (0-100)',
            },
          },
          required: ['accountId'],
        },
      },
      {
        name: 'create_account',
        description: 'Create a new Reddit account in the tracking database.',
        inputSchema: {
          type: 'object',
          properties: {
            username: {
              type: 'string',
              description: 'Reddit username',
            },
          },
          required: ['username'],
        },
      },
      {
        name: 'analyze_subreddit_opportunities',
        description: 'Analyze subreddit(s) for comment opportunities using RSS feeds. Returns posts with relevance scores.',
        inputSchema: {
          type: 'object',
          properties: {
            subreddit: {
              type: 'string',
              description: 'Specific subreddit to analyze (optional, analyzes all if not specified)',
            },
            maxAgeHours: {
              type: 'number',
              description: 'Maximum post age in hours (default: 24)',
            },
            minRelevanceScore: {
              type: 'number',
              description: 'Minimum relevance score (default: 85)',
            },
          },
        },
      },
      {
        name: 'get_typing_instructions',
        description: 'Convert behavioral metadata to step-by-step typing instructions for human-like behavior. Returns instructions Claude can follow with computer-control-2.',
        inputSchema: {
          type: 'object',
          properties: {
            opportunityId: {
              type: 'string',
              description: 'Comment opportunity ID containing behavioral metadata',
            },
            behavioralMetadata: {
              type: 'object',
              description: 'Raw behavioral metadata object (alternative to opportunityId)',
            },
          },
        },
      },
      {
        name: 'get_mouse_workflow_instructions',
        description: 'Convert mouse workflow metadata to browser action instructions. Returns instructions for navigating Reddit with human-like behavior.',
        inputSchema: {
          type: 'object',
          properties: {
            opportunityId: {
              type: 'string',
              description: 'Comment opportunity ID containing behavioral metadata',
            },
            behavioralMetadata: {
              type: 'object',
              description: 'Raw behavioral metadata object (alternative to opportunityId)',
            },
          },
        },
      },
      {
        name: 'queue_comment',
        description: 'Add a comment to the posting queue with priority and scheduling.',
        inputSchema: {
          type: 'object',
          properties: {
            accountId: {
              type: 'number',
              description: 'Account ID to post from',
            },
            opportunityId: {
              type: 'string',
              description: 'Comment opportunity ID',
            },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high', 'urgent'],
              description: 'Comment priority (default: medium)',
            },
            scheduledFor: {
              type: 'string',
              description: 'ISO timestamp to schedule for (optional)',
            },
          },
          required: ['accountId', 'opportunityId'],
        },
      },
      {
        name: 'recalculate_metrics',
        description: 'Recalculate account metrics from activity history.',
        inputSchema: {
          type: 'object',
          properties: {
            accountId: {
              type: 'number',
              description: 'Account ID to recalculate',
            },
          },
          required: ['accountId'],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'generate_helpful_comments': {
        const result = await generateHelpfulComments({
          phase: args.phase,
          maxResults: args.maxResults,
          subreddits: args.subreddits,
        });

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'get_account_state': {
        let result;
        if (args.username) {
          result = await getAccountByUsername(db, args.username);
        } else if (args.accountId) {
          result = await getAccountState(db, args.accountId, {
            includeMetrics: args.includeMetrics,
            includeActivity: args.includeActivity,
          });
        } else {
          throw new Error('Either accountId or username must be provided');
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'update_account_state': {
        const result = await updateAccountState(db, args.accountId, {
          karma: args.karma,
          accountAge: args.accountAge,
          currentPhase: args.currentPhase,
          shadowBanStatus: args.shadowBanStatus,
          cqsScore: args.cqsScore,
        });

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'create_account': {
        const result = await createAccount(db, args.username);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'analyze_subreddit_opportunities': {
        const result = await analyzeSubredditOpportunities(db, {
          subreddit: args.subreddit,
          maxAgeHours: args.maxAgeHours,
          minRelevanceScore: args.minRelevanceScore,
        });

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'get_typing_instructions': {
        let metadata;

        if (args.opportunityId) {
          const opportunity = await loadCommentOpportunity(args.opportunityId);
          if (!opportunity) {
            throw new Error(`Opportunity not found: ${args.opportunityId}`);
          }
          metadata = opportunity.suggestedResponse.behavioralMetadata;
        } else if (args.behavioralMetadata) {
          metadata = args.behavioralMetadata;
        } else {
          throw new Error('Either opportunityId or behavioralMetadata must be provided');
        }

        const validation = validateBehavioralMetadata(metadata);
        if (!validation.valid) {
          throw new Error(`Invalid behavioral metadata: ${validation.errors.join(', ')}`);
        }

        const result = await getTypingInstructions(metadata);
        const formatted = formatTypingInstructionsForClaude(result.instructions);

        return {
          content: [
            {
              type: 'text',
              text: `# Typing Instructions\n\nBase Speed: ${result.baseSpeed} WPM\nEstimated Duration: ${Math.round(result.estimatedDuration / 1000)}s\n\n${formatted}`,
            },
          ],
        };
      }

      case 'get_mouse_workflow_instructions': {
        let metadata;

        if (args.opportunityId) {
          const opportunity = await loadCommentOpportunity(args.opportunityId);
          if (!opportunity) {
            throw new Error(`Opportunity not found: ${args.opportunityId}`);
          }
          metadata = opportunity.suggestedResponse.behavioralMetadata;
        } else if (args.behavioralMetadata) {
          metadata = args.behavioralMetadata;
        } else {
          throw new Error('Either opportunityId or behavioralMetadata must be provided');
        }

        const result = await getMouseWorkflowInstructions(metadata);
        const formatted = formatMouseInstructionsForClaude(result.instructions);

        return {
          content: [
            {
              type: 'text',
              text: `# Mouse Workflow Instructions\n\nEstimated Duration: ${Math.round(result.estimatedDuration / 1000)}s\n\n${formatted}`,
            },
          ],
        };
      }

      case 'queue_comment': {
        const opportunity = await loadCommentOpportunity(args.opportunityId);
        if (!opportunity) {
          throw new Error(`Opportunity not found: ${args.opportunityId}`);
        }

        const queuedComment = db.queueComment({
          accountId: args.accountId,
          subreddit: opportunity.subreddit,
          postUrl: opportunity.postUrl,
          postTitle: opportunity.postTitle,
          commentType: opportunity.commentType,
          commentData: opportunity.suggestedResponse,
          priority: args.priority || 'medium',
          scheduledFor: args.scheduledFor,
        });

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(queuedComment, null, 2),
            },
          ],
        };
      }

      case 'recalculate_metrics': {
        const result = await recalculateAccountMetrics(db, args.accountId);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

// ============================================================================
// RESOURCES
// ============================================================================

server.setRequestHandler(ListResourcesRequestSchema, async () => {
  const accounts = await listAccountResources(db);
  const subreddits = await listSubredditStateResources(db);

  return {
    resources: [
      {
        uri: 'queue://pending-comments',
        name: 'Pending Comments Queue',
        description: 'Comments waiting to be posted, organized by priority',
        mimeType: 'application/json',
      },
      {
        uri: 'queue://scheduled-comments',
        name: 'Scheduled Comments',
        description: 'Comments scheduled for future posting',
        mimeType: 'application/json',
      },
      ...accounts.map(acc => ({
        uri: acc.uri,
        name: acc.name,
        description: acc.description,
        mimeType: acc.mimeType,
      })),
      ...subreddits.map(sub => ({
        uri: sub.uri,
        name: sub.name,
        description: sub.description,
        mimeType: sub.mimeType,
      })),
    ],
  };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  try {
    if (uri === 'queue://pending-comments') {
      const resource = await getPendingCommentsResource(db);
      return {
        contents: [
          {
            uri: resource.uri,
            mimeType: resource.mimeType,
            text: resource.text,
          },
        ],
      };
    }

    if (uri === 'queue://scheduled-comments') {
      const resource = await getScheduledCommentsResource(db);
      return {
        contents: [
          {
            uri: resource.uri,
            mimeType: resource.mimeType,
            text: resource.text,
          },
        ],
      };
    }

    if (uri.startsWith('account://')) {
      const accountId = parseInt(uri.replace('account://', ''));
      const resource = await getAccountResource(db, accountId);
      return {
        contents: [
          {
            uri: resource.uri,
            mimeType: resource.mimeType,
            text: resource.text,
          },
        ],
      };
    }

    if (uri.startsWith('subreddit://')) {
      const subredditName = uri.replace('subreddit://', '').replace('/state', '');
      const resource = await getSubredditStateResource(db, subredditName);
      return {
        contents: [
          {
            uri: resource.uri,
            mimeType: resource.mimeType,
            text: resource.text,
          },
        ],
      };
    }

    throw new Error(`Unknown resource: ${uri}`);
  } catch (error) {
    throw new Error(`Error reading resource: ${error instanceof Error ? error.message : String(error)}`);
  }
});

// ============================================================================
// START SERVER
// ============================================================================

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error('Reddit Marketing MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
