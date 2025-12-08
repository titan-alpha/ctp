import { useState, useCallback } from 'react';

interface CLVBreakdown {
  monthlyRevenue: number;
  annualRevenue: number;
  grossProfit: number;
  customerLifespan: number;
}

interface CLVProjection {
  year: number;
  cumulativeRevenue: number;
  cumulativeProfit: number;
  retainedCustomers: number;
}

interface CLVResult {
  simpleCLV: number;
  traditionalCLV: number;
  breakdown: CLVBreakdown;
  projections: CLVProjection[];
  formula: {
    simple: string;
    traditional: string;
  };
}

interface UseCustomerLifetimeValueReturn {
  result: CLVResult | null;
  error: string | null;
  calculate: (arpu: number, margin: number, churnRate: number) => void;
  reset: () => void;
}

export function useCustomerLifetimeValue(): UseCustomerLifetimeValueReturn {
  const [result, setResult] = useState<CLVResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculate = useCallback((arpu: number, margin: number, churnRate: number) => {
    // Validation
    if (arpu <= 0) {
      setError('Average revenue per user must be greater than 0');
      setResult(null);
      return;
    }
    if (margin < 0 || margin > 100) {
      setError('Gross margin must be between 0 and 100%');
      setResult(null);
      return;
    }
    if (churnRate <= 0 || churnRate > 100) {
      setError('Churn rate must be between 0 and 100%');
      setResult(null);
      return;
    }

    const marginDecimal = margin / 100;
    const churnDecimal = churnRate / 100;

    // Customer lifespan in months (1 / monthly churn rate)
    const customerLifespan = 1 / churnDecimal;

    // Simple CLV: ARPU * Lifespan
    const simpleCLV = arpu * customerLifespan;

    // Traditional CLV: (ARPU * Gross Margin) / Churn Rate
    const traditionalCLV = (arpu * marginDecimal) / churnDecimal;

    // Breakdown
    const monthlyRevenue = arpu;
    const annualRevenue = arpu * 12;
    const grossProfit = arpu * marginDecimal;

    // Generate 5-year projections
    const projections: CLVProjection[] = [];
    let retainedCustomers = 100; // Start with 100 customers
    let cumulativeRevenue = 0;
    let cumulativeProfit = 0;

    for (let year = 1; year <= 5; year++) {
      // Annual retention applied
      const annualChurn = 1 - Math.pow(1 - churnDecimal, 12);
      const yearRevenue = retainedCustomers * annualRevenue;
      const yearProfit = yearRevenue * marginDecimal;

      cumulativeRevenue += yearRevenue;
      cumulativeProfit += yearProfit;

      projections.push({
        year,
        cumulativeRevenue: Math.round(cumulativeRevenue),
        cumulativeProfit: Math.round(cumulativeProfit),
        retainedCustomers: Math.round(retainedCustomers),
      });

      retainedCustomers = retainedCustomers * (1 - annualChurn);
    }

    setResult({
      simpleCLV: Math.round(simpleCLV * 100) / 100,
      traditionalCLV: Math.round(traditionalCLV * 100) / 100,
      breakdown: {
        monthlyRevenue,
        annualRevenue,
        grossProfit: Math.round(grossProfit * 100) / 100,
        customerLifespan: Math.round(customerLifespan * 10) / 10,
      },
      projections,
      formula: {
        simple: `CLV = ARPU x (1 / Churn Rate) = $${arpu} x ${customerLifespan.toFixed(1)} = $${simpleCLV.toFixed(2)}`,
        traditional: `CLV = (ARPU x Margin) / Churn = ($${arpu} x ${(margin).toFixed(0)}%) / ${churnRate}% = $${traditionalCLV.toFixed(2)}`,
      },
    });
    setError(null);
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { result, error, calculate, reset };
}
