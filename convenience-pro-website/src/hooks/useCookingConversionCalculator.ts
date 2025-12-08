import { useState, useCallback, useMemo } from 'react';

export type CookingUnit =
  | 'cup'
  | 'tablespoon'
  | 'teaspoon'
  | 'ml'
  | 'liter'
  | 'fl_oz'
  | 'pint'
  | 'quart'
  | 'gallon';

export interface ConversionResult {
  value: number;
  formatted: string;
  unit: CookingUnit;
}

interface UseCookingConversionCalculatorReturn {
  amount: string;
  fromUnit: CookingUnit;
  toUnit: CookingUnit;
  result: ConversionResult | null;
  setAmount: (amount: string) => void;
  setFromUnit: (unit: CookingUnit) => void;
  setToUnit: (unit: CookingUnit) => void;
  convert: () => void;
  swap: () => void;
  reset: () => void;
}

// All units converted to milliliters as base
const ML_CONVERSIONS: Record<CookingUnit, number> = {
  ml: 1,
  liter: 1000,
  teaspoon: 4.92892,
  tablespoon: 14.7868,
  fl_oz: 29.5735,
  cup: 236.588,
  pint: 473.176,
  quart: 946.353,
  gallon: 3785.41,
};

export const UNIT_LABELS: Record<CookingUnit, string> = {
  cup: 'Cup',
  tablespoon: 'Tablespoon (tbsp)',
  teaspoon: 'Teaspoon (tsp)',
  ml: 'Milliliter (ml)',
  liter: 'Liter (L)',
  fl_oz: 'Fluid Ounce (fl oz)',
  pint: 'Pint',
  quart: 'Quart',
  gallon: 'Gallon',
};

export const UNIT_ABBREVIATIONS: Record<CookingUnit, string> = {
  cup: 'cups',
  tablespoon: 'tbsp',
  teaspoon: 'tsp',
  ml: 'ml',
  liter: 'L',
  fl_oz: 'fl oz',
  pint: 'pints',
  quart: 'quarts',
  gallon: 'gallons',
};

// Common ingredient conversions (cups to grams)
export const INGREDIENT_CONVERSIONS: Record<string, number> = {
  'All-purpose flour': 125,
  'Bread flour': 127,
  'Cake flour': 114,
  'Granulated sugar': 200,
  'Brown sugar (packed)': 220,
  'Powdered sugar': 120,
  'Butter': 227,
  'Honey': 340,
  'Milk': 245,
  'Water': 237,
  'Vegetable oil': 218,
  'Cocoa powder': 86,
  'Rolled oats': 90,
  'Rice (uncooked)': 185,
  'Salt (table)': 288,
};

function formatResult(value: number): string {
  if (value === 0) return '0';

  // Round very small numbers
  if (Math.abs(value) < 0.001) return value.toExponential(2);

  // Round to 4 decimal places and remove trailing zeros
  const rounded = Math.round(value * 10000) / 10000;

  if (rounded === Math.floor(rounded)) {
    return rounded.toString();
  }

  return rounded.toFixed(4).replace(/\.?0+$/, '');
}

export function useCookingConversionCalculator(): UseCookingConversionCalculatorReturn {
  const [amount, setAmount] = useState('1');
  const [fromUnit, setFromUnit] = useState<CookingUnit>('cup');
  const [toUnit, setToUnit] = useState<CookingUnit>('ml');
  const [result, setResult] = useState<ConversionResult | null>(null);

  const convert = useCallback(() => {
    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount < 0) {
      setResult(null);
      return;
    }

    // Convert to ml first, then to target unit
    const inMl = numAmount * ML_CONVERSIONS[fromUnit];
    const converted = inMl / ML_CONVERSIONS[toUnit];

    setResult({
      value: converted,
      formatted: formatResult(converted),
      unit: toUnit,
    });
  }, [amount, fromUnit, toUnit]);

  const swap = useCallback(() => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setResult(null);
  }, [fromUnit, toUnit]);

  const reset = useCallback(() => {
    setAmount('1');
    setFromUnit('cup');
    setToUnit('ml');
    setResult(null);
  }, []);

  return {
    amount,
    fromUnit,
    toUnit,
    result,
    setAmount,
    setFromUnit,
    setToUnit,
    convert,
    swap,
    reset,
  };
}
