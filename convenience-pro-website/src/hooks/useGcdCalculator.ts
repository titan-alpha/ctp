import { useState, useCallback } from 'react';

export interface GcdStep {
  a: number;
  b: number;
  quotient: number;
  remainder: number;
  explanation: string;
}

interface UseGcdCalculatorReturn {
  result: number | null;
  steps: GcdStep[];
  calculate: (numbers: number[]) => void;
  reset: () => void;
}

function gcdWithSteps(a: number, b: number): { gcd: number; steps: GcdStep[] } {
  const steps: GcdStep[] = [];
  a = Math.abs(a);
  b = Math.abs(b);

  if (a < b) [a, b] = [b, a];

  while (b !== 0) {
    const quotient = Math.floor(a / b);
    const remainder = a % b;
    steps.push({
      a,
      b,
      quotient,
      remainder,
      explanation: `${a} = ${b} x ${quotient} + ${remainder}`,
    });
    a = b;
    b = remainder;
  }

  return { gcd: a, steps };
}

export function useGcdCalculator(): UseGcdCalculatorReturn {
  const [result, setResult] = useState<number | null>(null);
  const [steps, setSteps] = useState<GcdStep[]>([]);

  const calculate = useCallback((numbers: number[]) => {
    const validNumbers = numbers.filter((n) => !isNaN(n) && n !== 0);

    if (validNumbers.length === 0) {
      setResult(null);
      setSteps([]);
      return;
    }

    if (validNumbers.length === 1) {
      setResult(Math.abs(validNumbers[0]));
      setSteps([]);
      return;
    }

    let currentGcd = Math.abs(validNumbers[0]);
    const allSteps: GcdStep[] = [];

    for (let i = 1; i < validNumbers.length; i++) {
      const { gcd, steps: pairSteps } = gcdWithSteps(currentGcd, Math.abs(validNumbers[i]));
      allSteps.push(...pairSteps);
      currentGcd = gcd;
    }

    setResult(currentGcd);
    setSteps(allSteps);
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setSteps([]);
  }, []);

  return { result, steps, calculate, reset };
}
