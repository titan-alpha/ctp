import { useState, useCallback } from 'react';

export type MeasurementUnit = 'inches' | 'cm';

interface BraSizeInput {
  bandMeasurement: number;
  bustMeasurement: number;
  unit: MeasurementUnit;
}

interface BraSizeResult {
  US: string;
  UK: string;
  EU: string;
  bandSize: number;
  cupSize: string;
}

interface UseBraSizeCalculatorReturn {
  result: BraSizeResult | null;
  calculate: (input: BraSizeInput) => void;
  reset: () => void;
}

const US_CUP_SIZES = ['AA', 'A', 'B', 'C', 'D', 'DD', 'DDD', 'G', 'H', 'I', 'J', 'K'];
const UK_CUP_SIZES = ['AA', 'A', 'B', 'C', 'D', 'DD', 'E', 'F', 'FF', 'G', 'GG', 'H'];

function cmToInches(cm: number): number {
  return cm / 2.54;
}

function calculateBandSize(bandMeasurement: number): number {
  // Round to nearest even number for band size
  const rounded = Math.round(bandMeasurement);
  return rounded % 2 === 0 ? rounded : rounded + 1;
}

function calculateCupIndex(bustMeasurement: number, bandSize: number): number {
  const difference = bustMeasurement - bandSize;
  // Each inch difference = one cup size, starting at 0 for AA
  return Math.max(0, Math.min(Math.round(difference), US_CUP_SIZES.length - 1));
}

function usToEuBand(usBand: number): number {
  // EU band = US band + 50 (approximately)
  return usBand + 50;
}

export function useBraSizeCalculator(): UseBraSizeCalculatorReturn {
  const [result, setResult] = useState<BraSizeResult | null>(null);

  const calculate = useCallback((input: BraSizeInput) => {
    let { bandMeasurement, bustMeasurement, unit } = input;

    // Convert to inches if needed
    if (unit === 'cm') {
      bandMeasurement = cmToInches(bandMeasurement);
      bustMeasurement = cmToInches(bustMeasurement);
    }

    const bandSize = calculateBandSize(bandMeasurement);
    const cupIndex = calculateCupIndex(bustMeasurement, bandSize);
    const usCup = US_CUP_SIZES[cupIndex];
    const ukCup = UK_CUP_SIZES[cupIndex];
    const euBand = usToEuBand(bandSize);

    // EU uses letters A-K similar to UK
    const euCup = UK_CUP_SIZES[cupIndex];

    setResult({
      US: `${bandSize}${usCup}`,
      UK: `${bandSize}${ukCup}`,
      EU: `${euBand}${euCup}`,
      bandSize,
      cupSize: usCup,
    });
  }, []);

  const reset = useCallback(() => {
    setResult(null);
  }, []);

  return { result, calculate, reset };
}
