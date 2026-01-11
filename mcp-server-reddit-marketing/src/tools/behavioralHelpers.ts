/**
 * Tools: get_typing_instructions, get_mouse_workflow_instructions
 *
 * Converts behavioral metadata into step-by-step instructions
 * that Claude can follow for human-like behavior execution.
 */

import type {
  TypingInstruction,
  MouseWorkflowInstruction,
  TypingInstructionsResult,
  MouseInstructionsResult,
} from '../types/index.js';

/**
 * Convert behavioral metadata to typing instructions
 */
export async function getTypingInstructions(
  behavioralMetadata: any
): Promise<TypingInstructionsResult> {
  if (!behavioralMetadata || !behavioralMetadata.typing) {
    throw new Error('No behavioral metadata provided');
  }

  const { typing } = behavioralMetadata;
  const instructions: TypingInstruction[] = [];
  let currentStep = 0;
  let estimatedDuration = 0;

  // Base typing speed
  const baseSpeed = typing.baseSpeed.wpm;
  const msPerChar = (60 / baseSpeed / 5) * 1000; // Average word length of 5 chars

  // Process each segment
  for (const segment of typing.segments) {
    const segmentDuration = segment.text.length * msPerChar * segment.speedModifier;
    estimatedDuration += segmentDuration;

    instructions.push({
      step: currentStep++,
      action: 'type',
      text: segment.text,
      duration: segmentDuration,
      rationale: segment.rationale,
    });
  }

  // Insert corrections at appropriate positions
  for (const correction of typing.corrections) {
    const insertionPoint = instructions.findIndex((inst, idx) => {
      let charCount = 0;
      for (let i = 0; i <= idx; i++) {
        if (instructions[i].text) {
          charCount += instructions[i].text!.length;
        }
      }
      return charCount > correction.position;
    });

    if (insertionPoint !== -1) {
      // Add recognition delay (pause before correcting)
      instructions.splice(insertionPoint, 0, {
        step: currentStep++,
        action: 'pause',
        duration: correction.recognitionDelay,
        rationale: `Recognizing typo: ${correction.rationale}`,
      });

      // Add correction action
      instructions.splice(insertionPoint + 1, 0, {
        step: currentStep++,
        action: 'correct',
        text: `Delete "${correction.originalText}" and type "${correction.correctedText}"`,
        duration: correction.correctionDelay,
        rationale: correction.rationale,
      });

      estimatedDuration += correction.recognitionDelay + correction.correctionDelay;
    }
  }

  // Insert thinking pauses
  for (const pause of typing.thinkingPauses) {
    const insertionPoint = instructions.findIndex((inst, idx) => {
      let charCount = 0;
      for (let i = 0; i <= idx; i++) {
        if (instructions[i].text) {
          charCount += instructions[i].text!.length;
        }
      }
      return charCount >= pause.position;
    });

    if (insertionPoint !== -1) {
      instructions.splice(insertionPoint, 0, {
        step: currentStep++,
        action: 'pause',
        duration: pause.duration,
        rationale: pause.rationale,
      });

      estimatedDuration += pause.duration;
    }
  }

  // Insert hesitations
  for (const hesitation of typing.hesitations) {
    const insertionPoint = instructions.findIndex((inst, idx) => {
      let charCount = 0;
      for (let i = 0; i <= idx; i++) {
        if (instructions[i].text) {
          charCount += instructions[i].text!.length;
        }
      }
      return charCount >= hesitation.wordStart && charCount < hesitation.wordEnd;
    });

    if (insertionPoint !== -1 && instructions[insertionPoint].action === 'type') {
      instructions[insertionPoint] = {
        ...instructions[insertionPoint],
        action: 'hesitate',
        rationale: hesitation.rationale,
      };

      // Adjust duration for slowdown
      if (instructions[insertionPoint].duration) {
        const originalDuration = instructions[insertionPoint].duration!;
        instructions[insertionPoint].duration = originalDuration / hesitation.slowdownFactor;
        estimatedDuration += originalDuration * (1 - hesitation.slowdownFactor);
      }
    }
  }

  // Re-number steps
  instructions.forEach((inst, idx) => {
    inst.step = idx;
  });

  return {
    instructions,
    estimatedDuration,
    baseSpeed,
  };
}

/**
 * Convert mouse workflow to browser action instructions
 */
export async function getMouseWorkflowInstructions(
  behavioralMetadata: any
): Promise<MouseInstructionsResult> {
  if (!behavioralMetadata || !behavioralMetadata.mouseWorkflow) {
    throw new Error('No mouse workflow metadata provided');
  }

  const { mouseWorkflow } = behavioralMetadata;
  const instructions: MouseWorkflowInstruction[] = [];
  let estimatedDuration = 0;

  for (let i = 0; i < mouseWorkflow.length; i++) {
    const step = mouseWorkflow[i];

    instructions.push({
      step: i,
      action: step.action,
      target: step.target || undefined,
      duration: step.duration,
      rationale: step.rationale,
    });

    estimatedDuration += step.duration;
  }

  return {
    instructions,
    estimatedDuration,
  };
}

/**
 * Convert typing instructions to natural language steps for Claude
 */
export function formatTypingInstructionsForClaude(
  instructions: TypingInstruction[]
): string {
  const steps = instructions.map(inst => {
    switch (inst.action) {
      case 'type':
        return `Step ${inst.step + 1}: Type "${inst.text}" (${Math.round(inst.duration! / 1000)}s) - ${inst.rationale}`;
      case 'pause':
        return `Step ${inst.step + 1}: Pause for ${Math.round(inst.duration! / 1000)}s - ${inst.rationale}`;
      case 'correct':
        return `Step ${inst.step + 1}: Correct typo (${Math.round(inst.duration! / 1000)}s) - ${inst.text} - ${inst.rationale}`;
      case 'hesitate':
        return `Step ${inst.step + 1}: Type slowly "${inst.text}" (${Math.round(inst.duration! / 1000)}s) - ${inst.rationale}`;
      default:
        return `Step ${inst.step + 1}: ${inst.action}`;
    }
  });

  return steps.join('\n');
}

/**
 * Convert mouse workflow instructions to natural language steps for Claude
 */
export function formatMouseInstructionsForClaude(
  instructions: MouseWorkflowInstruction[]
): string {
  const steps = instructions.map(inst => {
    const targetInfo = inst.target ? ` on "${inst.target}"` : '';
    return `Step ${inst.step + 1}: ${inst.action}${targetInfo} (${Math.round(inst.duration / 1000)}s) - ${inst.rationale}`;
  });

  return steps.join('\n');
}

/**
 * Validate behavioral metadata structure
 */
export function validateBehavioralMetadata(metadata: any): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!metadata) {
    errors.push('Metadata is null or undefined');
    return { valid: false, errors };
  }

  // Check typing behavior
  if (!metadata.typing) {
    errors.push('Missing typing behavior');
  } else {
    if (!metadata.typing.baseSpeed) {
      errors.push('Missing baseSpeed in typing behavior');
    }
    if (!Array.isArray(metadata.typing.segments)) {
      errors.push('Missing or invalid segments in typing behavior');
    }
    if (!Array.isArray(metadata.typing.corrections)) {
      errors.push('Missing or invalid corrections in typing behavior');
    }
    if (!Array.isArray(metadata.typing.thinkingPauses)) {
      errors.push('Missing or invalid thinkingPauses in typing behavior');
    }
    if (!Array.isArray(metadata.typing.hesitations)) {
      errors.push('Missing or invalid hesitations in typing behavior');
    }
  }

  // Check session context
  if (!metadata.session) {
    errors.push('Missing session context');
  } else {
    if (!metadata.session.emotionalTone) {
      errors.push('Missing emotionalTone in session context');
    }
    if (!metadata.session.engagementLevel) {
      errors.push('Missing engagementLevel in session context');
    }
    if (!metadata.session.behaviorImpact) {
      errors.push('Missing behaviorImpact in session context');
    }
  }

  // Check mouse workflow
  if (!Array.isArray(metadata.mouseWorkflow)) {
    errors.push('Missing or invalid mouseWorkflow');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
