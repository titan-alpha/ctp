import { useState, useCallback } from 'react';

type ProductSize = 'small' | 'large' | 'oversize';

interface FbaInput {
  sellingPrice: number;
  productCost: number;
  length: number;
  width: number;
  height: number;
  weight: number;
  referralFeePercent?: number;
  category?: string;
}

interface FbaResult {
  referralFee: number;
  fulfillmentFee: number;
  storageFee: number;
  totalFees: number;
  netProfit: number;
  profitMargin: number;
  roi: number;
  productSize: ProductSize;
  dimensionalWeight: number;
  breakEvenPrice: number;
}

interface UseAmazonFbaCalculatorReturn {
  result: FbaResult | null;
  calculate: (input: FbaInput) => void;
  reset: () => void;
}

export function useAmazonFbaCalculator(): UseAmazonFbaCalculatorReturn {
  const [result, setResult] = useState<FbaResult | null>(null);

  const calculate = useCallback((input: FbaInput) => {
    const {
      sellingPrice,
      productCost,
      length,
      width,
      height,
      weight,
      referralFeePercent = 15,
    } = input;

    // Calculate dimensional weight (length x width x height / 139)
    const dimensionalWeight = (length * width * height) / 139;
    const billableWeight = Math.max(weight, dimensionalWeight);

    // Determine product size tier
    let productSize: ProductSize;
    const longestSide = Math.max(length, width, height);
    const medianSide = [length, width, height].sort((a, b) => a - b)[1];
    const shortestSide = Math.min(length, width, height);

    if (
      weight <= 0.75 &&
      longestSide <= 15 &&
      medianSide <= 12 &&
      shortestSide <= 0.75
    ) {
      productSize = 'small';
    } else if (
      weight <= 20 &&
      longestSide <= 18 &&
      medianSide <= 14 &&
      shortestSide <= 8
    ) {
      productSize = 'large';
    } else {
      productSize = 'oversize';
    }

    // Calculate referral fee (typically 8-15% depending on category)
    const referralFee = sellingPrice * (referralFeePercent / 100);

    // Calculate FBA fulfillment fee based on size and weight
    let fulfillmentFee: number;
    if (productSize === 'small') {
      if (billableWeight <= 0.25) fulfillmentFee = 3.22;
      else if (billableWeight <= 0.5) fulfillmentFee = 3.40;
      else fulfillmentFee = 3.58;
    } else if (productSize === 'large') {
      if (billableWeight <= 0.25) fulfillmentFee = 3.86;
      else if (billableWeight <= 0.5) fulfillmentFee = 4.08;
      else if (billableWeight <= 0.75) fulfillmentFee = 4.24;
      else if (billableWeight <= 1) fulfillmentFee = 4.75;
      else if (billableWeight <= 1.5) fulfillmentFee = 5.40;
      else if (billableWeight <= 2) fulfillmentFee = 5.69;
      else if (billableWeight <= 2.5) fulfillmentFee = 6.10;
      else if (billableWeight <= 3) fulfillmentFee = 6.39;
      else fulfillmentFee = 6.39 + (billableWeight - 3) * 0.32;
    } else {
      // Oversize
      if (billableWeight <= 70) {
        fulfillmentFee = 9.73 + (billableWeight - 1) * 0.42;
      } else {
        fulfillmentFee = 9.73 + 69 * 0.42 + (billableWeight - 70) * 0.83;
      }
    }

    // Monthly storage fee (per cubic foot, approximately)
    const cubicFeet = (length * width * height) / 1728;
    const storageFee = cubicFeet * 0.87; // Standard rate (Jan-Sep)

    // Calculate totals
    const totalFees = referralFee + fulfillmentFee + storageFee;
    const netProfit = sellingPrice - productCost - totalFees;
    const profitMargin = sellingPrice > 0 ? (netProfit / sellingPrice) * 100 : 0;
    const roi = productCost > 0 ? (netProfit / productCost) * 100 : 0;
    const breakEvenPrice = productCost + totalFees;

    setResult({
      referralFee: Math.round(referralFee * 100) / 100,
      fulfillmentFee: Math.round(fulfillmentFee * 100) / 100,
      storageFee: Math.round(storageFee * 100) / 100,
      totalFees: Math.round(totalFees * 100) / 100,
      netProfit: Math.round(netProfit * 100) / 100,
      profitMargin: Math.round(profitMargin * 100) / 100,
      roi: Math.round(roi * 100) / 100,
      productSize,
      dimensionalWeight: Math.round(dimensionalWeight * 100) / 100,
      breakEvenPrice: Math.round(breakEvenPrice * 100) / 100,
    });
  }, []);

  const reset = useCallback(() => {
    setResult(null);
  }, []);

  return { result, calculate, reset };
}
