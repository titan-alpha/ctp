import { useState, useCallback } from 'react';

interface PaversCalculatorInput {
  areaLength: number;
  areaWidth: number;
  paverLength: number;
  paverWidth: number;
  wastagePercent: number;
}

interface PaversCalculatorResult {
  totalArea: number;
  paverArea: number;
  paversNeeded: number;
  paversWithWastage: number;
  wastePavers: number;
  coverage: number;
}

interface UsePaversCalculatorReturn {
  result: PaversCalculatorResult | null;
  calculate: (input: PaversCalculatorInput) => void;
  reset: () => void;
}

export function usePaversCalculator(): UsePaversCalculatorReturn {
  const [result, setResult] = useState<PaversCalculatorResult | null>(null);

  const calculate = useCallback((input: PaversCalculatorInput) => {
    const { areaLength, areaWidth, paverLength, paverWidth, wastagePercent } = input;

    // Calculate areas (convert paver dimensions from cm to meters)
    const totalArea = areaLength * areaWidth;
    const paverArea = (paverLength / 100) * (paverWidth / 100);

    // Calculate pavers needed
    const paversNeeded = Math.ceil(totalArea / paverArea);

    // Add wastage
    const wastageMultiplier = 1 + wastagePercent / 100;
    const paversWithWastage = Math.ceil(paversNeeded * wastageMultiplier);
    const wastePavers = paversWithWastage - paversNeeded;
    const coverage = paversWithWastage * paverArea;

    setResult({
      totalArea,
      paverArea,
      paversNeeded,
      paversWithWastage,
      wastePavers,
      coverage,
    });
  }, []);

  const reset = useCallback(() => {
    setResult(null);
  }, []);

  return { result, calculate, reset };
}
