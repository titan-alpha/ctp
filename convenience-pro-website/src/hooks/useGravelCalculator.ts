import { useState, useCallback } from 'react';

interface GravelCalculatorInput {
  length: number;
  width: number;
  depth: number;
  unit: 'imperial' | 'metric';
}

interface GravelCalculatorResult {
  cubicFeet: number;
  cubicYards: number;
  cubicMeters: number;
  tons: number;
  pounds: number;
}

interface UseGravelCalculatorReturn {
  result: GravelCalculatorResult | null;
  calculate: (input: GravelCalculatorInput) => void;
  reset: () => void;
}

// Conversion factors
const CUBIC_FEET_PER_YARD = 27;
const CUBIC_FEET_PER_METER = 35.3147;

// Gravel weight: approximately 2,800 lbs per cubic yard (varies by type)
const POUNDS_PER_CUBIC_YARD = 2800;
const POUNDS_PER_TON = 2000;

export function useGravelCalculator(): UseGravelCalculatorReturn {
  const [result, setResult] = useState<GravelCalculatorResult | null>(null);

  const calculate = useCallback((input: GravelCalculatorInput) => {
    const { length, width, depth, unit } = input;

    let cubicFeet: number;

    if (unit === 'imperial') {
      // Inputs are in feet, depth in inches - convert depth to feet
      cubicFeet = length * width * (depth / 12);
    } else {
      // Inputs are in meters - convert to cubic feet
      const cubicMeters = length * width * depth;
      cubicFeet = cubicMeters * CUBIC_FEET_PER_METER;
    }

    const cubicYards = cubicFeet / CUBIC_FEET_PER_YARD;
    const cubicMeters = cubicFeet / CUBIC_FEET_PER_METER;

    // Calculate weight
    const pounds = cubicYards * POUNDS_PER_CUBIC_YARD;
    const tons = pounds / POUNDS_PER_TON;

    setResult({
      cubicFeet,
      cubicYards,
      cubicMeters,
      tons,
      pounds,
    });
  }, []);

  const reset = useCallback(() => {
    setResult(null);
  }, []);

  return { result, calculate, reset };
}
