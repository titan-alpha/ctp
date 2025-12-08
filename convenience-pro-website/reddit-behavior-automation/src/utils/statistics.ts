/**
 * Statistical distribution utilities
 * Based on research findings from RESEARCH_FINDINGS.md
 */

import { StatisticalDistribution } from '../types/behavioral';

/**
 * Box-Muller transform for generating Gaussian (normal) random numbers
 */
export function gaussianRandom(mean: number, stdDev: number): number {
  const u1 = Math.random();
  const u2 = Math.random();
  const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return mean + stdDev * z0;
}

/**
 * Generate log-normal distributed random number
 * Used for timing intervals (IKI, session duration, etc.)
 */
export function logNormalRandom(mean: number, stdDev: number): number {
  const variance = stdDev * stdDev;
  const meanSquared = mean * mean;
  const mu = Math.log(mean) - 0.5 * Math.log(1 + variance / meanSquared);
  const sigma = Math.sqrt(Math.log(1 + variance / meanSquared));
  return Math.exp(gaussianRandom(mu, sigma));
}

/**
 * Generate gamma distributed random number
 * Used for pause durations and dwell times
 */
export function gammaRandom(shape: number, scale: number): number {
  // Using Marsaglia and Tsang's method
  if (shape < 1) {
    return gammaRandom(shape + 1, scale) * Math.pow(Math.random(), 1 / shape);
  }

  const d = shape - 1 / 3;
  const c = 1 / Math.sqrt(9 * d);

  while (true) {
    let x: number;
    let v: number;

    do {
      x = gaussianRandom(0, 1);
      v = 1 + c * x;
    } while (v <= 0);

    v = v * v * v;
    const u = Math.random();

    if (u < 1 - 0.0331 * x * x * x * x) {
      return d * v * scale;
    }

    if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) {
      return d * v * scale;
    }
  }
}

/**
 * Generate Poisson distributed random number
 * Used for event counts
 */
export function poissonRandom(lambda: number): number {
  const L = Math.exp(-lambda);
  let k = 0;
  let p = 1;

  do {
    k++;
    p *= Math.random();
  } while (p > L);

  return k - 1;
}

/**
 * Sample from a statistical distribution
 */
export function sampleDistribution(dist: StatisticalDistribution): number {
  let value: number;

  switch (dist.distributionType) {
    case 'gaussian':
      value = gaussianRandom(dist.mean, dist.stdDev);
      break;

    case 'log-normal':
      value = logNormalRandom(dist.mean, dist.stdDev);
      break;

    case 'gamma':
      // Convert mean/stdDev to shape/scale for gamma distribution
      const scale = (dist.stdDev * dist.stdDev) / dist.mean;
      const shape = dist.mean / scale;
      value = gammaRandom(shape, scale);
      break;

    case 'poisson':
      value = poissonRandom(dist.mean);
      break;

    default:
      value = gaussianRandom(dist.mean, dist.stdDev);
  }

  // Clamp to min/max bounds
  return Math.max(dist.min, Math.min(dist.max, value));
}

/**
 * Calculate statistics from a sample array
 */
export function calculateDistribution(
  samples: number[],
  distributionType: StatisticalDistribution['distributionType'] = 'gaussian'
): StatisticalDistribution {
  if (samples.length === 0) {
    throw new Error('Cannot calculate distribution from empty sample array');
  }

  const mean = samples.reduce((sum, val) => sum + val, 0) / samples.length;

  const variance =
    samples.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
    samples.length;
  const stdDev = Math.sqrt(variance);

  const min = Math.min(...samples);
  const max = Math.max(...samples);

  return {
    mean,
    stdDev,
    min,
    max,
    distributionType,
  };
}

/**
 * Weighted random choice from array
 */
export function weightedChoice<T>(
  choices: T[],
  weights: number[]
): T {
  if (choices.length !== weights.length) {
    throw new Error('Choices and weights arrays must have same length');
  }

  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  let random = Math.random() * totalWeight;

  for (let i = 0; i < choices.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return choices[i];
    }
  }

  return choices[choices.length - 1];
}

/**
 * Add jitter to a value based on amplitude
 */
export function addJitter(value: number, amplitude: number): number {
  return value + gaussianRandom(0, amplitude);
}

/**
 * Clamp value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
