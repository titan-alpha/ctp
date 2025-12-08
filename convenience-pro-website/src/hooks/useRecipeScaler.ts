import { useState, useCallback } from 'react';

export interface ScaledIngredient {
  original: string;
  scaled: string;
  amount: number | null;
  scaledAmount: number | null;
  unit: string;
  ingredient: string;
}

interface UseRecipeScalerReturn {
  originalServings: number;
  targetServings: number;
  ingredients: string;
  scaledIngredients: ScaledIngredient[];
  setOriginalServings: (servings: number) => void;
  setTargetServings: (servings: number) => void;
  setIngredients: (ingredients: string) => void;
  scale: () => void;
  reset: () => void;
}

const FRACTION_MAP: Record<string, number> = {
  '1/8': 0.125,
  '1/4': 0.25,
  '1/3': 0.333,
  '3/8': 0.375,
  '1/2': 0.5,
  '5/8': 0.625,
  '2/3': 0.667,
  '3/4': 0.75,
  '7/8': 0.875,
};

const UNICODE_FRACTIONS: Record<string, number> = {
  '\u00BC': 0.25, // 1/4
  '\u00BD': 0.5,  // 1/2
  '\u00BE': 0.75, // 3/4
  '\u2153': 0.333, // 1/3
  '\u2154': 0.667, // 2/3
  '\u215B': 0.125, // 1/8
  '\u215C': 0.375, // 3/8
  '\u215D': 0.625, // 5/8
  '\u215E': 0.875, // 7/8
};

function parseAmount(amountStr: string): number | null {
  if (!amountStr) return null;

  let amount = 0;
  let remaining = amountStr.trim();

  // Handle unicode fractions
  for (const [frac, value] of Object.entries(UNICODE_FRACTIONS)) {
    if (remaining.includes(frac)) {
      amount += value;
      remaining = remaining.replace(frac, '').trim();
    }
  }

  // Handle text fractions like "1 1/2" or "1/2"
  const mixedMatch = remaining.match(/^(\d+)\s+(\d+\/\d+)$/);
  if (mixedMatch) {
    amount += parseInt(mixedMatch[1]);
    const fracValue = FRACTION_MAP[mixedMatch[2]];
    if (fracValue) amount += fracValue;
    return amount;
  }

  const fractionMatch = remaining.match(/^(\d+)\/(\d+)$/);
  if (fractionMatch) {
    return amount + parseInt(fractionMatch[1]) / parseInt(fractionMatch[2]);
  }

  const numMatch = remaining.match(/^(\d+\.?\d*)$/);
  if (numMatch) {
    return amount + parseFloat(numMatch[1]);
  }

  return amount > 0 ? amount : null;
}

function formatAmount(amount: number): string {
  // Round to 3 decimal places to avoid floating point issues
  const rounded = Math.round(amount * 1000) / 1000;

  // Check for common fractions
  const wholePart = Math.floor(rounded);
  const fractionalPart = rounded - wholePart;

  let fractionStr = '';
  if (Math.abs(fractionalPart - 0.125) < 0.01) fractionStr = '1/8';
  else if (Math.abs(fractionalPart - 0.25) < 0.01) fractionStr = '1/4';
  else if (Math.abs(fractionalPart - 0.333) < 0.02) fractionStr = '1/3';
  else if (Math.abs(fractionalPart - 0.375) < 0.01) fractionStr = '3/8';
  else if (Math.abs(fractionalPart - 0.5) < 0.01) fractionStr = '1/2';
  else if (Math.abs(fractionalPart - 0.625) < 0.01) fractionStr = '5/8';
  else if (Math.abs(fractionalPart - 0.667) < 0.02) fractionStr = '2/3';
  else if (Math.abs(fractionalPart - 0.75) < 0.01) fractionStr = '3/4';
  else if (Math.abs(fractionalPart - 0.875) < 0.01) fractionStr = '7/8';

  if (fractionStr) {
    return wholePart > 0 ? `${wholePart} ${fractionStr}` : fractionStr;
  }

  // For other values, format nicely
  if (rounded === Math.floor(rounded)) {
    return rounded.toString();
  }
  return rounded.toFixed(2).replace(/\.?0+$/, '');
}

function parseIngredientLine(line: string): { amount: number | null; unit: string; ingredient: string } {
  const trimmed = line.trim();
  if (!trimmed) return { amount: null, unit: '', ingredient: '' };

  // Pattern: optional amount, optional unit, ingredient
  // Examples: "2 cups flour", "1/2 tsp salt", "3 eggs", "salt to taste"
  const unitPattern = /^([\d\s\/\u00BC-\u00BE\u2153-\u215E.]+)?\s*(cups?|tbsps?|tablespoons?|tsps?|teaspoons?|oz|ounces?|lbs?|pounds?|g|grams?|kg|ml|liters?|l|quarts?|qt|pints?|pt|gallons?|gal|sticks?|cloves?|cans?|packages?|pkgs?|bunche?s?|slices?|pieces?|pinch(?:es)?|dashes?|sprigs?)?\s*(.+)?$/i;

  const match = trimmed.match(unitPattern);

  if (match) {
    const amount = parseAmount(match[1] || '');
    const unit = match[2] || '';
    const ingredient = match[3] || trimmed;
    return { amount, unit, ingredient };
  }

  return { amount: null, unit: '', ingredient: trimmed };
}

export function useRecipeScaler(): UseRecipeScalerReturn {
  const [originalServings, setOriginalServings] = useState(4);
  const [targetServings, setTargetServings] = useState(8);
  const [ingredients, setIngredients] = useState('');
  const [scaledIngredients, setScaledIngredients] = useState<ScaledIngredient[]>([]);

  const scale = useCallback(() => {
    if (!ingredients.trim() || originalServings <= 0 || targetServings <= 0) {
      setScaledIngredients([]);
      return;
    }

    const scaleFactor = targetServings / originalServings;
    const lines = ingredients.split('\n');

    const scaled = lines.map((line) => {
      const original = line.trim();
      if (!original) {
        return { original: '', scaled: '', amount: null, scaledAmount: null, unit: '', ingredient: '' };
      }

      const { amount, unit, ingredient } = parseIngredientLine(original);

      if (amount === null) {
        return { original, scaled: original, amount: null, scaledAmount: null, unit, ingredient: original };
      }

      const scaledAmount = amount * scaleFactor;
      const formattedAmount = formatAmount(scaledAmount);
      const scaled = unit
        ? `${formattedAmount} ${unit} ${ingredient}`.trim()
        : `${formattedAmount} ${ingredient}`.trim();

      return { original, scaled, amount, scaledAmount, unit, ingredient };
    });

    setScaledIngredients(scaled.filter(s => s.original !== ''));
  }, [ingredients, originalServings, targetServings]);

  const reset = useCallback(() => {
    setOriginalServings(4);
    setTargetServings(8);
    setIngredients('');
    setScaledIngredients([]);
  }, []);

  return {
    originalServings,
    targetServings,
    ingredients,
    scaledIngredients,
    setOriginalServings,
    setTargetServings,
    setIngredients,
    scale,
    reset,
  };
}
