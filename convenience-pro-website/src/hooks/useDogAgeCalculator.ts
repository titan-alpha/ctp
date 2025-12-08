import { useState, useCallback } from 'react';

export type DogSize = 'small' | 'medium' | 'large';

export interface DogAgeResult {
  humanAge: number;
  lifeStage: 'puppy' | 'young' | 'adult' | 'mature' | 'senior';
  lifeStageLabel: string;
  description: string;
}

interface UseDogAgeCalculatorReturn {
  result: DogAgeResult | null;
  dogAge: number;
  dogSize: DogSize;
  setDogAge: (age: number) => void;
  setDogSize: (size: DogSize) => void;
  calculate: () => void;
  reset: () => void;
}

// Non-linear calculation based on dog size
// First 2 years age faster, then it varies by size
function calculateHumanAge(dogAge: number, size: DogSize): number {
  if (dogAge <= 0) return 0;

  // First year multipliers by size
  const firstYearMultiplier = { small: 15, medium: 15, large: 12 };
  // Second year multipliers by size
  const secondYearMultiplier = { small: 9, medium: 9, large: 9 };
  // Subsequent years multipliers by size
  const subsequentMultiplier = { small: 4, medium: 5, large: 6 };

  let humanAge = 0;

  if (dogAge <= 1) {
    humanAge = dogAge * firstYearMultiplier[size];
  } else if (dogAge <= 2) {
    humanAge = firstYearMultiplier[size] + (dogAge - 1) * secondYearMultiplier[size];
  } else {
    humanAge =
      firstYearMultiplier[size] +
      secondYearMultiplier[size] +
      (dogAge - 2) * subsequentMultiplier[size];
  }

  return Math.round(humanAge * 10) / 10;
}

function getLifeStage(
  dogAge: number,
  size: DogSize
): { stage: DogAgeResult['lifeStage']; label: string; description: string } {
  // Life stage thresholds vary by size (larger dogs age faster)
  const thresholds = {
    small: { puppy: 1, young: 2, adult: 7, mature: 10 },
    medium: { puppy: 1, young: 2, adult: 6, mature: 8 },
    large: { puppy: 1, young: 2, adult: 5, mature: 7 },
  };

  const t = thresholds[size];

  if (dogAge < t.puppy) {
    return {
      stage: 'puppy',
      label: 'Puppy',
      description: 'Rapid growth and development phase. Focus on socialization and basic training.',
    };
  } else if (dogAge < t.young) {
    return {
      stage: 'young',
      label: 'Young Adult',
      description: 'Full of energy and reaching physical maturity. Great time for advanced training.',
    };
  } else if (dogAge < t.adult) {
    return {
      stage: 'adult',
      label: 'Adult',
      description: 'Prime years with stable behavior and energy levels. Maintain regular exercise.',
    };
  } else if (dogAge < t.mature) {
    return {
      stage: 'mature',
      label: 'Mature',
      description: 'May start slowing down. Consider joint supplements and regular vet checkups.',
    };
  } else {
    return {
      stage: 'senior',
      label: 'Senior',
      description: 'Golden years requiring extra care, comfort, and more frequent health monitoring.',
    };
  }
}

export function useDogAgeCalculator(): UseDogAgeCalculatorReturn {
  const [result, setResult] = useState<DogAgeResult | null>(null);
  const [dogAge, setDogAge] = useState<number>(1);
  const [dogSize, setDogSize] = useState<DogSize>('medium');

  const calculate = useCallback(() => {
    if (dogAge < 0) return;

    const humanAge = calculateHumanAge(dogAge, dogSize);
    const { stage, label, description } = getLifeStage(dogAge, dogSize);

    setResult({
      humanAge,
      lifeStage: stage,
      lifeStageLabel: label,
      description,
    });
  }, [dogAge, dogSize]);

  const reset = useCallback(() => {
    setResult(null);
    setDogAge(1);
    setDogSize('medium');
  }, []);

  return {
    result,
    dogAge,
    dogSize,
    setDogAge,
    setDogSize,
    calculate,
    reset,
  };
}
