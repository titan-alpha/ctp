import { useState, useCallback, useMemo } from 'react';

export type Goal = 'maintenance' | 'cutting' | 'bulking';
export type DietType = 'balanced' | 'low-carb' | 'high-protein';
export type Gender = 'male' | 'female';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';

interface MacroResult {
  protein: { grams: number; percentage: number; calories: number };
  carbs: { grams: number; percentage: number; calories: number };
  fat: { grams: number; percentage: number; calories: number };
  totalCalories: number;
  perMeal: {
    protein: number;
    carbs: number;
    fat: number;
    calories: number;
  };
}

interface Stats {
  age: number;
  weight: number; // kg
  height: number; // cm
  gender: Gender;
  activityLevel: ActivityLevel;
}

interface UseMacroCalculatorReturn {
  result: MacroResult | null;
  tdee: number;
  calculateFromTDEE: (tdee: number, goal: Goal, dietType: DietType, mealsPerDay: number) => void;
  calculateFromStats: (stats: Stats, goal: Goal, dietType: DietType, mealsPerDay: number) => void;
  calculateTDEE: (stats: Stats) => number;
  reset: () => void;
}

// Goal calorie adjustments
const GOAL_MULTIPLIERS: Record<Goal, number> = {
  maintenance: 1.0,
  cutting: 0.8, // -20%
  bulking: 1.15, // +15%
};

// Diet type macro splits (carbs/protein/fat percentages)
const DIET_SPLITS: Record<DietType, { carbs: number; protein: number; fat: number }> = {
  balanced: { carbs: 40, protein: 30, fat: 30 },
  'low-carb': { carbs: 25, protein: 40, fat: 35 },
  'high-protein': { carbs: 30, protein: 40, fat: 30 },
};

// Activity level multipliers for TDEE calculation
const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  'very-active': 1.9,
};

export function useMacroCalculator(): UseMacroCalculatorReturn {
  const [result, setResult] = useState<MacroResult | null>(null);
  const [tdee, setTdee] = useState<number>(0);

  const calculateTDEE = useCallback((stats: Stats): number => {
    // Mifflin-St Jeor Equation
    let bmr: number;
    if (stats.gender === 'male') {
      bmr = 10 * stats.weight + 6.25 * stats.height - 5 * stats.age + 5;
    } else {
      bmr = 10 * stats.weight + 6.25 * stats.height - 5 * stats.age - 161;
    }
    return Math.round(bmr * ACTIVITY_MULTIPLIERS[stats.activityLevel]);
  }, []);

  const calculateMacros = useCallback(
    (baseTdee: number, goal: Goal, dietType: DietType, mealsPerDay: number): MacroResult => {
      const targetCalories = Math.round(baseTdee * GOAL_MULTIPLIERS[goal]);
      const splits = DIET_SPLITS[dietType];

      const proteinCalories = (targetCalories * splits.protein) / 100;
      const carbsCalories = (targetCalories * splits.carbs) / 100;
      const fatCalories = (targetCalories * splits.fat) / 100;

      // Protein and carbs = 4 cal/g, fat = 9 cal/g
      const proteinGrams = Math.round(proteinCalories / 4);
      const carbsGrams = Math.round(carbsCalories / 4);
      const fatGrams = Math.round(fatCalories / 9);

      return {
        protein: {
          grams: proteinGrams,
          percentage: splits.protein,
          calories: Math.round(proteinCalories),
        },
        carbs: {
          grams: carbsGrams,
          percentage: splits.carbs,
          calories: Math.round(carbsCalories),
        },
        fat: {
          grams: fatGrams,
          percentage: splits.fat,
          calories: Math.round(fatCalories),
        },
        totalCalories: targetCalories,
        perMeal: {
          protein: Math.round(proteinGrams / mealsPerDay),
          carbs: Math.round(carbsGrams / mealsPerDay),
          fat: Math.round(fatGrams / mealsPerDay),
          calories: Math.round(targetCalories / mealsPerDay),
        },
      };
    },
    []
  );

  const calculateFromTDEE = useCallback(
    (inputTdee: number, goal: Goal, dietType: DietType, mealsPerDay: number) => {
      setTdee(inputTdee);
      setResult(calculateMacros(inputTdee, goal, dietType, mealsPerDay));
    },
    [calculateMacros]
  );

  const calculateFromStats = useCallback(
    (stats: Stats, goal: Goal, dietType: DietType, mealsPerDay: number) => {
      const calculatedTdee = calculateTDEE(stats);
      setTdee(calculatedTdee);
      setResult(calculateMacros(calculatedTdee, goal, dietType, mealsPerDay));
    },
    [calculateTDEE, calculateMacros]
  );

  const reset = useCallback(() => {
    setResult(null);
    setTdee(0);
  }, []);

  return {
    result,
    tdee,
    calculateFromTDEE,
    calculateFromStats,
    calculateTDEE,
    reset,
  };
}
