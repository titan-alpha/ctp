/**
 * Bezier curve utilities for human-like mouse movement
 * Based on research from RESEARCH_FINDINGS.md
 */

import BezierEasing from 'bezier-easing';
import { gaussianRandom, addJitter } from './statistics';

export interface Point {
  x: number;
  y: number;
}

export interface BezierPath {
  points: Point[];
  timestamps: number[];
  velocities: number[];
}

/**
 * Generate human-like mouse movement path using Bezier curves
 * Based on research: https://github.com/sarperavci/human_mouse
 */
export function generateMousePath(
  start: Point,
  end: Point,
  options: {
    duration?: number; // ms
    samplingRate?: number; // Hz (default: 60)
    jitterAmplitude?: number; // pixels (default: 2-3)
    controlPointOffset?: { min: number; max: number }; // 0.2-0.4 of distance
  } = {}
): BezierPath {
  const {
    duration = calculateMovementDuration(start, end),
    samplingRate = 60,
    jitterAmplitude = 2.5,
    controlPointOffset = { min: 0.2, max: 0.4 },
  } = options;

  // Calculate control points with randomization
  const distance = Math.sqrt(
    Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
  );

  // Random offset for control points (20-40% of distance)
  const offsetRatio =
    controlPointOffset.min +
    Math.random() * (controlPointOffset.max - controlPointOffset.min);
  const offset = distance * offsetRatio;

  // Control point 1: offset perpendicular to line
  const angle = Math.atan2(end.y - start.y, end.x - start.x);
  const perpAngle = angle + Math.PI / 2;
  const cp1Offset = (Math.random() - 0.5) * offset;

  const cp1 = {
    x: start.x + (end.x - start.x) * 0.33 + Math.cos(perpAngle) * cp1Offset,
    y: start.y + (end.y - start.y) * 0.33 + Math.sin(perpAngle) * cp1Offset,
  };

  // Control point 2: offset in opposite direction
  const cp2Offset = (Math.random() - 0.5) * offset;

  const cp2 = {
    x: start.x + (end.x - start.x) * 0.67 + Math.cos(perpAngle) * cp2Offset,
    y: start.y + (end.y - start.y) * 0.67 + Math.sin(perpAngle) * cp2Offset,
  };

  // Generate velocity profile using Fitts's Law
  // Peak velocity at ~50% of movement, acceleration/deceleration phases
  const easing = BezierEasing(0.25, 0.1, 0.25, 1.0); // Ease-in-out

  // Sample points along the curve
  const numSamples = Math.ceil((duration / 1000) * samplingRate);
  const points: Point[] = [];
  const timestamps: number[] = [];
  const velocities: number[] = [];

  for (let i = 0; i <= numSamples; i++) {
    const t = i / numSamples;
    const easedT = easing(t);

    // Cubic Bezier curve formula
    const point = cubicBezier(start, cp1, cp2, end, easedT);

    // Add natural jitter
    point.x = addJitter(point.x, jitterAmplitude);
    point.y = addJitter(point.y, jitterAmplitude);

    points.push(point);
    timestamps.push((duration / numSamples) * i);

    // Calculate velocity
    if (i > 0) {
      const dx = point.x - points[i - 1].x;
      const dy = point.y - points[i - 1].y;
      const dt = (timestamps[i] - timestamps[i - 1]) / 1000; // Convert to seconds
      const velocity = Math.sqrt(dx * dx + dy * dy) / dt; // pixels/second
      velocities.push(velocity);
    } else {
      velocities.push(0);
    }
  }

  return { points, timestamps, velocities };
}

/**
 * Cubic Bezier curve calculation
 */
function cubicBezier(
  p0: Point,
  p1: Point,
  p2: Point,
  p3: Point,
  t: number
): Point {
  const oneMinusT = 1 - t;
  const oneMinusTSquared = oneMinusT * oneMinusT;
  const oneMinusTCubed = oneMinusTSquared * oneMinusT;
  const tSquared = t * t;
  const tCubed = tSquared * t;

  return {
    x:
      oneMinusTCubed * p0.x +
      3 * oneMinusTSquared * t * p1.x +
      3 * oneMinusT * tSquared * p2.x +
      tCubed * p3.x,
    y:
      oneMinusTCubed * p0.y +
      3 * oneMinusTSquared * t * p1.y +
      3 * oneMinusT * tSquared * p2.y +
      tCubed * p3.y,
  };
}

/**
 * Calculate movement duration based on Fitts's Law
 * MT = a + b * log2(D/W + 1)
 * Where D = distance, W = target width
 */
function calculateMovementDuration(start: Point, end: Point): number {
  const distance = Math.sqrt(
    Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
  );

  // Fitts's Law constants (empirically derived)
  const a = 50; // Base time (ms)
  const b = 150; // Sensitivity to distance/width ratio

  // Assume target width of 50 pixels (typical button/link)
  const targetWidth = 50;

  // Fitts's Law calculation
  const indexOfDifficulty = Math.log2(distance / targetWidth + 1);
  const movementTime = a + b * indexOfDifficulty;

  // Add some randomness (±15%)
  const randomFactor = 0.85 + Math.random() * 0.3;
  return movementTime * randomFactor;
}

/**
 * Generate click offset from element center
 * Based on research: Gaussian distribution, ~8% of element size
 */
export function generateClickOffset(elementSize: {
  width: number;
  height: number;
}): Point {
  const stdDevX = elementSize.width * 0.08;
  const stdDevY = elementSize.height * 0.08;

  return {
    x: gaussianRandom(0, stdDevX),
    y: gaussianRandom(0, stdDevY),
  };
}

/**
 * Add overshoot and correction to mouse movement
 * Human users often overshoot targets slightly before correcting
 */
export function addOvershoot(
  path: BezierPath,
  target: Point,
  probability: number = 0.3
): BezierPath {
  if (Math.random() > probability) {
    return path; // No overshoot
  }

  const { points, timestamps, velocities } = path;

  // Overshoot distance: 5-15% of final approach distance
  const overshootDistance = 5 + Math.random() * 10;
  const lastPoint = points[points.length - 1];
  const angle = Math.atan2(target.y - lastPoint.y, target.x - lastPoint.x);

  // Overshoot point
  const overshootPoint = {
    x: target.x + Math.cos(angle) * overshootDistance,
    y: target.y + Math.sin(angle) * overshootDistance,
  };

  // Generate correction path (quick, 100-200ms)
  const correctionDuration = 100 + Math.random() * 100;
  const correctionPath = generateMousePath(overshootPoint, target, {
    duration: correctionDuration,
    samplingRate: 60,
    jitterAmplitude: 1.5, // Less jitter on correction
  });

  // Append correction to original path
  const lastTimestamp = timestamps[timestamps.length - 1];

  return {
    points: [
      ...points,
      overshootPoint,
      ...correctionPath.points.slice(1), // Skip duplicate start point
    ],
    timestamps: [
      ...timestamps,
      lastTimestamp + 20, // Brief pause before correction
      ...correctionPath.timestamps
        .slice(1)
        .map((t) => t + lastTimestamp + 20),
    ],
    velocities: [...velocities, 0, ...correctionPath.velocities.slice(1)],
  };
}
