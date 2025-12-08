import { useState, useCallback } from 'react';

export type SizeSystem = 'US' | 'UK' | 'EU' | 'CM';
export type Gender = 'men' | 'women';

interface ShoeSizeInput {
  size: number;
  system: SizeSystem;
  gender: Gender;
}

interface ShoeSizeResult {
  US: number;
  UK: number;
  EU: number;
  CM: number;
}

interface UseShoeSizeConverterReturn {
  result: ShoeSizeResult | null;
  convert: (input: ShoeSizeInput) => void;
  reset: () => void;
}

// Conversion tables (approximate standard conversions)
// Men's US sizes as base reference
const MENS_US_TO_CM: Record<number, number> = {
  6: 24, 6.5: 24.5, 7: 25, 7.5: 25.5, 8: 26, 8.5: 26.5,
  9: 27, 9.5: 27.5, 10: 28, 10.5: 28.5, 11: 29, 11.5: 29.5,
  12: 30, 12.5: 30.5, 13: 31, 14: 32, 15: 33,
};

// Women's US sizes as base reference
const WOMENS_US_TO_CM: Record<number, number> = {
  5: 22, 5.5: 22.5, 6: 23, 6.5: 23.5, 7: 24, 7.5: 24.5,
  8: 25, 8.5: 25.5, 9: 26, 9.5: 26.5, 10: 27, 10.5: 27.5,
  11: 28, 11.5: 28.5, 12: 29,
};

function cmToUS(cm: number, gender: Gender): number {
  if (gender === 'men') {
    return Math.round((cm - 24) * 2 + 6 * 2) / 2;
  }
  return Math.round((cm - 22) * 2 + 5 * 2) / 2;
}

function usToCm(us: number, gender: Gender): number {
  if (gender === 'men') {
    return 24 + (us - 6) * 0.5;
  }
  return 22 + (us - 5) * 0.5;
}

function usToUK(us: number, gender: Gender): number {
  if (gender === 'men') {
    return us - 0.5;
  }
  return us - 2;
}

function ukToUS(uk: number, gender: Gender): number {
  if (gender === 'men') {
    return uk + 0.5;
  }
  return uk + 2;
}

function usToEU(us: number, gender: Gender): number {
  const cm = usToCm(us, gender);
  return Math.round((cm + 1.5) * 1.5 * 2) / 2;
}

function euToUS(eu: number, gender: Gender): number {
  const cm = eu / 1.5 - 1.5;
  return cmToUS(cm, gender);
}

function cmToEU(cm: number): number {
  return Math.round((cm + 1.5) * 1.5 * 2) / 2;
}

function euToCm(eu: number): number {
  return eu / 1.5 - 1.5;
}

export function useShoeSizeConverter(): UseShoeSizeConverterReturn {
  const [result, setResult] = useState<ShoeSizeResult | null>(null);

  const convert = useCallback((input: ShoeSizeInput) => {
    const { size, system, gender } = input;
    let usSize: number;

    // First convert input to US size as intermediate
    switch (system) {
      case 'US':
        usSize = size;
        break;
      case 'UK':
        usSize = ukToUS(size, gender);
        break;
      case 'EU':
        usSize = euToUS(size, gender);
        break;
      case 'CM':
        usSize = cmToUS(size, gender);
        break;
      default:
        usSize = size;
    }

    // Then convert US to all other systems
    const cm = usToCm(usSize, gender);
    const uk = usToUK(usSize, gender);
    const eu = usToEU(usSize, gender);

    setResult({
      US: Math.round(usSize * 2) / 2,
      UK: Math.round(uk * 2) / 2,
      EU: Math.round(eu * 2) / 2,
      CM: Math.round(cm * 10) / 10,
    });
  }, []);

  const reset = useCallback(() => {
    setResult(null);
  }, []);

  return { result, convert, reset };
}
