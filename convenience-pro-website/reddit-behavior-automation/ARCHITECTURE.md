# Reddit Behavioral Automation System - Architecture & Theory

## Executive Summary

A multi-layered system that captures human interaction patterns with Reddit across 100+ dimensions, builds a behavioral model, and enables programmatic comment posting that mimics natural human behavior to avoid bot detection.

## Legal & Ethical Considerations

**IMPORTANT DISCLAIMERS:**
- Reddit's Terms of Service prohibit automated posting without explicit permission
- This system should only be used for:
  - Personal automation with your own account
  - Research and educational purposes
  - Testing and development environments
  - Authorized bot accounts with proper disclosure
- Violating platform TOS can result in account suspension/legal action
- Always disclose bot usage when required by platform rules

## System Overview

### Core Objective
Create an automation system that posts Reddit comments with human-like behavior patterns indistinguishable from manual posting.

### Integration Point
- **Input**: Comment suggestions from `corporate/marketing/channels/reddit/conversation-analyzer/`
- **Output**: Posted comments on Reddit with captured behavioral patterns applied

---

## The 100+ Dimensions of Human Behavior

### 1. Temporal Patterns (20 dimensions)

#### Macro Timing
1. **Time of day posting distribution** - When you typically post (morning/afternoon/evening)
2. **Day of week patterns** - Weekday vs weekend behavior
3. **Session duration distribution** - How long you stay on Reddit
4. **Inter-session intervals** - Time between Reddit sessions
5. **Post reading time before commenting** - How long you read before engaging
6. **Notification response latency** - Time to respond to replies
7. **Edit timing patterns** - When you edit after posting
8. **Delete timing patterns** - Time before deleting comments
9. **Seasonal patterns** - Monthly/yearly trends
10. **Activity burst patterns** - Periods of high vs low activity

#### Micro Timing
11. **Typing speed (WPM)** - Your baseline typing rate
12. **Keystroke interval distribution** - Time between key presses
13. **Typing pause patterns** - Natural pauses while composing
14. **Thinking time indicators** - Longer pauses before complex thoughts
15. **Backspace usage frequency** - How often you correct typos
16. **Mouse hover duration** - Time hovering before clicking
17. **Scroll velocity patterns** - Speed and rhythm of scrolling
18. **Click delay variance** - Variability in click timing
19. **Page transition timing** - Time between page loads
20. **Tab switching patterns** - Frequency and timing of context switches

### 2. Mouse Movement Patterns (20 dimensions)

#### Movement Characteristics
21. **Trajectory curvature** - Curved vs straight line movements
22. **Movement velocity profile** - Acceleration and deceleration curves
23. **Jitter amplitude** - Natural hand tremor characteristics
24. **Overshoot and correction frequency** - Missing targets and adjusting
25. **Movement complexity** - Path smoothness vs erratic
26. **Directional preference** - Bias in movement directions
27. **Start point variability** - Where mouse movements typically begin
28. **End point precision** - Accuracy of target hitting
29. **Submovement patterns** - Breaking long movements into segments
30. **Rest positions** - Where mouse idles

#### Click Patterns
31. **Click position distribution** - Where on elements you click (center vs edge)
32. **Double-click timing** - Interval between double-clicks
33. **Click duration** - How long button is held down
34. **Click pressure patterns** - If trackpad, pressure variance
35. **Misclick frequency** - Rate of accidental clicks
36. **Right-click vs left-click ratio** - Context menu usage
37. **Drag patterns** - Text selection behavior
38. **Scroll wheel usage** - Discrete vs continuous scrolling
39. **Multi-click patterns** - Triple-click and beyond
40. **Click-hold-release patterns** - Timing of complete click action

### 3. Keyboard Patterns (15 dimensions)

41. **Typing rhythm cadence** - Natural flow and pauses
42. **Common typo patterns** - Your specific frequent mistakes
43. **Autocorrect acceptance rate** - How often you accept suggestions
44. **Keyboard shortcut preferences** - Which shortcuts you use
45. **Capitalization patterns** - Shift key usage timing
46. **Punctuation timing** - Pauses before/after punctuation
47. **Word-by-word vs character-by-character** - Typing granularity
48. **Copy-paste frequency** - Ratio of typing vs pasting
49. **Arrow key navigation patterns** - Text editing behavior
50. **Enter key patterns** - Paragraph/line break habits
51. **Tab key usage** - Form navigation behavior
52. **Special character usage** - Emoji, symbols timing
53. **Modifier key hold duration** - Ctrl, Alt, Shift timing
54. **Key repeat tolerance** - Held key behavior
55. **Composition patterns** - Draft, revise, finalize behavior

### 4. Navigation & Browsing Patterns (15 dimensions)

56. **URL typing vs clicking** - Direct navigation preference
57. **Back button usage frequency** - Navigation backtracking
58. **Tab management patterns** - Opening/closing/switching tabs
59. **Bookmark usage rate** - Saved link behavior
60. **Search vs browse ratio** - How you find content
61. **Subreddit navigation method** - Sidebar, search, direct URL
62. **Comment thread expansion patterns** - Which threads you open
63. **Sorting preference patterns** - Hot/new/top/controversial usage
64. **Filter application frequency** - Content filtering behavior
65. **Multi-tab Reddit usage** - How many Reddit tabs open
66. **Browser refresh patterns** - Manual refresh frequency
67. **Scroll depth distribution** - How far down you scroll
68. **Page revisit patterns** - Returning to same pages
69. **Cross-subreddit navigation** - How you move between communities
70. **External link clicking patterns** - Opening links in posts

### 5. Content Interaction Patterns (15 dimensions)

71. **Voting behavior timing** - When you upvote/downvote
72. **Vote then comment vs comment then vote** - Sequence preference
73. **Comment length distribution** - Your typical comment sizes
74. **Formatting tool usage** - Bold, italic, lists, quotes
75. **Link insertion frequency** - How often you add links
76. **Quote usage patterns** - Quoting other comments
77. **Edit frequency post-submission** - How often you edit
78. **Reply depth preference** - How deep in threads you go
79. **Parent comment reading time** - Time spent on context
80. **Sibling comment reading** - Do you read other replies
81. **Preview usage before posting** - Do you preview comments
82. **Draft saving behavior** - Do you compose offline
83. **Multi-comment thread behavior** - Multiple comments in one thread
84. **Reaction to your own comments** - Re-reading your posts
85. **Engagement with replies** - Response rate to your comments

### 6. Reading & Comprehension Patterns (10 dimensions)

86. **Post title reading time** - How long you spend on titles
87. **Post body reading time** - Full content reading duration
88. **Comment scanning vs deep reading** - Skimming behavior
89. **Re-reading frequency** - How often you re-read content
90. **Scroll-pause patterns** - Where you stop scrolling
91. **Attention span indicators** - Time before losing focus
92. **Skipping patterns** - What content you skip
93. **Focus loss indicators** - Tab switching while reading
94. **Speed reading indicators** - Fast vs slow reading
95. **Context gathering time** - Time spent understanding situation

### 7. Session & Environment Patterns (5 dimensions)

96. **Browser window size preference** - Your typical window dimensions
97. **Zoom level preference** - Browser zoom setting
98. **Dark mode vs light mode** - Theme preference and switching
99. **Browser extension interactions** - Ad blockers, RES, etc.
100. **Device fingerprint consistency** - Same device/browser patterns

### Additional Advanced Dimensions (10 bonus dimensions)

101. **Idle time before abandonment** - How long inactive before leaving
102. **Error tolerance patterns** - Response to loading delays/errors
103. **Network quality indicators** - Behavior on slow connections
104. **Multi-tasking patterns** - Reddit + other apps behavior
105. **Notification interaction timing** - Response to browser notifications
106. **Audio/video interaction** - Playing media in posts
107. **Image viewing patterns** - Expanding images, galleries
108. **Spoiler reveal behavior** - Click to reveal timing
109. **NSFW content interaction** - If applicable, interaction patterns
110. **Moderation tool usage** - If moderator, tooling patterns

---

## System Architecture

### Layer 1: Data Capture Layer

**Technology Stack:**
- **nut.js** - Desktop automation and screen capture
- **Puppeteer** - Browser automation and event capture
- **@nut-tree/nut-js** - Mouse and keyboard event listening
- **screenshot-desktop** - Screen recording
- **robotjs** - Alternative input capture

**Components:**

#### A. Browser Event Listener
```typescript
interface BrowserEvent {
  timestamp: number;
  eventType: 'click' | 'keypress' | 'scroll' | 'mousemove' | 'focus' | 'blur';
  target: ElementDescriptor;
  metadata: EventMetadata;
}
```

- Captures all browser interactions
- Records DOM element targets
- Logs network requests and responses
- Tracks tab focus changes
- Records URL navigation

#### B. Mouse Tracker
```typescript
interface MouseEvent {
  timestamp: number;
  x: number;
  y: number;
  eventType: 'move' | 'click' | 'scroll' | 'drag';
  button?: 'left' | 'right' | 'middle';
  velocity?: number;
  acceleration?: number;
}
```

- Samples mouse position at 60Hz+
- Calculates velocity and acceleration vectors
- Detects movement patterns (straight, curved, jittery)
- Records click locations with pixel precision
- Tracks scroll wheel deltas

#### C. Keyboard Tracker
```typescript
interface KeyboardEvent {
  timestamp: number;
  key: string;
  eventType: 'keydown' | 'keyup';
  modifiers: string[];
  duration?: number; // for keydown->keyup
}
```

- Records every keystroke with microsecond precision
- Captures modifier key combinations
- Measures key hold duration
- Detects typing rhythm patterns
- Logs autocorrect interactions

#### D. Screen Recorder
```typescript
interface ScreenFrame {
  timestamp: number;
  imageData: Buffer;
  activeWindow: WindowInfo;
  cursorPosition: Point;
}
```

- Records screen at 10-30 FPS
- Captures Reddit window only (privacy)
- Enables later visual analysis
- Detects UI state changes
- Logs element visibility timing

### Layer 2: Storage Layer

**Technology Stack:**
- **SQLite** or **PostgreSQL** - Structured event data
- **TimescaleDB** - Time-series optimization
- **LevelDB** - High-performance key-value storage
- **Parquet** - Columnar storage for analysis

**Schema Design:**

```sql
-- Sessions table
CREATE TABLE sessions (
  id UUID PRIMARY KEY,
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  duration_seconds INTEGER,
  total_interactions INTEGER,
  device_fingerprint TEXT,
  browser_info JSONB
);

-- Mouse events (time-series)
CREATE TABLE mouse_events (
  session_id UUID REFERENCES sessions(id),
  timestamp TIMESTAMP,
  x INTEGER,
  y INTEGER,
  event_type VARCHAR(20),
  velocity FLOAT,
  acceleration FLOAT,
  metadata JSONB
);

-- Keyboard events
CREATE TABLE keyboard_events (
  session_id UUID REFERENCES sessions(id),
  timestamp TIMESTAMP,
  key VARCHAR(10),
  event_type VARCHAR(10),
  modifiers TEXT[],
  context VARCHAR(50), -- 'comment_box', 'search', 'url', etc.
  metadata JSONB
);

-- Page interactions
CREATE TABLE page_interactions (
  session_id UUID REFERENCES sessions(id),
  timestamp TIMESTAMP,
  action VARCHAR(50), -- 'load_page', 'click_comment', 'submit_post', etc.
  target_type VARCHAR(50),
  target_id TEXT,
  duration_ms INTEGER,
  metadata JSONB
);

-- Comments posted (ground truth data)
CREATE TABLE posted_comments (
  id UUID PRIMARY KEY,
  session_id UUID REFERENCES sessions(id),
  post_url TEXT,
  comment_text TEXT,
  subreddit VARCHAR(100),
  timestamp TIMESTAMP,
  edit_history JSONB,
  interaction_sequence_id UUID -- links to captured sequence
);
```

### Layer 3: Analysis & Pattern Extraction Layer

**Technology Stack:**
- **Python** with pandas, numpy, scipy
- **scikit-learn** - Statistical analysis
- **TensorFlow/PyTorch** - Deep learning for pattern recognition
- **statsmodels** - Time series analysis

**Analysis Modules:**

#### A. Temporal Pattern Analyzer
```python
class TemporalAnalyzer:
    def extract_typing_rhythm(self, keyboard_events):
        """Extract typing speed, pauses, and rhythm patterns"""

    def calculate_action_timing_distribution(self, events):
        """Model time between different action types"""

    def detect_session_patterns(self, sessions):
        """Find typical session durations and frequencies"""

    def extract_micro_pauses(self, events):
        """Identify thinking pauses vs typos"""
```

#### B. Mouse Behavior Analyzer
```python
class MouseAnalyzer:
    def fit_trajectory_model(self, mouse_paths):
        """Model typical mouse movement trajectories"""

    def calculate_jitter_characteristics(self, positions):
        """Extract tremor/jitter statistical profile"""

    def detect_movement_patterns(self, movements):
        """Classify movement types (direct, curved, corrective)"""

    def model_click_precision(self, clicks, targets):
        """Distribution of click offsets from target centers"""
```

#### C. Behavioral Sequence Analyzer
```python
class SequenceAnalyzer:
    def extract_action_sequences(self, events):
        """Common sequences: read->scroll->comment->submit"""

    def build_markov_model(self, sequences):
        """Transition probabilities between actions"""

    def detect_workflow_patterns(self, sessions):
        """How you navigate from discovery to posting"""
```

#### D. Statistical Profile Generator
```python
class ProfileGenerator:
    def generate_behavior_profile(self, all_data):
        """
        Output: BehavioralProfile object with distributions for:
        - Typing: speed, rhythm, pauses, corrections
        - Mouse: trajectories, speeds, click patterns
        - Navigation: common paths, timing
        - Content: reading time, engagement patterns
        - Errors: retry behavior, tolerance levels
        """
```

### Layer 4: Behavioral Model Layer

**Technology Stack:**
- **Hidden Markov Models** - State transitions
- **Gaussian Mixture Models** - Distribution modeling
- **Recurrent Neural Networks** - Sequence prediction
- **Reinforcement Learning** - Adaptive behavior

**Model Components:**

#### A. Timing Model
```typescript
interface TimingModel {
  // Probability distributions for various timings
  typingSpeedDistribution: GaussianMixture;
  pauseDistribution: GammaDistribution;
  actionIntervalModel: HiddenMarkovModel;
  sessionTimingModel: TimeSeriesModel;

  // Methods
  sampleTypingDelay(): number;
  sampleActionInterval(prevAction: string, nextAction: string): number;
  shouldTakePause(context: Context): boolean;
}
```

#### B. Movement Model
```typescript
interface MovementModel {
  trajectoryGenerator: BezierCurveModel;
  jitterGenerator: WienerProcess;
  clickOffsetModel: MultivariateNormal;
  scrollPatternModel: MarkovChain;

  // Methods
  generateMousePath(start: Point, end: Point): Point[];
  applyJitter(idealPath: Point[]): Point[];
  sampleClickOffset(elementCenter: Point): Point;
}
```

#### C. Sequence Model
```typescript
interface SequenceModel {
  actionTransitionModel: MarkovChain;
  workflowTemplates: Template[];
  contextAwareModel: ConditionalProbabilityModel;

  // Methods
  predictNextAction(history: Action[]): Action;
  generateCommentingSequence(post: RedditPost): ActionSequence;
  shouldEngageWithPost(post: RedditPost, context: Context): boolean;
}
```

### Layer 5: Automation & Replay Layer

**Technology Stack:**
- **Puppeteer** - Browser control
- **nut.js** - Mouse/keyboard automation
- **Sharp** - Image processing for verification
- **Tesseract.js** - OCR for element detection

**Automation Components:**

#### A. Human-Like Input Generator
```typescript
class HumanInputSimulator {
  private timingModel: TimingModel;
  private movementModel: MovementModel;

  async typeText(text: string, element: ElementHandle): Promise<void> {
    // Type with human-like rhythm and errors
    const chars = text.split('');
    for (const char of chars) {
      // Sample realistic delay
      const delay = this.timingModel.sampleTypingDelay();
      await this.sleep(delay);

      // Occasionally make typos based on captured patterns
      if (this.shouldMakeTypo(char)) {
        await this.simulateTypo(char, element);
      } else {
        await element.type(char);
      }

      // Occasional thinking pauses
      if (this.timingModel.shouldTakePause()) {
        await this.sleep(this.timingModel.samplePauseLength());
      }
    }
  }

  async moveMouse(target: Point): Promise<void> {
    const currentPos = await this.getCurrentMousePosition();

    // Generate human-like path
    const path = this.movementModel.generateMousePath(currentPos, target);
    const jitteredPath = this.movementModel.applyJitter(path);

    // Follow path with realistic velocity
    for (const point of jitteredPath) {
      await this.mouse.setPosition(point);
      await this.sleep(16); // ~60fps
    }
  }

  async clickElement(element: ElementHandle): Promise<void> {
    // Get element bounding box
    const box = await element.boundingBox();
    const center = { x: box.x + box.width/2, y: box.y + box.height/2 };

    // Apply realistic click offset
    const clickPoint = this.movementModel.sampleClickOffset(center);

    // Move to point
    await this.moveMouse(clickPoint);

    // Realistic hover time
    await this.sleep(this.timingModel.sampleHoverDuration());

    // Click with realistic timing
    await this.mouse.click();
  }
}
```

#### B. Reddit Interaction Automator
```typescript
class RedditAutomator {
  private inputSimulator: HumanInputSimulator;
  private browser: Browser;

  async postComment(comment: CommentSuggestion): Promise<void> {
    // Navigate to post
    await this.navigateToPost(comment.postUrl);

    // Simulate reading behavior
    await this.simulateReading(comment.context);

    // Scroll to comment box
    await this.scrollToCommentBox();

    // Click comment box
    await this.inputSimulator.clickElement(commentBox);

    // Type comment with human-like behavior
    await this.inputSimulator.typeText(comment.text, commentBox);

    // Simulate review pause
    await this.sleep(this.timingModel.sampleReviewDuration());

    // Maybe preview
    if (this.shouldPreview()) {
      await this.clickPreview();
      await this.reviewPreview();
    }

    // Submit
    await this.clickSubmit();

    // Post-submission behavior
    await this.postSubmissionBehavior();
  }

  private async simulateReading(context: PostContext): Promise<void> {
    // Simulate realistic reading behavior
    const readingTime = this.estimateReadingTime(context.postContent);
    const scrollPattern = this.sequenceModel.generateReadingScrollPattern();

    for (const scrollAction of scrollPattern) {
      await this.scroll(scrollAction.pixels);
      await this.sleep(scrollAction.pauseDuration);
    }

    // Read some comments
    await this.readTopComments(context.numCommentsToRead);
  }
}
```

### Layer 6: Integration & Orchestration Layer

**Technology Stack:**
- **Node.js** - Main orchestration
- **Bull** - Job queue for scheduled posting
- **Redis** - Queue and caching
- **Winston** - Logging

**Integration Components:**

#### A. Comment Queue Manager
```typescript
interface QueuedComment {
  id: string;
  source: 'conversation-analyzer';
  comment: CommentSuggestion;
  scheduledTime: Date;
  priority: number;
  retryCount: number;
}

class CommentQueueManager {
  async queueComment(comment: CommentSuggestion): Promise<void> {
    // Determine optimal posting time based on patterns
    const scheduledTime = this.calculateOptimalPostTime();

    // Add to queue
    await this.queue.add({
      comment,
      scheduledTime,
      priority: this.calculatePriority(comment)
    });
  }

  private calculateOptimalPostTime(): Date {
    // Use captured temporal patterns
    // Post during typical activity hours
    // Distribute throughout day to avoid patterns
    // Add random jitter
  }
}
```

#### B. Safety & Compliance Manager
```typescript
class SafetyManager {
  // Rate limiting
  private readonly MAX_COMMENTS_PER_HOUR = 5;
  private readonly MAX_COMMENTS_PER_DAY = 20;

  async canPost(): Promise<boolean> {
    // Check rate limits
    const recentPosts = await this.getRecentPosts(1, 'hour');
    if (recentPosts.length >= this.MAX_COMMENTS_PER_HOUR) {
      return false;
    }

    // Check for suspicious patterns
    if (await this.detectsSuspiciousActivity()) {
      return false;
    }

    // Check Reddit API health
    if (!await this.isRedditHealthy()) {
      return false;
    }

    return true;
  }

  async detectsSuspiciousActivity(): Promise<boolean> {
    // Too regular posting intervals
    // Too similar comment patterns
    // Unusual activity spikes
    // Deviation from learned behavior
  }
}
```

---

## Implementation Phases

### Phase 1: Capture System (Weeks 1-3)
- Set up nut.js and Puppeteer environment
- Build event capture infrastructure
- Implement storage layer
- Create data capture UI/dashboard
- **Goal**: Capture 2-4 weeks of normal Reddit usage

### Phase 2: Analysis Pipeline (Weeks 4-6)
- Build pattern extraction modules
- Implement statistical analysis
- Create behavioral profile generator
- Validate pattern accuracy
- **Goal**: Generate comprehensive behavioral model

### Phase 3: Replay System (Weeks 7-10)
- Build human input simulator
- Implement mouse/keyboard automation
- Create Reddit interaction automator
- Test on throwaway account
- **Goal**: Post comments indistinguishable from human

### Phase 4: Integration (Weeks 11-12)
- Connect to conversation analyzer
- Build queue management
- Implement safety controls
- Create monitoring dashboard
- **Goal**: End-to-end automated commenting

### Phase 5: Optimization & Safety (Ongoing)
- A/B testing different behavioral profiles
- Detection evasion improvements
- Rate limit optimization
- Continuous model updates
- **Goal**: Maintain undetected operation

---

## Technical Challenges & Solutions

### Challenge 1: Browser Bot Detection
**Problem**: Sites detect automated browsers (Puppeteer, Selenium)

**Solutions**:
- Use `puppeteer-extra` with stealth plugin
- Rotate user agents matching your actual browser
- Maintain consistent browser fingerprint
- Use same cookies/localStorage as manual sessions
- Emulate WebGL, Canvas, Audio fingerprints
- Use residential proxy if needed

### Challenge 2: Behavioral Anomaly Detection
**Problem**: ML models detect non-human patterns

**Solutions**:
- Add realistic randomness to all timings
- Introduce occasional "mistakes" and corrections
- Vary behavior session to session
- Implement circadian rhythm in activity
- Add multi-tasking indicators (tab switches)

### Challenge 3: CAPTCHA Challenges
**Problem**: Triggered CAPTCHA for suspicious activity

**Solutions**:
- Build gradual trust with account
- Maintain very conservative rate limits
- Use 2Captcha/Anti-Captcha services as backup
- Implement CAPTCHA detection and alerting
- Manual fallback option

### Challenge 4: Data Volume & Storage
**Problem**: 100Hz mouse sampling = huge data

**Solutions**:
- Compress similar events (coalesce movements)
- Use columnar storage (Parquet)
- Sample at variable rates (faster during action)
- Aggregate historical data periodically
- Archive old sessions to cold storage

### Challenge 5: Model Overfitting
**Problem**: Too rigid adherence to patterns is detectable

**Solutions**:
- Add controlled noise to all predictions
- Use ensemble of models for variety
- Implement concept drift adaptation
- Regularly retrain on new capture data
- Include "exploration" randomness

---

## Monitoring & Metrics

### Behavioral Fidelity Metrics
1. **Timing Distribution Match** - KL divergence from captured data
2. **Movement Pattern Similarity** - Frechet distance of trajectories
3. **Sequence Likelihood** - Log probability under Markov model
4. **Turing Test Score** - Human reviewers can't tell difference

### Safety Metrics
1. **Detection Rate** - Accounts flagged/banned
2. **CAPTCHA Trigger Rate** - Challenges per 100 actions
3. **Shadowban Detection** - Comments visible to others
4. **Rate Limit Compliance** - Actions within safe limits

### Effectiveness Metrics
1. **Comment Success Rate** - Posted without errors
2. **Engagement Rate** - Upvotes, replies on comments
3. **Account Age/Karma** - Long-term account health
4. **Queue Throughput** - Comments posted per day

---

## Security & Privacy

### Data Protection
- Encrypt stored behavioral data
- Never log Reddit credentials in plaintext
- Secure key management for automation
- Audit logging for all automated actions
- Regular security reviews

### Operational Security
- Use dedicated automation account
- Don't mix manual and automated access from same IP
- Consider residential proxies for automation
- Maintain separate browser profiles
- Regular pattern analysis to avoid detection signatures

---

## Next Steps

1. **Review & Approve Architecture** - Validate approach
2. **Set Up Development Environment** - Install dependencies
3. **Build MVP Capture System** - Start recording data
4. **Begin Data Collection** - Use Reddit normally for 2-4 weeks
5. **Develop Analysis Pipeline** - Build pattern extractors
6. **Prototype Replay System** - Test on local/test environment

---

## File Structure

```
reddit-behavior-automation/
├── README.md
├── ARCHITECTURE.md (this file)
├── package.json
├── tsconfig.json
├── .env.example
│
├── src/
│   ├── capture/
│   │   ├── browser-listener.ts
│   │   ├── mouse-tracker.ts
│   │   ├── keyboard-tracker.ts
│   │   ├── screen-recorder.ts
│   │   └── session-manager.ts
│   │
│   ├── storage/
│   │   ├── database.ts
│   │   ├── schemas.sql
│   │   └── migrations/
│   │
│   ├── analysis/
│   │   ├── temporal-analyzer.py
│   │   ├── mouse-analyzer.py
│   │   ├── sequence-analyzer.py
│   │   └── profile-generator.py
│   │
│   ├── models/
│   │   ├── timing-model.ts
│   │   ├── movement-model.ts
│   │   ├── sequence-model.ts
│   │   └── types.ts
│   │
│   ├── automation/
│   │   ├── input-simulator.ts
│   │   ├── reddit-automator.ts
│   │   ├── element-detector.ts
│   │   └── error-handler.ts
│   │
│   ├── integration/
│   │   ├── queue-manager.ts
│   │   ├── scheduler.ts
│   │   ├── safety-manager.ts
│   │   └── monitor.ts
│   │
│   └── utils/
│       ├── logger.ts
│       ├── config.ts
│       └── helpers.ts
│
├── scripts/
│   ├── capture-session.ts
│   ├── analyze-data.py
│   ├── train-models.py
│   ├── test-automation.ts
│   └── generate-report.ts
│
├── data/
│   ├── raw/           # Raw captured data
│   ├── processed/     # Analyzed patterns
│   └── models/        # Trained behavioral models
│
└── tests/
    ├── capture.test.ts
    ├── analysis.test.ts
    └── automation.test.ts
```
