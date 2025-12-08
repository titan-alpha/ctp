import { useState, useCallback } from 'react';

interface ConversionResult {
  decimal: string;
  fraction: string;
  mixedNumber: string;
  simplified: string;
}

interface UseFractionToDecimalReturn {
  result: ConversionResult | null;
  error: string;
  convertFractionToDecimal: (numerator: number, denominator: number, wholeNumber?: number) => void;
  convertDecimalToFraction: (decimal: string) => void;
  reset: () => void;
}

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

function simplifyFraction(numerator: number, denominator: number): { num: number; den: number } {
  const divisor = gcd(numerator, denominator);
  return {
    num: numerator / divisor,
    den: denominator / divisor,
  };
}

function decimalToFraction(decimalStr: string): { numerator: number; denominator: number } {
  const decimal = parseFloat(decimalStr);
  if (isNaN(decimal)) return { numerator: 0, denominator: 1 };

  const isNegative = decimal < 0;
  const absDecimal = Math.abs(decimal);

  // Handle repeating decimals and precision
  const decimalPart = decimalStr.includes('.') ? decimalStr.split('.')[1] || '' : '';
  const precision = Math.min(decimalPart.length, 10);
  const denominator = Math.pow(10, precision);
  const numerator = Math.round(absDecimal * denominator);

  const simplified = simplifyFraction(numerator, denominator);
  return {
    numerator: isNegative ? -simplified.num : simplified.num,
    denominator: simplified.den,
  };
}

function toMixedNumber(numerator: number, denominator: number): string {
  if (denominator === 0) return 'undefined';

  const isNegative = (numerator < 0) !== (denominator < 0);
  const absNum = Math.abs(numerator);
  const absDen = Math.abs(denominator);

  const whole = Math.floor(absNum / absDen);
  const remainder = absNum % absDen;

  if (remainder === 0) {
    return isNegative ? `-${whole}` : `${whole}`;
  }

  const { num, den } = simplifyFraction(remainder, absDen);

  if (whole === 0) {
    return isNegative ? `-${num}/${den}` : `${num}/${den}`;
  }

  return isNegative ? `-${whole} ${num}/${den}` : `${whole} ${num}/${den}`;
}

export function useFractionToDecimal(): UseFractionToDecimalReturn {
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [error, setError] = useState('');

  const convertFractionToDecimal = useCallback((numerator: number, denominator: number, wholeNumber: number = 0) => {
    setError('');

    if (denominator === 0) {
      setError('Denominator cannot be zero');
      setResult(null);
      return;
    }

    if (isNaN(numerator) || isNaN(denominator)) {
      setError('Please enter valid numbers');
      setResult(null);
      return;
    }

    const totalNumerator = wholeNumber * denominator + numerator;
    const decimal = totalNumerator / denominator;
    const decimalStr = decimal.toFixed(10).replace(/\.?0+$/, '');

    const { num, den } = simplifyFraction(Math.abs(totalNumerator), Math.abs(denominator));
    const isNegative = (totalNumerator < 0) !== (denominator < 0);
    const signedNum = isNegative ? -num : num;

    setResult({
      decimal: decimalStr,
      fraction: `${signedNum}/${den}`,
      mixedNumber: toMixedNumber(totalNumerator, denominator),
      simplified: den === 1 ? `${signedNum}` : `${signedNum}/${den}`,
    });
  }, []);

  const convertDecimalToFraction = useCallback((decimalStr: string) => {
    setError('');

    const trimmed = decimalStr.trim();
    if (!trimmed || isNaN(parseFloat(trimmed))) {
      setError('Please enter a valid decimal number');
      setResult(null);
      return;
    }

    const { numerator, denominator } = decimalToFraction(trimmed);

    setResult({
      decimal: parseFloat(trimmed).toString(),
      fraction: `${numerator}/${denominator}`,
      mixedNumber: toMixedNumber(numerator, denominator),
      simplified: denominator === 1 ? `${numerator}` : `${numerator}/${denominator}`,
    });
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError('');
  }, []);

  return {
    result,
    error,
    convertFractionToDecimal,
    convertDecimalToFraction,
    reset,
  };
}
