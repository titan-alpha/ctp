import { useState, useCallback } from 'react';

interface StairsCalculatorInput {
  totalRise: number;
  preferredRiserHeight: number;
  preferredTreadDepth: number;
}

interface StairsCalculatorResult {
  riserCount: number;
  actualRiserHeight: number;
  treadDepth: number;
  totalRun: number;
  stairAngle: number;
  isCodeCompliant: boolean;
  complianceIssues: string[];
}

interface UseStairsCalculatorReturn {
  result: StairsCalculatorResult | null;
  calculate: (input: StairsCalculatorInput) => void;
  reset: () => void;
}

// IRC Building Code Requirements
const MIN_RISER_HEIGHT = 4;
const MAX_RISER_HEIGHT = 7.75;
const MIN_TREAD_DEPTH = 10;
const MAX_STAIR_ANGLE = 42;

export function useStairsCalculator(): UseStairsCalculatorReturn {
  const [result, setResult] = useState<StairsCalculatorResult | null>(null);

  const calculate = useCallback((input: StairsCalculatorInput) => {
    const { totalRise, preferredRiserHeight, preferredTreadDepth } = input;

    // Calculate number of risers
    const riserCount = Math.round(totalRise / preferredRiserHeight);
    const actualRiserHeight = totalRise / riserCount;

    // Tread depth (one less tread than risers)
    const treadDepth = preferredTreadDepth;
    const treadCount = riserCount - 1;
    const totalRun = treadCount * treadDepth;

    // Calculate stair angle
    const stairAngle = Math.atan(totalRise / totalRun) * (180 / Math.PI);

    // Check code compliance
    const complianceIssues: string[] = [];

    if (actualRiserHeight < MIN_RISER_HEIGHT) {
      complianceIssues.push(`Riser height (${actualRiserHeight.toFixed(2)}") is below minimum ${MIN_RISER_HEIGHT}"`);
    }
    if (actualRiserHeight > MAX_RISER_HEIGHT) {
      complianceIssues.push(`Riser height (${actualRiserHeight.toFixed(2)}") exceeds maximum ${MAX_RISER_HEIGHT}"`);
    }
    if (treadDepth < MIN_TREAD_DEPTH) {
      complianceIssues.push(`Tread depth (${treadDepth}") is below minimum ${MIN_TREAD_DEPTH}"`);
    }
    if (stairAngle > MAX_STAIR_ANGLE) {
      complianceIssues.push(`Stair angle (${stairAngle.toFixed(1)}°) exceeds maximum ${MAX_STAIR_ANGLE}°`);
    }

    const isCodeCompliant = complianceIssues.length === 0;

    setResult({
      riserCount,
      actualRiserHeight,
      treadDepth,
      totalRun,
      stairAngle,
      isCodeCompliant,
      complianceIssues,
    });
  }, []);

  const reset = useCallback(() => {
    setResult(null);
  }, []);

  return { result, calculate, reset };
}
