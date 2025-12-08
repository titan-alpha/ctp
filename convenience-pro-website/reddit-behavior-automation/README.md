# Reddit Behavioral Automation System

A research-based system for generating synthetic human-like Reddit interaction patterns and automating comment posting with indistinguishable behavior.

## Overview

This system generates synthetic behavioral profiles from academic research and uses them to post Reddit comments with human-like patterns. **No real user capture required** - all behavior is generated from statistical distributions derived from 30+ research sources.

Key features:

- **Synthetic Profile Generation** - Creates believable human behavioral profiles from research parameters
- **Research-Backed Behavior** - All patterns derived from academic studies (136M keystroke study, ACM mouse dynamics surveys, etc.)
- **HMM Action Sequences** - Hidden Markov Models generate realistic browsing → reading → composing sequences
- **Puppeteer Automation** - Stealth-mode browser control with anti-detection
- **Human-Like Timing** - Inter-keystroke intervals, thinking pauses, mouse jitter, Bezier curves
- **Safety Limits** - Built-in rate limiting (3/hour, 15/day) based on Reddit bot detection research

## Architecture

The system implements a complete synthetic generation and replay pipeline:

1. **Generator Layer** ✓
   - Synthetic behavioral profile generation
   - HMM-based action sequence generation
   - Statistical distributions from research

2. **Storage Layer** ✓
   - SQLite database for profile storage
   - Session and action sequence tracking

3. **Replay Layer** ✓
   - Human-like mouse movement with Bezier curves
   - Keystroke timing simulation with corrections
   - Browser automation with fingerprinting

4. **Integration Layer** ✓
   - Comment queue management
   - Rate limiting and safety checks
   - Integration with conversation analyzer

## Installation

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your credentials
# REDDIT_USERNAME=your_username
# REDDIT_PASSWORD=your_password

# Build the project
npm run build
```

## Configuration

Edit `.env` file:

```bash
# Database
DB_PATH=./data/behavioral_data.db

# Reddit Credentials
REDDIT_USERNAME=your_username
REDDIT_PASSWORD=your_password

# Comment Queue (from conversation analyzer)
COMMENT_QUEUE_PATH=../corporate/marketing/channels/reddit/conversation-analyzer/output/

# Safety Limits (based on research)
MAX_COMMENTS_PER_HOUR=3
MAX_COMMENTS_PER_DAY=15
MIN_DELAY_BETWEEN_COMMENTS_MINUTES=20
```

## Usage

### Generate and Post Comments

The main workflow:

```bash
# Development mode (with TypeScript)
npm run dev

# Production mode (compiled)
npm run build
npm start
```

**What it does:**

1. **Generates or loads a synthetic behavioral profile** from research parameters
2. **Loads comment queue** from the conversation analyzer output
3. **Initializes browser** with the profile's fingerprint (user agent, screen resolution, timezone)
4. **Logs in to Reddit** with human-like typing patterns
5. **Posts each comment** with complete human-like behavior:
   - Browsing phase (scrolling, reading)
   - Reading phase (slower scrolling, comprehension pauses)
   - Considering phase (small movements, hesitation)
   - Composing phase (realistic typing with IKI, corrections, thinking pauses)
   - Reviewing phase (re-reading, minor edits)
   - Submitting phase (click, wait for confirmation)
6. **Enforces rate limits** (20+ minute delays between comments)

### Behavioral Profile

On first run, a synthetic profile is generated with:

```
Profile Characteristics:
  Typing Speed: 55.2 WPM (±8.0)
  IKI: 148ms (±40)
  Mouse Velocity: 862px/s
  Mouse Jitter: 2.47px
  Correction Rate: 3.1%
  Browser: Chrome 120.0.0.0
  Timezone: America/New_York
```

This profile is saved to the database and reused for consistency. All values are sampled from research-based distributions.

## Project Structure

```
reddit-behavior-automation/
├── src/
│   ├── types/
│   │   └── behavioral.ts          # Type definitions (110+ dimensions)
│   ├── utils/
│   │   ├── statistics.ts          # Gaussian, log-normal, gamma distributions
│   │   └── bezier.ts              # Mouse movement with Bezier curves
│   ├── generator/
│   │   ├── profileGenerator.ts    # Synthetic profile generation
│   │   └── actionSequenceGenerator.ts  # HMM-based sequences
│   ├── replay/
│   │   └── redditAutomation.ts    # Browser automation with human behavior
│   ├── storage/
│   │   └── database.ts            # SQLite storage layer
│   └── replay.ts                  # Main orchestrator
├── data/                          # Database files (gitignored)
├── ARCHITECTURE.md                # System design document
├── RESEARCH_FINDINGS.md           # 30+ research sources with citations
└── README.md                      # This file
```

## Research-Based Parameters

All behavioral modeling is based on academic research (see `RESEARCH_FINDINGS.md` for full citations):

### Mouse Dynamics
- **Bezier curves** for realistic trajectories (not straight lines)
- **Jitter**: 2.5px ± 0.5px during movement (Gaussian)
- **Click offset**: 8% of element size from center (Gaussian)
- **Overshoot**: 30% chance of overshooting target
- **Velocity profile**: Fitts's Law for distance-based timing
- **Sources**: ACM 2024 surveys, BeCAPTCHA-Mouse, Frontiers research

### Keystroke Dynamics
- **Typing speed**: 40-60 WPM (Gaussian, μ=55, σ=8)
- **IKI (Inter-Keystroke Interval)**: 150ms mean, log-normal distribution
- **Dwell time**: 70ms mean, gamma distribution
- **Thinking pauses**: 15% of words, 800-1600ms duration
- **Correction rate**: 3% of characters (backspace → retype)
- **Sources**: 136M keystroke study (Aalto University), ACM keystroke dynamics surveys

### Action Sequences (HMM)
- **State transitions**: browsing → reading (25%), reading → considering (35%), considering → composing (45%)
- **State durations**: browsing (30s), reading (45s), considering (15s), composing (90s), reviewing (20s), submitting (5s)
- **All log-normal or gamma distributions** for natural timing variation
- **Sources**: HPE Labs HMM research, Frontiers behavioral modeling

### Bot Detection Evasion
- **Rate limits**: 3 comments/hour, 15/day maximum
- **Delays**: 20-25 minutes between comments (randomized)
- **Browser fingerprinting**: Consistent user agent, screen resolution, timezone, pixel ratio
- **Stealth plugins**: Puppeteer-extra with stealth to hide automation signals
- **Sources**: Reddit bot detection research, GitHub bot implementations

## Integration with Comment Queue

This system integrates with the conversation analyzer at:
`/corporate/marketing/channels/reddit/conversation-analyzer/`

**Comment queue format:**

The analyzer outputs JSON files with suggested comments:

```json
{
  "post": {
    "url": "https://reddit.com/r/programming/comments/...",
    "permalink": "/r/programming/comments/...",
    "title": "...",
    "subreddit": "programming"
  },
  "suggestedComment": "Your generated comment text here...",
  "reasoning": "Why this comment is appropriate"
}
```

The automation system loads these files and posts comments with human-like behavior.

## Safety & Rate Limiting

**Built-in protections:**

- ✓ Maximum 3 comments per hour
- ✓ Maximum 15 comments per day
- ✓ Minimum 20 minutes between comments (with 0-5 min random variance)
- ✓ Enforced at runtime (hard stops if limits exceeded)
- ✓ Based on Reddit bot detection research

**Manual safety:**

- Only posts comments from your conversation analyzer queue
- Requires valid Reddit credentials
- Browser runs in visible mode (headless: false) for monitoring
- All actions logged to console

## Legal & Ethical Considerations

**IMPORTANT DISCLAIMER:**

This system is designed for:
- Personal automation of your own Reddit account
- Research and education on behavioral biometrics
- Testing bot detection systems (with authorization)

**NOT for:**
- Mass automation or spam
- Vote manipulation
- Evading bans or restrictions
- Violating Reddit's Terms of Service
- Impersonating other users

Using this system for malicious purposes may result in:
- Account suspension/permanent ban
- IP blocking by Reddit
- Legal action from Reddit Inc.
- Violation of CFAA (Computer Fraud and Abuse Act) in the US

**Use responsibly and ethically.** This is a research tool for understanding human-computer interaction patterns.

## Technical Details

### Synthetic Profile Generation

Profiles are generated using research-based statistical distributions:

```typescript
// Example: Typing speed from 136M keystroke study
const typingSpeed: StatisticalDistribution = {
  mean: gaussianRandom(55, 8),  // 40-60 WPM average
  stdDev: 8,
  min: 35,
  max: 75,
  distributionType: 'gaussian',
};

// Example: Inter-keystroke interval (log-normal)
const interKeystrokeInterval: StatisticalDistribution = {
  mean: gaussianRandom(150, 20),  // ~150ms from research
  stdDev: 40,
  min: 40,   // Fastest possible
  max: 500,  // Before it becomes a "pause"
  distributionType: 'log-normal',
};
```

### Human-Like Typing

The system simulates realistic typing:

```typescript
for (let char of text) {
  // Sample IKI from profile's distribution
  const iki = sampleDistribution(profile.interKeystrokeInterval);

  // Thinking pauses at word boundaries (15%)
  if (char === ' ' && Math.random() < 0.15) {
    await delay(800 + Math.random() * 800);  // 800-1600ms pause
  }

  await type(char);

  // Random corrections (3%)
  if (Math.random() < profile.correctionRate) {
    await delay(200, 400);  // Recognition delay
    await press('Backspace');
    await delay(100, 300);
    await type(char);  // Retype
  }

  await delay(iki);
}
```

### Human-Like Mouse Movement

Bezier curves with jitter and overshoot:

```typescript
// Generate path from current position to target
const path = generateMousePath(currentPos, targetPos);

// Add overshoot (30% chance)
const finalPath = addOvershoot(path, target, 0.3);

// Execute movement with timing
for (const point of finalPath.points) {
  await mouse.move(point.x, point.y);
  await delay(timestamps[i+1] - timestamps[i]);
}

await mouse.click(target);
```

## Troubleshooting

### Puppeteer errors
- Install Chrome: `npx puppeteer browsers install chrome`
- Check that headless is set to `false` in redditAutomation.ts

### Login failures
- Verify REDDIT_USERNAME and REDDIT_PASSWORD in `.env`
- Check for 2FA (not currently supported)
- Ensure account is not flagged or suspended

### Rate limit errors
- Wait 20+ minutes between runs
- Check daily limit (15 comments max)
- Review console output for limit warnings

### Database locked
- Ensure only one instance is running
- Close any SQLite browser connections
- Delete `data/*.db-wal` and `data/*.db-shm` files

### Build errors
- Delete `node_modules` and `dist` folders
- Run `npm install` again
- Ensure Node.js version ≥ 18.0.0
- Check better-sqlite3 compilation (requires build tools)

## Contributing

This is a private research project for ConveniencePro. See `ARCHITECTURE.md` for system design details and `RESEARCH_FINDINGS.md` for research sources.

## License

UNLICENSED - Private use only
