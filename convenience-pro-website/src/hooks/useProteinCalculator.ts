import { useState, useCallback } from 'react';

export type ActivityLevel = 'sedentary' | 'active' | 'athlete' | 'bodybuilder';
export type Goal = 'maintain' | 'build' | 'lose';

interface ProteinResult {
  gramsPerDay: number;
  gramsPerMeal: number;
  gramsPerKg: number;
  minGrams: number;
  maxGrams: number;
}

interface UseProteinCalculatorReturn {
  result: ProteinResult | null;
  calculate: (weightKg: number, activityLevel: ActivityLevel, goal: Goal, mealsPerDay: number) => void;
  reset: () => void;
}

// Protein multipliers (g/kg) by activity level
const PROTEIN_RANGES: Record<ActivityLevel, { min: number; max: number }> = {
  sedentary: { min: 0.8, max: 0.8 },
  active: { min: 1.2, max: 1.6 },
  athlete: { min: 1.6, max: 2.2 },
  bodybuilder: { min: 2.2, max: 2.7 },
};

// Goal adjustments
const GOAL_ADJUSTMENTS: Record<Goal, number> = {
  maintain: 0,
  build: 0.2, // Add 0.2 g/kg for muscle building
  lose: 0.3, // Add 0.3 g/kg to preserve muscle during deficit
};

export function useProteinCalculator(): UseProteinCalculatorReturn {
  const [result, setResult] = useState<ProteinResult | null>(null);

  const calculate = useCallback(
    (weightKg: number, activityLevel: ActivityLevel, goal: Goal, mealsPerDay: number) => {
      const range = PROTEIN_RANGES[activityLevel];
      const goalAdjustment = GOAL_ADJUSTMENTS[goal];

      const minMultiplier = range.min + goalAdjustment;
      const maxMultiplier = range.max + goalAdjustment;
      const avgMultiplier = (minMultiplier + maxMultiplier) / 2;

      const minGrams = Math.round(weightKg * minMultiplier);
      const maxGrams = Math.round(weightKg * maxMultiplier);
      const gramsPerDay = Math.round(weightKg * avgMultiplier);
      const gramsPerMeal = Math.round(gramsPerDay / mealsPerDay);

      setResult({
        gramsPerDay,
        gramsPerMeal,
        gramsPerKg: Math.round(avgMultiplier * 10) / 10,
        minGrams,
        maxGrams,
      });
    },
    []
  );

  const reset = useCallback(() => {
    setResult(null);
  }, []);

  return {
    result,
    calculate,
    reset,
  };
}
