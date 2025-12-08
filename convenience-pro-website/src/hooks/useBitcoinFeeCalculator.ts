import { useState, useCallback } from 'react';

type Priority = 'low' | 'medium' | 'high';

interface BitcoinFeeInput {
  transactionSize: number; // in bytes
  priority: Priority;
}

interface BitcoinFeeResult {
  satPerByte: number;
  totalSatoshis: number;
  totalBtc: number;
  usdEstimate: number;
  confirmationTime: string;
}

interface UseBitcoinFeeCalculatorReturn {
  result: BitcoinFeeResult | null;
  calculate: (input: BitcoinFeeInput) => void;
  reset: () => void;
}

// Estimated sat/byte rates for different priorities
// These are typical values; real-time data would come from mempool APIs
const PRIORITY_RATES: Record<Priority, { satPerByte: number; confirmationTime: string }> = {
  low: { satPerByte: 5, confirmationTime: '~60+ minutes (6+ blocks)' },
  medium: { satPerByte: 20, confirmationTime: '~30 minutes (3 blocks)' },
  high: { satPerByte: 50, confirmationTime: '~10 minutes (next block)' },
};

// Approximate BTC to USD rate (would be fetched from API in production)
const BTC_USD_RATE = 95000;

export function useBitcoinFeeCalculator(): UseBitcoinFeeCalculatorReturn {
  const [result, setResult] = useState<BitcoinFeeResult | null>(null);

  const calculate = useCallback((input: BitcoinFeeInput) => {
    const { transactionSize, priority } = input;

    const rateInfo = PRIORITY_RATES[priority];
    const satPerByte = rateInfo.satPerByte;
    const totalSatoshis = transactionSize * satPerByte;
    const totalBtc = totalSatoshis / 100_000_000;
    const usdEstimate = totalBtc * BTC_USD_RATE;

    setResult({
      satPerByte,
      totalSatoshis,
      totalBtc,
      usdEstimate,
      confirmationTime: rateInfo.confirmationTime,
    });
  }, []);

  const reset = useCallback(() => {
    setResult(null);
  }, []);

  return { result, calculate, reset };
}
