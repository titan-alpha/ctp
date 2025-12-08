import { useState, useCallback } from 'react';

export type InsulationType = 'fiberglass_batt' | 'fiberglass_roll' | 'blown_fiberglass' | 'blown_cellulose' | 'spray_foam' | 'rigid_foam';

interface InsulationTypeInfo {
  name: string;
  rValuePerInch: number;
  coverage: number; // sq ft per bag/roll/unit
  unit: string;
}

export const INSULATION_TYPES: Record<InsulationType, InsulationTypeInfo> = {
  fiberglass_batt: { name: 'Fiberglass Batts', rValuePerInch: 3.2, coverage: 40, unit: 'batts' },
  fiberglass_roll: { name: 'Fiberglass Rolls', rValuePerInch: 3.2, coverage: 88, unit: 'rolls' },
  blown_fiberglass: { name: 'Blown Fiberglass', rValuePerInch: 2.5, coverage: 40, unit: 'bags' },
  blown_cellulose: { name: 'Blown Cellulose', rValuePerInch: 3.5, coverage: 40, unit: 'bags' },
  spray_foam: { name: 'Spray Foam', rValuePerInch: 6.5, coverage: 200, unit: 'kits' },
  rigid_foam: { name: 'Rigid Foam Board', rValuePerInch: 5.0, coverage: 32, unit: 'sheets' },
};

interface InsulationCalculatorInput {
  area: number;
  targetRValue: number;
  insulationType: InsulationType;
}

interface InsulationCalculatorResult {
  area: number;
  targetRValue: number;
  insulationType: InsulationType;
  insulationName: string;
  thicknessNeeded: number;
  unitsNeeded: number;
  unit: string;
  rValuePerInch: number;
  coveragePerUnit: number;
}

interface UseInsulationCalculatorReturn {
  result: InsulationCalculatorResult | null;
  calculate: (input: InsulationCalculatorInput) => void;
  reset: () => void;
}

export function useInsulationCalculator(): UseInsulationCalculatorReturn {
  const [result, setResult] = useState<InsulationCalculatorResult | null>(null);

  const calculate = useCallback((input: InsulationCalculatorInput) => {
    const { area, targetRValue, insulationType } = input;
    const typeInfo = INSULATION_TYPES[insulationType];

    // Calculate thickness needed to achieve target R-value
    const thicknessNeeded = targetRValue / typeInfo.rValuePerInch;

    // Calculate units needed based on area
    const unitsNeeded = Math.ceil(area / typeInfo.coverage);

    setResult({
      area,
      targetRValue,
      insulationType,
      insulationName: typeInfo.name,
      thicknessNeeded,
      unitsNeeded,
      unit: typeInfo.unit,
      rValuePerInch: typeInfo.rValuePerInch,
      coveragePerUnit: typeInfo.coverage,
    });
  }, []);

  const reset = useCallback(() => {
    setResult(null);
  }, []);

  return { result, calculate, reset };
}
