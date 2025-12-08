import { useState, useCallback } from 'react';

interface RentalYieldInput {
  propertyPrice: number;
  monthlyRent: number;
  annualExpenses: number;
  downPayment?: number;
}

interface RentalYieldResult {
  grossYield: number;
  netYield: number;
  annualRent: number;
  annualNetIncome: number;
  cashOnCashReturn: number;
  monthlyNetIncome: number;
}

interface UseRentalYieldCalculatorReturn {
  result: RentalYieldResult | null;
  calculate: (input: RentalYieldInput) => void;
  reset: () => void;
}

export function useRentalYieldCalculator(): UseRentalYieldCalculatorReturn {
  const [result, setResult] = useState<RentalYieldResult | null>(null);

  const calculate = useCallback((input: RentalYieldInput) => {
    const { propertyPrice, monthlyRent, annualExpenses, downPayment } = input;

    if (propertyPrice <= 0) return;

    // Calculate annual rent
    const annualRent = monthlyRent * 12;

    // Gross yield = (Annual Rent / Property Price) * 100
    const grossYield = (annualRent / propertyPrice) * 100;

    // Net annual income = Annual Rent - Annual Expenses
    const annualNetIncome = annualRent - annualExpenses;

    // Net yield = (Net Annual Income / Property Price) * 100
    const netYield = (annualNetIncome / propertyPrice) * 100;

    // Cash on cash return = (Net Annual Income / Down Payment) * 100
    const cashInvested = downPayment && downPayment > 0 ? downPayment : propertyPrice;
    const cashOnCashReturn = (annualNetIncome / cashInvested) * 100;

    // Monthly net income
    const monthlyNetIncome = annualNetIncome / 12;

    setResult({
      grossYield,
      netYield,
      annualRent,
      annualNetIncome,
      cashOnCashReturn,
      monthlyNetIncome,
    });
  }, []);

  const reset = useCallback(() => {
    setResult(null);
  }, []);

  return { result, calculate, reset };
}
