import { useState, useCallback } from 'react';

interface FenceCalculatorInput {
  perimeter: number;
  height: number;
  postSpacing: number;
  railsPerSection: number;
  boardWidth: number;
  boardGap: number;
}

interface FenceCalculatorResult {
  posts: number;
  rails: number;
  boards: number;
  totalBoardWidth: number;
  sections: number;
}

interface UseFenceCalculatorReturn {
  result: FenceCalculatorResult | null;
  calculate: (input: FenceCalculatorInput) => void;
  reset: () => void;
}

export function useFenceCalculator(): UseFenceCalculatorReturn {
  const [result, setResult] = useState<FenceCalculatorResult | null>(null);

  const calculate = useCallback((input: FenceCalculatorInput) => {
    const { perimeter, height, postSpacing, railsPerSection, boardWidth, boardGap } = input;

    // Calculate number of sections (rounded up)
    const sections = Math.ceil(perimeter / postSpacing);

    // Posts = sections + 1 (need one at start and one at end of each section)
    const posts = sections + 1;

    // Rails = sections * rails per section
    const rails = sections * railsPerSection;

    // Boards calculation: total perimeter / (board width + gap)
    const boardWidthInFeet = boardWidth / 12; // Convert inches to feet
    const boardGapInFeet = boardGap / 12; // Convert inches to feet
    const effectiveBoardWidth = boardWidthInFeet + boardGapInFeet;
    const boards = Math.ceil(perimeter / effectiveBoardWidth);

    // Total board width needed (in linear feet)
    const totalBoardWidth = boards * height;

    setResult({
      posts,
      rails,
      boards,
      totalBoardWidth,
      sections,
    });
  }, []);

  const reset = useCallback(() => {
    setResult(null);
  }, []);

  return { result, calculate, reset };
}
