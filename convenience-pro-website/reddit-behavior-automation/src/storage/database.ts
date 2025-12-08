/**
 * SQLite database storage layer
 * Stores behavioral data for analysis and replay
 */

import Database from 'better-sqlite3';
import * as fs from 'fs';
import * as path from 'path';
import {
  Session,
  MouseEvent,
  KeyboardEvent,
  BrowserEvent,
  BehavioralProfile,
  ActionSequence,
} from '../types/behavioral';

export class BehavioralDatabase {
  private db: Database.Database;

  constructor(dbPath: string) {
    // Ensure data directory exists
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    this.db = new Database(dbPath);
    this.initializeTables();
  }

  /**
   * Initialize database tables
   */
  private initializeTables(): void {
    // Sessions table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS sessions (
        session_id TEXT PRIMARY KEY,
        start_time INTEGER NOT NULL,
        end_time INTEGER,
        duration INTEGER,
        user_agent TEXT,
        screen_width INTEGER,
        screen_height INTEGER,
        timezone TEXT,
        created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000)
      )
    `);

    // Mouse events table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS mouse_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        x REAL NOT NULL,
        y REAL NOT NULL,
        event_type TEXT NOT NULL,
        button TEXT,
        scroll_delta REAL,
        velocity REAL,
        acceleration REAL,
        FOREIGN KEY (session_id) REFERENCES sessions(session_id)
      )
    `);

    // Keyboard events table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS keyboard_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        key TEXT NOT NULL,
        event_type TEXT NOT NULL,
        dwell_time REAL,
        iki REAL,
        is_correction INTEGER,
        FOREIGN KEY (session_id) REFERENCES sessions(session_id)
      )
    `);

    // Browser events table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS browser_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        event_type TEXT NOT NULL,
        url TEXT,
        element_type TEXT,
        element_id TEXT,
        scroll_x REAL,
        scroll_y REAL,
        window_width INTEGER,
        window_height INTEGER,
        FOREIGN KEY (session_id) REFERENCES sessions(session_id)
      )
    `);

    // Behavioral profiles table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS behavioral_profiles (
        user_id TEXT PRIMARY KEY,
        created_at INTEGER NOT NULL,
        last_updated INTEGER NOT NULL,
        profile_data TEXT NOT NULL
      )
    `);

    // Action sequences table (for HMM)
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS action_sequences (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        state TEXT NOT NULL,
        duration INTEGER NOT NULL,
        next_state TEXT,
        FOREIGN KEY (session_id) REFERENCES sessions(session_id)
      )
    `);

    // Create indices for performance
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_mouse_session ON mouse_events(session_id);
      CREATE INDEX IF NOT EXISTS idx_keyboard_session ON keyboard_events(session_id);
      CREATE INDEX IF NOT EXISTS idx_browser_session ON browser_events(session_id);
      CREATE INDEX IF NOT EXISTS idx_action_session ON action_sequences(session_id);
    `);

    console.log('Database tables initialized');
  }

  /**
   * Save a complete session
   */
  saveSession(session: Session): void {
    const transaction = this.db.transaction(() => {
      // Insert session
      const insertSession = this.db.prepare(`
        INSERT INTO sessions (
          session_id, start_time, end_time, duration,
          user_agent, screen_width, screen_height, timezone
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      insertSession.run(
        session.sessionId,
        session.startTime,
        session.endTime || null,
        session.duration || null,
        session.userAgent || null,
        session.screenResolution?.width || null,
        session.screenResolution?.height || null,
        session.timezone || null
      );

      // Insert mouse events
      if (session.mouseEvents.length > 0) {
        const insertMouse = this.db.prepare(`
          INSERT INTO mouse_events (
            session_id, timestamp, x, y, event_type,
            button, scroll_delta, velocity, acceleration
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        for (const event of session.mouseEvents) {
          insertMouse.run(
            session.sessionId,
            event.timestamp,
            event.x,
            event.y,
            event.eventType,
            event.button || null,
            event.scrollDelta || null,
            event.velocity || null,
            event.acceleration || null
          );
        }
      }

      // Insert keyboard events
      if (session.keyboardEvents.length > 0) {
        const insertKeyboard = this.db.prepare(`
          INSERT INTO keyboard_events (
            session_id, timestamp, key, event_type,
            dwell_time, iki, is_correction
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `);

        for (const event of session.keyboardEvents) {
          insertKeyboard.run(
            session.sessionId,
            event.timestamp,
            event.key,
            event.eventType,
            event.dwellTime || null,
            event.iki || null,
            event.isCorrection ? 1 : 0
          );
        }
      }

      // Insert browser events
      if (session.browserEvents.length > 0) {
        const insertBrowser = this.db.prepare(`
          INSERT INTO browser_events (
            session_id, timestamp, event_type, url,
            element_type, element_id, scroll_x, scroll_y,
            window_width, window_height
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        for (const event of session.browserEvents) {
          insertBrowser.run(
            session.sessionId,
            event.timestamp,
            event.eventType,
            event.url || null,
            event.elementType || null,
            event.elementId || null,
            event.scrollPosition?.x || null,
            event.scrollPosition?.y || null,
            event.windowSize?.width || null,
            event.windowSize?.height || null
          );
        }
      }
    });

    transaction();

    console.log(`Saved session ${session.sessionId}`);
  }

  /**
   * Load a session by ID
   */
  loadSession(sessionId: string): Session | null {
    const sessionRow = this.db
      .prepare('SELECT * FROM sessions WHERE session_id = ?')
      .get(sessionId) as any;

    if (!sessionRow) {
      return null;
    }

    const mouseEvents = this.db
      .prepare('SELECT * FROM mouse_events WHERE session_id = ? ORDER BY timestamp')
      .all(sessionId) as any[];

    const keyboardEvents = this.db
      .prepare('SELECT * FROM keyboard_events WHERE session_id = ? ORDER BY timestamp')
      .all(sessionId) as any[];

    const browserEvents = this.db
      .prepare('SELECT * FROM browser_events WHERE session_id = ? ORDER BY timestamp')
      .all(sessionId) as any[];

    return {
      sessionId: sessionRow.session_id,
      startTime: sessionRow.start_time,
      endTime: sessionRow.end_time,
      duration: sessionRow.duration,
      userAgent: sessionRow.user_agent,
      screenResolution: sessionRow.screen_width
        ? {
            width: sessionRow.screen_width,
            height: sessionRow.screen_height,
          }
        : undefined,
      timezone: sessionRow.timezone,
      mouseEvents: mouseEvents.map((row) => ({
        timestamp: row.timestamp,
        x: row.x,
        y: row.y,
        eventType: row.event_type,
        button: row.button,
        scrollDelta: row.scroll_delta,
        velocity: row.velocity,
        acceleration: row.acceleration,
      })),
      keyboardEvents: keyboardEvents.map((row) => ({
        timestamp: row.timestamp,
        key: row.key,
        eventType: row.event_type,
        dwellTime: row.dwell_time,
        iki: row.iki,
        isCorrection: row.is_correction === 1,
      })),
      browserEvents: browserEvents.map((row) => ({
        timestamp: row.timestamp,
        eventType: row.event_type,
        url: row.url,
        elementType: row.element_type,
        elementId: row.element_id,
        scrollPosition: row.scroll_x
          ? { x: row.scroll_x, y: row.scroll_y }
          : undefined,
        windowSize: row.window_width
          ? { width: row.window_width, height: row.window_height }
          : undefined,
      })),
    };
  }

  /**
   * Save a behavioral profile
   */
  saveBehavioralProfile(profile: BehavioralProfile): void {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO behavioral_profiles (
        user_id, created_at, last_updated, profile_data
      ) VALUES (?, ?, ?, ?)
    `);

    stmt.run(
      profile.userId,
      profile.createdAt,
      profile.lastUpdated,
      JSON.stringify(profile)
    );

    console.log(`Saved behavioral profile for user ${profile.userId}`);
  }

  /**
   * Load a behavioral profile
   */
  loadBehavioralProfile(userId: string): BehavioralProfile | null {
    const row = this.db
      .prepare('SELECT * FROM behavioral_profiles WHERE user_id = ?')
      .get(userId) as any;

    if (!row) {
      return null;
    }

    return JSON.parse(row.profile_data);
  }

  /**
   * Get all sessions
   */
  getAllSessions(): Array<{ sessionId: string; startTime: number }> {
    const rows = this.db
      .prepare('SELECT session_id, start_time FROM sessions ORDER BY start_time DESC')
      .all() as any[];

    return rows.map((row) => ({
      sessionId: row.session_id,
      startTime: row.start_time,
    }));
  }

  /**
   * Close database connection
   */
  close(): void {
    this.db.close();
    console.log('Database connection closed');
  }
}
