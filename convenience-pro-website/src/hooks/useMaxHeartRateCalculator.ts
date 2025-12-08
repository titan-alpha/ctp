import { useState, useCallback } from 'react';

export type Gender = 'male' | 'female';

interface FormulaResults {
  traditional: number; // 220 - age
  tanaka: number; // 208 - 0.7 × age
  gulati: number | null; // 206 - 0.88 × age (women only)
}

interface TargetZone {
  name: string;
  minPercent: number;
  maxPercent: number;
  minBpm: number;
  maxBpm: number;
  description: string;
}

interface MaxHeartRateResult {
  formulas: FormulaResults;
  average: number;
  targetZones: TargetZone[];
}

interface UseMaxHeartRateCalculatorReturn {
  result: MaxHeartRateResult | null;
  calculate: (age: number, gender?: Gender) => void;
  reset: () => void;
}

export function useMaxHeartRateCalculator(): UseMaxHeartRateCalculatorReturn {
  const [result, setResult] = useState<MaxHeartRateResult | null>(null);

  const calculate = useCallback((age: number, gender?: Gender) => {
    if (age <= 0 || age > 120) {
      setResult(null);
      return;
    }

    // Calculate MHR using different formulas
    const traditional = Math.round(220 - age);
    const tanaka = Math.round(208 - 0.7 * age);
    const gulati = gender === 'female' ? Math.round(206 - 0.88 * age) : null;

    const formulas: FormulaResults = {
      traditional,
      tanaka,
      gulati,
    };

    // Calculate average (include Gulati only for women)
    const values = [traditional, tanaka];
    if (gulati !== null) {
      values.push(gulati);
    }
    const average = Math.round(values.reduce((a, b) => a + b, 0) / values.length);

    // Calculate target heart rate zones based on average MHR
    const targetZones: TargetZone[] = [
      {
        name: 'Zone 1 - Recovery',
        minPercent: 50,
        maxPercent: 60,
        minBpm: Math.round(average * 0.5),
        maxBpm: Math.round(average * 0.6),
        description: 'Light activity, warm-up, cool-down',
      },
      {
        name: 'Zone 2 - Fat Burn',
        minPercent: 60,
        maxPercent: 70,
        minBpm: Math.round(average * 0.6),
        maxBpm: Math.round(average * 0.7),
        description: 'Endurance training, fat oxidation',
      },
      {
        name: 'Zone 3 - Aerobic',
        minPercent: 70,
        maxPercent: 80,
        minBpm: Math.round(average * 0.7),
        maxBpm: Math.round(average * 0.8),
        description: 'Cardio fitness, moderate intensity',
      },
      {
        name: 'Zone 4 - Anaerobic',
        minPercent: 80,
        maxPercent: 90,
        minBpm: Math.round(average * 0.8),
        maxBpm: Math.round(average * 0.9),
        description: 'High intensity, performance training',
      },
      {
        name: 'Zone 5 - Maximum',
        minPercent: 90,
        maxPercent: 100,
        minBpm: Math.round(average * 0.9),
        maxBpm: average,
        description: 'Maximum effort, short bursts only',
      },
    ];

    setResult({
      formulas,
      average,
      targetZones,
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
