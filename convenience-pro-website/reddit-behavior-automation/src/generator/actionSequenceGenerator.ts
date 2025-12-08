/**
 * HMM-based Action Sequence Generator
 * Generates realistic action sequences using Hidden Markov Model
 * Based on research from HPE Labs and Frontiers research
 */

import { RedditActionState, ActionSequence, BehavioralProfile } from '../types/behavioral';
import { sampleDistribution, weightedChoice } from '../utils/statistics';

/**
 * Generate a realistic action sequence for a Reddit session
 * Uses HMM state transitions from research
 */
export function generateActionSequence(
  profile: BehavioralProfile,
  sessionId: string,
  targetAction: 'comment' | 'browse' = 'browse'
): ActionSequence[] {
  const sequence: ActionSequence[] = [];
  let currentState: RedditActionState = 'browsing';
  let currentTime = Date.now();

  const maxActions = 50; // Safety limit
  let actionCount = 0;

  while (actionCount < maxActions) {
    // Sample duration for current state
    const stateDuration = profile.stateDurations[currentState];
    const duration = sampleDistribution(stateDuration) * 1000; // Convert to ms

    // Record action
    sequence.push({
      sessionId,
      timestamp: currentTime,
      state: currentState,
      duration,
    });

    currentTime += duration;
    actionCount++;

    // Determine next state based on HMM transitions
    const nextState = transitionState(currentState, profile, targetAction);

    // Update sequence with next state info
    sequence[sequence.length - 1].nextState = nextState;

    // Exit conditions
    if (nextState === 'exit') {
      break;
    }

    // If we're targeting a comment and just submitted, we're done
    if (targetAction === 'comment' && currentState === 'submitting') {
      break;
    }

    currentState = nextState;
  }

  return sequence;
}

/**
 * Transition to next state based on HMM probabilities
 */
function transitionState(
  currentState: RedditActionState,
  profile: BehavioralProfile,
  targetAction: 'comment' | 'browse'
): RedditActionState {
  const transitions = profile.stateTransitions[currentState];

  if (!transitions) {
    return 'browsing'; // Default fallback
  }

  // If we're trying to post a comment, bias toward composing path
  let adjustedTransitions = { ...transitions };

  if (targetAction === 'comment') {
    // Increase probability of moving toward composing
    if (currentState === 'reading') {
      adjustedTransitions = {
        ...transitions,
        considering: (transitions.considering || 0) * 1.5,
        browsing: (transitions.browsing || 0) * 0.5,
      };
    } else if (currentState === 'considering') {
      adjustedTransitions = {
        ...transitions,
        composing: (transitions.composing || 0) * 2.0,
        browsing: (transitions.browsing || 0) * 0.3,
      };
    }
  }

  // Normalize probabilities
  const total = Object.values(adjustedTransitions).reduce((sum, p) => sum + p, 0);
  const normalizedTransitions = Object.fromEntries(
    Object.entries(adjustedTransitions).map(([state, prob]) => [state, prob / total])
  );

  // Sample next state
  const states = Object.keys(normalizedTransitions) as RedditActionState[];
  const probabilities = Object.values(normalizedTransitions);

  return weightedChoice(states, probabilities);
}

/**
 * Generate a comment posting sequence
 * Returns sequence from browsing to submitting
 */
export function generateCommentSequence(
  profile: BehavioralProfile,
  sessionId: string
): ActionSequence[] {
  return generateActionSequence(profile, sessionId, 'comment');
}

/**
 * Calculate total time for sequence
 */
export function calculateSequenceDuration(sequence: ActionSequence[]): number {
  return sequence.reduce((total, action) => total + action.duration, 0);
}

/**
 * Get actions by state type
 */
export function filterActionsByState(
  sequence: ActionSequence[],
  state: RedditActionState
): ActionSequence[] {
  return sequence.filter(action => action.state === state);
}
