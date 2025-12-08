import { useState, useCallback } from 'react';

interface PercentileStats {
  count: number;
  min: number;
  max: number;
  mean: number;
  median: number;
  standardDeviation: number;
  sortedData: number[];
}

interface PercentileResult {
  mode: 'findRank' | 'findValue';
  percentileRank?: number;
  valueAtPercentile?: number;
  inputValue?: number;
  inputPercentile?: number;
  stats: PercentileStats;
}

interface UsePercentileCalculatorReturn {
  result: PercentileResult | null;
  error: string | null;
  calculateRank: (data: number[], value: number) => void;
  calculateValue: (data: number[], percentile: number) => void;
  reset: () => void;
}

function parseDataSet(input: string): number[] {
  return input
    .split(/[,\s]+/)
    .map((s) => s.trim())
    .filter((s) => s !== '')
    .map((s) => parseFloat(s))
    .filter((n) => !isNaN(n));
}

function calculateStats(data: number[]): PercentileStats {
  const sorted = [...data].sort((a, b) => a - b);
  const count = sorted.length;
  const min = sorted[0];
  const max = sorted[count - 1];
  const sum = sorted.reduce((a, b) => a + b, 0);
  const mean = sum / count;

  const median = count % 2 === 0
    ? (sorted[count / 2 - 1] + sorted[count / 2]) / 2
    : sorted[Math.floor(count / 2)];

  const variance = sorted.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / count;
  const standardDeviation = Math.sqrt(variance);

  return { count, min, max, mean, median, standardDeviation, sortedData: sorted };
}

function getPercentileRank(sorted: number[], value: number): number {
  const below = sorted.filter((v) => v < value).length;
  const equal = sorted.filter((v) => v === value).length;
  const rank = ((below + 0.5 * equal) / sorted.length) * 100;
  return Math.round(rank * 100) / 100;
}

function getValueAtPercentile(sorted: number[], percentile: number): number {
  const index = (percentile / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);

  if (lower === upper) {
    return sorted[lower];
  }

  const fraction = index - lower;
  return sorted[lower] + fraction * (sorted[upper] - sorted[lower]);
}

export function usePercentileCalculator(): UsePercentileCalculatorReturn {
  const [result, setResult] = useState<PercentileResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculateRank = useCallback((data: number[], value: number) => {
    if (data.length === 0) {
      setError('Please enter at least one data point');
      setResult(null);
      return;
    }

    if (isNaN(value)) {
      setError('Please enter a valid value');
      setResult(null);
      return;
    }

    const stats = calculateStats(data);
    const percentileRank = getPercentileRank(stats.sortedData, value);

    setResult({
      mode: 'findRank',
      percentileRank,
      inputValue: value,
      stats,
    });
    setError(null);
  }, []);

  const calculateValue = useCallback((data: number[], percentile: number) => {
    if (data.length === 0) {
      setError('Please enter at least one data point');
      setResult(null);
      return;
    }

    if (isNaN(percentile) || percentile < 0 || percentile > 100) {
      setError('Percentile must be between 0 and 100');
      setResult(null);
      return;
    }

    const stats = calculateStats(data);
    const valueAtPercentile = getValueAtPercentile(stats.sortedData, percentile);

    setResult({
      mode: 'findValue',
      valueAtPercentile: Math.round(valueAtPercentile * 100) / 100,
      inputPercentile: percentile,
      stats,
    });
    setError(null);
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { result, error, calculateRank, calculateValue, reset };
}

export { parseDataSet };
