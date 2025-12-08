import { useState, useCallback } from 'react';

export type Gender = 'male' | 'female';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';

interface TDEEInput {
  age: number;
  gender: Gender;
  height: number; // cm
  weight: number; // kg
  activityLevel: ActivityLevel;
}

interface MacroSuggestion {
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
}

interface TDEEResult {
  bmr: number;
  tdee: number;
  macros: MacroSuggestion;
  calorieGoals: {
    cut: number;
    maintain: number;
    bulk: number;
  };
}

interface UseTDEECalculatorReturn {
  result: TDEEResult | null;
  calculate: (input: TDEEInput) => void;
  reset: () => void;
}

// Activity level multipliers
const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  'very-active': 1.9,
};

export function useTDEECalculator(): UseTDEECalculatorReturn {
  const [result, setResult] = useState<TDEEResult | null>(null);

  const calculate = useCallback((input: TDEEInput) => {
    // Mifflin-St Jeor Equation for BMR
    let bmr: number;
    if (input.gender === 'male') {
      bmr = 10 * input.weight + 6.25 * input.height - 5 * input.age + 5;
    } else {
      bmr = 10 * input.weight + 6.25 * input.height - 5 * input.age - 161;
    }
    bmr = Math.round(bmr);

    // Calculate TDEE
    const tdee = Math.round(bmr * ACTIVITY_MULTIPLIERS[input.activityLevel]);

    // Calorie goals
    const calorieGoals = {
      cut: Math.round(tdee * 0.8), // -20%
      maintain: tdee,
      bulk: Math.round(tdee * 1.15), // +15%
    };

    // Macro suggestions (balanced: 40% carbs, 30% protein, 30% fat)
    const macros: MacroSuggestion = {
      protein: Math.round((tdee * 0.3) / 4), // 4 cal/g
      carbs: Math.round((tdee * 0.4) / 4), // 4 cal/g
      fat: Math.round((tdee * 0.3) / 9), // 9 cal/g
    };

    setResult({ bmr, tdee, macros, calorieGoals });
  }, []);

  const reset = useCallback(() => {
    setResult(null);
  }, []);

  return { result, calculate, reset };
}
