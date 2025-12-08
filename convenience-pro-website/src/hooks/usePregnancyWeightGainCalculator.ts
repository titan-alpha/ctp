import { useState, useCallback, useMemo } from 'react';

export type BMICategory = 'underweight' | 'normal' | 'overweight' | 'obese';

interface WeightGainRange {
  min: number;
  max: number;
}

interface TrimesterGain {
  trimester: number;
  weekRange: string;
  expectedGain: WeightGainRange;
}

interface WeeklyProgress {
  week: number;
  minWeight: number;
  maxWeight: number;
}

interface PregnancyWeightGainResult {
  bmi: number;
  bmiCategory: BMICategory;
  recommendedRange: WeightGainRange;
  weeklyGainRate: WeightGainRange;
  currentTargetRange: WeightGainRange;
  trimesterBreakdown: TrimesterGain[];
  weeklyProgress: WeeklyProgress[];
}

interface UsePregnancyWeightGainCalculatorReturn {
  result: PregnancyWeightGainResult | null;
  calculate: (prePregnancyWeight: number, heightCm: number, currentWeek: number) => void;
  reset: () => void;
}

// IOM Guidelines for weight gain based on pre-pregnancy BMI
const IOM_GUIDELINES: Record<BMICategory, { range: WeightGainRange; weeklyRate: WeightGainRange }> = {
  underweight: { range: { min: 28, max: 40 }, weeklyRate: { min: 1.0, max: 1.3 } },
  normal: { range: { min: 25, max: 35 }, weeklyRate: { min: 0.8, max: 1.0 } },
  overweight: { range: { min: 15, max: 25 }, weeklyRate: { min: 0.5, max: 0.7 } },
  obese: { range: { min: 11, max: 20 }, weeklyRate: { min: 0.4, max: 0.6 } },
};

function getBMICategory(bmi: number): BMICategory {
  if (bmi < 18.5) return 'underweight';
  if (bmi < 25) return 'normal';
  if (bmi < 30) return 'overweight';
  return 'obese';
}

function calculateBMI(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}

export function usePregnancyWeightGainCalculator(): UsePregnancyWeightGainCalculatorReturn {
  const [result, setResult] = useState<PregnancyWeightGainResult | null>(null);

  const calculate = useCallback((prePregnancyWeight: number, heightCm: number, currentWeek: number) => {
    const bmi = calculateBMI(prePregnancyWeight, heightCm);
    const bmiCategory = getBMICategory(bmi);
    const guidelines = IOM_GUIDELINES[bmiCategory];

    // First trimester: minimal gain (1-4.5 lbs total)
    const firstTrimesterGain = { min: 1, max: 4.5 };

    // Remaining gain spread over 2nd and 3rd trimesters (weeks 14-40)
    const remainingMin = guidelines.range.min - firstTrimesterGain.max;
    const remainingMax = guidelines.range.max - firstTrimesterGain.min;

    // Weekly rate for 2nd and 3rd trimesters
    const weeklyRate = guidelines.weeklyRate;

    // Calculate current target based on week
    let currentMin = 0;
    let currentMax = 0;

    if (currentWeek <= 13) {
      // First trimester: linear gain
      currentMin = (currentWeek / 13) * firstTrimesterGain.min;
      currentMax = (currentWeek / 13) * firstTrimesterGain.max;
    } else {
      // Second/third trimester
      const weeksIntoSecondPhase = currentWeek - 13;
      currentMin = firstTrimesterGain.min + (weeksIntoSecondPhase * weeklyRate.min);
      currentMax = firstTrimesterGain.max + (weeksIntoSecondPhase * weeklyRate.max);
    }

    // Generate weekly progress data for chart
    const weeklyProgress: WeeklyProgress[] = [];
    for (let week = 1; week <= 40; week++) {
      let minW = 0;
      let maxW = 0;

      if (week <= 13) {
        minW = (week / 13) * firstTrimesterGain.min;
        maxW = (week / 13) * firstTrimesterGain.max;
      } else {
        const weeksIn = week - 13;
        minW = firstTrimesterGain.min + (weeksIn * weeklyRate.min);
        maxW = firstTrimesterGain.max + (weeksIn * weeklyRate.max);
      }

      weeklyProgress.push({
        week,
        minWeight: Math.round(minW * 10) / 10,
        maxWeight: Math.round(maxW * 10) / 10,
      });
    }

    // Trimester breakdown
    const trimesterBreakdown: TrimesterGain[] = [
      {
        trimester: 1,
        weekRange: 'Weeks 1-13',
        expectedGain: firstTrimesterGain,
      },
      {
        trimester: 2,
        weekRange: 'Weeks 14-27',
        expectedGain: {
          min: Math.round(14 * weeklyRate.min * 10) / 10,
          max: Math.round(14 * weeklyRate.max * 10) / 10,
        },
      },
      {
        trimester: 3,
        weekRange: 'Weeks 28-40',
        expectedGain: {
          min: Math.round(13 * weeklyRate.min * 10) / 10,
          max: Math.round(13 * weeklyRate.max * 10) / 10,
        },
      },
    ];

    setResult({
      bmi: Math.round(bmi * 10) / 10,
      bmiCategory,
      recommendedRange: guidelines.range,
      weeklyGainRate: weeklyRate,
      currentTargetRange: {
        min: Math.round(currentMin * 10) / 10,
        max: Math.round(currentMax * 10) / 10,
      },
      trimesterBreakdown,
      weeklyProgress,
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
