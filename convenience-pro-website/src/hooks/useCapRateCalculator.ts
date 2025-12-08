import { useState, useCallback } from 'react';

type CalculationMode = 'capRate' | 'propertyValue';

interface CapRateInput {
  mode: CalculationMode;
  noi: number;
  propertyValue?: number;
  capRate?: number;
}

interface CapRateResult {
  capRate: number;
  propertyValue: number;
  noi: number;
  interpretation: string;
  riskLevel: 'low' | 'moderate' | 'high';
}

interface UseCapRateCalculatorReturn {
  result: CapRateResult | null;
  calculate: (input: CapRateInput) => void;
  reset: () => void;
}

export function useCapRateCalculator(): UseCapRateCalculatorReturn {
  const [result, setResult] = useState<CapRateResult | null>(null);

  const getInterpretation = (capRate: number): { interpretation: string; riskLevel: 'low' | 'moderate' | 'high' } => {
    if (capRate < 4) {
      return {
        interpretation: 'Very low cap rate, typically indicating a premium property in a prime location with lower risk but also lower returns.',
        riskLevel: 'low',
      };
    } else if (capRate < 6) {
      return {
        interpretation: 'Low to moderate cap rate, common in stable markets with quality properties. Lower risk with modest returns.',
        riskLevel: 'low',
      };
    } else if (capRate < 8) {
      return {
        interpretation: 'Moderate cap rate, representing a balance between risk and return. Common for average investment properties.',
        riskLevel: 'moderate',
      };
    } else if (capRate < 10) {
      return {
        interpretation: 'Higher cap rate, potentially indicating higher risk or value-add opportunity. May require more active management.',
        riskLevel: 'moderate',
      };
    } else {
      return {
        interpretation: 'High cap rate, suggesting higher risk, distressed property, or emerging market. Higher potential returns but more uncertainty.',
        riskLevel: 'high',
      };
    }
  };

  const calculate = useCallback((input: CapRateInput) => {
    const { mode, noi, propertyValue, capRate } = input;

    let calculatedCapRate: number;
    let calculatedPropertyValue: number;

    if (mode === 'capRate') {
      if (!propertyValue || propertyValue <= 0) return;
      calculatedCapRate = (noi / propertyValue) * 100;
      calculatedPropertyValue = propertyValue;
    } else {
      if (!capRate || capRate <= 0) return;
      calculatedCapRate = capRate;
      calculatedPropertyValue = (noi / capRate) * 100;
    }

    const { interpretation, riskLevel } = getInterpretation(calculatedCapRate);

    setResult({
      capRate: calculatedCapRate,
      propertyValue: calculatedPropertyValue,
      noi,
      interpretation,
      riskLevel,
    });
  }, []);

  const reset = useCallback(() => {
    setResult(null);
  }, []);

  return { result, calculate, reset };
}
