import { useState, useCallback } from 'react';

interface EtsyFeeInput {
  itemPrice: number;
  shippingPrice: number;
  quantity: number;
  itemCost: number;
  shippingCost: number;
  isEtsyPayments: boolean;
  isOffSiteAd: boolean;
}

interface EtsyFeeResult {
  listingFee: number;
  transactionFee: number;
  paymentProcessingFee: number;
  offSiteAdFee: number;
  regulatoryFee: number;
  totalFees: number;
  grossRevenue: number;
  totalCosts: number;
  netProfit: number;
  profitMargin: number;
}

interface UseEtsyFeeCalculatorReturn {
  result: EtsyFeeResult | null;
  calculate: (input: EtsyFeeInput) => void;
  reset: () => void;
}

// Etsy fee rates (as of 2024)
const LISTING_FEE = 0.20; // $0.20 per listing
const TRANSACTION_FEE_RATE = 0.065; // 6.5% of item price + shipping
const PAYMENT_PROCESSING_RATE = 0.03; // 3% + $0.25
const PAYMENT_PROCESSING_FIXED = 0.25;
const OFFSITE_AD_RATE = 0.15; // 15% for shops under $10k/year, 12% for over
const REGULATORY_FEE_RATE = 0.003; // 0.3% regulatory operating fee

export function useEtsyFeeCalculator(): UseEtsyFeeCalculatorReturn {
  const [result, setResult] = useState<EtsyFeeResult | null>(null);

  const calculate = useCallback((input: EtsyFeeInput) => {
    const {
      itemPrice,
      shippingPrice,
      quantity,
      itemCost,
      shippingCost,
      isEtsyPayments,
      isOffSiteAd,
    } = input;

    const saleTotal = (itemPrice + shippingPrice) * quantity;

    // Listing fee: $0.20 per quantity
    const listingFee = LISTING_FEE * quantity;

    // Transaction fee: 6.5% of sale total
    const transactionFee = saleTotal * TRANSACTION_FEE_RATE;

    // Payment processing fee (if using Etsy Payments): 3% + $0.25
    const paymentProcessingFee = isEtsyPayments
      ? saleTotal * PAYMENT_PROCESSING_RATE + PAYMENT_PROCESSING_FIXED
      : 0;

    // Offsite ads fee: 15% of item price (not shipping)
    const offSiteAdFee = isOffSiteAd ? itemPrice * quantity * OFFSITE_AD_RATE : 0;

    // Regulatory operating fee: 0.3% of sale total
    const regulatoryFee = saleTotal * REGULATORY_FEE_RATE;

    // Total fees
    const totalFees = listingFee + transactionFee + paymentProcessingFee + offSiteAdFee + regulatoryFee;

    // Revenue and costs
    const grossRevenue = saleTotal;
    const totalCosts = (itemCost + shippingCost) * quantity;

    // Net profit
    const netProfit = grossRevenue - totalFees - totalCosts;
    const profitMargin = grossRevenue > 0 ? (netProfit / grossRevenue) * 100 : 0;

    setResult({
      listingFee,
      transactionFee,
      paymentProcessingFee,
      offSiteAdFee,
      regulatoryFee,
      totalFees,
      grossRevenue,
      totalCosts,
      netProfit,
      profitMargin,
    });
  }, []);

  const reset = useCallback(() => {
    setResult(null);
  }, []);

  return { result, calculate, reset };
}
