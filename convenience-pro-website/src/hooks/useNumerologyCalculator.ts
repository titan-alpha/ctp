import { useState, useCallback } from 'react';

export interface NumerologyResult {
  lifePathNumber: number;
  lifePathMeaning: string;
  expressionNumber: number | null;
  expressionMeaning: string | null;
}

interface UseNumerologyCalculatorReturn {
  result: NumerologyResult | null;
  birthdate: string;
  name: string;
  setBirthdate: (date: string) => void;
  setName: (name: string) => void;
  calculate: () => void;
  reset: () => void;
}

const LIFE_PATH_MEANINGS: Record<number, string> = {
  1: 'The Leader - Independent, ambitious, and innovative. You are a natural pioneer with strong willpower and determination to succeed.',
  2: 'The Mediator - Diplomatic, cooperative, and sensitive. You excel at bringing harmony and balance to relationships and situations.',
  3: 'The Communicator - Creative, expressive, and social. You have natural artistic talents and the ability to inspire others.',
  4: 'The Builder - Practical, disciplined, and hardworking. You create solid foundations and bring order to chaos.',
  5: 'The Freedom Seeker - Adventurous, versatile, and dynamic. You thrive on change and new experiences.',
  6: 'The Nurturer - Responsible, caring, and protective. You are devoted to family and community service.',
  7: 'The Seeker - Analytical, introspective, and spiritual. You search for deeper truths and understanding.',
  8: 'The Powerhouse - Ambitious, authoritative, and successful. You have strong business acumen and material goals.',
  9: 'The Humanitarian - Compassionate, selfless, and wise. You are driven to make the world a better place.',
  11: 'The Intuitive (Master Number) - Highly intuitive, inspirational, and visionary. You have the potential for spiritual enlightenment.',
  22: 'The Master Builder (Master Number) - Powerful, practical visionary. You can turn dreams into reality on a grand scale.',
  33: 'The Master Teacher (Master Number) - Selfless, nurturing, and spiritually evolved. You uplift humanity through love and service.',
};

const EXPRESSION_MEANINGS: Record<number, string> = {
  1: 'Natural leadership abilities and original thinking define your expression.',
  2: 'You express yourself through cooperation, diplomacy, and sensitivity.',
  3: 'Your expression is creative, joyful, and communicative.',
  4: 'You express yourself through hard work, practicality, and reliability.',
  5: 'Your expression is adventurous, versatile, and freedom-loving.',
  6: 'You express yourself through nurturing, responsibility, and harmony.',
  7: 'Your expression is analytical, spiritual, and introspective.',
  8: 'You express yourself through ambition, authority, and material mastery.',
  9: 'Your expression is humanitarian, compassionate, and idealistic.',
  11: 'Master intuition and inspiration define your expression.',
  22: 'Master builder energy flows through your expression.',
  33: 'Master teacher compassion defines your expression.',
};

// Letter to number mapping (Pythagorean system)
const LETTER_VALUES: Record<string, number> = {
  a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
  j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
  s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8,
};

function reduceToSingleDigit(num: number, preserveMaster: boolean = true): number {
  while (num > 9) {
    if (preserveMaster && (num === 11 || num === 22 || num === 33)) {
      return num;
    }
    num = String(num).split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  }
  return num;
}

function calculateLifePathNumber(birthdate: string): number {
  const [year, month, day] = birthdate.split('-').map(Number);

  // Reduce each component separately
  const dayReduced = reduceToSingleDigit(day, false);
  const monthReduced = reduceToSingleDigit(month, false);
  const yearReduced = reduceToSingleDigit(year, false);

  // Sum and reduce, preserving master numbers
  const total = dayReduced + monthReduced + yearReduced;
  return reduceToSingleDigit(total, true);
}

function calculateExpressionNumber(name: string): number | null {
  const cleanName = name.toLowerCase().replace(/[^a-z]/g, '');
  if (cleanName.length === 0) return null;

  const total = cleanName.split('').reduce((sum, letter) => {
    return sum + (LETTER_VALUES[letter] || 0);
  }, 0);

  return reduceToSingleDigit(total, true);
}

export function useNumerologyCalculator(): UseNumerologyCalculatorReturn {
  const [result, setResult] = useState<NumerologyResult | null>(null);
  const [birthdate, setBirthdate] = useState<string>('');
  const [name, setName] = useState<string>('');

  const calculate = useCallback(() => {
    if (!birthdate) return;

    const lifePathNumber = calculateLifePathNumber(birthdate);
    const expressionNumber = name ? calculateExpressionNumber(name) : null;

    setResult({
      lifePathNumber,
      lifePathMeaning: LIFE_PATH_MEANINGS[lifePathNumber] || 'Unknown meaning',
      expressionNumber,
      expressionMeaning: expressionNumber ? EXPRESSION_MEANINGS[expressionNumber] || null : null,
    });
  }, [birthdate, name]);

  const reset = useCallback(() => {
    setResult(null);
    setBirthdate('');
    setName('');
  }, []);

  return {
    result,
    birthdate,
    name,
    setBirthdate,
    setName,
    calculate,
    reset,
  };
}
