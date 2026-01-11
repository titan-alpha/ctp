/**
 * SQLite database schemas for Reddit marketing state management
 */

export const DATABASE_SCHEMAS = {
  accounts: `
    CREATE TABLE IF NOT EXISTS accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      karma INTEGER DEFAULT 0,
      account_age INTEGER DEFAULT 0,
      current_phase TEXT DEFAULT 'accountWarming',
      shadow_ban_status TEXT DEFAULT 'clear',
      cqs_score INTEGER DEFAULT 0,
      last_activity TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `,

  activity_log: `
    CREATE TABLE IF NOT EXISTS activity_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      account_id INTEGER NOT NULL,
      action_type TEXT NOT NULL,
      timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
      metadata TEXT,
      FOREIGN KEY (account_id) REFERENCES accounts(id)
    )
  `,

  comment_queue: `
    CREATE TABLE IF NOT EXISTS comment_queue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      account_id INTEGER NOT NULL,
      subreddit TEXT NOT NULL,
      post_url TEXT NOT NULL,
      post_title TEXT NOT NULL,
      comment_type TEXT NOT NULL,
      comment_data TEXT NOT NULL,
      priority TEXT DEFAULT 'medium',
      scheduled_for TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      posted_at TEXT,
      status TEXT DEFAULT 'pending',
      FOREIGN KEY (account_id) REFERENCES accounts(id)
    )
  `,

  subreddit_state: `
    CREATE TABLE IF NOT EXISTS subreddit_state (
      name TEXT PRIMARY KEY,
      last_scanned TEXT,
      opportunities_found INTEGER DEFAULT 0,
      avg_engagement REAL DEFAULT 0.0,
      recommended_frequency REAL DEFAULT 1.0,
      last_posted TEXT,
      notes TEXT,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `,

  account_metrics: `
    CREATE TABLE IF NOT EXISTS account_metrics (
      account_id INTEGER PRIMARY KEY,
      total_comments INTEGER DEFAULT 0,
      helpful_comments INTEGER DEFAULT 0,
      promotional_comments INTEGER DEFAULT 0,
      avg_karma_per_comment REAL DEFAULT 0.0,
      total_upvotes INTEGER DEFAULT 0,
      total_downvotes INTEGER DEFAULT 0,
      success_rate REAL DEFAULT 0.0,
      last_calculated TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (account_id) REFERENCES accounts(id)
    )
  `,
};

export const DATABASE_INDEXES = {
  idx_activity_log_account: `
    CREATE INDEX IF NOT EXISTS idx_activity_log_account
    ON activity_log(account_id, timestamp DESC)
  `,

  idx_comment_queue_account: `
    CREATE INDEX IF NOT EXISTS idx_comment_queue_account
    ON comment_queue(account_id, status, priority)
  `,

  idx_comment_queue_scheduled: `
    CREATE INDEX IF NOT EXISTS idx_comment_queue_scheduled
    ON comment_queue(scheduled_for, status)
  `,

  idx_subreddit_last_scanned: `
    CREATE INDEX IF NOT EXISTS idx_subreddit_last_scanned
    ON subreddit_state(last_scanned)
  `,
};
