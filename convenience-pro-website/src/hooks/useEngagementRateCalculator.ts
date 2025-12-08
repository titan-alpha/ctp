import { useState, useCallback } from 'react';

interface EngagementResult {
  engagementRate: number;
  engagementPercentage: string;
  totalEngagements: number;
  benchmark: 'low' | 'average' | 'good' | 'excellent';
  benchmarkLabel: string;
}

interface UseEngagementRateCalculatorReturn {
  result: EngagementResult | null;
  error: string | null;
  calculate: (followers: number, likes: number, comments: number, shares: number, platform: string) => void;
  reset: () => void;
}

const PLATFORM_BENCHMARKS: Record<string, { low: number; average: number; good: number }> = {
  instagram: { low: 1, average: 3, good: 6 },
  facebook: { low: 0.5, average: 1, good: 3 },
  twitter: { low: 0.5, average: 1, good: 3 },
  linkedin: { low: 1, average: 2, good: 4 },
  tiktok: { low: 3, average: 6, good: 10 },
  youtube: { low: 1, average: 3, good: 6 },
};

function getBenchmark(rate: number, platform: string): { level: 'low' | 'average' | 'good' | 'excellent'; label: string } {
  const benchmarks = PLATFORM_BENCHMARKS[platform] || PLATFORM_BENCHMARKS.instagram;

  if (rate < benchmarks.low) {
    return { level: 'low', label: 'Below Average' };
  } else if (rate < benchmarks.average) {
    return { level: 'average', label: 'Average' };
  } else if (rate < benchmarks.good) {
    return { level: 'good', label: 'Good' };
  } else {
    return { level: 'excellent', label: 'Excellent' };
  }
}

export function useEngagementRateCalculator(): UseEngagementRateCalculatorReturn {
  const [result, setResult] = useState<EngagementResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculate = useCallback((followers: number, likes: number, comments: number, shares: number, platform: string) => {
    if (followers <= 0) {
      setError('Followers must be greater than 0');
      setResult(null);
      return;
    }

    if (likes < 0 || comments < 0 || shares < 0) {
      setError('Engagement metrics cannot be negative');
      setResult(null);
      return;
    }

    const totalEngagements = likes + comments + shares;
    const engagementRate = (totalEngagements / followers) * 100;
    const { level, label } = getBenchmark(engagementRate, platform);

    setResult({
      engagementRate,
      engagementPercentage: engagementRate.toFixed(2),
      totalEngagements,
      benchmark: level,
      benchmarkLabel: label,
    });
    setError(null);
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { result, error, calculate, reset };
}
