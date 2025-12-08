/**
 * Reddit Automation with Human-like Behavior
 * Uses synthetic profiles to post comments indistinguishably from humans
 * Based on research from RESEARCH_FINDINGS.md
 */

import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { Browser, Page } from 'puppeteer';
import {
  BehavioralProfile,
  ActionSequence,
  TypingBehavior,
  MouseWorkflowStep,
  BehavioralMetadata,
} from '../types/behavioral';
import { generateMousePath, generateClickOffset, addOvershoot } from '../utils/bezier';
import { sampleDistribution, gaussianRandom } from '../utils/statistics';
import { generateCommentSequence } from '../generator/actionSequenceGenerator';

puppeteer.use(StealthPlugin());

export interface RedditComment {
  postUrl: string;
  commentText: string;
  behavioralMetadata?: BehavioralMetadata;
}

export interface RedditAutomationConfig {
  username: string;
  password: string;
  maxCommentsPerHour: number;
  maxCommentsPerDay: number;
  minDelayBetweenCommentsMinutes: number;
}

export class RedditAutomation {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private profile: BehavioralProfile;
  private config: RedditAutomationConfig;
  private commentsPostedToday: number = 0;
  private lastCommentTime: number = 0;

  constructor(profile: BehavioralProfile, config: RedditAutomationConfig) {
    this.profile = profile;
    this.config = config;
  }

  /**
   * Initialize browser with profile's fingerprint
   */
  async init(): Promise<void> {
    this.browser = await puppeteer.launch({
      headless: false, // Visible for monitoring
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled',
        `--window-size=${this.profile.fingerprint.screenResolution.width},${this.profile.fingerprint.screenResolution.height}`,
      ],
    });

    this.page = await this.browser.newPage();

    // Set viewport
    await this.page.setViewport({
      width: this.profile.fingerprint.screenResolution.width,
      height: this.profile.fingerprint.screenResolution.height,
      deviceScaleFactor: this.profile.fingerprint.pixelRatio,
    });

    // Set user agent
    await this.page.setUserAgent(this.profile.fingerprint.userAgent);

    // Set timezone
    await this.page.emulateTimezone(this.profile.fingerprint.timezone);

    console.log('Browser initialized with fingerprint:');
    console.log(`  User Agent: ${this.profile.fingerprint.userAgent}`);
    console.log(`  Resolution: ${this.profile.fingerprint.screenResolution.width}x${this.profile.fingerprint.screenResolution.height}`);
    console.log(`  Timezone: ${this.profile.fingerprint.timezone}`);
  }

  /**
   * Login to Reddit with human-like timing
   */
  async login(): Promise<void> {
    if (!this.page) {
      throw new Error('Browser not initialized');
    }

    console.log('\nLogging in to Reddit...');

    await this.page.goto('https://www.reddit.com/login', {
      waitUntil: 'networkidle2',
    });

    // Wait for login form with human-like delay
    await this.humanDelay(1000, 2000);

    // Type username with human-like timing
    await this.humanType('#loginUsername', this.config.username);
    await this.humanDelay(300, 800);

    // Type password with human-like timing
    await this.humanType('#loginPassword', this.config.password);
    await this.humanDelay(500, 1000);

    // Click login button with human-like mouse movement
    await this.humanClick('button[type="submit"]');

    // Wait for login to complete
    await this.page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 });

    console.log('✓ Logged in successfully');
  }

  /**
   * Post a comment with full human-like behavior
   */
  async postComment(comment: RedditComment): Promise<void> {
    if (!this.page) {
      throw new Error('Browser not initialized');
    }

    // Safety checks
    this.enforceRateLimits();

    console.log(`\nPosting comment to: ${comment.postUrl}`);

    // Generate action sequence for this comment
    const sessionId = `session-${Date.now()}`;
    const sequence = generateCommentSequence(this.profile, sessionId);

    console.log(`Action sequence: ${sequence.length} states`);

    // Execute action sequence
    await this.executeActionSequence(sequence, comment);

    // Update tracking
    this.commentsPostedToday++;
    this.lastCommentTime = Date.now();

    console.log('✓ Comment posted successfully');
  }

  /**
   * Execute an action sequence with realistic timing
   */
  private async executeActionSequence(
    sequence: ActionSequence[],
    comment: RedditComment
  ): Promise<void> {
    for (const action of sequence) {
      console.log(`  [${action.state}] - ${(action.duration / 1000).toFixed(1)}s`);

      switch (action.state) {
        case 'browsing':
          await this.simulateBrowsing(action.duration);
          break;

        case 'reading':
          await this.simulateReading(action.duration, comment.postUrl);
          break;

        case 'considering':
          await this.simulateConsidering(action.duration);
          break;

        case 'composing':
          await this.simulateComposing(
            action.duration,
            comment.commentText,
            comment.behavioralMetadata
          );
          break;

        case 'reviewing':
          await this.simulateReviewing(action.duration);
          break;

        case 'submitting':
          await this.simulateSubmitting(action.duration);
          break;
      }
    }
  }

  /**
   * Simulate browsing behavior
   */
  private async simulateBrowsing(duration: number): Promise<void> {
    // Scroll randomly
    const scrolls = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < scrolls; i++) {
      await this.humanScroll();
      await this.humanDelay(duration / scrolls / 2, duration / scrolls);
    }
  }

  /**
   * Simulate reading a post
   */
  private async simulateReading(duration: number, postUrl: string): Promise<void> {
    if (!this.page) return;

    // Navigate to post
    await this.page.goto(postUrl, { waitUntil: 'networkidle2' });

    // Simulate reading by scrolling slowly
    const scrollCount = Math.floor(duration / 3000); // Scroll every 3 seconds
    for (let i = 0; i < scrollCount; i++) {
      await this.humanScroll(200, 400);
      await this.humanDelay(2000, 4000);
    }
  }

  /**
   * Simulate considering whether to comment
   */
  private async simulateConsidering(duration: number): Promise<void> {
    // Small mouse movements, maybe scroll to comment box
    await this.humanScroll(100, 200);
    await this.humanDelay(duration);
  }

  /**
   * Simulate composing a comment
   */
  private async simulateComposing(
    duration: number,
    text: string,
    metadata?: BehavioralMetadata
  ): Promise<void> {
    if (!this.page) return;

    // Execute pre-browsing mouse workflow if metadata exists
    if (metadata?.mouseWorkflow) {
      await this.executeMouseWorkflowWithMetadata(metadata.mouseWorkflow);
    }

    // Click comment box
    await this.humanClick('textarea[placeholder*="Comment"]');
    await this.humanDelay(300, 800);

    // Type comment with metadata or fall back to generic profile
    if (metadata?.typing) {
      console.log('[Behavior Mode] Using LLM-driven behavioral metadata');
      await this.humanTypeWithMetadata('textarea[placeholder*="Comment"]', text, metadata.typing);
    } else {
      console.log('[Behavior Mode] Using generic profile (no metadata available)');
      await this.humanType('textarea[placeholder*="Comment"]', text, true);
    }
  }

  /**
   * Simulate reviewing comment before submitting
   */
  private async simulateReviewing(duration: number): Promise<void> {
    // Re-read what was typed, maybe make small edits
    await this.humanDelay(duration);
  }

  /**
   * Submit the comment
   */
  private async simulateSubmitting(duration: number): Promise<void> {
    if (!this.page) return;

    // Click submit button
    await this.humanClick('button[type="submit"]');
    await this.humanDelay(duration);
  }

  /**
   * Type text with human-like timing based on profile
   */
  private async humanType(
    selector: string,
    text: string,
    useProfile: boolean = true
  ): Promise<void> {
    if (!this.page) return;

    const element = await this.page.$(selector);
    if (!element) {
      throw new Error(`Element not found: ${selector}`);
    }

    await element.click();

    for (let i = 0; i < text.length; i++) {
      const char = text[i];

      // Sample IKI from profile
      const iki = useProfile
        ? sampleDistribution(this.profile.interKeystrokeInterval)
        : 100 + Math.random() * 50;

      // Add thinking pauses at word boundaries (15% of words)
      const isWordBoundary = char === ' ';
      const shouldPause = isWordBoundary && Math.random() < 0.15;

      if (shouldPause) {
        const pauseDuration = 800 + Math.random() * 800; // 800-1600ms
        await this.humanDelay(pauseDuration);
      }

      // Type character
      await element.type(char, { delay: 0 });

      // Random corrections (3% of characters)
      if (Math.random() < this.profile.correctionRate && i > 0) {
        await this.humanDelay(200, 400); // Recognition delay
        await element.press('Backspace');
        await this.humanDelay(100, 300);
        await element.type(char);
      }

      await this.humanDelay(iki);
    }
  }

  /**
   * Click element with human-like mouse movement
   */
  private async humanClick(selector: string): Promise<void> {
    if (!this.page) return;

    const element = await this.page.$(selector);
    if (!element) {
      throw new Error(`Element not found: ${selector}`);
    }

    const box = await element.boundingBox();
    if (!box) {
      throw new Error('Element has no bounding box');
    }

    // Generate click offset from center
    const offset = generateClickOffset({ width: box.width, height: box.height });

    const targetX = box.x + box.width / 2 + offset.x;
    const targetY = box.y + box.height / 2 + offset.y;

    // Get current mouse position (estimate)
    const currentX = Math.random() * this.profile.fingerprint.screenResolution.width;
    const currentY = Math.random() * this.profile.fingerprint.screenResolution.height;

    // Generate Bezier path
    const path = generateMousePath(
      { x: currentX, y: currentY },
      { x: targetX, y: targetY }
    );

    // Maybe add overshoot (30% chance)
    const finalPath = addOvershoot(path, { x: targetX, y: targetY }, 0.3);

    // Execute mouse movement
    for (let i = 0; i < finalPath.points.length; i++) {
      const point = finalPath.points[i];
      await this.page.mouse.move(point.x, point.y);

      if (i < finalPath.timestamps.length - 1) {
        const delay = finalPath.timestamps[i + 1] - finalPath.timestamps[i];
        await this.humanDelay(delay);
      }
    }

    // Click
    await this.page.mouse.click(targetX, targetY);
  }

  /**
   * Scroll with human-like behavior
   */
  private async humanScroll(minDelta: number = 100, maxDelta: number = 300): Promise<void> {
    if (!this.page) return;

    const delta = minDelta + Math.random() * (maxDelta - minDelta);
    await this.page.evaluate((scrollAmount: number) => {
      // @ts-ignore - window is available in browser context
      window.scrollBy(0, scrollAmount);
    }, delta);
  }

  /**
   * Human-like delay
   */
  private async humanDelay(minMs: number, maxMs?: number): Promise<void> {
    const delay = maxMs ? minMs + Math.random() * (maxMs - minMs) : minMs;
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  /**
   * Type text with LLM-driven behavioral metadata
   * Implements contextually appropriate typing with semantic understanding
   */
  private async humanTypeWithMetadata(
    selector: string,
    text: string,
    metadata: TypingBehavior
  ): Promise<void> {
    if (!this.page) return;

    const element = await this.page.$(selector);
    if (!element) {
      throw new Error(`Element not found: ${selector}`);
    }

    await element.click();
    console.log('[Behavioral Metadata] Using LLM-driven typing patterns');
    console.log(`  Base WPM: ${metadata.baseSpeed.wpm}, Variation: ${(metadata.baseSpeed.variation * 100).toFixed(1)}%`);

    let charIndex = 0;

    // Process typing segments with contextual speed modulation
    for (const segment of metadata.segments) {
      const segmentSpeed = metadata.baseSpeed.wpm * segment.speedModifier;
      console.log(`  [Segment] "${segment.text.substring(0, 30)}..." - ${segmentSpeed.toFixed(1)} WPM - ${segment.rationale}`);

      for (const char of segment.text) {
        // Check for thinking pauses at this position
        const pause = metadata.thinkingPauses.find(p => p.position === charIndex);
        if (pause) {
          console.log(`    [Thinking Pause] ${pause.duration}ms - ${pause.rationale}`);
          await this.humanDelay(pause.duration);
        }

        // Check for corrections at this position
        const correction = metadata.corrections.find(c => c.position === charIndex);
        if (correction) {
          console.log(`    [Typo] "${correction.originalText}" → "${correction.correctedText}" - ${correction.rationale}`);

          // Type the typo
          await element.type(correction.originalText, { delay: 0 });
          await this.humanDelay(correction.recognitionDelay);

          console.log(`      Recognition delay: ${correction.recognitionDelay}ms`);

          // Backspace to remove typo
          for (let i = 0; i < correction.originalText.length; i++) {
            await element.press('Backspace');
            await this.humanDelay(50, 100);
          }

          await this.humanDelay(correction.correctionDelay);
          console.log(`      Correction delay: ${correction.correctionDelay}ms`);

          // Type correction
          await element.type(correction.correctedText, { delay: 0 });

          charIndex += correction.correctedText.length;
          continue;
        }

        // Check for hesitations on this word
        const hesitation = metadata.hesitations.find(
          h => charIndex >= h.wordStart && charIndex < h.wordEnd
        );

        if (hesitation && charIndex === hesitation.wordStart) {
          const word = segment.text.substring(
            hesitation.wordStart - (charIndex - segment.text.indexOf(char)),
            hesitation.wordEnd - (charIndex - segment.text.indexOf(char))
          );
          console.log(`    [Hesitation] Slowing down ${(hesitation.slowdownFactor * 100).toFixed(0)}% on word - ${hesitation.rationale}`);
        }

        const hesitationModifier = hesitation ? hesitation.slowdownFactor : 1.0;

        // Calculate IKI with all modifiers
        // WPM to characters per second: WPM * 4.7 (avg chars per word)
        // Then convert to ms between chars
        const baseIKI = 60000 / (segmentSpeed * 4.7);
        const variationMultiplier = 1 + gaussianRandom(0, metadata.baseSpeed.variation);
        const finalIKI = baseIKI * hesitationModifier * variationMultiplier;

        // Type character
        await element.type(char, { delay: 0 });
        await this.humanDelay(finalIKI);

        charIndex++;
      }
    }

    console.log('[Behavioral Metadata] Typing completed with LLM directives');
  }

  /**
   * Execute mouse workflow with LLM-driven behavioral metadata
   */
  private async executeMouseWorkflowWithMetadata(
    workflow: MouseWorkflowStep[]
  ): Promise<void> {
    if (!this.page) return;

    console.log('[Behavioral Metadata] Executing mouse workflow');

    for (const step of workflow) {
      console.log(`  [Mouse Action] ${step.action} - ${step.duration}ms - ${step.rationale}`);

      switch (step.action) {
        case 'scroll':
          await this.humanScroll(100, 300);
          await this.humanDelay(step.duration);
          break;

        case 'click':
          if (step.target) {
            await this.humanClick(step.target);
          }
          await this.humanDelay(step.duration);
          break;

        case 'hover':
          // Move mouse to random position (simulating reading/thinking)
          await this.humanDelay(step.duration);
          break;

        case 'read-comments':
          // Simulate reading by scrolling and pausing
          const scrollCount = Math.floor(step.duration / 3000);
          for (let i = 0; i < scrollCount; i++) {
            await this.humanScroll(200, 400);
            await this.humanDelay(2000, 4000);
          }
          break;

        case 'select-text':
          // Simulate text selection (could be implemented with mouse drag)
          await this.humanDelay(step.duration);
          break;

        case 'move-away':
          // Move mouse away from active area
          await this.humanDelay(step.duration);
          break;
      }
    }

    console.log('[Behavioral Metadata] Mouse workflow completed');
  }

  /**
   * Enforce rate limits from research
   */
  private enforceRateLimits(): void {
    // Check daily limit
    if (this.commentsPostedToday >= this.config.maxCommentsPerDay) {
      throw new Error(
        `Daily limit reached: ${this.config.maxCommentsPerDay} comments/day`
      );
    }

    // Check minimum delay between comments
    const timeSinceLastComment = Date.now() - this.lastCommentTime;
    const minDelay = this.config.minDelayBetweenCommentsMinutes * 60 * 1000;

    if (timeSinceLastComment < minDelay) {
      const waitTime = minDelay - timeSinceLastComment;
      throw new Error(
        `Must wait ${(waitTime / 1000 / 60).toFixed(1)} more minutes before next comment`
      );
    }
  }

  /**
   * Close browser
   */
  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
  }
}
