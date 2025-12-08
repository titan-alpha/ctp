import { useState, useCallback } from 'react';

interface PaintCalculatorInput {
  roomLength: number;
  roomWidth: number;
  roomHeight: number;
  doorCount: number;
  windowCount: number;
  coats: number;
  coveragePerGallon: number;
}

interface PaintCalculatorResult {
  totalWallArea: number;
  doorArea: number;
  windowArea: number;
  paintableArea: number;
  gallonsNeeded: number;
  gallonsRounded: number;
}

interface UsePaintCalculatorReturn {
  result: PaintCalculatorResult | null;
  calculate: (input: PaintCalculatorInput) => void;
  reset: () => void;
}

// Standard door: 3ft x 7ft = 21 sq ft
const DOOR_AREA = 21;
// Standard window: 3ft x 4ft = 12 sq ft
const WINDOW_AREA = 12;

export function usePaintCalculator(): UsePaintCalculatorReturn {
  const [result, setResult] = useState<PaintCalculatorResult | null>(null);

  const calculate = useCallback((input: PaintCalculatorInput) => {
    const { roomLength, roomWidth, roomHeight, doorCount, windowCount, coats, coveragePerGallon } = input;

    // Calculate total wall area (perimeter x height)
    const perimeter = 2 * (roomLength + roomWidth);
    const totalWallArea = perimeter * roomHeight;

    // Calculate areas to subtract
    const doorArea = doorCount * DOOR_AREA;
    const windowArea = windowCount * WINDOW_AREA;

    // Calculate paintable area
    const paintableArea = Math.max(0, totalWallArea - doorArea - windowArea);

    // Calculate gallons needed (considering coats)
    const totalAreaToPaint = paintableArea * coats;
    const gallonsNeeded = totalAreaToPaint / coveragePerGallon;
    const gallonsRounded = Math.ceil(gallonsNeeded);

    setResult({
      totalWallArea,
      doorArea,
      windowArea,
      paintableArea,
      gallonsNeeded,
      gallonsRounded,
    });
  }, []);

  const reset = useCallback(() => {
    setResult(null);
  }, []);

  return { result, calculate, reset };
}
