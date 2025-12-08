import { useState, useCallback } from 'react';

export interface ExpenseItem {
  id: string;
  name: string;
  amount: number;
  category: 'payroll' | 'rent' | 'software' | 'marketing' | 'operations' | 'other';
}

interface BurnRateInput {
  expenses: ExpenseItem[];
  monthlyRevenue: number;
  cashBalance: number;
}

interface BurnRateResult {
  grossBurnRate: number;
  netBurnRate: number;
  runwayMonths: number;
  runwayDate: Date;
  expensesByCategory: Record<string, number>;
  isProfit: boolean;
}

interface UseBurnRateCalculatorReturn {
  result: BurnRateResult | null;
  calculate: (input: BurnRateInput) => void;
  reset: () => void;
}

export function useBurnRateCalculator(): UseBurnRateCalculatorReturn {
  const [result, setResult] = useState<BurnRateResult | null>(null);

  const calculate = useCallback((input: BurnRateInput) => {
    const { expenses, monthlyRevenue, cashBalance } = input;

    // Calculate total monthly expenses (gross burn rate)
    const grossBurnRate = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    // Net burn rate = expenses - revenue
    const netBurnRate = grossBurnRate - monthlyRevenue;

    // Calculate runway in months
    const isProfit = netBurnRate <= 0;
    const runwayMonths = isProfit
      ? Infinity
      : cashBalance > 0 && netBurnRate > 0
        ? Math.floor(cashBalance / netBurnRate)
        : 0;

    // Calculate runway end date
    const runwayDate = new Date();
    if (!isProfit && runwayMonths !== Infinity && runwayMonths > 0) {
      runwayDate.setMonth(runwayDate.getMonth() + runwayMonths);
    }

    // Group expenses by category
    const expensesByCategory = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {} as Record<string, number>);

    setResult({
      grossBurnRate,
      netBurnRate,
      runwayMonths,
      runwayDate,
      expensesByCategory,
      isProfit,
    });
  }, []);

  const reset = useCallback(() => {
    setResult(null);
  }, []);

  return { result, calculate, reset };
}
