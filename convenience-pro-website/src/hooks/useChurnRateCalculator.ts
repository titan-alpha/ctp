import { useState, useCallback } from 'react';

export interface ChurnInputs {
  customersStart: number;
  customersLost: number;
  customersGained: number;
  timePeriod: 'monthly' | 'quarterly' | 'annual';
}

export interface ChurnMetrics {
  churnRate: number;
  retentionRate: number;
  netChurn: number;
  netChurnRate: number;
  customersEnd: number;
  monthlyChurnRate: number;
  annualChurnRate: number;
  projectedCustomers6Months: number;
  projectedCustomers12Months: number;
  averageCustomerLifespan: number;
  customerLifetimeMonths: number;
}

interface UseChurnRateCalculatorReturn {
  inputs: ChurnInputs;
  metrics: ChurnMetrics | null;
  error: string | null;
  setInputs: (inputs: Partial<ChurnInputs>) => void;
  calculate: () => void;
  reset: () => void;
}

const DEFAULT_INPUTS: ChurnInputs = {
  customersStart: 0,
  customersLost: 0,
  customersGained: 0,
  timePeriod: 'monthly',
};

export function useChurnRateCalculator(): UseChurnRateCalculatorReturn {
  const [inputs, setInputsState] = useState<ChurnInputs>(DEFAULT_INPUTS);
  const [metrics, setMetrics] = useState<ChurnMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);

  const setInputs = useCallback((newInputs: Partial<ChurnInputs>) => {
    setInputsState((prev) => ({ ...prev, ...newInputs }));
  }, []);

  const calculate = useCallback(() => {
    const { customersStart, customersLost, customersGained, timePeriod } = inputs;

    if (customersStart <= 0) {
      setError('Starting customers must be greater than 0');
      setMetrics(null);
      return;
    }

    if (customersLost < 0 || customersGained < 0) {
      setError('Customer counts cannot be negative');
      setMetrics(null);
      return;
    }

    if (customersLost > customersStart) {
      setError('Lost customers cannot exceed starting customers');
      setMetrics(null);
      return;
    }

    // Basic churn rate calculation
    const churnRate = (customersLost / customersStart) * 100;
    const retentionRate = 100 - churnRate;
    const netChurn = customersLost - customersGained;
    const netChurnRate = (netChurn / customersStart) * 100;
    const customersEnd = customersStart - customersLost + customersGained;

    // Convert to monthly and annual rates based on time period
    let monthlyChurnRate: number;
    let annualChurnRate: number;

    switch (timePeriod) {
      case 'monthly':
        monthlyChurnRate = churnRate;
        annualChurnRate = (1 - Math.pow(1 - churnRate / 100, 12)) * 100;
        break;
      case 'quarterly':
        monthlyChurnRate = (1 - Math.pow(1 - churnRate / 100, 1 / 3)) * 100;
        annualChurnRate = (1 - Math.pow(1 - churnRate / 100, 4)) * 100;
        break;
      case 'annual':
        monthlyChurnRate = (1 - Math.pow(1 - churnRate / 100, 1 / 12)) * 100;
        annualChurnRate = churnRate;
        break;
    }

    // Projections based on monthly churn rate
    const monthlyRetention = 1 - monthlyChurnRate / 100;
    const projectedCustomers6Months = Math.round(customersEnd * Math.pow(monthlyRetention, 6));
    const projectedCustomers12Months = Math.round(customersEnd * Math.pow(monthlyRetention, 12));

    // Average customer lifespan (in periods and months)
    const averageCustomerLifespan = churnRate > 0 ? 1 / (churnRate / 100) : Infinity;
    const customerLifetimeMonths = monthlyChurnRate > 0 ? 1 / (monthlyChurnRate / 100) : Infinity;

    setMetrics({
      churnRate,
      retentionRate,
      netChurn,
      netChurnRate,
      customersEnd,
      monthlyChurnRate,
      annualChurnRate,
      projectedCustomers6Months,
      projectedCustomers12Months,
      averageCustomerLifespan,
      customerLifetimeMonths,
    });
    setError(null);
  }, [inputs]);

  const reset = useCallback(() => {
    setInputsState(DEFAULT_INPUTS);
    setMetrics(null);
    setError(null);
  }, []);

  return { inputs, metrics, error, setInputs, calculate, reset };
}
