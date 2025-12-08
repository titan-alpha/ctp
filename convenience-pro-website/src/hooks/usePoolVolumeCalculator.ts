import { useState, useCallback } from 'react';

export type PoolShape = 'rectangle' | 'oval' | 'kidney';

interface PoolVolumeInput {
  shape: PoolShape;
  length: number;
  width: number;
  shallowDepth: number;
  deepDepth: number;
}

interface PoolVolumeResult {
  cubicFeet: number;
  gallons: number;
  liters: number;
  averageDepth: number;
}

interface UsePoolVolumeCalculatorReturn {
  result: PoolVolumeResult | null;
  calculate: (input: PoolVolumeInput) => void;
  reset: () => void;
}

// 1 cubic foot = 7.48052 gallons
const GALLONS_PER_CUBIC_FOOT = 7.48052;
// 1 gallon = 3.78541 liters
const LITERS_PER_GALLON = 3.78541;

export function usePoolVolumeCalculator(): UsePoolVolumeCalculatorReturn {
  const [result, setResult] = useState<PoolVolumeResult | null>(null);

  const calculate = useCallback((input: PoolVolumeInput) => {
    const { shape, length, width, shallowDepth, deepDepth } = input;

    const averageDepth = (shallowDepth + deepDepth) / 2;
    let cubicFeet: number;

    switch (shape) {
      case 'rectangle':
        // Length x Width x Average Depth
        cubicFeet = length * width * averageDepth;
        break;
      case 'oval':
        // Length x Width x Average Depth x 0.89 (pi/4 approximation adjusted)
        cubicFeet = length * width * averageDepth * 0.89;
        break;
      case 'kidney':
        // (A + B) / 2 x Length x Average Depth x 0.45
        // For kidney pools, width represents the average of both widths
        cubicFeet = length * width * averageDepth * 0.45;
        break;
      default:
        cubicFeet = 0;
    }

    const gallons = cubicFeet * GALLONS_PER_CUBIC_FOOT;
    const liters = gallons * LITERS_PER_GALLON;

    setResult({
      cubicFeet,
      gallons,
      liters,
      averageDepth,
    });
  }, []);

  const reset = useCallback(() => {
    setResult(null);
  }, []);

  return { result, calculate, reset };
}
