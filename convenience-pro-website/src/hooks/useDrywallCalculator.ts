import { useState, useCallback } from 'react';

interface DrywallCalculatorInput {
  wallLength: number;
  wallHeight: number;
  doorCount: number;
  windowCount: number;
  sheetWidth: number;
  sheetHeight: number;
  wastagePercent: number;
}

interface DrywallCalculatorResult {
  totalWallArea: number;
  doorArea: number;
  windowArea: number;
  netArea: number;
  sheetArea: number;
  sheetsExact: number;
  sheetsWithWastage: number;
  sheetsNeeded: number;
  wastageSheets: number;
}

interface UseDrywallCalculatorReturn {
  result: DrywallCalculatorResult | null;
  calculate: (input: DrywallCalculatorInput) => void;
  reset: () => void;
}

// Standard door: 3ft x 7ft = 21 sq ft
const DOOR_AREA = 21;
// Standard window: 3ft x 4ft = 12 sq ft
const WINDOW_AREA = 12;

export function useDrywallCalculator(): UseDrywallCalculatorReturn {
  const [result, setResult] = useState<DrywallCalculatorResult | null>(null);

  const calculate = useCallback((input: DrywallCalculatorInput) => {
    const { wallLength, wallHeight, doorCount, windowCount, sheetWidth, sheetHeight, wastagePercent } = input;

    // Calculate total wall area
    const totalWallArea = wallLength * wallHeight;

    // Calculate areas to subtract
    const doorArea = doorCount * DOOR_AREA;
    const windowArea = windowCount * WINDOW_AREA;

    // Calculate net area to cover
    const netArea = Math.max(0, totalWallArea - doorArea - windowArea);

    // Calculate sheet area
    const sheetArea = sheetWidth * sheetHeight;

    // Calculate sheets needed
    const sheetsExact = netArea / sheetArea;
    const sheetsWithWastage = sheetsExact * (1 + wastagePercent / 100);
    const sheetsNeeded = Math.ceil(sheetsWithWastage);
    const wastageSheets = sheetsNeeded - Math.ceil(sheetsExact);

    setResult({
      totalWallArea,
      doorArea,
      windowArea,
      netArea,
      sheetArea,
      sheetsExact,
      sheetsWithWastage,
      sheetsNeeded,
      wastageSheets,
    });
  }, []);

  const reset = useCallback(() => {
    setResult(null);
  }, []);

  return { result, calculate, reset };
}
