import { useState, useCallback } from 'react';

type CalculationMode = 'single' | 'combined' | 'permutation';
type CombinedOperation = 'and' | 'or' | 'not';

interface SingleEventResult {
  mode: 'single';
  favorable: number;
  total: number;
  probability: number;
  percentage: number;
  odds: string;
}

interface CombinedEventResult {
  mode: 'combined';
  operation: CombinedOperation;
  probabilityA: number;
  probabilityB?: number;
  result: number;
  percentage: number;
  explanation: string;
}

interface PermutationResult {
  mode: 'permutation';
  type: 'permutation' | 'combination';
  n: number;
  r: number;
  result: number;
  formula: string;
  explanation: string;
}

type ProbabilityResult = SingleEventResult | CombinedEventResult | PermutationResult;

interface UseProbabilityCalculatorReturn {
  result: ProbabilityResult | null;
  error: string | null;
  calculateSingleEvent: (favorable: number, total: number) => void;
  calculateCombined: (operation: CombinedOperation, pA: number, pB?: number) => void;
  calculatePermutation: (n: number, r: number) => void;
  calculateCombination: (n: number, r: number) => void;
  reset: () => void;
}

function factorial(n: number): number {
  if (n < 0) return NaN;
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

function permutation(n: number, r: number): number {
  if (r > n || r < 0 || n < 0) return NaN;
  return factorial(n) / factorial(n - r);
}

function combination(n: number, r: number): number {
  if (r > n || r < 0 || n < 0) return NaN;
  return factorial(n) / (factorial(r) * factorial(n - r));
}

function formatOdds(probability: number): string {
  if (probability === 0) return '0:1';
  if (probability === 1) return '1:0';
  const against = (1 - probability) / probability;
  if (against >= 1) {
    return `1:${Math.round(against * 100) / 100}`;
  }
  return `${Math.round((1 / against) * 100) / 100}:1`;
}

export function useProbabilityCalculator(): UseProbabilityCalculatorReturn {
  const [result, setResult] = useState<ProbabilityResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculateSingleEvent = useCallback((favorable: number, total: number) => {
    if (total <= 0) {
      setError('Total outcomes must be greater than 0');
      setResult(null);
      return;
    }
    if (favorable < 0) {
      setError('Favorable outcomes cannot be negative');
      setResult(null);
      return;
    }
    if (favorable > total) {
      setError('Favorable outcomes cannot exceed total outcomes');
      setResult(null);
      return;
    }

    const probability = favorable / total;
    setResult({
      mode: 'single',
      favorable,
      total,
      probability: Math.round(probability * 10000) / 10000,
      percentage: Math.round(probability * 10000) / 100,
      odds: formatOdds(probability),
    });
    setError(null);
  }, []);

  const calculateCombined = useCallback((operation: CombinedOperation, pA: number, pB?: number) => {
    if (pA < 0 || pA > 1) {
      setError('Probability A must be between 0 and 1');
      setResult(null);
      return;
    }
    if (operation !== 'not' && (pB === undefined || pB < 0 || pB > 1)) {
      setError('Probability B must be between 0 and 1');
      setResult(null);
      return;
    }

    let resultValue: number;
    let explanation: string;

    switch (operation) {
      case 'and':
        resultValue = pA * (pB as number);
        explanation = `P(A AND B) = P(A) x P(B) = ${pA} x ${pB} = ${Math.round(resultValue * 10000) / 10000}`;
        break;
      case 'or':
        resultValue = pA + (pB as number) - pA * (pB as number);
        explanation = `P(A OR B) = P(A) + P(B) - P(A)P(B) = ${pA} + ${pB} - ${Math.round(pA * (pB as number) * 10000) / 10000} = ${Math.round(resultValue * 10000) / 10000}`;
        break;
      case 'not':
        resultValue = 1 - pA;
        explanation = `P(NOT A) = 1 - P(A) = 1 - ${pA} = ${Math.round(resultValue * 10000) / 10000}`;
        break;
      default:
        setError('Invalid operation');
        return;
    }

    setResult({
      mode: 'combined',
      operation,
      probabilityA: pA,
      probabilityB: pB,
      result: Math.round(resultValue * 10000) / 10000,
      percentage: Math.round(resultValue * 10000) / 100,
      explanation,
    });
    setError(null);
  }, []);

  const calculatePermutation = useCallback((n: number, r: number) => {
    if (!Number.isInteger(n) || !Number.isInteger(r) || n < 0 || r < 0) {
      setError('n and r must be non-negative integers');
      setResult(null);
      return;
    }
    if (r > n) {
      setError('r cannot be greater than n');
      setResult(null);
      return;
    }
    if (n > 170) {
      setError('n must be 170 or less to avoid overflow');
      setResult(null);
      return;
    }

    const resultValue = permutation(n, r);
    setResult({
      mode: 'permutation',
      type: 'permutation',
      n,
      r,
      result: resultValue,
      formula: `P(${n},${r}) = ${n}!/(${n}-${r})!`,
      explanation: `The number of ways to arrange ${r} items from ${n} items where order matters is ${resultValue.toLocaleString()}.`,
    });
    setError(null);
  }, []);

  const calculateCombination = useCallback((n: number, r: number) => {
    if (!Number.isInteger(n) || !Number.isInteger(r) || n < 0 || r < 0) {
      setError('n and r must be non-negative integers');
      setResult(null);
      return;
    }
    if (r > n) {
      setError('r cannot be greater than n');
      setResult(null);
      return;
    }
    if (n > 170) {
      setError('n must be 170 or less to avoid overflow');
      setResult(null);
      return;
    }

    const resultValue = combination(n, r);
    setResult({
      mode: 'permutation',
      type: 'combination',
      n,
      r,
      result: resultValue,
      formula: `C(${n},${r}) = ${n}!/(${r}!(${n}-${r})!)`,
      explanation: `The number of ways to choose ${r} items from ${n} items where order does not matter is ${resultValue.toLocaleString()}.`,
    });
    setError(null);
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    result,
    error,
    calculateSingleEvent,
    calculateCombined,
    calculatePermutation,
    calculateCombination,
    reset,
  };
}
