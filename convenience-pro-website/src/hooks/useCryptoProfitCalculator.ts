import { useState, useCallback } from 'react';

interface CryptoProfitResult {
  investment: number;
  saleValue: number;
  buyFeeAmount: number;
  sellFeeAmount: number;
  totalFees: number;
  profit: number;
  roi: number;
  roiPercentage: string;
  isProfit: boolean;
}

interface UseCryptoProfitCalculatorReturn {
  result: CryptoProfitResult | null;
  error: string | null;
  calculate: (
    buyPrice: number,
    sellPrice: number,
    amount: number,
    buyFeePercent: number,
    sellFeePercent: number
  ) => void;
  reset: () => void;
}

export function useCryptoProfitCalculator(): UseCryptoProfitCalculatorReturn {
  const [result, setResult] = useState<CryptoProfitResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculate = useCallback(
    (
      buyPrice: number,
      sellPrice: number,
      amount: number,
      buyFeePercent: number,
      sellFeePercent: number
    ) => {
      if (buyPrice <= 0) {
        setError('Buy price must be greater than 0');
        setResult(null);
        return;
      }

      if (sellPrice <= 0) {
        setError('Sell price must be greater than 0');
        setResult(null);
        return;
      }

      if (amount <= 0) {
        setError('Amount must be greater than 0');
        setResult(null);
        return;
      }

      if (buyFeePercent < 0 || sellFeePercent < 0) {
        setError('Fees cannot be negative');
        setResult(null);
        return;
      }

      // Calculate investment (cost to buy)
      const investment = buyPrice * amount;
      const buyFeeAmount = investment * (buyFeePercent / 100);
      const totalInvestment = investment + buyFeeAmount;

      // Calculate sale value
      const saleValue = sellPrice * amount;
      const sellFeeAmount = saleValue * (sellFeePercent / 100);
      const netSaleValue = saleValue - sellFeeAmount;

      // Calculate profit/loss
      const totalFees = buyFeeAmount + sellFeeAmount;
      const profit = netSaleValue - totalInvestment;

      // Calculate ROI
      const roi = totalInvestment > 0 ? profit / totalInvestment : 0;

      setResult({
        investment: totalInvestment,
        saleValue: netSaleValue,
        buyFeeAmount,
        sellFeeAmount,
        totalFees,
        profit,
        roi,
        roiPercentage: (roi * 100).toFixed(2),
        isProfit: profit >= 0,
      });
      setError(null);
    },
    []
  );

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { result, error, calculate, reset };
}
