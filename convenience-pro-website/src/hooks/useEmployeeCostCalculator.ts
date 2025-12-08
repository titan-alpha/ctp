import { useState, useCallback, useMemo } from 'react';

export interface EmployeeCostInputs {
  baseSalary: number;
  healthInsurance: number;
  dentalVision: number;
  retirement401k: number;
  paidTimeOff: number;
  socialSecurityRate: number;
  medicareRate: number;
  federalUnemploymentRate: number;
  stateUnemploymentRate: number;
  workersCompRate: number;
  equipmentCost: number;
  softwareLicenses: number;
  officeSpace: number;
  trainingCost: number;
}

export interface CostBreakdown {
  baseSalary: number;
  totalBenefits: number;
  totalTaxes: number;
  totalOverhead: number;
  totalCost: number;
  costMultiplier: number;
  monthlyCost: number;
  hourlyRate: number;
}

interface UseEmployeeCostCalculatorReturn {
  inputs: EmployeeCostInputs;
  updateInput: (field: keyof EmployeeCostInputs, value: number) => void;
  resetInputs: () => void;
  breakdown: CostBreakdown;
}

const DEFAULT_INPUTS: EmployeeCostInputs = {
  baseSalary: 60000,
  healthInsurance: 6000,
  dentalVision: 600,
  retirement401k: 3,
  paidTimeOff: 15,
  socialSecurityRate: 6.2,
  medicareRate: 1.45,
  federalUnemploymentRate: 0.6,
  stateUnemploymentRate: 2.7,
  workersCompRate: 1.0,
  equipmentCost: 2000,
  softwareLicenses: 1200,
  officeSpace: 5000,
  trainingCost: 1500,
};

export function useEmployeeCostCalculator(): UseEmployeeCostCalculatorReturn {
  const [inputs, setInputs] = useState<EmployeeCostInputs>(DEFAULT_INPUTS);

  const updateInput = useCallback((field: keyof EmployeeCostInputs, value: number) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }, []);

  const resetInputs = useCallback(() => {
    setInputs(DEFAULT_INPUTS);
  }, []);

  const breakdown = useMemo((): CostBreakdown => {
    const { baseSalary } = inputs;

    // Calculate benefits
    const ptoValue = (inputs.paidTimeOff / 260) * baseSalary;
    const retirement401kAmount = (inputs.retirement401k / 100) * baseSalary;
    const totalBenefits = inputs.healthInsurance + inputs.dentalVision + retirement401kAmount + ptoValue;

    // Calculate employer taxes
    const socialSecurityTax = (inputs.socialSecurityRate / 100) * Math.min(baseSalary, 168600);
    const medicareTax = (inputs.medicareRate / 100) * baseSalary;
    const futaTax = (inputs.federalUnemploymentRate / 100) * Math.min(baseSalary, 7000);
    const sutaTax = (inputs.stateUnemploymentRate / 100) * Math.min(baseSalary, 7000);
    const workersCompTax = (inputs.workersCompRate / 100) * baseSalary;
    const totalTaxes = socialSecurityTax + medicareTax + futaTax + sutaTax + workersCompTax;

    // Calculate overhead
    const totalOverhead = inputs.equipmentCost + inputs.softwareLicenses + inputs.officeSpace + inputs.trainingCost;

    // Calculate totals
    const totalCost = baseSalary + totalBenefits + totalTaxes + totalOverhead;
    const costMultiplier = baseSalary > 0 ? totalCost / baseSalary : 0;
    const monthlyCost = totalCost / 12;
    const hourlyRate = totalCost / 2080;

    return {
      baseSalary,
      totalBenefits,
      totalTaxes,
      totalOverhead,
      totalCost,
      costMultiplier,
      monthlyCost,
      hourlyRate,
    };
  }, [inputs]);

  return {
    inputs,
    updateInput,
    resetInputs,
    breakdown,
  };
}
