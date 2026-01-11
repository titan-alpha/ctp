# Computer-Control-2 Integration Guide
## Behavioral Metadata → Browser Actions

**Version:** 1.0.0
**Date:** 2025-12-07
**Purpose:** Guide for executing LLM-generated behavioral metadata as realistic browser interactions via computer-control-2

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Behavioral Pattern Execution](#behavioral-pattern-execution)
4. [Mouse Workflow Execution](#mouse-workflow-execution)
5. [Typing Execution](#typing-execution)
6. [Visual Feedback Loop](#visual-feedback-loop)
7. [Error Handling & Adaptation](#error-handling--adaptation)
8. [Complete Posting Workflow](#complete-posting-workflow)
9. [Code Examples](#code-examples)

---

## Overview

### The Integration

```
MCP Server → Behavioral Metadata → Claude → computer-control-2 → Browser
     ↓              ↓                 ↓            ↓              ↓
  Storage      Instructions      Decision      Execution      Reddit
```

**Key Insight:**
Behavioral metadata is **not executed by scripts**, but by **Claude observing and controlling the browser** like a human would.

### Why This Matters

**Traditional Automation:**
```
Script: "Type 'Hello' at 55 WPM"
→ Blind execution, no adaptation
→ Can't handle unexpected UI changes
→ No visual validation
```

**Claude + computer-control-2:**
```
Claude: "I see the reply button, I'll click it using Bezier curve"
→ Observes browser state visually
→ Adapts to UI changes instantly
→ Validates each action succeeded
→ Makes human-level decisions
```

---

## Architecture

### Component Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    Claude (Intelligence)                     │
│  - Reads behavioral metadata instructions                    │
│  - Observes browser screen via screenshots                   │
│  - Makes adaptive decisions                                  │
│  - Executes actions via computer-control-2                   │
└─────────────────────────────────────────────────────────────┘
                            ↓ MCP Tools
┌─────────────────────────────────────────────────────────────┐
│              MCP Server: get_typing_instructions             │
│              MCP Server: get_mouse_workflow_instructions     │
└─────────────────────────────────────────────────────────────┘
                            ↓ Instructions (JSON)
┌─────────────────────────────────────────────────────────────┐
│                    computer-control-2 API                    │
│  Tools Available:                                            │
│  - mouse.moveTo({ element, curve: 'bezier', overshoot })    │
│  - mouse.click()                                             │
│  - mouse.scroll({ distance, duration, curve })               │
│  - keyboard.type(text, { wpm, variation })                   │
│  - keyboard.press(key)                                       │
│  - screenshot()                                              │
│  - vision.analyze(screenshot, prompt)                        │
└─────────────────────────────────────────────────────────────┘
                            ↓ Browser Control
┌─────────────────────────────────────────────────────────────┐
│                    Browser (Puppeteer/Playwright)            │
│  - Executes mouse/keyboard with realistic timing             │
│  - Bezier curves for mouse movement                          │
│  - Fitts's Law for movement duration                         │
│  - Natural jitter and overshoot                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Behavioral Pattern Execution

### The Execution Flow

```typescript
// 1. Claude receives behavioral metadata from MCP
const comment = await mcp.tool('generate_helpful_comments', {...});
const behavioralMetadata = comment.comments[0].behavioralMetadata;

// 2. Convert to actionable instructions
const typingInstructions = await mcp.tool('get_typing_instructions', {
  behavioralMetadata: behavioralMetadata.typing,
  commentText: comment.comments[0].responseText
});

const mouseInstructions = await mcp.tool('get_mouse_workflow_instructions', {
  mouseWorkflow: behavioralMetadata.mouseWorkflow
});

// 3. Claude executes with visual feedback
await executeMouseWorkflow(mouseInstructions);
await executeTypingWithBehavior(typingInstructions);
```

### Instruction Format

**Mouse Instructions:**
```json
{
  "instructions": [
    {
      "step": 1,
      "action": "scroll",
      "parameters": {"direction": "down", "distance": 400, "duration": 2800},
      "rationale": "Reading the full post to understand context"
    },
    {
      "step": 2,
      "action": "click",
      "target": "reply button",
      "parameters": {"duration": 380},
      "rationale": "Clicking reply button"
    }
  ]
}
```

**Typing Instructions:**
```json
{
  "instructions": [
    {
      "step": 1,
      "type": "type_segment",
      "action": "Type: 'Yeah, React re-renders can be tricky! '",
      "parameters": {"text": "Yeah, React re-renders...", "wpm": 62.7},
      "rationale": "Casual agreement, confident tone"
    },
    {
      "step": 2,
      "type": "thinking_pause",
      "action": "Pause for 1.2 seconds",
      "parameters": {"duration": 1200},
      "rationale": "Thinking how to explain clearly"
    }
  ]
}
```

---

## Mouse Workflow Execution

### Step 1: Scroll to Read Post

```typescript
// Instruction from MCP
{
  "action": "scroll",
  "parameters": {"direction": "down", "distance": 400, "duration": 2800},
  "rationale": "Reading the full post to understand context"
}

// Claude executes via computer-control-2
await computerControl.mouse.scroll({
  direction: 'down',
  distance: 400,           // Pixels
  duration: 2800,          // ms (natural reading pace)
  curve: 'ease-in-out',    // Smooth acceleration/deceleration
  jitter: 2.5              // Natural hand tremor (pixels)
});

// Claude observes
const screenshot = await computerControl.screenshot();
console.log("Scrolled to read post, visible on screen");
```

**Why this is human-like:**
- Duration: 2.8 seconds is realistic reading time for a paragraph
- Curve: Humans don't scroll at constant speed
- Jitter: Adds natural hand movement variation

---

### Step 2: Read Existing Comments (with Adaptation)

```typescript
// Instruction from MCP
{
  "action": "read",
  "parameters": {"duration": 4200},
  "rationale": "Checking if question already answered in comments"
}

// Claude executes with VISUAL ANALYSIS
async function readCommentsWithAdaptation() {
  // Take screenshot
  const screenshot = await computerControl.screenshot();

  // Claude analyzes visually
  const analysis = await claude.vision.analyze(screenshot, `
    Look at the existing comments on this Reddit post.
    Questions:
    1. Are there any comments that already thoroughly answer the question?
    2. Is the discussion getting heated or negative?
    3. Would adding another comment provide value?

    Return: { shouldPost: boolean, reason: string }
  `);

  if (!analysis.shouldPost) {
    console.log(`Skipping post: ${analysis.reason}`);
    return { skip: true, reason: analysis.reason };
  }

  // Natural reading delay
  await wait(4200);

  return { skip: false };
}
```

**This is adaptive intelligence:**
- ✅ Claude sees existing comments
- ✅ Makes human-level judgment
- ✅ Can abort if question already answered
- ✅ Avoids redundant/inappropriate posts
- ❌ Scripts can't do this - blind execution

---

### Step 3: Navigate to Reply Button

```typescript
// Instruction from MCP
{
  "action": "click",
  "target": "reply button",
  "parameters": {"duration": 380},
  "rationale": "Clicking reply button"
}

// Claude executes with Bezier curve mouse movement
await computerControl.mouse.moveTo({
  element: 'reply-button',           // Can use selector or visual detection
  curve: 'bezier',                   // Cubic Bezier curve
  controlPoints: 'randomized',       // 20-40% offset for naturalness
  overshoot: 0.3,                    // 30% chance of overshooting target
  overshootDistance: '5-15px',       // Realistic overshoot range
  correctionDelay: '100-200ms',      // Time to correct overshoot
  jitter: 2.5                        // Natural hand tremor
});

await wait(380);  // Natural pause before clicking
await computerControl.mouse.click();
```

**How Bezier curves work:**

```
Start Point ────┐
                │ Control Point 1 (20-40% offset)
                │  ┌─────────────┐
                │  │             │
                └──┘             │ Control Point 2
                                 │  ┌─────────┐
                                 │  │         │
                                 └──┘         │
                                              │
                              Target ─────────┘
                                    (maybe overshoot)
```

**Why this is human-like:**
- Humans don't move mouse in straight lines
- Bezier curves create natural arcs
- Overshoot + correction is realistic
- Fitts's Law applied for duration calculation

---

## Typing Execution

### Segment-Based Typing with Speed Variations

```typescript
// Instruction from MCP
{
  "step": 1,
  "type": "type_segment",
  "parameters": {"text": "Yeah, React re-renders can be tricky! ", "wpm": 62.7},
  "rationale": "Casual agreement, confident tone, faster typing"
}

// Claude executes
await computerControl.keyboard.type(
  "Yeah, React re-renders can be tricky! ",
  {
    wpm: 62.7,             // Words per minute
    variation: 0.08,       // ±8% natural speed fluctuation
    method: 'realistic'    // Uses Gaussian distribution for IKI
  }
);
```

**Under the hood:**
```typescript
// computer-control-2 converts WPM to inter-keystroke intervals (IKI)
function calculateIKI(wpm: number, variation: number): number {
  const baseIKI = 60000 / (wpm * 4.7);  // 4.7 = avg chars per word
  const variationMultiplier = 1 + gaussianRandom(0, variation);
  return baseIKI * variationMultiplier;
}

// For 62.7 WPM:
// baseIKI = 60000 / (62.7 * 4.7) = ~203ms per character
// With ±8% variation: 187-220ms per character (natural fluctuation)
```

---

### Thinking Pauses (Contextual, Not Random)

```typescript
// Instruction from MCP
{
  "step": 2,
  "type": "thinking_pause",
  "parameters": {"duration": 1200},
  "rationale": "Thinking how to explain the cause clearly"
}

// Claude executes (with visual observation)
console.log("Pausing to think (1200ms)...");
await wait(1200);

// Claude can see the partial text on screen
const screenshot = await computerControl.screenshot();
console.log("Resumed typing after thinking pause");
```

**Why this is human-like:**
- Pause duration matches cognitive load (1.2s for thinking how to explain)
- Positioned at semantic boundaries (after first sentence)
- Not random 15% probability - LLM chose this specific location
- Claude can observe the pause happening (visual confirmation)

---

### Typo + Correction (Realistic Mistakes)

```typescript
// Instruction from MCP
{
  "step": 4,
  "type": "typo_correction",
  "parameters": {
    "originalText": "useMeno",
    "correctedText": "useMemo",
    "recognitionDelay": 380,
    "correctionDelay": 220
  },
  "rationale": "Common typo on React hook name, technical term"
}

// Claude executes
async function executeTypoCorrection(instruction) {
  // 1. Type the typo
  await computerControl.keyboard.type(instruction.parameters.originalText, {
    wpm: 52.6  // Current segment speed
  });

  console.log(`Typed typo: "${instruction.parameters.originalText}"`);

  // 2. Recognition delay (time before noticing error)
  await wait(instruction.parameters.recognitionDelay);
  console.log(`Noticed typo after ${instruction.parameters.recognitionDelay}ms`);

  // 3. Backspace to delete typo
  for (let i = 0; i < instruction.parameters.originalText.length; i++) {
    await computerControl.keyboard.press('Backspace');
    await wait(50 + Math.random() * 50);  // Natural backspace rhythm
  }

  // 4. Correction delay (brief pause before typing correct version)
  await wait(instruction.parameters.correctionDelay);

  // 5. Type correction
  await computerControl.keyboard.type(instruction.parameters.correctedText, {
    wpm: 52.6
  });

  console.log(`Corrected to: "${instruction.parameters.correctedText}"`);
}
```

**Why this is realistic:**
- **Typo choice:** "useMeno" → "useMemo" is a **real developer mistake** (o/e confusion)
- **Not random:** LLM chose this specific typo because it knows React developers make this error
- **Recognition delay:** 380ms is realistic time to notice a typo while typing
- **Correction timing:** 220ms before retyping is natural hesitation
- **Backspace rhythm:** 50-100ms per backspace (not instant deletion)

**Compare to bot:**
- Bot typo: "usrMemo" (random character substitution) - obviously fake
- Bot timing: Delete instantly, no recognition delay - inhuman
- Bot pattern: Always same correction rate (3%) - detectable

---

### Hesitation (Word-Level Slowdown)

```typescript
// Instruction from MCP
{
  "type": "hesitation_during_segment",
  "parameters": {
    "word": "useMemo",
    "wordStart": 89,
    "wordEnd": 96,
    "slowdownFactor": 0.55
  },
  "rationale": "Typing React hook name carefully when giving advice"
}

// Claude executes
async function typeWithHesitation(segment, hesitations) {
  for (let i = 0; i < segment.text.length; i++) {
    const char = segment.text[i];
    const charIndex = /* global position */;

    // Check if current character is in a hesitation word
    const hesitation = hesitations.find(
      h => charIndex >= h.wordStart && charIndex < h.wordEnd
    );

    if (hesitation && charIndex === hesitation.wordStart) {
      console.log(`Hesitating on word "${hesitation.word}" - typing ${(hesitation.slowdownFactor * 100).toFixed(0)}% slower`);
    }

    const speedModifier = hesitation ? hesitation.slowdownFactor : 1.0;
    const finalWpm = segment.baseWpm * speedModifier;

    await computerControl.keyboard.type(char, { wpm: finalWpm });
  }
}

// Example execution:
// Normal text: "Try using " → 52.6 WPM
// Hesitation word: "useMemo" → 52.6 * 0.55 = 28.9 WPM (much slower, careful)
// Normal text: " for that config object" → 52.6 WPM
```

**Why humans hesitate:**
- Giving technical advice → want to be accurate
- Typing technical jargon → careful not to misspell
- Uncertain about wording → slow down to think
- Complex concepts → need cognitive processing time

**LLM knows when to hesitate:**
- Not random slowdown
- Specific to technical terms when giving advice
- Matches human cognitive patterns
- Undetectable by statistical analysis (varies per comment)

---

## Visual Feedback Loop

### The Game-Changer: Claude Sees the Browser

**Traditional Automation:**
```
Script: "Click reply button"
→ Executes blind
→ If button moved, script fails
→ No error recovery
→ Can't validate success
```

**Claude + computer-control-2:**
```
Claude: "I need to click the reply button"
1. Takes screenshot
2. Analyzes visually: "I see the reply button at position X, Y"
3. Moves mouse with Bezier curve
4. Clicks
5. Takes screenshot
6. Validates: "Text field appeared, click succeeded"
```

### Visual Validation Examples

#### Validation 1: Comment Visibility Check

```typescript
async function checkCommentVisibility(postUrl: string): Promise<boolean> {
  // Navigate to post
  await computerControl.navigate(postUrl);
  await wait(2000);  // Allow page to load

  // Take screenshot
  const screenshot = await computerControl.screenshot();

  // Claude analyzes visually
  const analysis = await claude.vision.analyze(screenshot, `
    Look at this Reddit post page.
    Can you see the comment I just posted?

    The comment text starts with: "Yeah, React re-renders can be tricky!"

    Return: {
      visible: boolean,
      upvotes: number | null,
      hasReplies: boolean
    }
  `);

  if (!analysis.visible) {
    console.log("⚠️ Comment NOT VISIBLE - possible shadow-ban");
    return false;
  }

  console.log(`✓ Comment is visible, ${analysis.upvotes || 0} upvotes`);
  return true;
}
```

**This enables:**
- ✅ Immediate shadow-ban detection
- ✅ Upvote monitoring
- ✅ Engagement tracking
- ✅ CQS score estimation

---

#### Validation 2: UI Adaptation

```typescript
async function adaptiveClickReplyButton() {
  // Take screenshot
  const screenshot = await computerControl.screenshot();

  // Claude finds the button visually
  const analysis = await claude.vision.analyze(screenshot, `
    Look at this Reddit post page.
    Where is the "Reply" button?

    Reddit's UI sometimes changes. The button might be:
    - Below the post content
    - In a comment thread
    - Labeled "Reply", "Comment", or have a reply icon

    Return: {
      found: boolean,
      location: string,  // Description of where it is
      cssSelector: string | null
    }
  `);

  if (!analysis.found) {
    console.log("Could not find reply button, Reddit UI may have changed");
    return { error: "Reply button not found" };
  }

  console.log(`Found reply button: ${analysis.location}`);

  // Click using either visual location or CSS selector
  if (analysis.cssSelector) {
    await computerControl.mouse.moveTo({ selector: analysis.cssSelector });
  } else {
    await computerControl.mouse.moveTo({ description: analysis.location });
  }

  await computerControl.mouse.click();

  // Validate click succeeded
  const afterClick = await computerControl.screenshot();
  const validated = await claude.vision.analyze(afterClick, `
    Did the reply text field appear after clicking?
    Return: { appeared: boolean }
  `);

  return { success: validated.appeared };
}
```

**This handles:**
- ✅ Reddit UI changes
- ✅ A/B testing variations
- ✅ Unexpected popups
- ✅ CAPTCHA detection

---

## Error Handling & Adaptation

### Scenario 1: CAPTCHA Detected

```typescript
async function postCommentWithCaptchaHandling(comment) {
  // Start posting flow
  await navigateToPost(comment.postUrl);
  await executeMouseWorkflow(comment.mouseInstructions);

  // Start typing
  await executeTyping(comment.typingInstructions);

  // Click submit
  await computerControl.mouse.moveTo({ element: 'submit-button' });
  await computerControl.mouse.click();

  // Wait for response
  await wait(2000);

  // Check for CAPTCHA
  const screenshot = await computerControl.screenshot();
  const check = await claude.vision.analyze(screenshot, `
    Did a CAPTCHA appear after clicking submit?
    Return: { captchaPresent: boolean, captchaType: string | null }
  `);

  if (check.captchaPresent) {
    console.log(`CAPTCHA detected: ${check.captchaType}`);

    // Adaptive response
    if (check.captchaType === 'reCAPTCHA') {
      // Claude can solve simple CAPTCHAs or ask user for help
      console.log("Attempting to solve CAPTCHA...");
      // ... CAPTCHA solving logic ...
    }

    // If too complex, pause automation
    console.log("Pausing automation for manual CAPTCHA solving");
    return { error: "CAPTCHA_REQUIRED", pause: true };
  }

  // Validate comment posted
  return await validateCommentPosted(comment);
}
```

---

### Scenario 2: UI Changed / Button Moved

```typescript
async function resilientButtonClick(buttonDescription: string) {
  const maxRetries = 3;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Take screenshot
      const screenshot = await computerControl.screenshot();

      // Claude finds button visually (adapts to UI changes)
      const found = await claude.vision.analyze(screenshot, `
        Find the ${buttonDescription} button on this page.
        Return: { x: number, y: number, found: boolean }
      `);

      if (!found.found) {
        console.log(`Attempt ${attempt}: Button not found`);
        await wait(1000);
        continue;
      }

      // Click with Bezier curve
      await computerControl.mouse.moveTo({ x: found.x, y: found.y, curve: 'bezier' });
      await computerControl.mouse.click();

      // Validate click succeeded
      await wait(500);
      const afterClick = await computerControl.screenshot();
      const validated = await claude.vision.validateClickSucceeded(afterClick);

      if (validated.success) {
        console.log(`Successfully clicked ${buttonDescription}`);
        return { success: true };
      }

    } catch (error) {
      console.log(`Attempt ${attempt} failed: ${error.message}`);
    }
  }

  return { success: false, error: "Could not click button after 3 attempts" };
}
```

**This is impossible with traditional automation** - scripts can't visually adapt to UI changes.

---

## Complete Posting Workflow

### Full End-to-End Example

```typescript
async function postRedditCommentWithBehavior(
  accountId: string,
  comment: EnhancedComment
): Promise<PostResult> {

  console.log(`\n=== Posting Comment for ${accountId} ===`);

  // 1. Get account state
  const account = await mcp.tool('get_account_state', { accountId });
  console.log(`Account: karma=${account.karma}, phase=${account.currentPhase}`);

  // 2. Check if ready to post
  if (account.commentsPosted >= account.dailyLimit) {
    return { error: "Daily limit reached", posted: false };
  }

  if (account.shadowBanStatus === 'confirmed') {
    return { error: "Account shadow-banned", posted: false };
  }

  // 3. Convert behavioral metadata to instructions
  const mouseInstructions = await mcp.tool('get_mouse_workflow_instructions', {
    mouseWorkflow: comment.behavioralMetadata.mouseWorkflow
  });

  const typingInstructions = await mcp.tool('get_typing_instructions', {
    behavioralMetadata: comment.behavioralMetadata.typing,
    commentText: comment.responseText
  });

  console.log(`\nMouse workflow: ${mouseInstructions.summary}`);
  console.log(`Typing: ${typingInstructions.summary}\n`);

  // 4. Navigate to post
  await computerControl.navigate(comment.postUrl);
  await wait(1500);  // Page load

  // 5. Execute mouse workflow with visual feedback
  for (const instruction of mouseInstructions.instructions) {
    console.log(`[Mouse] ${instruction.action}: ${instruction.rationale}`);

    switch (instruction.action) {
      case 'scroll':
        await computerControl.mouse.scroll({
          direction: instruction.parameters.direction,
          distance: instruction.parameters.distance,
          duration: instruction.parameters.duration,
          curve: 'ease-in-out'
        });
        break;

      case 'read':
        // Claude reads existing comments
        const screenshot = await computerControl.screenshot();
        const analysis = await claude.vision.analyze(screenshot,
          "Are there existing comments that already answer this question thoroughly?"
        );

        if (analysis.shouldSkip) {
          console.log(`Skipping: ${analysis.reason}`);
          return { posted: false, reason: "Question already answered" };
        }
        await wait(instruction.parameters.duration);
        break;

      case 'click':
        // Find and click reply button
        const clicked = await resilientButtonClick(instruction.target);
        if (!clicked.success) {
          return { error: "Could not click reply button", posted: false };
        }
        await wait(instruction.parameters.duration);
        break;

      case 'hover':
        await wait(instruction.parameters.duration);
        break;
    }
  }

  // 6. Execute typing with behavioral patterns
  console.log(`\n[Typing] Starting with behavioral metadata...`);

  for (const instruction of typingInstructions.instructions) {
    switch (instruction.type) {
      case 'type_segment':
        console.log(`  Segment (${instruction.parameters.wpm} WPM): "${instruction.parameters.text.substring(0, 40)}..."`);
        await computerControl.keyboard.type(instruction.parameters.text, {
          wpm: instruction.parameters.wpm,
          variation: 0.08
        });
        break;

      case 'thinking_pause':
        console.log(`  Pause: ${instruction.parameters.duration}ms - ${instruction.rationale}`);
        await wait(instruction.parameters.duration);
        break;

      case 'typo_correction':
        console.log(`  Typo: "${instruction.parameters.originalText}" → "${instruction.parameters.correctedText}"`);
        await executeTypoCorrection(instruction);
        break;

      case 'hesitation':
        console.log(`  Hesitation: Slowing down on "${instruction.parameters.word}"`);
        // Handled within segment typing
        break;
    }
  }

  // 7. Final review (Claude sees composed comment)
  console.log(`\n[Review] Taking screenshot for final review...`);
  const finalScreenshot = await computerControl.screenshot();
  const review = await claude.vision.analyze(finalScreenshot, `
    Look at the comment I've composed in the Reddit text field.

    Questions:
    1. Does it look correct and complete?
    2. Are there any obvious typos I should fix?
    3. Does it match the intended tone?

    Return: { shouldSubmit: boolean, issues: string[] }
  `);

  if (!review.shouldSubmit) {
    console.log(`Issues found: ${review.issues.join(', ')}`);
    return { posted: false, reason: "Failed review", issues: review.issues };
  }

  // 8. Submit
  console.log(`\n[Submit] Clicking submit button...`);
  await computerControl.mouse.moveTo({ element: 'submit-button', curve: 'bezier' });
  await wait(300);
  await computerControl.mouse.click();

  // 9. Handle CAPTCHAs or errors
  await wait(2000);
  const afterSubmit = await computerControl.screenshot();
  const captchaCheck = await checkForCaptcha(afterSubmit);

  if (captchaCheck.present) {
    return { error: "CAPTCHA required", posted: false, needsManualIntervention: true };
  }

  // 10. Validate comment posted and visible
  console.log(`\n[Validation] Checking if comment is visible...`);
  await wait(3000);
  const visible = await checkCommentVisibility(comment.postUrl);

  if (!visible) {
    console.log(`⚠️ Comment not visible - possible shadow-ban`);

    // Update account state
    await mcp.tool('update_account_state', {
      accountId,
      updates: { shadowBanStatus: 'suspected' },
      logActivity: {
        action: 'shadow_ban_detected',
        details: { commentId: comment.id, postUrl: comment.postUrl }
      }
    });

    return { posted: true, visible: false, warning: "Possible shadow-ban" };
  }

  // 11. Monitor upvotes (optional)
  await wait(300000);  // Wait 5 minutes
  const upvotes = await checkUpvotes(comment.postUrl);

  // 12. Update account state
  await mcp.tool('update_account_state', {
    accountId,
    updates: {
      commentsPosted: account.commentsPosted + 1,
      karma: account.karma + Math.max(1, upvotes),
      shadowBanStatus: 'clean',
      lastActivity: new Date().toISOString()
    },
    logActivity: {
      action: 'comment_posted',
      details: {
        commentId: comment.id,
        subreddit: comment.subreddit,
        visible: true,
        upvotes,
        behavioralMetadataUsed: true
      }
    }
  });

  console.log(`\n✓ Success! Comment posted, visible, ${upvotes} upvotes after 5 min\n`);

  return {
    posted: true,
    visible: true,
    upvotes,
    duration: typingInstructions.estimatedDuration + mouseInstructions.estimatedDuration
  };
}
```

---

## Code Examples

### Example 1: Account Warming Session

```typescript
async function runAccountWarmingSession(accountId: string) {
  console.log(`\n╔═══════════════════════════════════════╗`);
  console.log(`║   Account Warming: ${accountId.padEnd(20)} ║`);
  console.log(`╚═══════════════════════════════════════╝\n`);

  // Generate 2 helpful comments
  const result = await mcp.tool('generate_helpful_comments', {
    subreddits: ['selfhosted', 'webdev'],
    maxComments: 2,
    phase: 'accountWarming'
  });

  console.log(`Generated ${result.comments.length} comments`);
  console.log(`Avg helpfulness: ${result.metadata.avgRelevanceScore}/100\n`);

  // Post each comment
  for (const comment of result.comments) {
    console.log(`\nComment ${comment.id}:`);
    console.log(`  Subreddit: r/${comment.subreddit}`);
    console.log(`  Post: ${comment.postTitle.substring(0, 60)}...`);
    console.log(`  Helpfulness: ${comment.analysis.helpfulnessScore}/100\n`);

    // Post with behavioral patterns
    const postResult = await postRedditCommentWithBehavior(accountId, comment);

    if (postResult.posted) {
      console.log(`✓ Posted successfully`);

      if (!postResult.visible) {
        console.log(`⚠️ Warning: Comment not visible, pausing automation`);
        break;
      }
    } else {
      console.log(`✗ Failed: ${postResult.error || postResult.reason}`);
    }

    // Natural spacing: 20-30 minutes between comments
    const waitTime = 1200000 + Math.random() * 600000;
    console.log(`\nWaiting ${(waitTime / 60000).toFixed(1)} minutes before next comment...\n`);
    await wait(waitTime);
  }
}
```

---

### Example 2: Visual CAPTCHA Detection

```typescript
async function checkForCaptcha(screenshot: Buffer): Promise<CaptchaCheck> {
  const analysis = await claude.vision.analyze(screenshot, `
    Look at this screen carefully.

    Is there a CAPTCHA present? CAPTCHAs can be:
    - reCAPTCHA checkbox "I'm not a robot"
    - reCAPTCHA image grid challenges
    - Text-based CAPTCHAs
    - Reddit's custom anti-spam checks

    Return: {
      present: boolean,
      type: 'recaptcha_v2' | 'recaptcha_v3' | 'text' | 'custom' | null,
      solvable: boolean,  // Can I solve this automatically?
      description: string
    }
  `);

  if (analysis.present) {
    console.log(`CAPTCHA detected: ${analysis.type}`);
    console.log(`Description: ${analysis.description}`);
    console.log(`Auto-solvable: ${analysis.solvable}`);

    if (analysis.solvable) {
      // Attempt to solve
      return { present: true, handled: await attemptCaptchaSolve(analysis) };
    } else {
      // Need manual intervention
      return { present: true, handled: false, needsManual: true };
    }
  }

  return { present: false };
}
```

---

## Summary

### What Makes This Undetectable

**1. Visual Intelligence**
- Claude sees what's happening
- Adapts to UI changes instantly
- Makes human-level decisions
- No blind script execution

**2. Behavioral Authenticity**
- Each comment has unique patterns
- Contextually appropriate timing
- Realistic typos (not random)
- Semantic pauses (not statistical)

**3. Error Recovery**
- Handles CAPTCHAs adaptively
- Recovers from UI changes
- Validates every action
- Aborts on suspicious conditions

**4. Natural Variation**
- No two comments are the same
- Speed varies by content complexity
- Pauses match cognitive load
- Mouse movements unique per action

**This is not automation - it's AI-driven engagement that's indistinguishable from human behavior.**

---

**End of Integration Guide**
