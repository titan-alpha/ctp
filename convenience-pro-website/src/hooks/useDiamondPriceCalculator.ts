import { useState, useCallback } from 'react';

export type CutGrade = 'Ideal' | 'Excellent' | 'Very Good' | 'Good' | 'Fair';
export type ColorGrade = 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M';
export type ClarityGrade = 'FL' | 'IF' | 'VVS1' | 'VVS2' | 'VS1' | 'VS2' | 'SI1' | 'SI2' | 'I1' | 'I2';

interface DiamondInput {
  carat: number;
  cut: CutGrade;
  color: ColorGrade;
  clarity: ClarityGrade;
}

interface PriceEstimate {
  lowPrice: number;
  highPrice: number;
  averagePrice: number;
  pricePerCarat: number;
}

interface UseDiamondPriceCalculatorReturn {
  estimate: PriceEstimate | null;
  calculatePrice: (input: DiamondInput) => void;
  reset: () => void;
}

// Base price per carat (approximate market values for 1 carat round brilliant)
const BASE_PRICE_PER_CARAT = 5000;

// Cut multipliers
const CUT_MULTIPLIERS: Record<CutGrade, number> = {
  'Ideal': 1.15,
  'Excellent': 1.10,
  'Very Good': 1.00,
  'Good': 0.85,
  'Fair': 0.70,
};

// Color multipliers (D is highest)
const COLOR_MULTIPLIERS: Record<ColorGrade, number> = {
  'D': 1.30,
  'E': 1.20,
  'F': 1.10,
  'G': 1.00,
  'H': 0.90,
  'I': 0.80,
  'J': 0.70,
  'K': 0.60,
  'L': 0.50,
  'M': 0.40,
};

// Clarity multipliers (FL is highest)
const CLARITY_MULTIPLIERS: Record<ClarityGrade, number> = {
  'FL': 1.50,
  'IF': 1.35,
  'VVS1': 1.20,
  'VVS2': 1.10,
  'VS1': 1.00,
  'VS2': 0.90,
  'SI1': 0.75,
  'SI2': 0.65,
  'I1': 0.50,
  'I2': 0.35,
};

// Carat weight premium (larger stones are exponentially more expensive)
function getCaratPremium(carat: number): number {
  if (carat < 0.5) return 0.6;
  if (carat < 1) return 0.85;
  if (carat < 1.5) return 1.0;
  if (carat < 2) return 1.3;
  if (carat < 3) return 1.8;
  if (carat < 4) return 2.5;
  return 3.5;
}

export function useDiamondPriceCalculator(): UseDiamondPriceCalculatorReturn {
  const [estimate, setEstimate] = useState<PriceEstimate | null>(null);

  const calculatePrice = useCallback((input: DiamondInput) => {
    const { carat, cut, color, clarity } = input;

    if (carat <= 0) {
      setEstimate(null);
      return;
    }

    const cutMultiplier = CUT_MULTIPLIERS[cut];
    const colorMultiplier = COLOR_MULTIPLIERS[color];
    const clarityMultiplier = CLARITY_MULTIPLIERS[clarity];
    const caratPremium = getCaratPremium(carat);

    const pricePerCarat = BASE_PRICE_PER_CARAT * cutMultiplier * colorMultiplier * clarityMultiplier * caratPremium;
    const averagePrice = pricePerCarat * carat;

    // Market variance of approximately +/- 20%
    const lowPrice = averagePrice * 0.80;
    const highPrice = averagePrice * 1.20;

    setEstimate({
      lowPrice: Math.round(lowPrice),
      highPrice: Math.round(highPrice),
      averagePrice: Math.round(averagePrice),
      pricePerCarat: Math.round(pricePerCarat),
    });
  }, []);

  const reset = useCallback(() => {
    setEstimate(null);
  }, []);

  return {
    estimate,
    calculatePrice,
    reset,
  };
}
