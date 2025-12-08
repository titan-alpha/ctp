import { useState, useCallback } from 'react';

interface ConversionResult {
  rate: number;
  ratePercentage: string;
}

interface ABTestResult {
  controlRate: number;
  variantRate: number;
  lift: number;
  liftPercentage: string;
  isSignificant: boolean;
  confidenceLevel: number;
  pValue: number;
  zScore: number;
}

interface UseConversionRateCalculatorReturn {
  result: ConversionResult | null;
  abTestResult: ABTestResult | null;
  error: string | null;
  calculateRate: (visitors: number, conversions: number) => void;
  calculateABTest: (
    controlVisitors: number,
    controlConversions: number,
    variantVisitors: number,
    variantConversions: number
  ) => void;
  reset: () => void;
}

// Standard normal cumulative distribution function approximation
function normalCDF(z: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = z < 0 ? -1 : 1;
  z = Math.abs(z) / Math.sqrt(2);

  const t = 1.0 / (1.0 + p * z);
  const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-z * z);

  return 0.5 * (1.0 + sign * y);
}

// Calculate z-score for two proportions
function calculateZScore(
  p1: number,
  n1: number,
  p2: number,
  n2: number
): number {
  const pooledP = (p1 * n1 + p2 * n2) / (n1 + n2);
  const se = Math.sqrt(pooledP * (1 - pooledP) * (1 / n1 + 1 / n2));

  if (se === 0) return 0;
  return (p2 - p1) / se;
}

export function useConversionRateCalculator(): UseConversionRateCalculatorReturn {
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [abTestResult, setABTestResult] = useState<ABTestResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculateRate = useCallback((visitors: number, conversions: number) => {
    if (visitors <= 0) {
      setError('Visitors must be greater than 0');
      setResult(null);
      return;
    }

    if (conversions < 0) {
      setError('Conversions cannot be negative');
      setResult(null);
      return;
    }

    if (conversions > visitors) {
      setError('Conversions cannot exceed visitors');
      setResult(null);
      return;
    }

    const rate = conversions / visitors;
    setResult({
      rate,
      ratePercentage: (rate * 100).toFixed(2),
    });
    setError(null);
  }, []);

  const calculateABTest = useCallback(
    (
      controlVisitors: number,
      controlConversions: number,
      variantVisitors: number,
      variantConversions: number
    ) => {
      if (controlVisitors <= 0 || variantVisitors <= 0) {
        setError('Visitors must be greater than 0 for both groups');
        setABTestResult(null);
        return;
      }

      if (controlConversions < 0 || variantConversions < 0) {
        setError('Conversions cannot be negative');
        setABTestResult(null);
        return;
      }

      if (controlConversions > controlVisitors || variantConversions > variantVisitors) {
        setError('Conversions cannot exceed visitors');
        setABTestResult(null);
        return;
      }

      const controlRate = controlConversions / controlVisitors;
      const variantRate = variantConversions / variantVisitors;

      const lift = controlRate === 0 ? 0 : (variantRate - controlRate) / controlRate;

      const zScore = calculateZScore(
        controlRate,
        controlVisitors,
        variantRate,
        variantVisitors
      );

      // Two-tailed p-value
      const pValue = 2 * (1 - normalCDF(Math.abs(zScore)));

      // Confidence level (1 - p-value)
      const confidenceLevel = (1 - pValue) * 100;

      // Statistical significance at 95% confidence (p < 0.05)
      const isSignificant = pValue < 0.05;

      setABTestResult({
        controlRate,
        variantRate,
        lift,
        liftPercentage: (lift * 100).toFixed(2),
        isSignificant,
        confidenceLevel: Math.min(99.99, confidenceLevel),
        pValue,
        zScore,
      });
      setError(null);
    },
    []
  );

  const reset = useCallback(() => {
    setResult(null);
    setABTestResult(null);
    setError(null);
  }, []);

  return { result, abTestResult, error, calculateRate, calculateABTest, reset };
}
