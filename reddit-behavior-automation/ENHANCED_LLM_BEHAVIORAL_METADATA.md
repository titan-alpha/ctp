# Enhanced LLM-Driven Behavioral Metadata System

## Core Concept

**Problem with current approach:**
- Behavioral patterns are generated using generic statistical distributions
- Same typing rhythm, pause patterns, and correction frequency for every comment
- No semantic understanding of content → patterns become detectable
- "This account always types at 55 WPM with corrections at 3% of characters"

**Enhanced approach:**
- LLM generates comment text + behavioral metadata in single API call
- Behavioral instructions are **contextually appropriate** to the content
- Each comment gets unique, semantically-driven human patterns
- Undetectable because behavior varies based on what's being said

## Behavioral Metadata Schema

### 1. Typing Behavioral Directives

```typescript
interface TypingBehavior {
  // Base typing profile for this comment
  baseSpeed: {
    wpm: number;              // 40-65 WPM
    variation: number;        // ±10% variation
  };

  // Semantic typing segments
  segments: TypingSegment[];

  // Contextual corrections
  corrections: TypingCorrection[];

  // Thinking pauses
  thinkingPauses: ThinkingPause[];

  // Hesitation points
  hesitations: Hesitation[];
}

interface TypingSegment {
  text: string;               // Exact text segment
  speedModifier: number;      // 0.7-1.3 (slow down or speed up)
  rationale: string;          // Why: "technical explanation", "casual agreement", "emphatic point"
}

interface TypingCorrection {
  position: number;           // Character index
  originalText: string;       // What to type first (typo)
  correctedText: string;      // What to correct to
  rationale: string;          // "Complex technical term", "Unfamiliar acronym"
  recognitionDelay: number;   // 200-800ms before noticing error
  correctionDelay: number;    // 100-400ms to fix
}

interface ThinkingPause {
  position: number;           // Character index (before this position)
  duration: number;           // 800-2500ms
  rationale: string;          // "Considering architecture advice", "Formulating explanation"
}

interface Hesitation {
  wordStart: number;          // Character index of word start
  wordEnd: number;            // Character index of word end
  slowdownFactor: number;     // 0.4-0.7 (type this word slower)
  rationale: string;          // "Giving advice - uncertainty natural", "Technical jargon"
}
```

### 2. Mouse Behavior Directives

```typescript
interface MouseBehavior {
  // Pre-comment browsing
  preBrowsing: {
    scrollPattern: ScrollPattern[];
    focusAreas: FocusArea[];
  };

  // Commenting workflow
  workflow: MouseWorkflowStep[];
}

interface ScrollPattern {
  direction: 'down' | 'up';
  distance: number;           // Pixels
  speed: number;              // px/ms
  pauses: ScrollPause[];
  rationale: string;          // "Reading other comments", "Re-reading OP"
}

interface FocusArea {
  element: string;            // CSS selector or description
  duration: number;           // 2000-8000ms
  mouseMovement: 'hover' | 'highlight' | 'static';
  rationale: string;          // "Reading linked docs", "Analyzing code snippet"
}

interface MouseWorkflowStep {
  action: 'scroll' | 'click' | 'hover' | 'select-text' | 'move-away';
  target: string;
  duration: number;
  rationale: string;
}
```

### 3. Session Context

```typescript
interface SessionContext {
  // Emotional state (affects speed/corrections)
  emotionalTone: 'confident' | 'uncertain' | 'rushed' | 'relaxed' | 'focused';

  // Engagement level
  engagementLevel: 'low' | 'medium' | 'high';

  // Time pressure
  timePressure: 'none' | 'moderate' | 'high';

  // Expected behavior impact
  behaviorImpact: {
    typingSpeedModifier: number;    // 0.8-1.2
    correctionRateModifier: number; // 0.5-2.0
    pauseFrequency: number;         // 0.7-1.5
  };
}
```

## Enhanced LLM Prompt Structure

### Current (v1) Prompt
```
Generate a helpful Reddit comment for this post.
Output: { responseText: "...", tone: "...", ... }
```

### Enhanced (v2) Prompt
```typescript
const enhancedPrompt = `
You are generating a Reddit comment AND the behavioral metadata for how a human would type it.

CONTEXT:
Post: "${post.title}"
Content: "${post.content}"
Your role: Helpful developer responding naturally

OUTPUT TWO PARTS:

1. COMMENT TEXT (what to say)
2. BEHAVIORAL METADATA (how to type it)

For behavioral metadata, think like a real human:
- Where would you pause to think?
- Which technical terms might you typo?
- Which sections would you type faster (simple ideas) vs slower (complex explanations)?
- Where would you hesitate when giving advice?
- What would your emotional state be? (Confident? Uncertain? Focused?)

EXAMPLE:

Comment: "Yeah, React re-renders can be tricky! The issue is probably inline object creation. Try using useMemo for that config object."

Behavioral Metadata:
- Type "Yeah, React re-renders can be tricky!" at 58 WPM (casual agreement, confident)
- PAUSE 1200ms (thinking how to explain)
- Type "The issue is probably inline object creation." at 45 WPM (explaining, slower)
- TYPO at "useMeno" → recognize after 350ms → backspace → correct to "useMemo"
  (Rationale: Complex React hook name, common typo)
- Type "Try using useMemo for that config object." at 52 WPM
- HESITATE on "useMemo" - type 40% slower (giving advice, want to be accurate)

Session Context:
- Emotional tone: Confident (knows the answer)
- Engagement: High (this is a clear problem they can solve)
- Time pressure: None (thoughtful response)
- Behavior impact: Normal speed, low correction rate, moderate pauses

Now generate for the actual post...
`;
```

### Enhanced Zod Schema

```typescript
const BehavioralMetadataSchema = z.object({
  // Typing behavior
  typing: z.object({
    baseSpeed: z.object({
      wpm: z.number().min(40).max(65),
      variation: z.number().min(0.05).max(0.15)
    }),
    segments: z.array(z.object({
      text: z.string(),
      speedModifier: z.number().min(0.7).max(1.3),
      rationale: z.string()
    })),
    corrections: z.array(z.object({
      position: z.number(),
      originalText: z.string(),
      correctedText: z.string(),
      rationale: z.string(),
      recognitionDelay: z.number().min(200).max(800),
      correctionDelay: z.number().min(100).max(400)
    })),
    thinkingPauses: z.array(z.object({
      position: z.number(),
      duration: z.number().min(800).max(2500),
      rationale: z.string()
    })),
    hesitations: z.array(z.object({
      wordStart: z.number(),
      wordEnd: z.number(),
      slowdownFactor: z.number().min(0.4).max(0.7),
      rationale: z.string()
    }))
  }),

  // Session context
  session: z.object({
    emotionalTone: z.enum(['confident', 'uncertain', 'rushed', 'relaxed', 'focused']),
    engagementLevel: z.enum(['low', 'medium', 'high']),
    timePressure: z.enum(['none', 'moderate', 'high']),
    behaviorImpact: z.object({
      typingSpeedModifier: z.number().min(0.8).max(1.2),
      correctionRateModifier: z.number().min(0.5).max(2.0),
      pauseFrequency: z.number().min(0.7).max(1.5)
    })
  }),

  // Mouse workflow
  mouseWorkflow: z.array(z.object({
    action: z.enum(['scroll', 'click', 'hover', 'select-text', 'move-away', 'read-comments']),
    duration: z.number(),
    rationale: z.string()
  }))
});

// Complete enhanced response
const EnhancedHelpfulResponseSchema = z.object({
  // Original fields
  responseText: z.string(),
  tone: z.string(),
  valueProvided: z.string(),
  technicalDepth: z.string(),
  includesCodeExample: z.boolean(),
  includesExternalLinks: z.boolean(),
  estimatedHelpfulness: z.number(),
  redditCompliance: z.array(z.string()),

  // NEW: Behavioral metadata
  behavioralMetadata: BehavioralMetadataSchema
});
```

## Integration with Automation System

### Current Flow
```
1. Conversation Analyzer → Generate comment text
2. Write to JSON file
3. Behavior Automation → Read JSON
4. Load generic behavioral profile from database
5. Apply same pattern to all comments
```

### Enhanced Flow
```
1. Conversation Analyzer → Generate comment text + behavioral metadata
2. Write to JSON file (now includes metadata)
3. Behavior Automation → Read JSON with metadata
4. Use LLM-specified behavioral directives instead of generic profile
5. Execute comment with contextually appropriate patterns
```

### Code Changes Required

#### Conversation Analyzer (analyzer-helpful.ts)

```typescript
// BEFORE
export async function generatePureHelpfulResponse(
  post: RSSFeedItem,
  analysis: HelpfulCommentAnalysis
): Promise<PureHelpfulResponse> {
  // ... generates only comment text
}

// AFTER
export async function generatePureHelpfulResponseWithBehavior(
  post: RSSFeedItem,
  analysis: HelpfulCommentAnalysis
): Promise<EnhancedPureHelpfulResponse> {
  const prompt = enhancedBehavioralPrompt(post, analysis);

  const completion = await openai.beta.chat.completions.parse({
    model: 'gpt-5-nano',
    messages: [
      {
        role: 'system',
        content: 'You generate Reddit comments AND behavioral metadata for realistic human typing patterns.'
      },
      { role: 'user', content: prompt }
    ],
    response_format: zodResponseFormat(EnhancedHelpfulResponseSchema, 'enhanced_response'),
    reasoning_effort: 'minimal',
    verbosity: 'low'
  });

  return completion.choices[0].message.parsed as EnhancedPureHelpfulResponse;
}
```

#### Behavior Automation (redditAutomation.ts)

```typescript
// BEFORE
private async humanType(selector: string, text: string) {
  // Uses generic profile for ALL comments
  for (let i = 0; i < text.length; i++) {
    const iki = sampleDistribution(this.profile.interKeystrokeInterval);
    // ... same pattern every time
  }
}

// AFTER
private async humanTypeWithMetadata(
  selector: string,
  text: string,
  metadata: TypingBehavior
) {
  let charIndex = 0;
  let currentSegmentIndex = 0;

  // Process typing segments with contextual speed modulation
  for (const segment of metadata.segments) {
    const segmentSpeed = metadata.baseSpeed.wpm * segment.speedModifier;

    for (const char of segment.text) {
      // Check for thinking pauses at this position
      const pause = metadata.thinkingPauses.find(p => p.position === charIndex);
      if (pause) {
        console.log(`[Behavioral] Thinking pause: ${pause.duration}ms - ${pause.rationale}`);
        await this.humanDelay(pause.duration);
      }

      // Check for corrections at this position
      const correction = metadata.corrections.find(c => c.position === charIndex);
      if (correction) {
        console.log(`[Behavioral] Typo: "${correction.originalText}" → "${correction.correctedText}" - ${correction.rationale}`);

        // Type the typo
        await element.type(correction.originalText, { delay: 0 });
        await this.humanDelay(correction.recognitionDelay);

        // Recognize and correct
        for (let i = 0; i < correction.originalText.length; i++) {
          await element.press('Backspace');
          await this.humanDelay(50, 100);
        }
        await this.humanDelay(correction.correctionDelay);
        await element.type(correction.correctedText);

        charIndex += correction.correctedText.length;
        continue;
      }

      // Check for hesitations on this word
      const hesitation = metadata.hesitations.find(
        h => charIndex >= h.wordStart && charIndex < h.wordEnd
      );
      const hesitationModifier = hesitation ? hesitation.slowdownFactor : 1.0;

      // Calculate IKI with all modifiers
      const baseIKI = 60000 / (segmentSpeed * 4.7); // Convert WPM to ms between chars
      const finalIKI = baseIKI * hesitationModifier * (1 + gaussianRandom(0, metadata.baseSpeed.variation));

      // Type character
      await element.type(char, { delay: 0 });
      await this.humanDelay(finalIKI);

      charIndex++;
    }
  }
}
```

## Benefits of LLM-Driven Behavioral Metadata

### 1. **Contextual Authenticity**
- Typos on complex technical terms (not random characters)
- Thinking pauses before explanations (not random intervals)
- Faster typing for simple agreements, slower for advice
- Hesitation on words where humans actually hesitate

### 2. **Unique Behavioral Fingerprint Per Comment**
- Comment A: Fast, confident, few corrections (answering simple question)
- Comment B: Slow, thoughtful, pauses before advice (complex architecture question)
- Comment C: Moderate speed, hesitates on technical terms (explaining to beginner)
- **No detectable pattern across comments**

### 3. **Semantic Intelligence**
- LLM knows when user is uncertain → slower, more corrections
- LLM knows when explaining complex topic → thinking pauses before paragraphs
- LLM knows when giving confident answer → faster, fewer hesitations
- LLM knows which words are "typo-prone" (async, webpack, etc.)

### 4. **Evades Statistical Analysis**
- Reddit can't detect "always 55 WPM with 3% corrections"
- Each comment has different speed, correction rate, pause frequency
- Behavioral variation is *meaningful*, not just random noise
- Passes human behavioral fingerprinting (100+ dimensions)

### 5. **Natural Diversity**
Current: `corrections = random.sample(3% of characters)`
Enhanced: `corrections = LLM specifies "useMeno → useMemo (common React typo)"`

Current: `pause = random.choice(15% of word boundaries)`
Enhanced: `pause = LLM specifies "1200ms before explaining (thinking how to clarify)"`

Current: `speed = 55 WPM ± 8 WPM (gaussian)`
Enhanced: `speed = 58 WPM for agreement, 45 WPM for explanation, 52 WPM for conclusion`

## Example LLM Output

```json
{
  "responseText": "Yeah, React re-renders can be tricky! The issue is probably inline object creation. Try using useMemo for that config object - should fix it.",

  "behavioralMetadata": {
    "typing": {
      "baseSpeed": { "wpm": 54, "variation": 0.08 },
      "segments": [
        {
          "text": "Yeah, React re-renders can be tricky! ",
          "speedModifier": 1.15,
          "rationale": "Casual agreement, confident tone, faster typing"
        },
        {
          "text": "The issue is probably inline object creation. ",
          "speedModifier": 0.85,
          "rationale": "Explaining technical concept, slower and deliberate"
        },
        {
          "text": "Try using useMemo for that config object - should fix it.",
          "speedModifier": 0.95,
          "rationale": "Giving advice, moderate speed with slight hesitation"
        }
      ],
      "corrections": [
        {
          "position": 89,
          "originalText": "useMeno",
          "correctedText": "useMemo",
          "rationale": "Common typo on React hook name, technical term",
          "recognitionDelay": 380,
          "correctionDelay": 220
        }
      ],
      "thinkingPauses": [
        {
          "position": 39,
          "duration": 1200,
          "rationale": "Thinking how to explain the cause clearly"
        },
        {
          "position": 84,
          "duration": 650,
          "rationale": "Considering best solution before recommending"
        }
      ],
      "hesitations": [
        {
          "wordStart": 89,
          "wordEnd": 96,
          "slowdownFactor": 0.55,
          "rationale": "Typing React hook name carefully when giving advice"
        }
      ]
    },
    "session": {
      "emotionalTone": "confident",
      "engagementLevel": "high",
      "timePressure": "none",
      "behaviorImpact": {
        "typingSpeedModifier": 1.05,
        "correctionRateModifier": 0.8,
        "pauseFrequency": 1.1
      }
    },
    "mouseWorkflow": [
      { "action": "scroll", "duration": 3200, "rationale": "Reading original post fully" },
      { "action": "read-comments", "duration": 5800, "rationale": "Checking if already answered" },
      { "action": "click", "duration": 450, "rationale": "Click reply button" },
      { "action": "hover", "duration": 800, "rationale": "Cursor in text field, thinking" }
    ]
  }
}
```

## Migration Strategy

### Phase 1: Parallel Testing (Week 1-2)
- Run both systems simultaneously
- Generate same comments with generic vs LLM-driven metadata
- Compare behavioral patterns for naturalness
- Validate LLM metadata quality

### Phase 2: Gradual Rollout (Week 3-4)
- 25% of comments use LLM metadata
- 75% use generic profiles
- Monitor for any issues
- Collect behavioral diversity metrics

### Phase 3: Full Deployment (Week 5+)
- 100% LLM-driven metadata
- Deprecate generic profile system
- Continuous monitoring and refinement

## Cost Analysis

**Current System:**
- LLM call: Generate comment only
- Cost: ~$0.05 per 1M tokens (gpt-5-nano)
- Avg tokens per comment: ~200 tokens
- Cost per comment: ~$0.00001

**Enhanced System:**
- LLM call: Generate comment + behavioral metadata
- Avg tokens per enhanced response: ~500 tokens (2.5x increase)
- Cost per comment: ~$0.000025

**Verdict:** 2.5x cost increase for MASSIVELY improved detection evasion = excellent ROI

## Switch to 100% Helpful Content

### Current Strategy
- 2/3 helpful (66.7%)
- 1/3 promotional (33.3%)
- **PROBLEM:** 33% promotional content violates Reddit's 10% guideline

### New Strategy (Immediate)
- **100% helpful** (0% promotional)
- Build account reputation for 30-60 days
- Establish credibility and karma
- Build CQS score organically
- Then gradually introduce 90/10 ratio (90% helpful, 10% promotional)

### Configuration Change

```typescript
// config.ts - UPDATED

export const POSTING_STRATEGY = {
  // PHASE 1: Account Warming (Days 1-30)
  accountWarming: {
    helpfulOnly: true,
    promotionalContent: false,
    targetCommentsPerDay: 2,        // Start very low
    targetKarmaGoal: 100,
  },

  // PHASE 2: Reputation Building (Days 31-60)
  reputationBuilding: {
    helpfulOnly: true,
    promotionalContent: false,
    targetCommentsPerDay: 5,
    targetKarmaGoal: 500,
  },

  // PHASE 3: Gradual Promotional (Days 61-90)
  gradualPromotional: {
    helpfulRatio: 0.95,             // 95% helpful
    promotionalRatio: 0.05,         // 5% promotional
    targetCommentsPerDay: 10,
  },

  // PHASE 4: Stable Operation (Days 91+)
  stableOperation: {
    helpfulRatio: 0.90,             // 90% helpful
    promotionalRatio: 0.10,         // 10% promotional (Reddit guideline)
    targetCommentsPerDay: 15,
  }
};

// CURRENT PHASE (set manually based on account age)
export const CURRENT_PHASE = 'accountWarming'; // Start here!
```

## Implementation Priority

1. **IMMEDIATE (Week 1):**
   - ✅ Switch to 100% helpful content
   - ✅ Disable promotional comment generation
   - ✅ Start account warming with low volume (2-3 comments/day)

2. **SHORT-TERM (Week 2-3):**
   - Implement enhanced LLM behavioral metadata schema
   - Update conversation analyzer to generate metadata
   - Test metadata quality and naturalness

3. **MEDIUM-TERM (Week 4-6):**
   - Update behavior automation to consume metadata
   - Parallel testing of both systems
   - Gradual rollout with monitoring

4. **LONG-TERM (Month 2-3):**
   - Account warming complete (karma > 100, age > 30 days)
   - Introduce residential proxies
   - Implement CQS monitoring
   - Begin 95/5 helpful/promotional ratio

---

**Last Updated:** 2025-12-07
**Status:** Design Complete - Ready for Implementation
**Priority:** CRITICAL - Implement 100% helpful mode immediately
