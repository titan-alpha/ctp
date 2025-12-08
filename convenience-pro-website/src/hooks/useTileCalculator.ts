import { useState, useCallback } from 'react';

interface TileCalculatorInput {
  roomLength: number;
  roomWidth: number;
  tileLength: number;
  tileWidth: number;
  wastagePercent: number;
  tilesPerBox: number;
}

interface TileCalculatorResult {
  roomArea: number;
  tileArea: number;
  tilesNeeded: number;
  tilesWithWastage: number;
  boxesNeeded: number;
  totalTiles: number;
  wasteTiles: number;
  coverage: number;
}

interface UseTileCalculatorReturn {
  result: TileCalculatorResult | null;
  calculate: (input: TileCalculatorInput) => void;
  reset: () => void;
}

export function useTileCalculator(): UseTileCalculatorReturn {
  const [result, setResult] = useState<TileCalculatorResult | null>(null);

  const calculate = useCallback((input: TileCalculatorInput) => {
    const { roomLength, roomWidth, tileLength, tileWidth, wastagePercent, tilesPerBox } = input;

    // Calculate areas (convert tile dimensions from cm to same unit as room)
    const roomArea = roomLength * roomWidth;
    const tileArea = (tileLength / 100) * (tileWidth / 100); // Convert cm to m

    // Calculate tiles needed
    const tilesNeeded = Math.ceil(roomArea / tileArea);

    // Add wastage
    const wastageMultiplier = 1 + wastagePercent / 100;
    const tilesWithWastage = Math.ceil(tilesNeeded * wastageMultiplier);

    // Calculate boxes needed
    const boxesNeeded = Math.ceil(tilesWithWastage / tilesPerBox);
    const totalTiles = boxesNeeded * tilesPerBox;
    const wasteTiles = totalTiles - tilesNeeded;
    const coverage = totalTiles * tileArea;

    setResult({
      roomArea,
      tileArea,
      tilesNeeded,
      tilesWithWastage,
      boxesNeeded,
      totalTiles,
      wasteTiles,
      coverage,
    });
  }, []);

  const reset = useCallback(() => {
    setResult(null);
  }, []);

  return { result, calculate, reset };
}
