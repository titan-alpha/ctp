import { useState, useCallback } from 'react';

interface WallpaperCalculatorInput {
  wallHeight: number;
  wallWidth: number;
  rollLength: number;
  rollWidth: number;
  patternRepeat: number;
  doorCount: number;
  windowCount: number;
}

interface WallpaperCalculatorResult {
  totalWallArea: number;
  doorArea: number;
  windowArea: number;
  netWallArea: number;
  stripsNeeded: number;
  usableStripsPerRoll: number;
  rollsNeeded: number;
  rollsWithWastage: number;
  wastagePercent: number;
}

interface UseWallpaperCalculatorReturn {
  result: WallpaperCalculatorResult | null;
  calculate: (input: WallpaperCalculatorInput) => void;
  reset: () => void;
}

// Standard door: 3ft x 7ft = 21 sq ft
const DOOR_AREA = 21;
// Standard window: 3ft x 4ft = 12 sq ft
const WINDOW_AREA = 12;
// Standard door width for strip calculation
const DOOR_WIDTH = 3;
// Standard window width for strip calculation
const WINDOW_WIDTH = 3;

export function useWallpaperCalculator(): UseWallpaperCalculatorReturn {
  const [result, setResult] = useState<WallpaperCalculatorResult | null>(null);

  const calculate = useCallback((input: WallpaperCalculatorInput) => {
    const { wallHeight, wallWidth, rollLength, rollWidth, patternRepeat, doorCount, windowCount } = input;

    // Calculate total wall area
    const totalWallArea = wallHeight * wallWidth;

    // Calculate areas to subtract
    const doorArea = doorCount * DOOR_AREA;
    const windowArea = windowCount * WINDOW_AREA;
    const netWallArea = Math.max(0, totalWallArea - doorArea - windowArea);

    // Calculate strip length needed (accounting for pattern repeat)
    let stripLength = wallHeight;
    if (patternRepeat > 0) {
      // Add extra length for pattern matching
      stripLength = wallHeight + patternRepeat;
    }

    // Calculate number of strips needed across the wall width
    // Subtract approximate widths of doors and windows
    const effectiveWidth = wallWidth - (doorCount * DOOR_WIDTH) - (windowCount * WINDOW_WIDTH);
    const stripsNeeded = Math.ceil(Math.max(0, effectiveWidth) / (rollWidth / 12)); // Convert inches to feet

    // Calculate usable strips per roll
    const usableStripsPerRoll = Math.floor((rollLength * 12) / (stripLength * 12)); // Both in inches for precision

    // Calculate rolls needed
    const rollsNeeded = usableStripsPerRoll > 0 ? Math.ceil(stripsNeeded / usableStripsPerRoll) : 0;

    // Add 10% for wastage
    const rollsWithWastage = Math.ceil(rollsNeeded * 1.10);

    // Calculate wastage percentage
    const wastagePercent = rollsNeeded > 0 ? ((rollsWithWastage - rollsNeeded) / rollsNeeded) * 100 : 0;

    setResult({
      totalWallArea,
      doorArea,
      windowArea,
      netWallArea,
      stripsNeeded,
      usableStripsPerRoll,
      rollsNeeded,
      rollsWithWastage,
      wastagePercent,
    });
  }, []);

  const reset = useCallback(() => {
    setResult(null);
  }, []);

  return { result, calculate, reset };
}
