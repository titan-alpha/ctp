import { useState, useCallback } from 'react';

interface NpsBreakdown {
  promoters: number;
  passives: number;
  detractors: number;
  promoterPercentage: number;
  passivePercentage: number;
  detractorPercentage: number;
  totalResponses: number;
}

interface NpsResult {
  npsScore: number;
  breakdown: NpsBreakdown;
  interpretation: string;
  category: 'excellent' | 'great' | 'good' | 'needs-improvement' | 'critical';
}

interface UseNpsCalculatorReturn {
  result: NpsResult | null;
  error: string | null;
  calculate: (responses: Record<number, number>) => void;
  reset: () => void;
}

function getInterpretation(score: number): { interpretation: string; category: NpsResult['category'] } {
  if (score >= 70) {
    return { interpretation: 'Excellent! World-class customer loyalty. Your customers are enthusiastic advocates.', category: 'excellent' };
  } else if (score >= 50) {
    return { interpretation: 'Great! Strong customer loyalty with many promoters. Keep up the good work.', category: 'great' };
  } else if (score >= 0) {
    return { interpretation: 'Good start, but there\'s room for improvement. Focus on converting passives to promoters.', category: 'good' };
  } else if (score >= -50) {
    return { interpretation: 'Needs improvement. You have more detractors than promoters. Investigate customer pain points.', category: 'needs-improvement' };
  } else {
    return { interpretation: 'Critical situation. Significant customer dissatisfaction requires immediate attention.', category: 'critical' };
  }
}

export function useNpsCalculator(): UseNpsCalculatorReturn {
  const [result, setResult] = useState<NpsResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculate = useCallback((responses: Record<number, number>) => {
    // Validate all scores are 0-10
    for (const [score, count] of Object.entries(responses)) {
      const scoreNum = parseInt(score);
      if (scoreNum < 0 || scoreNum > 10) {
        setError('Scores must be between 0 and 10');
        setResult(null);
        return;
      }
      if (count < 0) {
        setError('Response counts cannot be negative');
        setResult(null);
        return;
      }
    }

    // Calculate totals
    let detractors = 0; // 0-6
    let passives = 0;   // 7-8
    let promoters = 0;  // 9-10

    for (let score = 0; score <= 6; score++) {
      detractors += responses[score] || 0;
    }
    for (let score = 7; score <= 8; score++) {
      passives += responses[score] || 0;
    }
    for (let score = 9; score <= 10; score++) {
      promoters += responses[score] || 0;
    }

    const totalResponses = detractors + passives + promoters;

    if (totalResponses === 0) {
      setError('Please enter at least one response');
      setResult(null);
      return;
    }

    const promoterPercentage = (promoters / totalResponses) * 100;
    const passivePercentage = (passives / totalResponses) * 100;
    const detractorPercentage = (detractors / totalResponses) * 100;

    // NPS = % Promoters - % Detractors
    const npsScore = Math.round(promoterPercentage - detractorPercentage);

    const { interpretation, category } = getInterpretation(npsScore);

    setResult({
      npsScore,
      breakdown: {
        promoters,
        passives,
        detractors,
        promoterPercentage: Math.round(promoterPercentage * 10) / 10,
        passivePercentage: Math.round(passivePercentage * 10) / 10,
        detractorPercentage: Math.round(detractorPercentage * 10) / 10,
        totalResponses,
      },
      interpretation,
      category,
    });
    setError(null);
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { result, error, calculate, reset };
}
