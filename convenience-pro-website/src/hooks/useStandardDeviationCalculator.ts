import { useState, useCallback } from 'react';

interface CalculationStep {
  step: number;
  description: string;
  formula?: string;
  value?: string;
}

interface StandardDeviationResult {
  mean: number;
  variance: number;
  standardDeviation: number;
  count: number;
  sum: number;
  deviations: number[];
  squaredDeviations: number[];
  steps: CalculationStep[];
  type: 'population' | 'sample';
}

interface UseStandardDeviationCalculatorReturn {
  result: StandardDeviationResult | null;
  error: string | null;
  calculate: (data: number[], type: 'population' | 'sample') => void;
  reset: () => void;
}

export function parseDataSet(input: string): number[] {
  return input
    .split(/[,\s]+/)
    .map((s) => s.trim())
    .filter((s) => s !== '')
    .map((s) => parseFloat(s))
    .filter((n) => !isNaN(n));
}

export function useStandardDeviationCalculator(): UseStandardDeviationCalculatorReturn {
  const [result, setResult] = useState<StandardDeviationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculate = useCallback((data: number[], type: 'population' | 'sample') => {
    if (data.length === 0) {
      setError('Please enter at least one data point');
      setResult(null);
      return;
    }

    if (type === 'sample' && data.length < 2) {
      setError('Sample standard deviation requires at least 2 data points');
      setResult(null);
      return;
    }

    const steps: CalculationStep[] = [];
    const n = data.length;
    const divisor = type === 'population' ? n : n - 1;

    // Step 1: Calculate sum and mean
    const sum = data.reduce((a, b) => a + b, 0);
    const mean = sum / n;
    steps.push({
      step: 1,
      description: 'Calculate the mean (average)',
      formula: `Mean = Sum / n = ${sum} / ${n}`,
      value: mean.toFixed(4),
    });

    // Step 2: Calculate deviations
    const deviations = data.map((x) => x - mean);
    steps.push({
      step: 2,
      description: 'Subtract the mean from each value (deviations)',
      formula: 'Deviation = x - mean',
      value: deviations.map((d) => d.toFixed(4)).join(', '),
    });

    // Step 3: Square deviations
    const squaredDeviations = deviations.map((d) => d * d);
    steps.push({
      step: 3,
      description: 'Square each deviation',
      formula: 'Squared Deviation = (x - mean)^2',
      value: squaredDeviations.map((d) => d.toFixed(4)).join(', '),
    });

    // Step 4: Sum of squared deviations
    const sumSquaredDeviations = squaredDeviations.reduce((a, b) => a + b, 0);
    steps.push({
      step: 4,
      description: 'Sum the squared deviations',
      formula: 'Sum of Squared Deviations',
      value: sumSquaredDeviations.toFixed(4),
    });

    // Step 5: Calculate variance
    const variance = sumSquaredDeviations / divisor;
    const divisorLabel = type === 'population' ? 'n' : 'n-1';
    steps.push({
      step: 5,
      description: `Calculate variance (divide by ${divisorLabel})`,
      formula: `Variance = ${sumSquaredDeviations.toFixed(4)} / ${divisor}`,
      value: variance.toFixed(4),
    });

    // Step 6: Calculate standard deviation
    const standardDeviation = Math.sqrt(variance);
    steps.push({
      step: 6,
      description: 'Calculate standard deviation (square root of variance)',
      formula: `Standard Deviation = sqrt(${variance.toFixed(4)})`,
      value: standardDeviation.toFixed(4),
    });

    setResult({
      mean,
      variance,
      standardDeviation,
      count: n,
      sum,
      deviations,
      squaredDeviations,
      steps,
      type,
    });
    setError(null);
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { result, error, calculate, reset };
}
