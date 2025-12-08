import { useState, useCallback } from 'react';

interface StakingInput {
  amount: number;
  apy: number;
  durationMonths: number;
  compoundFrequency: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
}

interface StakingResult {
  totalRewards: number;
  finalBalance: number;
  effectiveApy: number;
  monthlyBreakdown: Array<{
    month: number;
    balance: number;
    rewards: number;
  }>;
}

interface UseCryptoStakingCalculatorReturn {
  result: StakingResult | null;
  calculate: (input: StakingInput) => void;
  reset: () => void;
}

export function useCryptoStakingCalculator(): UseCryptoStakingCalculatorReturn {
  const [result, setResult] = useState<StakingResult | null>(null);

  const calculate = useCallback((input: StakingInput) => {
    const { amount, apy, durationMonths, compoundFrequency } = input;

    if (amount <= 0 || apy <= 0 || durationMonths <= 0) {
      return;
    }

    const rate = apy / 100;
    const years = durationMonths / 12;
    let finalBalance: number;
    let compoundsPerYear: number;

    // Calculate based on compound frequency
    if (compoundFrequency === 'none') {
      // Simple interest
      finalBalance = amount * (1 + rate * years);
      compoundsPerYear = 0;
    } else {
      // Compound interest
      switch (compoundFrequency) {
        case 'daily':
          compoundsPerYear = 365;
          break;
        case 'weekly':
          compoundsPerYear = 52;
          break;
        case 'monthly':
          compoundsPerYear = 12;
          break;
        case 'yearly':
          compoundsPerYear = 1;
          break;
        default:
          compoundsPerYear = 12;
      }
      finalBalance = amount * Math.pow(1 + rate / compoundsPerYear, compoundsPerYear * years);
    }

    const totalRewards = finalBalance - amount;

    // Calculate effective APY (for compound interest)
    const effectiveApy = compoundFrequency === 'none'
      ? apy
      : (Math.pow(1 + rate / compoundsPerYear, compoundsPerYear) - 1) * 100;

    // Generate monthly breakdown
    const monthlyBreakdown: StakingResult['monthlyBreakdown'] = [];
    for (let month = 1; month <= durationMonths; month++) {
      const monthYears = month / 12;
      let monthBalance: number;

      if (compoundFrequency === 'none') {
        monthBalance = amount * (1 + rate * monthYears);
      } else {
        monthBalance = amount * Math.pow(1 + rate / compoundsPerYear, compoundsPerYear * monthYears);
      }

      monthlyBreakdown.push({
        month,
        balance: monthBalance,
        rewards: monthBalance - amount,
      });
    }

    setResult({
      totalRewards,
      finalBalance,
      effectiveApy,
      monthlyBreakdown,
    });
  }, []);

  const reset = useCallback(() => {
    setResult(null);
  }, []);

  return { result, calculate, reset };
}
