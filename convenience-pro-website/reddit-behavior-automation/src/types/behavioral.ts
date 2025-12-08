/**
 * Behavioral data type definitions
 * Based on research from RESEARCH_FINDINGS.md
 */

export interface MouseEvent {
  timestamp: number;
  x: number;
  y: number;
  eventType: 'move' | 'click' | 'scroll' | 'hover';
  button?: 'left' | 'right' | 'middle';
  scrollDelta?: number;
  velocity?: number;
  acceleration?: number;
}

export interface KeyboardEvent {
  timestamp: number;
  key: string;
  eventType: 'keydown' | 'keyup';
  dwellTime?: number; // Key hold duration (ms)
  iki?: number; // Inter-keystroke interval (ms)
  isCorrection?: boolean; // Backspace or delete
}

export interface BrowserEvent {
  timestamp: number;
  eventType: 'navigation' | 'scroll' | 'click' | 'focus' | 'blur' | 'tab_switch';
  url?: string;
  elementType?: string;
  elementId?: string;
  scrollPosition?: { x: number; y: number };
  windowSize?: { width: number; height: number };
}

export interface Session {
  sessionId: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  mouseEvents: MouseEvent[];
  keyboardEvents: KeyboardEvent[];
  browserEvents: BrowserEvent[];
  userAgent?: string;
  screenResolution?: { width: number; height: number };
  timezone?: string;
}

export interface BehavioralProfile {
  userId: string;
  createdAt: number;
  lastUpdated: number;

  // Typing characteristics
  typingSpeed: StatisticalDistribution; // WPM
  interKeystrokeInterval: StatisticalDistribution; // ms
  dwellTime: StatisticalDistribution; // ms
  correctionRate: number; // Frequency of backspace/corrections

  // Mouse characteristics
  mouseVelocity: StatisticalDistribution; // pixels/second
  mouseJitter: StatisticalDistribution; // pixels
  clickPrecision: StatisticalDistribution; // pixels from center
  trajectoryComplexity: number; // Bezier curve complexity measure

  // Temporal patterns
  sessionDuration: StatisticalDistribution; // seconds
  timeOfDayDistribution: number[]; // 24-hour distribution
  dayOfWeekDistribution: number[]; // 7-day distribution

  // Behavioral sequences (HMM states)
  stateTransitions: Record<string, Record<string, number>>;
  stateDurations: Record<string, StatisticalDistribution>;

  // Browser fingerprint
  fingerprint: BrowserFingerprint;
}

export interface StatisticalDistribution {
  mean: number;
  stdDev: number;
  min: number;
  max: number;
  distributionType: 'gaussian' | 'log-normal' | 'gamma' | 'poisson';
}

export interface BrowserFingerprint {
  userAgent: string;
  screenResolution: { width: number; height: number };
  timezone: string;
  language: string;
  platform: string;
  colorDepth: number;
  pixelRatio: number;
  fonts: string[];
  plugins: string[];
  canvasFingerprint?: string;
}

// HMM states for Reddit interaction
export type RedditActionState =
  | 'browsing'
  | 'reading'
  | 'considering'
  | 'composing'
  | 'reviewing'
  | 'submitting'
  | 'exit';

export interface ActionSequence {
  sessionId: string;
  timestamp: number;
  state: RedditActionState;
  duration: number; // ms spent in this state
  nextState?: RedditActionState;
}

// Capture configuration
export interface CaptureConfig {
  mouseSamplingRateHz: number;
  captureDurationMinutes: number;
  enableScreenRecording: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

// Replay configuration
export interface ReplayConfig {
  targetUrl: string;
  commentText: string;
  useProfile: string; // Profile ID to use
  maxCommentsPerHour: number;
  maxCommentsPerDay: number;
  minDelayBetweenCommentsMinutes: number;
}

// ============================================================================
// LLM-DRIVEN BEHAVIORAL METADATA TYPES
// Based on ENHANCED_LLM_BEHAVIORAL_METADATA.md
// ============================================================================

/**
 * Typing behavior metadata for contextually appropriate human-like typing
 */
export interface TypingBehavior {
  baseSpeed: {
    wpm: number;              // 40-65 WPM
    variation: number;        // ±10% variation
  };
  segments: TypingSegment[];
  corrections: TypingCorrection[];
  thinkingPauses: ThinkingPause[];
  hesitations: Hesitation[];
}

export interface TypingSegment {
  text: string;               // Exact text segment
  speedModifier: number;      // 0.7-1.3 (slow down or speed up)
  rationale: string;          // Why: "technical explanation", "casual agreement", "emphatic point"
}

export interface TypingCorrection {
  position: number;           // Character index
  originalText: string;       // What to type first (typo)
  correctedText: string;      // What to correct to
  rationale: string;          // "Complex technical term", "Unfamiliar acronym"
  recognitionDelay: number;   // 200-800ms before noticing error
  correctionDelay: number;    // 100-400ms to fix
}

export interface ThinkingPause {
  position: number;           // Character index (before this position)
  duration: number;           // 800-2500ms
  rationale: string;          // "Considering architecture advice", "Formulating explanation"
}

export interface Hesitation {
  wordStart: number;          // Character index of word start
  wordEnd: number;            // Character index of word end
  slowdownFactor: number;     // 0.4-0.7 (type this word slower)
  rationale: string;          // "Giving advice - uncertainty natural", "Technical jargon"
}

/**
 * Mouse behavior metadata for contextually appropriate browsing patterns
 */
export interface MouseBehavior {
  preBrowsing: {
    scrollPattern: ScrollPattern[];
    focusAreas: FocusArea[];
  };
  workflow: MouseWorkflowStep[];
}

export interface ScrollPattern {
  direction: 'down' | 'up';
  distance: number;           // Pixels
  speed: number;              // px/ms
  pauses: ScrollPause[];
  rationale: string;          // "Reading other comments", "Re-reading OP"
}

export interface ScrollPause {
  position: number;           // Scroll position (pixels)
  duration: number;           // ms
  rationale: string;
}

export interface FocusArea {
  element: string;            // CSS selector or description
  duration: number;           // 2000-8000ms
  mouseMovement: 'hover' | 'highlight' | 'static';
  rationale: string;          // "Reading linked docs", "Analyzing code snippet"
}

export interface MouseWorkflowStep {
  action: 'scroll' | 'click' | 'hover' | 'select-text' | 'move-away' | 'read-comments';
  target?: string;
  duration: number;
  rationale: string;
}

/**
 * Session context metadata for emotional/cognitive state
 */
export interface SessionContext {
  emotionalTone: 'confident' | 'uncertain' | 'rushed' | 'relaxed' | 'focused';
  engagementLevel: 'low' | 'medium' | 'high';
  timePressure: 'none' | 'moderate' | 'high';
  behaviorImpact: {
    typingSpeedModifier: number;    // 0.8-1.2
    correctionRateModifier: number; // 0.5-2.0
    pauseFrequency: number;         // 0.7-1.5
  };
}

/**
 * Complete behavioral metadata for a comment
 * This is what the LLM will generate alongside the comment text
 */
export interface BehavioralMetadata {
  typing: TypingBehavior;
  session: SessionContext;
  mouseWorkflow: MouseWorkflowStep[];
}

/**
 * Enhanced comment with optional behavioral metadata
 * If metadata exists, use it; otherwise fall back to generic profile
 */
export interface CommentWithMetadata {
  postUrl: string;
  commentText: string;
  behavioralMetadata?: BehavioralMetadata;
}
