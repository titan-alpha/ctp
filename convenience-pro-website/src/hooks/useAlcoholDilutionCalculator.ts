import { useState, useCallback } from 'react';

interface DilutionResult {
  waterToAdd: number;
  finalVolume: number;
  dilutionRatio: string;
}

interface UseAlcoholDilutionCalculatorReturn {
  currentAbv: number;
  targetAbv: number;
  volume: number;
  volumeUnit: 'ml' | 'oz' | 'l';
  result: DilutionResult | null;
  error: string | null;
  setCurrentAbv: (abv: number) => void;
  setTargetAbv: (abv: number) => void;
  setVolume: (volume: number) => void;
  setVolumeUnit: (unit: 'ml' | 'oz' | 'l') => void;
  calculate: () => void;
  reset: () => void;
}

export function useAlcoholDilutionCalculator(): UseAlcoholDilutionCalculatorReturn {
  const [currentAbv, setCurrentAbv] = useState(40);
  const [targetAbv, setTargetAbv] = useState(20);
  const [volume, setVolume] = useState(100);
  const [volumeUnit, setVolumeUnit] = useState<'ml' | 'oz' | 'l'>('ml');
  const [result, setResult] = useState<DilutionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculate = useCallback(() => {
    setError(null);
    setResult(null);

    if (currentAbv <= 0 || currentAbv > 100) {
      setError('Current ABV must be between 0 and 100%');
      return;
    }

    if (targetAbv <= 0 || targetAbv > 100) {
      setError('Target ABV must be between 0 and 100%');
      return;
    }

    if (targetAbv >= currentAbv) {
      setError('Target ABV must be lower than current ABV');
      return;
    }

    if (volume <= 0) {
      setError('Volume must be greater than 0');
      return;
    }

    // Convert to ml for calculation
    let volumeInMl = volume;
    if (volumeUnit === 'oz') {
      volumeInMl = volume * 29.5735;
    } else if (volumeUnit === 'l') {
      volumeInMl = volume * 1000;
    }

    // Formula: V2 = V1 * (C1 / C2)
    // Water to add = V2 - V1
    const finalVolumeInMl = volumeInMl * (currentAbv / targetAbv);
    const waterToAddInMl = finalVolumeInMl - volumeInMl;

    // Convert back to original unit
    let waterToAdd = waterToAddInMl;
    let finalVolume = finalVolumeInMl;
    if (volumeUnit === 'oz') {
      waterToAdd = waterToAddInMl / 29.5735;
      finalVolume = finalVolumeInMl / 29.5735;
    } else if (volumeUnit === 'l') {
      waterToAdd = waterToAddInMl / 1000;
      finalVolume = finalVolumeInMl / 1000;
    }

    const ratio = (waterToAdd / volume).toFixed(2);

    setResult({
      waterToAdd: Math.round(waterToAdd * 100) / 100,
      finalVolume: Math.round(finalVolume * 100) / 100,
      dilutionRatio: `1:${ratio}`,
    });
  }, [currentAbv, targetAbv, volume, volumeUnit]);

  const reset = useCallback(() => {
    setCurrentAbv(40);
    setTargetAbv(20);
    setVolume(100);
    setVolumeUnit('ml');
    setResult(null);
    setError(null);
  }, []);

  return {
    currentAbv,
    targetAbv,
    volume,
    volumeUnit,
    result,
    error,
    setCurrentAbv,
    setTargetAbv,
    setVolume,
    setVolumeUnit,
    calculate,
    reset,
  };
}
