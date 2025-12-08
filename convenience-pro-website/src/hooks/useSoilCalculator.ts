import { useState, useCallback } from 'react';

export type ShapeType = 'rectangle' | 'circle';

interface SoilCalculatorInput {
  shape: ShapeType;
  length: number;
  width: number;
  diameter: number;
  depth: number;
}

interface SoilCalculatorResult {
  cubicFeet: number;
  cubicYards: number;
  bags1CubicFoot: number;
  bags2CubicFoot: number;
  bags3CubicFoot: number;
}

interface UseSoilCalculatorReturn {
  result: SoilCalculatorResult | null;
  calculate: (input: SoilCalculatorInput) => void;
  reset: () => void;
}

export function useSoilCalculator(): UseSoilCalculatorReturn {
  const [result, setResult] = useState<SoilCalculatorResult | null>(null);

  const calculate = useCallback((input: SoilCalculatorInput) => {
    const { shape, length, width, diameter, depth } = input;

    let areaSquareFeet = 0;

    if (shape === 'rectangle') {
      areaSquareFeet = length * width;
    } else if (shape === 'circle') {
      const radius = diameter / 2;
      areaSquareFeet = Math.PI * radius * radius;
    }

    // Convert depth from inches to feet
    const depthInFeet = depth / 12;

    // Calculate volume
    const cubicFeet = areaSquareFeet * depthInFeet;
    const cubicYards = cubicFeet / 27;

    // Calculate bags needed (common bag sizes)
    const bags1CubicFoot = Math.ceil(cubicFeet);
    const bags2CubicFoot = Math.ceil(cubicFeet / 2);
    const bags3CubicFoot = Math.ceil(cubicFeet / 3);

    setResult({
      cubicFeet,
      cubicYards,
      bags1CubicFoot,
      bags2CubicFoot,
      bags3CubicFoot,
    });
  }, []);

  const reset = useCallback(() => {
    setResult(null);
  }, []);

  return { result, calculate, reset };
}
