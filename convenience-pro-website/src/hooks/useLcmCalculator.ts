import { useState, useCallback } from 'react';

interface CalculationStep {
  description: string;
  formula?: string;
  result?: string;
}

interface UseLcmCalculatorReturn {
  lcm: number | null;
  steps: CalculationStep[];
  calculate: (numbers: number[]) => void;
  reset: () => void;
}

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

function lcmOfTwo(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b);
}

export function useLcmCalculator(): UseLcmCalculatorReturn {
  const [lcm, setLcm] = useState<number | null>(null);
  const [steps, setSteps] = useState<CalculationStep[]>([]);

  const calculate = useCallback((numbers: number[]) => {
    const validNumbers = numbers.filter((n) => !isNaN(n) && n !== 0);

    if (validNumbers.length < 2) {
      setLcm(null);
      setSteps([]);
      return;
    }

    const calculationSteps: CalculationStep[] = [];

    calculationSteps.push({
      description: 'Input numbers',
      result: validNumbers.join(', '),
    });

    calculationSteps.push({
      description: 'Formula: LCM(a, b) = |a x b| / GCD(a, b)',
    });

    let result = validNumbers[0];

    for (let i = 1; i < validNumbers.length; i++) {
      const a = result;
      const b = validNumbers[i];
      const gcdValue = gcd(a, b);
      const newLcm = lcmOfTwo(a, b);

      calculationSteps.push({
        description: `Step ${i}: Calculate LCM(${a}, ${b})`,
        formula: `GCD(${a}, ${b}) = ${gcdValue}`,
        result: `LCM = |${a} x ${b}| / ${gcdValue} = ${Math.abs(a * b)} / ${gcdValue} = ${newLcm}`,
      });

      result = newLcm;
    }

    calculationSteps.push({
      description: 'Final Result',
      result: `LCM(${validNumbers.join(', ')}) = ${result}`,
    });

    setLcm(result);
    setSteps(calculationSteps);
  }, []);

  const reset = useCallback(() => {
    setLcm(null);
    setSteps([]);
  }, []);

  return { lcm, steps, calculate, reset };
}
