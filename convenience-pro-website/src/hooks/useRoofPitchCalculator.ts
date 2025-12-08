import { useState, useCallback } from 'react';

interface RoofPitchCalculatorInput {
  rise: number;
  run: number;
}

interface RoofPitchCalculatorResult {
  pitchRatio: string;
  degrees: number;
  percentage: number;
  risePerFoot: number;
  pitchCategory: string;
}

interface UseRoofPitchCalculatorReturn {
  result: RoofPitchCalculatorResult | null;
  calculate: (input: RoofPitchCalculatorInput) => void;
  reset: () => void;
}

function getPitchCategory(degrees: number): string {
  if (degrees < 10) return 'Low Slope';
  if (degrees < 20) return 'Moderate Slope';
  if (degrees < 35) return 'Standard Slope';
  if (degrees < 45) return 'Steep Slope';
  return 'Very Steep';
}

export function useRoofPitchCalculator(): UseRoofPitchCalculatorReturn {
  const [result, setResult] = useState<RoofPitchCalculatorResult | null>(null);

  const calculate = useCallback((input: RoofPitchCalculatorInput) => {
    const { rise, run } = input;

    if (run === 0) {
      return;
    }

    // Calculate pitch ratio (rise per 12 inches of run)
    const risePerFoot = (rise / run) * 12;
    const pitchRatio = `${risePerFoot.toFixed(1)}:12`;

    // Calculate angle in degrees
    const radians = Math.atan(rise / run);
    const degrees = radians * (180 / Math.PI);

    // Calculate percentage (slope grade)
    const percentage = (rise / run) * 100;

    // Determine pitch category
    const pitchCategory = getPitchCategory(degrees);

    setResult({
      pitchRatio,
      degrees,
      percentage,
      risePerFoot,
      pitchCategory,
    });
  }, []);

  const reset = useCallback(() => {
    setResult(null);
  }, []);

  return { result, calculate, reset };
}
