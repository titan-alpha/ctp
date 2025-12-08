/**
 * Synthetic Behavioral Profile Generator
 * Generates human-like behavioral profiles from research parameters
 * No capture required - uses statistical distributions from RESEARCH_FINDINGS.md
 */

import { BehavioralProfile, StatisticalDistribution, BrowserFingerprint } from '../types/behavioral';
import { gaussianRandom, logNormalRandom } from '../utils/statistics';

/**
 * Generate a synthetic behavioral profile based on research
 * Source: RESEARCH_FINDINGS.md - 30+ academic sources
 */
export function generateBehavioralProfile(userId: string = 'synthetic-user'): BehavioralProfile {
  const now = Date.now();

  // Typing characteristics from 136M keystroke study (Aalto)
  const typingSpeed: StatisticalDistribution = {
    mean: gaussianRandom(55, 8), // 40-60 WPM average, moderate skilled
    stdDev: 8,
    min: 35,
    max: 75,
    distributionType: 'gaussian',
  };

  // Inter-keystroke interval (IKI) from research
  const interKeystrokeInterval: StatisticalDistribution = {
    mean: gaussianRandom(150, 20), // ~150ms mean from research
    stdDev: 40,
    min: 40, // Fastest possible
    max: 500, // Before it becomes a "pause"
    distributionType: 'log-normal', // Natural timing follows log-normal
  };

  // Dwell time (key hold duration) from research
  const dwellTime: StatisticalDistribution = {
    mean: gaussianRandom(70, 10), // ~70ms mean
    stdDev: 20,
    min: 30,
    max: 150,
    distributionType: 'gamma', // Physical key press follows gamma
  };

  // Correction rate from research (3% of characters)
  const correctionRate = 0.03 + gaussianRandom(0, 0.01); // 3% ± 1%

  // Mouse velocity from research (pixels/second)
  const mouseVelocity: StatisticalDistribution = {
    mean: gaussianRandom(850, 100), // Average velocity from research
    stdDev: 200,
    min: 100,
    max: 3200, // Max velocity observed
    distributionType: 'gaussian',
  };

  // Mouse jitter from BeCAPTCHA-Mouse research
  const mouseJitter: StatisticalDistribution = {
    mean: gaussianRandom(2.5, 0.3), // 2-3 pixels during movement
    stdDev: 0.5,
    min: 1,
    max: 5,
    distributionType: 'gaussian',
  };

  // Click precision from research (8% of element size, Gaussian)
  const clickPrecision: StatisticalDistribution = {
    mean: 0.08, // 8% offset from center
    stdDev: 0.03,
    min: 0,
    max: 0.2,
    distributionType: 'gaussian',
  };

  // Trajectory complexity (Bezier control point randomness)
  const trajectoryComplexity = 0.2 + Math.random() * 0.2; // 20-40% offset

  // Session duration from chain-of-thought reasoning
  const sessionDuration: StatisticalDistribution = {
    mean: gaussianRandom(1200, 300), // 20 minutes ± 5 min
    stdDev: 600, // 10 min variance
    min: 180, // 3 min minimum
    max: 7200, // 2 hours maximum
    distributionType: 'log-normal',
  };

  // Time of day distribution (24-hour, realistic human pattern)
  const timeOfDayDistribution = generateTimeOfDayDistribution();

  // Day of week distribution (7-day, slightly higher on weekdays)
  const dayOfWeekDistribution = [0.14, 0.15, 0.15, 0.15, 0.15, 0.13, 0.13]; // Mon-Sun

  // HMM state transitions from HPE Labs research
  const stateTransitions = {
    browsing: { browsing: 0.70, reading: 0.25, exit: 0.05 },
    reading: { browsing: 0.40, considering: 0.35, reading: 0.20, exit: 0.05 },
    considering: { browsing: 0.30, reading: 0.20, composing: 0.45, exit: 0.05 },
    composing: { composing: 0.70, reviewing: 0.25, exit: 0.05 },
    reviewing: { composing: 0.40, submitting: 0.50, browsing: 0.10 },
    submitting: { browsing: 0.80, exit: 0.20 },
  };

  // State durations from research (seconds)
  const stateDurations = {
    browsing: { mean: 30, stdDev: 15, min: 5, max: 120, distributionType: 'log-normal' as const },
    reading: { mean: 45, stdDev: 20, min: 10, max: 180, distributionType: 'log-normal' as const },
    considering: { mean: 15, stdDev: 10, min: 3, max: 60, distributionType: 'gamma' as const },
    composing: { mean: 90, stdDev: 40, min: 20, max: 300, distributionType: 'log-normal' as const },
    reviewing: { mean: 20, stdDev: 10, min: 5, max: 60, distributionType: 'gamma' as const },
    submitting: { mean: 5, stdDev: 2, min: 1, max: 15, distributionType: 'gamma' as const },
  };

  // Browser fingerprint (consistent, realistic)
  const fingerprint = generateBrowserFingerprint();

  return {
    userId,
    createdAt: now,
    lastUpdated: now,
    typingSpeed,
    interKeystrokeInterval,
    dwellTime,
    correctionRate,
    mouseVelocity,
    mouseJitter,
    clickPrecision,
    trajectoryComplexity,
    sessionDuration,
    timeOfDayDistribution,
    dayOfWeekDistribution,
    stateTransitions,
    stateDurations,
    fingerprint,
  };
}

/**
 * Generate realistic time-of-day distribution
 * Peak activity: 9am-11am, 2pm-5pm, 7pm-10pm
 * Low activity: 12am-6am
 */
function generateTimeOfDayDistribution(): number[] {
  const distribution = new Array(24).fill(0);

  // Night (12am-6am): Low activity
  for (let i = 0; i < 6; i++) {
    distribution[i] = 0.01 + Math.random() * 0.01; // 1-2%
  }

  // Morning (6am-9am): Ramping up
  for (let i = 6; i < 9; i++) {
    distribution[i] = 0.03 + Math.random() * 0.02; // 3-5%
  }

  // Peak morning (9am-12pm): High activity
  for (let i = 9; i < 12; i++) {
    distribution[i] = 0.06 + Math.random() * 0.02; // 6-8%
  }

  // Lunch dip (12pm-2pm): Moderate
  for (let i = 12; i < 14; i++) {
    distribution[i] = 0.04 + Math.random() * 0.01; // 4-5%
  }

  // Afternoon peak (2pm-5pm): High activity
  for (let i = 14; i < 17; i++) {
    distribution[i] = 0.06 + Math.random() * 0.02; // 6-8%
  }

  // Evening (5pm-7pm): Moderate
  for (let i = 17; i < 19; i++) {
    distribution[i] = 0.05 + Math.random() * 0.01; // 5-6%
  }

  // Night peak (7pm-10pm): High activity
  for (let i = 19; i < 22; i++) {
    distribution[i] = 0.06 + Math.random() * 0.02; // 6-8%
  }

  // Late night (10pm-12am): Declining
  for (let i = 22; i < 24; i++) {
    distribution[i] = 0.03 + Math.random() * 0.02; // 3-5%
  }

  // Normalize to sum to 1.0
  const sum = distribution.reduce((a, b) => a + b, 0);
  return distribution.map(v => v / sum);
}

/**
 * Generate consistent browser fingerprint
 * Based on EFF 2024 research on browser fingerprinting
 */
function generateBrowserFingerprint(): BrowserFingerprint {
  // Common macOS configurations
  const userAgents = [
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
  ];

  const resolutions = [
    { width: 1920, height: 1080 },
    { width: 2560, height: 1440 },
    { width: 1440, height: 900 },
    { width: 3840, height: 2160 },
  ];

  const timezones = [
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'America/Toronto',
  ];

  return {
    userAgent: userAgents[Math.floor(Math.random() * userAgents.length)],
    screenResolution: resolutions[Math.floor(Math.random() * resolutions.length)],
    timezone: timezones[Math.floor(Math.random() * timezones.length)],
    language: 'en-US',
    platform: 'MacIntel',
    colorDepth: 24,
    pixelRatio: Math.random() < 0.5 ? 1 : 2, // 50% retina, 50% standard
    fonts: [
      'Arial',
      'Helvetica',
      'Times New Roman',
      'Courier New',
      'Georgia',
      'Verdana',
    ],
    plugins: [], // Modern browsers hide plugins
  };
}

/**
 * Generate multiple profiles with variation
 */
export function generateProfileVariants(count: number, baseUserId: string = 'user'): BehavioralProfile[] {
  const profiles: BehavioralProfile[] = [];

  for (let i = 0; i < count; i++) {
    const profile = generateBehavioralProfile(`${baseUserId}-${i + 1}`);
    profiles.push(profile);
  }

  return profiles;
}
