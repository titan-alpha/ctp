import { useState, useCallback } from 'react';

interface BatteryLifeInput {
  batteryCapacity: number; // mAh
  powerDraw: number; // mA
}

interface BatteryLifeResult {
  runtimeHours: number;
  runtimeMinutes: number;
  totalMinutes: number;
}

interface UseBatteryLifeCalculatorReturn {
  result: BatteryLifeResult | null;
  calculate: (input: BatteryLifeInput) => void;
  reset: () => void;
}

export function useBatteryLifeCalculator(): UseBatteryLifeCalculatorReturn {
  const [result, setResult] = useState<BatteryLifeResult | null>(null);

  const calculate = useCallback((input: BatteryLifeInput) => {
    const { batteryCapacity, powerDraw } = input;

    if (powerDraw <= 0 || batteryCapacity <= 0) {
      setResult(null);
      return;
    }

    // Battery life formula: Hours = Capacity (mAh) / Current Draw (mA)
    const runtimeHours = batteryCapacity / powerDraw;
    const totalMinutes = runtimeHours * 60;
    const hours = Math.floor(runtimeHours);
    const minutes = Math.round((runtimeHours - hours) * 60);

    setResult({
      runtimeHours,
      runtimeMinutes: minutes,
      totalMinutes,
    });
  }, []);

  const reset = useCallback(() => {
    setResult(null);
  }, []);

  return { result, calculate, reset };
}
