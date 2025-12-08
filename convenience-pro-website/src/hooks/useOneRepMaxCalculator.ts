import { useState, useCallback } from 'react';

export interface FormulaResult {
  name: string;
  oneRepMax: number;
  formula: string;
}

export interface TrainingLoad {
  percentage: number;
  weight: number;
  reps: string;
}

interface OneRepMaxResult {
  epley: FormulaResult;
  brzycki: FormulaResult;
  average: number;
  trainingLoads: TrainingLoad[];
}

interface UseOneRepMaxCalculatorReturn {
  result: OneRepMaxResult | null;
  calculate: (weight: number, reps: number) => void;
  reset: () => void;
}

const TRAINING_PERCENTAGES = [100, 95, 90, 85, 80, 75, 70, 65, 60, 55, 50];

const REP_RANGES: Record<number, string> = {
  100: '1',
  95: '2',
  90: '3-4',
  85: '5-6',
  80: '7-8',
  75: '9-10',
  70: '11-12',
  65: '13-15',
  60: '16-18',
  55: '19-22',
  50: '23+',
};

export function useOneRepMaxCalculator(): UseOneRepMaxCalculatorReturn {
  const [result, setResult] = useState<OneRepMaxResult | null>(null);

  const calculate = useCallback((weight: number, reps: number) => {
    if (weight <= 0 || reps <= 0 || reps > 30) {
      return;
    }

    // Epley Formula: weight × (1 + reps/30)
    const epleyMax = reps === 1 ? weight : Math.round(weight * (1 + reps / 30));

    // Brzycki Formula: weight × 36/(37-reps)
    const brzyckiMax = reps === 1 ? weight : Math.round(weight * (36 / (37 - reps)));

    const average = Math.round((epleyMax + brzyckiMax) / 2);

    const trainingLoads: TrainingLoad[] = TRAINING_PERCENTAGES.map((percentage) => ({
      percentage,
      weight: Math.round(average * (percentage / 100)),
      reps: REP_RANGES[percentage],
    }));

    setResult({
      epley: {
        name: 'Epley',
        oneRepMax: epleyMax,
        formula: `${weight} x (1 + ${reps}/30) = ${epleyMax}`,
      },
      brzycki: {
        name: 'Brzycki',
        oneRepMax: brzyckiMax,
        formula: `${weight} x 36/(37-${reps}) = ${brzyckiMax}`,
      },
      average,
      trainingLoads,
    });
  }, []);

  const reset = useCallback(() => {
    setResult(null);
  }, []);

  return {
    result,
    calculate,
    reset,
  };
}
