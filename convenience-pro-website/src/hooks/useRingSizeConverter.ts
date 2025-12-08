import { useState, useCallback } from 'react';

export type RingSizeSystem = 'US' | 'UK' | 'EU';
export type MeasurementType = 'circumference' | 'diameter';

interface RingSizeData {
  us: number;
  uk: string;
  eu: number;
  circumference: number; // mm
  diameter: number; // mm
}

// Ring size conversion table (comprehensive data)
const RING_SIZE_TABLE: RingSizeData[] = [
  { us: 3, uk: 'F', eu: 44, circumference: 44.2, diameter: 14.1 },
  { us: 3.5, uk: 'G', eu: 45, circumference: 45.5, diameter: 14.5 },
  { us: 4, uk: 'H', eu: 46.5, circumference: 46.8, diameter: 14.9 },
  { us: 4.5, uk: 'I', eu: 48, circumference: 48.0, diameter: 15.3 },
  { us: 5, uk: 'J', eu: 49, circumference: 49.3, diameter: 15.7 },
  { us: 5.5, uk: 'K', eu: 50, circumference: 50.6, diameter: 16.1 },
  { us: 6, uk: 'L', eu: 51.5, circumference: 51.9, diameter: 16.5 },
  { us: 6.5, uk: 'M', eu: 52.5, circumference: 53.1, diameter: 16.9 },
  { us: 7, uk: 'N', eu: 54, circumference: 54.4, diameter: 17.3 },
  { us: 7.5, uk: 'O', eu: 55, circumference: 55.7, diameter: 17.7 },
  { us: 8, uk: 'P', eu: 56.5, circumference: 57.0, diameter: 18.1 },
  { us: 8.5, uk: 'Q', eu: 57.5, circumference: 58.3, diameter: 18.5 },
  { us: 9, uk: 'R', eu: 59, circumference: 59.5, diameter: 19.0 },
  { us: 9.5, uk: 'S', eu: 60, circumference: 60.8, diameter: 19.4 },
  { us: 10, uk: 'T', eu: 61.5, circumference: 62.1, diameter: 19.8 },
  { us: 10.5, uk: 'U', eu: 62.5, circumference: 63.4, diameter: 20.2 },
  { us: 11, uk: 'V', eu: 64, circumference: 64.6, diameter: 20.6 },
  { us: 11.5, uk: 'W', eu: 65, circumference: 65.9, diameter: 21.0 },
  { us: 12, uk: 'X', eu: 66.5, circumference: 67.2, diameter: 21.4 },
  { us: 12.5, uk: 'Y', eu: 67.5, circumference: 68.5, diameter: 21.8 },
  { us: 13, uk: 'Z', eu: 69, circumference: 69.7, diameter: 22.2 },
];

interface ConversionResult {
  us: number;
  uk: string;
  eu: number;
  circumference: number;
  diameter: number;
  isExact: boolean;
}

interface UseRingSizeConverterReturn {
  result: ConversionResult | null;
  allSizes: RingSizeData[];
  convertFromSize: (value: number | string, system: RingSizeSystem) => void;
  convertFromMeasurement: (value: number, type: MeasurementType) => void;
  reset: () => void;
}

export function useRingSizeConverter(): UseRingSizeConverterReturn {
  const [result, setResult] = useState<ConversionResult | null>(null);

  const findClosestSize = useCallback((value: number, key: keyof RingSizeData): RingSizeData => {
    let closest = RING_SIZE_TABLE[0];
    let minDiff = Math.abs((closest[key] as number) - value);

    for (const size of RING_SIZE_TABLE) {
      const diff = Math.abs((size[key] as number) - value);
      if (diff < minDiff) {
        minDiff = diff;
        closest = size;
      }
    }
    return closest;
  }, []);

  const convertFromSize = useCallback((value: number | string, system: RingSizeSystem) => {
    let matchedSize: RingSizeData | undefined;
    let isExact = true;

    if (system === 'US') {
      const numValue = typeof value === 'string' ? parseFloat(value) : value;
      matchedSize = RING_SIZE_TABLE.find((s) => s.us === numValue);
      if (!matchedSize) {
        matchedSize = findClosestSize(numValue, 'us');
        isExact = false;
      }
    } else if (system === 'UK') {
      const strValue = typeof value === 'string' ? value.toUpperCase() : String(value).toUpperCase();
      matchedSize = RING_SIZE_TABLE.find((s) => s.uk === strValue);
      if (!matchedSize) {
        isExact = false;
        matchedSize = RING_SIZE_TABLE[Math.floor(RING_SIZE_TABLE.length / 2)];
      }
    } else if (system === 'EU') {
      const numValue = typeof value === 'string' ? parseFloat(value) : value;
      matchedSize = RING_SIZE_TABLE.find((s) => s.eu === numValue);
      if (!matchedSize) {
        matchedSize = findClosestSize(numValue, 'eu');
        isExact = false;
      }
    }

    if (matchedSize) {
      setResult({
        us: matchedSize.us,
        uk: matchedSize.uk,
        eu: matchedSize.eu,
        circumference: matchedSize.circumference,
        diameter: matchedSize.diameter,
        isExact,
      });
    }
  }, [findClosestSize]);

  const convertFromMeasurement = useCallback((value: number, type: MeasurementType) => {
    const key = type === 'circumference' ? 'circumference' : 'diameter';
    const matchedSize = findClosestSize(value, key);
    const exactMatch = Math.abs((matchedSize[key] as number) - value) < 0.3;

    setResult({
      us: matchedSize.us,
      uk: matchedSize.uk,
      eu: matchedSize.eu,
      circumference: matchedSize.circumference,
      diameter: matchedSize.diameter,
      isExact: exactMatch,
    });
  }, [findClosestSize]);

  const reset = useCallback(() => {
    setResult(null);
  }, []);

  return {
    result,
    allSizes: RING_SIZE_TABLE,
    convertFromSize,
    convertFromMeasurement,
    reset,
  };
}
