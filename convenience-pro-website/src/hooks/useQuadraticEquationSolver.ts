import { useState, useCallback } from 'react';

export interface ComplexNumber {
  real: number;
  imaginary: number;
}

export interface QuadraticRoot {
  type: 'real' | 'complex';
  x1: number | ComplexNumber;
  x2: number | ComplexNumber;
}

export interface SolutionStep {
  step: number;
  description: string;
  formula: string;
  result: string;
}

export interface QuadraticResult {
  a: number;
  b: number;
  c: number;
  discriminant: number;
  discriminantType: 'positive' | 'zero' | 'negative';
  roots: QuadraticRoot;
  vertex: { x: number; y: number };
  axisOfSymmetry: number;
  yIntercept: number;
  steps: SolutionStep[];
}

interface UseQuadraticEquationSolverReturn {
  result: QuadraticResult | null;
  error: string | null;
  solve: (a: number, b: number, c: number) => void;
  reset: () => void;
}

function formatNumber(num: number): string {
  if (Number.isInteger(num)) return num.toString();
  return num.toFixed(6).replace(/\.?0+$/, '');
}

function formatComplexRoot(root: ComplexNumber): string {
  const real = formatNumber(root.real);
  const imag = formatNumber(Math.abs(root.imaginary));
  if (root.imaginary >= 0) {
    return `${real} + ${imag}i`;
  }
  return `${real} - ${imag}i`;
}

export function useQuadraticEquationSolver(): UseQuadraticEquationSolverReturn {
  const [result, setResult] = useState<QuadraticResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const solve = useCallback((a: number, b: number, c: number) => {
    if (a === 0) {
      setError('Coefficient "a" cannot be zero for a quadratic equation');
      setResult(null);
      return;
    }

    if (!isFinite(a) || !isFinite(b) || !isFinite(c)) {
      setError('Please enter valid numbers');
      setResult(null);
      return;
    }

    const steps: SolutionStep[] = [];

    // Step 1: Show the equation
    steps.push({
      step: 1,
      description: 'Start with the quadratic equation',
      formula: `${formatNumber(a)}x² + ${formatNumber(b)}x + ${formatNumber(c)} = 0`,
      result: 'Standard form: ax² + bx + c = 0',
    });

    // Step 2: Calculate discriminant
    const discriminant = b * b - 4 * a * c;
    steps.push({
      step: 2,
      description: 'Calculate the discriminant (D = b² - 4ac)',
      formula: `D = (${formatNumber(b)})² - 4(${formatNumber(a)})(${formatNumber(c)})`,
      result: `D = ${formatNumber(b * b)} - ${formatNumber(4 * a * c)} = ${formatNumber(discriminant)}`,
    });

    // Step 3: Determine nature of roots
    let discriminantType: 'positive' | 'zero' | 'negative';
    let rootDescription: string;
    if (discriminant > 0) {
      discriminantType = 'positive';
      rootDescription = 'D > 0: Two distinct real roots';
    } else if (discriminant === 0) {
      discriminantType = 'zero';
      rootDescription = 'D = 0: One repeated real root';
    } else {
      discriminantType = 'negative';
      rootDescription = 'D < 0: Two complex conjugate roots';
    }
    steps.push({
      step: 3,
      description: 'Determine the nature of roots',
      formula: `D = ${formatNumber(discriminant)}`,
      result: rootDescription,
    });

    // Step 4: Apply quadratic formula
    let roots: QuadraticRoot;
    if (discriminant >= 0) {
      const sqrtD = Math.sqrt(discriminant);
      const x1 = (-b + sqrtD) / (2 * a);
      const x2 = (-b - sqrtD) / (2 * a);
      roots = { type: 'real', x1, x2 };

      steps.push({
        step: 4,
        description: 'Apply the quadratic formula: x = (-b ± √D) / 2a',
        formula: `x = (${formatNumber(-b)} ± √${formatNumber(discriminant)}) / ${formatNumber(2 * a)}`,
        result: `x = (${formatNumber(-b)} ± ${formatNumber(sqrtD)}) / ${formatNumber(2 * a)}`,
      });

      steps.push({
        step: 5,
        description: 'Calculate the roots',
        formula: `x₁ = (${formatNumber(-b)} + ${formatNumber(sqrtD)}) / ${formatNumber(2 * a)}, x₂ = (${formatNumber(-b)} - ${formatNumber(sqrtD)}) / ${formatNumber(2 * a)}`,
        result: discriminant === 0
          ? `x = ${formatNumber(x1)} (repeated root)`
          : `x₁ = ${formatNumber(x1)}, x₂ = ${formatNumber(x2)}`,
      });
    } else {
      const sqrtAbsD = Math.sqrt(Math.abs(discriminant));
      const realPart = -b / (2 * a);
      const imagPart = sqrtAbsD / (2 * a);
      roots = {
        type: 'complex',
        x1: { real: realPart, imaginary: imagPart },
        x2: { real: realPart, imaginary: -imagPart },
      };

      steps.push({
        step: 4,
        description: 'Apply the quadratic formula with complex numbers',
        formula: `x = (${formatNumber(-b)} ± √(${formatNumber(discriminant)})) / ${formatNumber(2 * a)}`,
        result: `x = (${formatNumber(-b)} ± ${formatNumber(sqrtAbsD)}i) / ${formatNumber(2 * a)}`,
      });

      steps.push({
        step: 5,
        description: 'Calculate the complex roots',
        formula: `x = ${formatNumber(realPart)} ± ${formatNumber(imagPart)}i`,
        result: `x₁ = ${formatComplexRoot(roots.x1 as ComplexNumber)}, x₂ = ${formatComplexRoot(roots.x2 as ComplexNumber)}`,
      });
    }

    // Calculate vertex and axis of symmetry
    const axisOfSymmetry = -b / (2 * a);
    const vertexY = a * axisOfSymmetry * axisOfSymmetry + b * axisOfSymmetry + c;
    const vertex = { x: axisOfSymmetry, y: vertexY };
    const yIntercept = c;

    setResult({
      a,
      b,
      c,
      discriminant,
      discriminantType,
      roots,
      vertex,
      axisOfSymmetry,
      yIntercept,
      steps,
    });
    setError(null);
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { result, error, solve, reset };
}
