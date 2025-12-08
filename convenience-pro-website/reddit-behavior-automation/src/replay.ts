/**
 * Reddit Comment Automation - Main Orchestrator
 * Uses synthetic behavioral profiles to post comments with human-like patterns
 * NO CAPTURE REQUIRED - generates behavior from research parameters
 */

import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { generateBehavioralProfile } from './generator/profileGenerator';
import { RedditAutomation, RedditComment } from './replay/redditAutomation';
import { BehavioralDatabase } from './storage/database';

dotenv.config();

const DB_PATH = process.env.DB_PATH || './data/behavioral_data.db';
const REDDIT_USERNAME = process.env.REDDIT_USERNAME || '';
const REDDIT_PASSWORD = process.env.REDDIT_PASSWORD || '';
const COMMENT_QUEUE_PATH = process.env.COMMENT_QUEUE_PATH || '../corporate/marketing/channels/reddit/conversation-analyzer/output/';

// Safety limits from research
const MAX_COMMENTS_PER_HOUR = parseInt(process.env.MAX_COMMENTS_PER_HOUR || '3', 10);
const MAX_COMMENTS_PER_DAY = parseInt(process.env.MAX_COMMENTS_PER_DAY || '15', 10);
const MIN_DELAY_BETWEEN_COMMENTS_MINUTES = parseInt(
  process.env.MIN_DELAY_BETWEEN_COMMENTS_MINUTES || '20',
  10
);

/**
 * Main automation workflow
 */
async function main() {
  console.log('========================================');
  console.log('Reddit Behavioral Automation - Replay Mode');
  console.log('Research-Based Synthetic Behavior');
  console.log('========================================\n');

  // Validate credentials
  if (!REDDIT_USERNAME || !REDDIT_PASSWORD) {
    console.error('❌ Error: REDDIT_USERNAME and REDDIT_PASSWORD must be set in .env');
    process.exit(1);
  }

  // Generate or load behavioral profile
  console.log('Step 1: Generating synthetic behavioral profile...\n');

  const database = new BehavioralDatabase(DB_PATH);
  let profile = database.loadBehavioralProfile('primary-user');

  if (!profile) {
    console.log('No existing profile found. Generating new synthetic profile...');
    profile = generateBehavioralProfile('primary-user');

    // Save profile
    database.saveBehavioralProfile(profile);
    console.log('✓ Profile saved to database\n');
  } else {
    console.log('✓ Loaded existing profile from database\n');
  }

  // Display profile characteristics
  console.log('Profile Characteristics:');
  console.log(`  Typing Speed: ${profile.typingSpeed.mean.toFixed(1)} WPM (±${profile.typingSpeed.stdDev.toFixed(1)})`);
  console.log(`  IKI: ${profile.interKeystrokeInterval.mean.toFixed(0)}ms (±${profile.interKeystrokeInterval.stdDev.toFixed(0)})`);
  console.log(`  Mouse Velocity: ${profile.mouseVelocity.mean.toFixed(0)}px/s`);
  console.log(`  Mouse Jitter: ${profile.mouseJitter.mean.toFixed(2)}px`);
  console.log(`  Correction Rate: ${(profile.correctionRate * 100).toFixed(1)}%`);
  console.log(`  Browser: ${profile.fingerprint.userAgent.split(' ')[0]}`);
  console.log(`  Timezone: ${profile.fingerprint.timezone}`);
  console.log('');

  // Load comment queue
  console.log('Step 2: Loading comment queue...\n');

  const comments = loadCommentQueue(COMMENT_QUEUE_PATH);

  if (comments.length === 0) {
    console.log('❌ No comments in queue. Run the conversation analyzer first.');
    console.log(`   Queue path: ${COMMENT_QUEUE_PATH}`);
    database.close();
    process.exit(0);
  }

  const withMetadata = comments.filter(c => c.behavioralMetadata).length;
  const withoutMetadata = comments.length - withMetadata;

  console.log(`✓ Loaded ${comments.length} comments from queue`);
  console.log(`  - ${withMetadata} with LLM behavioral metadata`);
  console.log(`  - ${withoutMetadata} using generic profile\n`);

  // Initialize automation
  console.log('Step 3: Initializing Reddit automation...\n');

  const automation = new RedditAutomation(profile, {
    username: REDDIT_USERNAME,
    password: REDDIT_PASSWORD,
    maxCommentsPerHour: MAX_COMMENTS_PER_HOUR,
    maxCommentsPerDay: MAX_COMMENTS_PER_DAY,
    minDelayBetweenCommentsMinutes: MIN_DELAY_BETWEEN_COMMENTS_MINUTES,
  });

  await automation.init();
  await automation.login();

  console.log('');

  // Post comments with rate limiting
  console.log('Step 4: Posting comments with human-like behavior...\n');

  let posted = 0;
  const maxToPost = Math.min(comments.length, MAX_COMMENTS_PER_DAY);

  for (let i = 0; i < maxToPost; i++) {
    const comment = comments[i];

    try {
      console.log(`\n[${i + 1}/${maxToPost}] Posting comment...`);
      await automation.postComment(comment);
      posted++;

      // Calculate next delay based on rate limits
      if (i < maxToPost - 1) {
        const delayMinutes = MIN_DELAY_BETWEEN_COMMENTS_MINUTES + Math.random() * 5; // Add 0-5 min variance
        console.log(`\n⏱  Waiting ${delayMinutes.toFixed(1)} minutes before next comment...`);
        await new Promise(resolve => setTimeout(resolve, delayMinutes * 60 * 1000));
      }
    } catch (error) {
      console.error(`\n❌ Error posting comment: ${(error as Error).message}`);

      // If rate limit error, stop
      if ((error as Error).message.includes('limit')) {
        break;
      }
    }
  }

  // Cleanup
  await automation.close();
  database.close();

  console.log('\n========================================');
  console.log('Summary');
  console.log('========================================');
  console.log(`Comments posted: ${posted}/${maxToPost}`);
  console.log(`Rate limits: ${MAX_COMMENTS_PER_HOUR}/hour, ${MAX_COMMENTS_PER_DAY}/day`);
  console.log(`Profile used: ${profile.userId}`);
  console.log('========================================\n');
}

/**
 * Load comments from the conversation analyzer output directory
 */
function loadCommentQueue(queuePath: string): RedditComment[] {
  const comments: RedditComment[] = [];

  // Check if path exists
  const fullPath = path.resolve(__dirname, '..', queuePath);

  if (!fs.existsSync(fullPath)) {
    console.log(`Comment queue path does not exist: ${fullPath}`);
    return comments;
  }

  // Read promotional comments (with product mentions)
  const promotionalPath = path.join(fullPath, '.');
  if (fs.existsSync(promotionalPath)) {
    const files = fs.readdirSync(promotionalPath)
      .filter(f => f.startsWith('promotional_') && f.endsWith('.json'));

    for (const file of files) {
      try {
        const data = JSON.parse(fs.readFileSync(path.join(promotionalPath, file), 'utf-8'));

        // Extract behavioral metadata if present
        const behavioralMetadata = data.suggestedResponse?.behavioralMetadata || data.behavioralMetadata;

        const comment: RedditComment = {
          postUrl: data.post?.url || data.postUrl || `https://reddit.com${data.post?.permalink || ''}`,
          commentText: data.suggestedResponse?.responseText || data.suggestedComment || data.responseText,
        };

        // Add metadata if it exists
        if (behavioralMetadata) {
          comment.behavioralMetadata = behavioralMetadata;
          console.log(`  ✓ Loaded comment with LLM behavioral metadata: ${file}`);
        } else {
          console.log(`  ○ Loaded comment (no metadata, will use generic profile): ${file}`);
        }

        comments.push(comment);
      } catch (error) {
        console.error(`Error reading ${file}:`, error);
      }
    }
  }

  // Optionally load helpful comments too
  const helpfulPath = path.join(fullPath, 'helpful');
  if (fs.existsSync(helpfulPath)) {
    const files = fs.readdirSync(helpfulPath)
      .filter(f => f.startsWith('helpful_') && f.endsWith('.json'))
      .slice(0, 10); // Limit helpful comments

    for (const file of files) {
      try {
        const data = JSON.parse(fs.readFileSync(path.join(helpfulPath, file), 'utf-8'));

        // Extract behavioral metadata if present
        const behavioralMetadata = data.suggestedResponse?.behavioralMetadata || data.behavioralMetadata;

        const comment: RedditComment = {
          postUrl: data.post?.url || data.postUrl || `https://reddit.com${data.post?.permalink || ''}`,
          commentText: data.suggestedResponse?.responseText || data.suggestedComment || data.responseText,
        };

        // Add metadata if it exists
        if (behavioralMetadata) {
          comment.behavioralMetadata = behavioralMetadata;
          console.log(`  ✓ Loaded comment with LLM behavioral metadata: ${file}`);
        } else {
          console.log(`  ○ Loaded comment (no metadata, will use generic profile): ${file}`);
        }

        comments.push(comment);
      } catch (error) {
        console.error(`Error reading ${file}:`, error);
      }
    }
  }

  return comments;
}

// Run if executed directly
if (require.main === module) {
  main().catch((error) => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  });
}
