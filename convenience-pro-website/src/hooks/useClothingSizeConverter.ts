import { useState, useCallback } from 'react';

export type ClothingSizeSystem = 'US' | 'UK' | 'EU';
export type ClothingGender = 'men' | 'women';

interface ClothingSizeInput {
  size: string;
  system: ClothingSizeSystem;
  gender: ClothingGender;
}

interface ClothingSizeResult {
  US: string;
  UK: string;
  EU: string;
}

interface UseClothingSizeConverterReturn {
  result: ClothingSizeResult | null;
  convert: (input: ClothingSizeInput) => void;
  reset: () => void;
}

// Women's size mappings (US as base)
const WOMENS_SIZES: { US: string; UK: string; EU: string }[] = [
  { US: 'XS', UK: '4', EU: '32' },
  { US: '0', UK: '4', EU: '32' },
  { US: '2', UK: '6', EU: '34' },
  { US: '4', UK: '8', EU: '36' },
  { US: 'S', UK: '8-10', EU: '36-38' },
  { US: '6', UK: '10', EU: '38' },
  { US: '8', UK: '12', EU: '40' },
  { US: 'M', UK: '12-14', EU: '40-42' },
  { US: '10', UK: '14', EU: '42' },
  { US: '12', UK: '16', EU: '44' },
  { US: 'L', UK: '16-18', EU: '44-46' },
  { US: '14', UK: '18', EU: '46' },
  { US: '16', UK: '20', EU: '48' },
  { US: 'XL', UK: '20-22', EU: '48-50' },
  { US: '18', UK: '22', EU: '50' },
  { US: '20', UK: '24', EU: '52' },
  { US: 'XXL', UK: '24-26', EU: '52-54' },
  { US: '22', UK: '26', EU: '54' },
];

// Men's size mappings (US as base)
const MENS_SIZES: { US: string; UK: string; EU: string }[] = [
  { US: 'XS', UK: 'XS', EU: '44' },
  { US: '34', UK: '34', EU: '44' },
  { US: 'S', UK: 'S', EU: '46' },
  { US: '36', UK: '36', EU: '46' },
  { US: '38', UK: '38', EU: '48' },
  { US: 'M', UK: 'M', EU: '48-50' },
  { US: '40', UK: '40', EU: '50' },
  { US: '42', UK: '42', EU: '52' },
  { US: 'L', UK: 'L', EU: '52-54' },
  { US: '44', UK: '44', EU: '54' },
  { US: '46', UK: '46', EU: '56' },
  { US: 'XL', UK: 'XL', EU: '56-58' },
  { US: '48', UK: '48', EU: '58' },
  { US: 'XXL', UK: 'XXL', EU: '60-62' },
  { US: '50', UK: '50', EU: '60' },
  { US: '52', UK: '52', EU: '62' },
  { US: 'XXXL', UK: 'XXXL', EU: '64' },
];

function findSizeMatch(
  size: string,
  system: ClothingSizeSystem,
  gender: ClothingGender
): ClothingSizeResult | null {
  const sizeTable = gender === 'women' ? WOMENS_SIZES : MENS_SIZES;
  const normalizedSize = size.toUpperCase().trim();

  // Find exact match
  const match = sizeTable.find(
    (entry) => entry[system].toUpperCase() === normalizedSize
  );

  if (match) {
    return {
      US: match.US,
      UK: match.UK,
      EU: match.EU,
    };
  }

  // Try to find partial match for ranges
  const partialMatch = sizeTable.find((entry) =>
    entry[system].toUpperCase().includes(normalizedSize)
  );

  if (partialMatch) {
    return {
      US: partialMatch.US,
      UK: partialMatch.UK,
      EU: partialMatch.EU,
    };
  }

  return null;
}

export function useClothingSizeConverter(): UseClothingSizeConverterReturn {
  const [result, setResult] = useState<ClothingSizeResult | null>(null);

  const convert = useCallback((input: ClothingSizeInput) => {
    const { size, system, gender } = input;
    const match = findSizeMatch(size, system, gender);
    setResult(match);
  }, []);

  const reset = useCallback(() => {
    setResult(null);
  }, []);

  return { result, convert, reset };
}
