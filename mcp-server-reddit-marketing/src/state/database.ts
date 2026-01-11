/**
 * SQLite database management for Reddit marketing state
 */

import Database from 'better-sqlite3';
import { DATABASE_SCHEMAS, DATABASE_INDEXES } from './schemas.js';
import type {
  AccountState,
  AccountMetrics,
  ActivityLog,
  QueuedComment,
  SubredditState,
  ActivityType,
  CommentPriority,
} from '../types/index.js';

export class RedditMarketingDatabase {
  private db: Database.Database;

  constructor(dbPath: string = './reddit-marketing.db') {
    this.db = new Database(dbPath);
    this.db.pragma('journal_mode = WAL'); // Better concurrency
    this.initializeDatabase();
  }

  private initializeDatabase(): void {
    // Create tables
    Object.values(DATABASE_SCHEMAS).forEach(schema => {
      this.db.exec(schema);
    });

    // Create indexes
    Object.values(DATABASE_INDEXES).forEach(index => {
      this.db.exec(index);
    });
  }

  // ============================================================================
  // Account Management
  // ============================================================================

  createAccount(username: string): AccountState {
    const stmt = this.db.prepare(`
      INSERT INTO accounts (username)
      VALUES (?)
      RETURNING *
    `);

    const row = stmt.get(username) as any;
    return this.rowToAccountState(row);
  }

  getAccount(accountId: number): AccountState | null {
    const stmt = this.db.prepare('SELECT * FROM accounts WHERE id = ?');
    const row = stmt.get(accountId) as any;
    return row ? this.rowToAccountState(row) : null;
  }

  getAccountByUsername(username: string): AccountState | null {
    const stmt = this.db.prepare('SELECT * FROM accounts WHERE username = ?');
    const row = stmt.get(username) as any;
    return row ? this.rowToAccountState(row) : null;
  }

  updateAccount(accountId: number, updates: Partial<AccountState>): AccountState {
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.karma !== undefined) {
      fields.push('karma = ?');
      values.push(updates.karma);
    }
    if (updates.accountAge !== undefined) {
      fields.push('account_age = ?');
      values.push(updates.accountAge);
    }
    if (updates.currentPhase !== undefined) {
      fields.push('current_phase = ?');
      values.push(updates.currentPhase);
    }
    if (updates.shadowBanStatus !== undefined) {
      fields.push('shadow_ban_status = ?');
      values.push(updates.shadowBanStatus);
    }
    if (updates.cqsScore !== undefined) {
      fields.push('cqs_score = ?');
      values.push(updates.cqsScore);
    }

    fields.push('updated_at = CURRENT_TIMESTAMP');
    fields.push('last_activity = CURRENT_TIMESTAMP');
    values.push(accountId);

    const stmt = this.db.prepare(`
      UPDATE accounts
      SET ${fields.join(', ')}
      WHERE id = ?
      RETURNING *
    `);

    const row = stmt.get(...values) as any;
    return this.rowToAccountState(row);
  }

  listAccounts(): AccountState[] {
    const stmt = this.db.prepare('SELECT * FROM accounts ORDER BY created_at DESC');
    const rows = stmt.all() as any[];
    return rows.map(row => this.rowToAccountState(row));
  }

  // ============================================================================
  // Account Metrics
  // ============================================================================

  getAccountMetrics(accountId: number): AccountMetrics | null {
    const stmt = this.db.prepare('SELECT * FROM account_metrics WHERE account_id = ?');
    const row = stmt.get(accountId) as any;
    return row ? this.rowToAccountMetrics(row) : null;
  }

  updateAccountMetrics(accountId: number, metrics: Partial<AccountMetrics>): void {
    const stmt = this.db.prepare(`
      INSERT INTO account_metrics (
        account_id, total_comments, helpful_comments, promotional_comments,
        avg_karma_per_comment, total_upvotes, total_downvotes, success_rate
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(account_id) DO UPDATE SET
        total_comments = excluded.total_comments,
        helpful_comments = excluded.helpful_comments,
        promotional_comments = excluded.promotional_comments,
        avg_karma_per_comment = excluded.avg_karma_per_comment,
        total_upvotes = excluded.total_upvotes,
        total_downvotes = excluded.total_downvotes,
        success_rate = excluded.success_rate,
        last_calculated = CURRENT_TIMESTAMP
    `);

    stmt.run(
      accountId,
      metrics.totalComments || 0,
      metrics.helpfulComments || 0,
      metrics.promotionalComments || 0,
      metrics.avgKarmaPerComment || 0,
      metrics.totalUpvotes || 0,
      metrics.totalDownvotes || 0,
      metrics.successRate || 0
    );
  }

  // ============================================================================
  // Activity Log
  // ============================================================================

  logActivity(accountId: number, actionType: ActivityType, metadata: Record<string, any> = {}): ActivityLog {
    const stmt = this.db.prepare(`
      INSERT INTO activity_log (account_id, action_type, metadata)
      VALUES (?, ?, ?)
      RETURNING *
    `);

    const row = stmt.get(accountId, actionType, JSON.stringify(metadata)) as any;
    return this.rowToActivityLog(row);
  }

  getRecentActivity(accountId: number, limit: number = 50): ActivityLog[] {
    const stmt = this.db.prepare(`
      SELECT * FROM activity_log
      WHERE account_id = ?
      ORDER BY timestamp DESC
      LIMIT ?
    `);

    const rows = stmt.all(accountId, limit) as any[];
    return rows.map(row => this.rowToActivityLog(row));
  }

  // ============================================================================
  // Comment Queue
  // ============================================================================

  queueComment(comment: Omit<QueuedComment, 'id' | 'createdAt' | 'status'>): QueuedComment {
    const stmt = this.db.prepare(`
      INSERT INTO comment_queue (
        account_id, subreddit, post_url, post_title, comment_type,
        comment_data, priority, scheduled_for
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      RETURNING *
    `);

    const row = stmt.get(
      comment.accountId,
      comment.subreddit,
      comment.postUrl,
      comment.postTitle,
      comment.commentType,
      JSON.stringify(comment.commentData),
      comment.priority,
      comment.scheduledFor || null
    ) as any;

    return this.rowToQueuedComment(row);
  }

  getPendingComments(accountId?: number, limit: number = 50): QueuedComment[] {
    let query = `
      SELECT * FROM comment_queue
      WHERE status = 'pending'
    `;

    const params: any[] = [];
    if (accountId !== undefined) {
      query += ' AND account_id = ?';
      params.push(accountId);
    }

    query += ' ORDER BY priority DESC, created_at ASC LIMIT ?';
    params.push(limit);

    const stmt = this.db.prepare(query);
    const rows = stmt.all(...params) as any[];
    return rows.map(row => this.rowToQueuedComment(row));
  }

  updateCommentStatus(commentId: number, status: QueuedComment['status'], postedAt?: string): void {
    const stmt = this.db.prepare(`
      UPDATE comment_queue
      SET status = ?, posted_at = ?
      WHERE id = ?
    `);

    stmt.run(status, postedAt || null, commentId);
  }

  // ============================================================================
  // Subreddit State
  // ============================================================================

  getSubredditState(name: string): SubredditState | null {
    const stmt = this.db.prepare('SELECT * FROM subreddit_state WHERE name = ?');
    const row = stmt.get(name) as any;
    return row ? this.rowToSubredditState(row) : null;
  }

  updateSubredditState(name: string, state: Partial<SubredditState>): SubredditState {
    const stmt = this.db.prepare(`
      INSERT INTO subreddit_state (
        name, last_scanned, opportunities_found, avg_engagement,
        recommended_frequency, last_posted, notes
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(name) DO UPDATE SET
        last_scanned = excluded.last_scanned,
        opportunities_found = excluded.opportunities_found,
        avg_engagement = excluded.avg_engagement,
        recommended_frequency = excluded.recommended_frequency,
        last_posted = excluded.last_posted,
        notes = excluded.notes,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `);

    const row = stmt.get(
      name,
      state.lastScanned || new Date().toISOString(),
      state.opportunitiesFound || 0,
      state.avgEngagement || 0,
      state.recommendedFrequency || 1,
      state.lastPosted || null,
      state.notes || null
    ) as any;

    return this.rowToSubredditState(row);
  }

  listSubreddits(): SubredditState[] {
    const stmt = this.db.prepare('SELECT * FROM subreddit_state ORDER BY last_scanned DESC');
    const rows = stmt.all() as any[];
    return rows.map(row => this.rowToSubredditState(row));
  }

  // ============================================================================
  // Helper Methods
  // ============================================================================

  private rowToAccountState(row: any): AccountState {
    return {
      id: row.id,
      username: row.username,
      karma: row.karma,
      accountAge: row.account_age,
      currentPhase: row.current_phase,
      shadowBanStatus: row.shadow_ban_status,
      cqsScore: row.cqs_score,
      lastActivity: row.last_activity,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  private rowToAccountMetrics(row: any): AccountMetrics {
    return {
      accountId: row.account_id,
      totalComments: row.total_comments,
      helpfulComments: row.helpful_comments,
      promotionalComments: row.promotional_comments,
      avgKarmaPerComment: row.avg_karma_per_comment,
      totalUpvotes: row.total_upvotes,
      totalDownvotes: row.total_downvotes,
      successRate: row.success_rate,
      lastCalculated: row.last_calculated,
    };
  }

  private rowToActivityLog(row: any): ActivityLog {
    return {
      id: row.id,
      accountId: row.account_id,
      actionType: row.action_type,
      timestamp: row.timestamp,
      metadata: row.metadata ? JSON.parse(row.metadata) : {},
    };
  }

  private rowToQueuedComment(row: any): QueuedComment {
    return {
      id: row.id,
      accountId: row.account_id,
      subreddit: row.subreddit,
      postUrl: row.post_url,
      postTitle: row.post_title,
      commentType: row.comment_type,
      commentData: JSON.parse(row.comment_data),
      priority: row.priority,
      scheduledFor: row.scheduled_for,
      createdAt: row.created_at,
      postedAt: row.posted_at,
      status: row.status,
    };
  }

  private rowToSubredditState(row: any): SubredditState {
    return {
      name: row.name,
      lastScanned: row.last_scanned,
      opportunitiesFound: row.opportunities_found,
      avgEngagement: row.avg_engagement,
      recommendedFrequency: row.recommended_frequency,
      lastPosted: row.last_posted,
      notes: row.notes,
    };
  }

  close(): void {
    this.db.close();
  }
}
