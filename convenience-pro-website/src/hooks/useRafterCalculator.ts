import { useState, useCallback } from 'react';

interface RafterCalculatorInput {
  span: number;
  pitch: number;
}

interface RafterCalculatorResult {
  rafterLength: number;
  rise: number;
  run: number;
  pitchAngle: number;
}

interface UseRafterCalculatorReturn {
  result: RafterCalculatorResult | null;
  calculate: (input: RafterCalculatorInput) => void;
  reset: () => void;
}

export function useRafterCalculator(): UseRafterCalculatorReturn {
  const [result, setResult] = useState<RafterCalculatorResult | null>(null);

  const calculate = useCallback((input: RafterCalculatorInput) => {
    const { span, pitch } = input;

    // Run is half the span (from center ridge to wall)
    const run = span / 2;

    // Pitch is typically expressed as rise per 12 inches of run (e.g., 4:12)
    // Rise = run * (pitch / 12)
    const rise = run * (pitch / 12);

    // Rafter length using Pythagorean theorem
    const rafterLength = Math.sqrt(run * run + rise * rise);

    // Calculate pitch angle in degrees
    const pitchAngle = Math.atan(pitch / 12) * (180 / Math.PI);

    setResult({
      rafterLength,
      rise,
      run,
      pitchAngle,
    });
  }, []);

  const reset = useCallback(() => {
    setResult(null);
  }, []);

  return { result, calculate, reset };
}
