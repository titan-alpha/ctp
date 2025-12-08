import { useState, useCallback } from 'react';

interface FlooringCalculatorInput {
  roomLength: number;
  roomWidth: number;
  wastagePercent: number;
  sqFtPerBox: number;
}

interface FlooringCalculatorResult {
  roomAreaSqFt: number;
  areaWithWastage: number;
  wastageAmount: number;
  boxesNeeded: number;
  totalCoverage: number;
  extraCoverage: number;
}

interface UseFlooringCalculatorReturn {
  result: FlooringCalculatorResult | null;
  calculate: (input: FlooringCalculatorInput) => void;
  reset: () => void;
}

export function useFlooringCalculator(): UseFlooringCalculatorReturn {
  const [result, setResult] = useState<FlooringCalculatorResult | null>(null);

  const calculate = useCallback((input: FlooringCalculatorInput) => {
    const { roomLength, roomWidth, wastagePercent, sqFtPerBox } = input;

    // Calculate room area in square feet
    const roomAreaSqFt = roomLength * roomWidth;

    // Calculate wastage amount
    const wastageMultiplier = 1 + wastagePercent / 100;
    const areaWithWastage = roomAreaSqFt * wastageMultiplier;
    const wastageAmount = areaWithWastage - roomAreaSqFt;

    // Calculate boxes needed
    const boxesNeeded = Math.ceil(areaWithWastage / sqFtPerBox);
    const totalCoverage = boxesNeeded * sqFtPerBox;
    const extraCoverage = totalCoverage - roomAreaSqFt;

    setResult({
      roomAreaSqFt,
      areaWithWastage,
      wastageAmount,
      boxesNeeded,
      totalCoverage,
      extraCoverage,
    });
  }, []);

  const reset = useCallback(() => {
    setResult(null);
  }, []);

  return { result, calculate, reset };
}
