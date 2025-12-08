import { useState, useCallback } from 'react';

export type CalculationMode = 'wake' | 'sleep';

export interface SleepTime {
  time: Date;
  cycles: number;
  totalHours: number;
  quality: 'excellent' | 'good' | 'fair';
}

interface UseSleepCalculatorReturn {
  results: SleepTime[];
  mode: CalculationMode;
  setMode: (mode: CalculationMode) => void;
  calculate: (time: Date) => void;
  reset: () => void;
}

const SLEEP_CYCLE_MINUTES = 90;
const FALL_ASLEEP_MINUTES = 14;
const MIN_CYCLES = 4;
const MAX_CYCLES = 6;

function getQuality(cycles: number): 'excellent' | 'good' | 'fair' {
  if (cycles >= 5) return 'excellent';
  if (cycles >= 4) return 'good';
  return 'fair';
}

function formatTotalHours(cycles: number): number {
  return Math.round((cycles * SLEEP_CYCLE_MINUTES) / 60 * 10) / 10;
}

export function useSleepCalculator(): UseSleepCalculatorReturn {
  const [results, setResults] = useState<SleepTime[]>([]);
  const [mode, setMode] = useState<CalculationMode>('wake');

  const calculate = useCallback((inputTime: Date) => {
    const times: SleepTime[] = [];

    if (mode === 'wake') {
      // Given wake time, calculate bedtimes
      for (let cycles = MAX_CYCLES; cycles >= MIN_CYCLES; cycles--) {
        const sleepDurationMinutes = cycles * SLEEP_CYCLE_MINUTES;
        const totalMinutes = sleepDurationMinutes + FALL_ASLEEP_MINUTES;

        const bedtime = new Date(inputTime);
        bedtime.setMinutes(bedtime.getMinutes() - totalMinutes);

        times.push({
          time: bedtime,
          cycles,
          totalHours: formatTotalHours(cycles),
          quality: getQuality(cycles),
        });
      }
    } else {
      // Given bedtime, calculate wake times
      const fallAsleepTime = new Date(inputTime);
      fallAsleepTime.setMinutes(fallAsleepTime.getMinutes() + FALL_ASLEEP_MINUTES);

      for (let cycles = MIN_CYCLES; cycles <= MAX_CYCLES; cycles++) {
        const sleepDurationMinutes = cycles * SLEEP_CYCLE_MINUTES;

        const wakeTime = new Date(fallAsleepTime);
        wakeTime.setMinutes(wakeTime.getMinutes() + sleepDurationMinutes);

        times.push({
          time: wakeTime,
          cycles,
          totalHours: formatTotalHours(cycles),
          quality: getQuality(cycles),
        });
      }
    }

    setResults(times);
  }, [mode]);

  const reset = useCallback(() => {
    setResults([]);
  }, []);

  return {
    results,
    mode,
    setMode,
    calculate,
    reset,
  };
}
