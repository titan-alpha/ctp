import { useState, useCallback } from 'react';

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';
export type Climate = 'hot' | 'moderate' | 'cold';
export type WeightUnit = 'lbs' | 'kg';

interface WaterIntakeResult {
  dailyOz: number;
  dailyLiters: number;
  glasses: number; // 8oz glasses
  reminders: string[];
  breakdown: {
    baseOz: number;
    activityAdjustment: number;
    climateAdjustment: number;
    caffeineAdjustment: number;
  };
}

interface UseWaterIntakeCalculatorReturn {
  result: WaterIntakeResult | null;
  calculate: (
    weight: number,
    weightUnit: WeightUnit,
    activity: ActivityLevel,
    climate: Climate,
    caffeineServings: number
  ) => void;
  reset: () => void;
}

// Activity level multipliers (percentage increase)
const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 0,
  light: 0.1, // +10%
  moderate: 0.2, // +20%
  active: 0.3, // +30%
  'very-active': 0.4, // +40%
};

// Climate adjustments (oz added)
const CLIMATE_ADJUSTMENTS: Record<Climate, number> = {
  hot: 16, // +16 oz
  moderate: 0,
  cold: -8, // -8 oz (less sweating)
};

// Caffeine adjustment: +12 oz per serving (diuretic effect)
const CAFFEINE_ADJUSTMENT_PER_SERVING = 12;

// Hydration reminders based on intake level
const generateReminders = (dailyOz: number, activity: ActivityLevel, climate: Climate): string[] => {
  const reminders: string[] = [];
  const glasses = Math.ceil(dailyOz / 8);

  reminders.push(`Drink ${Math.ceil(glasses / 3)} glasses with each main meal`);
  reminders.push(`Start your day with a glass of water before breakfast`);

  if (activity === 'active' || activity === 'very-active') {
    reminders.push('Drink 16-20 oz of water 2 hours before exercise');
    reminders.push('Drink 8 oz every 15-20 minutes during exercise');
  }

  if (climate === 'hot') {
    reminders.push('Increase intake during outdoor activities in heat');
    reminders.push('Watch for signs of dehydration: dark urine, headaches');
  }

  reminders.push('Keep a reusable water bottle with you throughout the day');

  return reminders;
};

export function useWaterIntakeCalculator(): UseWaterIntakeCalculatorReturn {
  const [result, setResult] = useState<WaterIntakeResult | null>(null);

  const calculate = useCallback(
    (
      weight: number,
      weightUnit: WeightUnit,
      activity: ActivityLevel,
      climate: Climate,
      caffeineServings: number
    ) => {
      // Convert to pounds if needed
      const weightLbs = weightUnit === 'kg' ? weight * 2.205 : weight;

      // Base calculation: 0.5-1 oz per pound (using 0.67 as middle ground)
      const baseOz = Math.round(weightLbs * 0.67);

      // Activity adjustment
      const activityAdjustment = Math.round(baseOz * ACTIVITY_MULTIPLIERS[activity]);

      // Climate adjustment
      const climateAdjustment = CLIMATE_ADJUSTMENTS[climate];

      // Caffeine adjustment
      const caffeineAdjustment = caffeineServings * CAFFEINE_ADJUSTMENT_PER_SERVING;

      // Total daily intake
      const dailyOz = Math.max(64, baseOz + activityAdjustment + climateAdjustment + caffeineAdjustment);
      const dailyLiters = Math.round((dailyOz * 0.0296) * 100) / 100;
      const glasses = Math.ceil(dailyOz / 8);

      const reminders = generateReminders(dailyOz, activity, climate);

      setResult({
        dailyOz,
        dailyLiters,
        glasses,
        reminders,
        breakdown: {
          baseOz,
          activityAdjustment,
          climateAdjustment,
          caffeineAdjustment,
        },
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
