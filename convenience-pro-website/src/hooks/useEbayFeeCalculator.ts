import { useState, useCallback } from 'react';

export type EbayCategory =
  | 'most_categories'
  | 'books_movies_music'
  | 'clothing_shoes'
  | 'electronics'
  | 'business_industrial'
  | 'collectibles';

interface EbayFeeInput {
  salePrice: number;
  shippingCharged: number;
  category: EbayCategory;
  isStore: boolean;
}

interface EbayFeeResult {
  finalValueFee: number;
  finalValueFeeRate: number;
  paymentProcessingFee: number;
  totalFees: number;
  netProfit: number;
  totalSale: number;
  feePercentage: number;
}

interface UseEbayFeeCalculatorReturn {
  result: EbayFeeResult | null;
  calculate: (input: EbayFeeInput) => void;
  reset: () => void;
}

// Final value fee rates by category (as of 2024)
const FEE_RATES: Record<EbayCategory, { standard: number; store: number }> = {
  most_categories: { standard: 0.1325, store: 0.1195 },
  books_movies_music: { standard: 0.1455, store: 0.1195 },
  clothing_shoes: { standard: 0.1325, store: 0.1195 },
  electronics: { standard: 0.1325, store: 0.0935 },
  business_industrial: { standard: 0.1265, store: 0.0935 },
  collectibles: { standard: 0.1325, store: 0.1195 },
};

// Payment processing fee: 2.9% + $0.30
const PAYMENT_PROCESSING_RATE = 0.029;
const PAYMENT_PROCESSING_FIXED = 0.30;

export function useEbayFeeCalculator(): UseEbayFeeCalculatorReturn {
  const [result, setResult] = useState<EbayFeeResult | null>(null);

  const calculate = useCallback((input: EbayFeeInput) => {
    const { salePrice, shippingCharged, category, isStore } = input;

    const totalSale = salePrice + shippingCharged;

    // Calculate final value fee
    const feeRates = FEE_RATES[category];
    const finalValueFeeRate = isStore ? feeRates.store : feeRates.standard;
    const finalValueFee = totalSale * finalValueFeeRate;

    // Calculate payment processing fee
    const paymentProcessingFee = totalSale * PAYMENT_PROCESSING_RATE + PAYMENT_PROCESSING_FIXED;

    // Total fees and net profit
    const totalFees = finalValueFee + paymentProcessingFee;
    const netProfit = totalSale - totalFees;
    const feePercentage = totalSale > 0 ? (totalFees / totalSale) * 100 : 0;

    setResult({
      finalValueFee,
      finalValueFeeRate,
      paymentProcessingFee,
      totalFees,
      netProfit,
      totalSale,
      feePercentage,
    });
  }, []);

  const reset = useCallback(() => {
    setResult(null);
  }, []);

  return { result, calculate, reset };
}
