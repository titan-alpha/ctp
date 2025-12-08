import { useState, useCallback } from 'react';

interface SampleSizeResult {
  sampleSize: number;
  population: number;
  confidenceLevel: number;
  marginOfError: number;
  explanation: string;
}

interface UseSampleSizeCalculatorReturn {
  result: SampleSizeResult | null;
  error: string | null;
  calculate: (population: number, confidenceLevel: number, marginOfError: number) => void;
  reset: () => void;
}

// Z-scores for common confidence levels
const Z_SCORES: Record<number, number> = {
  80: 1.282,
  85: 1.440,
  90: 1.645,
  95: 1.96,
  99: 2.576,
};

function getZScore(confidenceLevel: number): number {
  return Z_SCORES[confidenceLevel] || 1.96;
}

function calculateSampleSize(
  population: number,
  confidenceLevel: number,
  marginOfError: number
): number {
  const z = getZScore(confidenceLevel);
  const p = 0.5; // Maximum variability (50%)
  const e = marginOfError / 100;

  // Cochran's formula for infinite population
  const n0 = (z * z * p * (1 - p)) / (e * e);

  // Finite population correction
  const n = n0 / (1 + (n0 - 1) / population);

  return Math.ceil(n);
}

function generateExplanation(
  sampleSize: number,
  population: number,
  confidenceLevel: number,
  marginOfError: number
): string {
  const percentage = ((sampleSize / population) * 100).toFixed(1);
  return `To achieve a ${confidenceLevel}% confidence level with a ${marginOfError}% margin of error from a population of ${population.toLocaleString()}, you need a sample size of ${sampleSize.toLocaleString()} respondents (${percentage}% of the population). This means if you surveyed ${sampleSize.toLocaleString()} people, there's a ${confidenceLevel}% chance your results will be within ${marginOfError}% of the true population value.`;
}

export function useSampleSizeCalculator(): UseSampleSizeCalculatorReturn {
  const [result, setResult] = useState<SampleSizeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculate = useCallback(
    (population: number, confidenceLevel: number, marginOfError: number) => {
      if (!population || population <= 0) {
        setError('Please enter a valid population size');
        setResult(null);
        return;
      }

      if (marginOfError <= 0 || marginOfError > 50) {
        setError('Margin of error must be between 0 and 50%');
        setResult(null);
        return;
      }

      if (!Z_SCORES[confidenceLevel]) {
        setError('Please select a valid confidence level');
        setResult(null);
        return;
      }

      const sampleSize = calculateSampleSize(population, confidenceLevel, marginOfError);
      const explanation = generateExplanation(sampleSize, population, confidenceLevel, marginOfError);

      setResult({
        sampleSize,
        population,
        confidenceLevel,
        marginOfError,
        explanation,
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
