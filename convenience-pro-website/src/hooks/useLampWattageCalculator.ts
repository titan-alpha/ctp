import { useState, useCallback } from 'react';

interface LampWattageInput {
  roomLength: number;
  roomWidth: number;
  lumensPerSqFt: number;
}

interface BulbSuggestion {
  type: string;
  wattage: string;
  lumens: number;
  count: number;
}

interface LampWattageResult {
  roomArea: number;
  totalLumensNeeded: number;
  bulbSuggestions: BulbSuggestion[];
}

interface UseLampWattageCalculatorReturn {
  result: LampWattageResult | null;
  calculate: (input: LampWattageInput) => void;
  reset: () => void;
}

// Common bulb types with typical lumen outputs
const BULB_OPTIONS = [
  { type: 'LED', wattage: '9W', lumens: 800 },
  { type: 'LED', wattage: '12W', lumens: 1100 },
  { type: 'LED', wattage: '15W', lumens: 1600 },
  { type: 'CFL', wattage: '13W', lumens: 800 },
  { type: 'CFL', wattage: '23W', lumens: 1600 },
  { type: 'Incandescent', wattage: '60W', lumens: 800 },
  { type: 'Incandescent', wattage: '100W', lumens: 1600 },
];

export function useLampWattageCalculator(): UseLampWattageCalculatorReturn {
  const [result, setResult] = useState<LampWattageResult | null>(null);

  const calculate = useCallback((input: LampWattageInput) => {
    const { roomLength, roomWidth, lumensPerSqFt } = input;

    const roomArea = roomLength * roomWidth;
    const totalLumensNeeded = roomArea * lumensPerSqFt;

    // Generate bulb suggestions
    const bulbSuggestions: BulbSuggestion[] = BULB_OPTIONS.map((bulb) => ({
      type: bulb.type,
      wattage: bulb.wattage,
      lumens: bulb.lumens,
      count: Math.ceil(totalLumensNeeded / bulb.lumens),
    }));

    setResult({
      roomArea,
      totalLumensNeeded,
      bulbSuggestions,
    });
  }, []);

  const reset = useCallback(() => {
    setResult(null);
  }, []);

  return { result, calculate, reset };
}
