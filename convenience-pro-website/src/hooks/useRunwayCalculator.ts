import { useState, useCallback } from 'react';

interface RunwayInput {
  cashBalance: number;
  monthlyBurn: number;
  growthRate: number; // Monthly burn growth rate as percentage
}

interface RunwayResult {
  runwayMonths: number;
  endDate: Date;
  monthlyProjections: Array<{
    month: number;
    date: Date;
    burn: number;
    remainingCash: number;
  }>;
  totalBurn: number;
  averageMonthlyBurn: number;
}

interface UseRunwayCalculatorReturn {
  result: RunwayResult | null;
  calculate: (input: RunwayInput) => void;
  reset: () => void;
}

export function useRunwayCalculator(): UseRunwayCalculatorReturn {
  const [result, setResult] = useState<RunwayResult | null>(null);

  const calculate = useCallback((input: RunwayInput) => {
    const { cashBalance, monthlyBurn, growthRate } = input;

    if (cashBalance <= 0 || monthlyBurn <= 0) {
      setResult(null);
      return;
    }

    const monthlyProjections: RunwayResult['monthlyProjections'] = [];
    let remainingCash = cashBalance;
    let currentBurn = monthlyBurn;
    let month = 0;
    let totalBurn = 0;
    const startDate = new Date();

    // Calculate month by month until cash runs out or 120 months max
    while (remainingCash > 0 && month < 120) {
      month++;
      const burnThisMonth = Math.min(currentBurn, remainingCash);
      remainingCash -= burnThisMonth;
      totalBurn += burnThisMonth;

      const projectionDate = new Date(startDate);
      projectionDate.setMonth(projectionDate.getMonth() + month);

      monthlyProjections.push({
        month,
        date: projectionDate,
        burn: currentBurn,
        remainingCash: Math.max(0, remainingCash),
      });

      // Apply growth rate to burn for next month
      currentBurn = currentBurn * (1 + growthRate / 100);
    }

    const runwayMonths = month;
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + runwayMonths);

    const averageMonthlyBurn = runwayMonths > 0 ? totalBurn / runwayMonths : monthlyBurn;

    setResult({
      runwayMonths,
      endDate,
      monthlyProjections,
      totalBurn,
      averageMonthlyBurn,
    });
  }, []);

  const reset = useCallback(() => {
    setResult(null);
  }, []);

  return { result, calculate, reset };
}
