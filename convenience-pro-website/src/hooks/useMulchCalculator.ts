import { useState, useCallback } from 'react';

interface MulchCalculatorInput {
  area: number;
  depth: number;
}

interface MulchCalculatorResult {
  cubicFeet: number;
  cubicYards: number;
  bagsNeeded2CuFt: number;
  bagsNeeded3CuFt: number;
}

interface UseMulchCalculatorReturn {
  result: MulchCalculatorResult | null;
  calculate: (input: MulchCalculatorInput) => void;
  reset: () => void;
}

export function useMulchCalculator(): UseMulchCalculatorReturn {
  const [result, setResult] = useState<MulchCalculatorResult | null>(null);

  const calculate = useCallback((input: MulchCalculatorInput) => {
    const { area, depth } = input;

    // Convert depth from inches to feet
    const depthInFeet = depth / 12;

    // Calculate cubic feet
    const cubicFeet = area * depthInFeet;

    // Convert to cubic yards (27 cubic feet per cubic yard)
    const cubicYards = cubicFeet / 27;

    // Calculate bags needed (common sizes: 2 cu ft and 3 cu ft)
    const bagsNeeded2CuFt = Math.ceil(cubicFeet / 2);
    const bagsNeeded3CuFt = Math.ceil(cubicFeet / 3);

    setResult({
      cubicFeet,
      cubicYards,
      bagsNeeded2CuFt,
      bagsNeeded3CuFt,
    });
  }, []);

  const reset = useCallback(() => {
    setResult(null);
  }, []);

  return { result, calculate, reset };
}
