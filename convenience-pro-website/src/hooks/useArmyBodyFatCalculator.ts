import { useState, useCallback } from 'react';

export type Gender = 'male' | 'female';

interface ArmyBodyFatInput {
  gender: Gender;
  height: number; // inches
  neck: number; // inches
  waist: number; // inches
  hip?: number; // inches (required for women)
}

interface ArmyBodyFatResult {
  bodyFatPercentage: number;
  category: string;
  meetsStandard: boolean;
  maxAllowedBodyFat: number;
}

interface UseArmyBodyFatCalculatorReturn {
  result: ArmyBodyFatResult | null;
  calculate: (input: ArmyBodyFatInput) => void;
  reset: () => void;
}

// Army body fat standards by age group (approximate max percentages)
const ARMY_STANDARDS = {
  male: { min: 18, max: 26 }, // 17-20: 20%, 21-27: 22%, 28-39: 24%, 40+: 26%
  female: { min: 26, max: 36 }, // 17-20: 30%, 21-27: 32%, 28-39: 34%, 40+: 36%
};

function getCategory(bodyFat: number, gender: Gender): string {
  if (gender === 'male') {
    if (bodyFat < 6) return 'Essential Fat';
    if (bodyFat < 14) return 'Athletic';
    if (bodyFat < 18) return 'Fitness';
    if (bodyFat < 25) return 'Average';
    return 'Above Average';
  } else {
    if (bodyFat < 14) return 'Essential Fat';
    if (bodyFat < 21) return 'Athletic';
    if (bodyFat < 25) return 'Fitness';
    if (bodyFat < 32) return 'Average';
    return 'Above Average';
  }
}

export function useArmyBodyFatCalculator(): UseArmyBodyFatCalculatorReturn {
  const [result, setResult] = useState<ArmyBodyFatResult | null>(null);

  const calculate = useCallback((input: ArmyBodyFatInput) => {
    let bodyFatPercentage: number;

    if (input.gender === 'male') {
      // Male formula: %BF = 86.010 × log10(waist - neck) - 70.041 × log10(height) + 36.76
      bodyFatPercentage =
        86.01 * Math.log10(input.waist - input.neck) -
        70.041 * Math.log10(input.height) +
        36.76;
    } else {
      // Female formula: %BF = 163.205 × log10(waist + hip - neck) - 97.684 × log10(height) - 78.387
      const hip = input.hip || 0;
      bodyFatPercentage =
        163.205 * Math.log10(input.waist + hip - input.neck) -
        97.684 * Math.log10(input.height) -
        78.387;
    }

    bodyFatPercentage = Math.round(bodyFatPercentage * 10) / 10;

    const category = getCategory(bodyFatPercentage, input.gender);
    const maxAllowedBodyFat = ARMY_STANDARDS[input.gender].max;
    const meetsStandard = bodyFatPercentage <= maxAllowedBodyFat;

    setResult({
      bodyFatPercentage,
      category,
      meetsStandard,
      maxAllowedBodyFat,
    });
  }, []);

  const reset = useCallback(() => {
    setResult(null);
  }, []);

  return { result, calculate, reset };
}
