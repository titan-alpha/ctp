import { useState, useCallback } from 'react';

interface BrickCalculatorInput {
  wallLength: number;
  wallHeight: number;
  brickLength: number;
  brickHeight: number;
  mortarJoint: number;
  wastagePercent: number;
}

interface BrickCalculatorResult {
  wallArea: number;
  brickArea: number;
  bricksNeeded: number;
  bricksWithWastage: number;
  wasteBricks: number;
  bricksPerSquareMeter: number;
}

interface UseBrickCalculatorReturn {
  result: BrickCalculatorResult | null;
  calculate: (input: BrickCalculatorInput) => void;
  reset: () => void;
}

export function useBrickCalculator(): UseBrickCalculatorReturn {
  const [result, setResult] = useState<BrickCalculatorResult | null>(null);

  const calculate = useCallback((input: BrickCalculatorInput) => {
    const { wallLength, wallHeight, brickLength, brickHeight, mortarJoint, wastagePercent } = input;

    // Calculate wall area in square meters
    const wallArea = wallLength * wallHeight;

    // Convert brick dimensions from mm to meters and add mortar joint
    const brickWithMortarLength = (brickLength + mortarJoint) / 1000;
    const brickWithMortarHeight = (brickHeight + mortarJoint) / 1000;

    // Calculate effective brick area including mortar
    const brickArea = brickWithMortarLength * brickWithMortarHeight;

    // Calculate bricks per square meter
    const bricksPerSquareMeter = 1 / brickArea;

    // Calculate exact bricks needed
    const bricksNeeded = Math.ceil(wallArea / brickArea);

    // Add wastage
    const wastageMultiplier = 1 + wastagePercent / 100;
    const bricksWithWastage = Math.ceil(bricksNeeded * wastageMultiplier);
    const wasteBricks = bricksWithWastage - bricksNeeded;

    setResult({
      wallArea,
      brickArea,
      bricksNeeded,
      bricksWithWastage,
      wasteBricks,
      bricksPerSquareMeter,
    });
  }, []);

  const reset = useCallback(() => {
    setResult(null);
  }, []);

  return { result, calculate, reset };
}
