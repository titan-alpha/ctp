import { useState, useCallback } from 'react';

interface ConcreteCalculatorInput {
  length: number;
  width: number;
  depth: number;
  unit: 'imperial' | 'metric';
}

interface ConcreteCalculatorResult {
  cubicFeet: number;
  cubicYards: number;
  cubicMeters: number;
  bags40lb: number;
  bags60lb: number;
  bags80lb: number;
}

interface UseConcreteCalculatorReturn {
  result: ConcreteCalculatorResult | null;
  calculate: (input: ConcreteCalculatorInput) => void;
  reset: () => void;
}

// Conversion factors
const CUBIC_FEET_PER_YARD = 27;
const CUBIC_FEET_PER_METER = 35.3147;
const FEET_PER_METER = 3.28084;

// Approximate coverage per bag
const CUBIC_FEET_PER_40LB_BAG = 0.30;
const CUBIC_FEET_PER_60LB_BAG = 0.45;
const CUBIC_FEET_PER_80LB_BAG = 0.60;

export function useConcreteCalculator(): UseConcreteCalculatorReturn {
  const [result, setResult] = useState<ConcreteCalculatorResult | null>(null);

  const calculate = useCallback((input: ConcreteCalculatorInput) => {
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

    // Calculate bags needed (rounded up)
    const bags40lb = Math.ceil(cubicFeet / CUBIC_FEET_PER_40LB_BAG);
    const bags60lb = Math.ceil(cubicFeet / CUBIC_FEET_PER_60LB_BAG);
    const bags80lb = Math.ceil(cubicFeet / CUBIC_FEET_PER_80LB_BAG);

    setResult({
      cubicFeet,
      cubicYards,
      cubicMeters,
      bags40lb,
      bags60lb,
      bags80lb,
    });
  }, []);

  const reset = useCallback(() => {
    setResult(null);
  }, []);

  return { result, calculate, reset };
}
