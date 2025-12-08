import { useState, useCallback } from 'react';

interface AuctionBidInput {
  maxBudget: number;
  buyerPremiumPercent: number;
}

interface AuctionBidResult {
  maxBidAmount: number;
  buyerPremiumAmount: number;
  totalCost: number;
  effectivePremiumRate: number;
}

interface UseAuctionBidCalculatorReturn {
  result: AuctionBidResult | null;
  calculate: (input: AuctionBidInput) => void;
  reset: () => void;
}

export function useAuctionBidCalculator(): UseAuctionBidCalculatorReturn {
  const [result, setResult] = useState<AuctionBidResult | null>(null);

  const calculate = useCallback((input: AuctionBidInput) => {
    const { maxBudget, buyerPremiumPercent } = input;

    // Max bid = Budget / (1 + premium rate)
    // Total = Max Bid + (Max Bid * premium rate) = Max Bid * (1 + premium rate)
    const premiumRate = buyerPremiumPercent / 100;
    const maxBidAmount = maxBudget / (1 + premiumRate);
    const buyerPremiumAmount = maxBidAmount * premiumRate;
    const totalCost = maxBidAmount + buyerPremiumAmount;
    const effectivePremiumRate = maxBidAmount > 0 ? (buyerPremiumAmount / maxBidAmount) * 100 : 0;

    setResult({
      maxBidAmount,
      buyerPremiumAmount,
      totalCost,
      effectivePremiumRate,
    });
  }, []);

  const reset = useCallback(() => {
    setResult(null);
  }, []);

  return { result, calculate, reset };
}
