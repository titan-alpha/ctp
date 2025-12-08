import { useState, useCallback } from 'react';

interface InventoryTurnoverInput {
  cogs: number;
  beginningInventory: number;
  endingInventory: number;
}

interface InventoryTurnoverResult {
  averageInventory: number;
  turnoverRatio: number;
  daysSalesOfInventory: number;
  interpretation: string;
  rating: 'excellent' | 'good' | 'average' | 'poor';
}

interface UseInventoryTurnoverCalculatorReturn {
  result: InventoryTurnoverResult | null;
  calculate: (input: InventoryTurnoverInput) => void;
  reset: () => void;
}

export function useInventoryTurnoverCalculator(): UseInventoryTurnoverCalculatorReturn {
  const [result, setResult] = useState<InventoryTurnoverResult | null>(null);

  const calculate = useCallback((input: InventoryTurnoverInput) => {
    const { cogs, beginningInventory, endingInventory } = input;

    // Calculate average inventory
    const averageInventory = (beginningInventory + endingInventory) / 2;

    // Calculate inventory turnover ratio
    const turnoverRatio = averageInventory > 0 ? cogs / averageInventory : 0;

    // Calculate days sales of inventory (DSI)
    const daysSalesOfInventory = turnoverRatio > 0 ? 365 / turnoverRatio : 0;

    // Determine rating and interpretation
    let interpretation: string;
    let rating: 'excellent' | 'good' | 'average' | 'poor';

    if (turnoverRatio >= 8) {
      rating = 'excellent';
      interpretation = 'Excellent inventory management. Your inventory sells quickly, minimizing holding costs and reducing obsolescence risk.';
    } else if (turnoverRatio >= 5) {
      rating = 'good';
      interpretation = 'Good inventory turnover. You are efficiently managing inventory with healthy stock levels.';
    } else if (turnoverRatio >= 2) {
      rating = 'average';
      interpretation = 'Average turnover. Consider optimizing purchasing or sales strategies to improve efficiency.';
    } else {
      rating = 'poor';
      interpretation = 'Low turnover indicates excess inventory or slow-moving stock. Review your inventory management practices.';
    }

    setResult({
      averageInventory,
      turnoverRatio,
      daysSalesOfInventory,
      interpretation,
      rating,
    });
  }, []);

  const reset = useCallback(() => {
    setResult(null);
  }, []);

  return { result, calculate, reset };
}
