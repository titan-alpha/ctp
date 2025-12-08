import { useState, useCallback } from 'react';

export interface ClosingCostItem {
  name: string;
  amount: number;
  category: 'lender' | 'title' | 'government' | 'prepaid' | 'other';
  description?: string;
}

interface ClosingCostInput {
  homePrice: number;
  loanAmount: number;
  location: string;
  isBuyer: boolean;
}

interface ClosingCostResult {
  totalClosingCosts: number;
  percentOfHomePrice: number;
  percentOfLoanAmount: number;
  itemizedCosts: ClosingCostItem[];
  costsByCategory: Record<string, number>;
}

interface UseClosingCostCalculatorReturn {
  result: ClosingCostResult | null;
  calculate: (input: ClosingCostInput) => void;
  reset: () => void;
}

// State-based transfer tax rates (simplified)
const STATE_TRANSFER_TAX_RATES: Record<string, number> = {
  california: 0.0011,
  texas: 0,
  florida: 0.007,
  'new york': 0.004,
  illinois: 0.001,
  pennsylvania: 0.01,
  ohio: 0.001,
  georgia: 0.001,
  'north carolina': 0.002,
  michigan: 0.0075,
  default: 0.002,
};

export function useClosingCostCalculator(): UseClosingCostCalculatorReturn {
  const [result, setResult] = useState<ClosingCostResult | null>(null);

  const calculate = useCallback((input: ClosingCostInput) => {
    const { homePrice, loanAmount, location, isBuyer } = input;

    const itemizedCosts: ClosingCostItem[] = [];
    const stateLower = location.toLowerCase().trim();
    const transferTaxRate = STATE_TRANSFER_TAX_RATES[stateLower] || STATE_TRANSFER_TAX_RATES.default;

    if (isBuyer) {
      // Lender fees
      itemizedCosts.push({
        name: 'Loan Origination Fee',
        amount: Math.round(loanAmount * 0.01),
        category: 'lender',
        description: 'Fee charged by lender for processing the loan (typically 0.5-1%)',
      });
      itemizedCosts.push({
        name: 'Application Fee',
        amount: 500,
        category: 'lender',
        description: 'Fee for processing your mortgage application',
      });
      itemizedCosts.push({
        name: 'Credit Report Fee',
        amount: 50,
        category: 'lender',
        description: 'Cost to pull your credit report',
      });
      itemizedCosts.push({
        name: 'Appraisal Fee',
        amount: 450,
        category: 'lender',
        description: 'Professional appraisal of the property value',
      });
      itemizedCosts.push({
        name: 'Underwriting Fee',
        amount: 700,
        category: 'lender',
        description: 'Fee for evaluating and verifying your loan application',
      });

      // Title fees
      itemizedCosts.push({
        name: 'Title Search',
        amount: 400,
        category: 'title',
        description: 'Search to verify clear title ownership',
      });
      itemizedCosts.push({
        name: 'Title Insurance (Lender)',
        amount: Math.round(loanAmount * 0.005),
        category: 'title',
        description: 'Insurance protecting lender against title defects',
      });
      itemizedCosts.push({
        name: 'Title Insurance (Owner)',
        amount: Math.round(homePrice * 0.005),
        category: 'title',
        description: 'Insurance protecting buyer against title defects',
      });
      itemizedCosts.push({
        name: 'Settlement/Closing Fee',
        amount: 500,
        category: 'title',
        description: 'Fee for conducting the closing',
      });

      // Government fees
      itemizedCosts.push({
        name: 'Recording Fees',
        amount: 150,
        category: 'government',
        description: 'Fee to record the deed and mortgage',
      });
      itemizedCosts.push({
        name: 'Transfer Tax',
        amount: Math.round(homePrice * transferTaxRate),
        category: 'government',
        description: 'State/local tax on property transfer',
      });

      // Prepaid items
      itemizedCosts.push({
        name: 'Homeowners Insurance (1 year)',
        amount: Math.round(homePrice * 0.0035),
        category: 'prepaid',
        description: 'First year of homeowners insurance premium',
      });
      itemizedCosts.push({
        name: 'Property Taxes (2 months)',
        amount: Math.round((homePrice * 0.012) / 6),
        category: 'prepaid',
        description: 'Property taxes held in escrow',
      });
      itemizedCosts.push({
        name: 'Prepaid Interest',
        amount: Math.round((loanAmount * 0.065) / 12),
        category: 'prepaid',
        description: 'Interest from closing date to first payment',
      });

      // Other
      itemizedCosts.push({
        name: 'Home Inspection',
        amount: 400,
        category: 'other',
        description: 'Professional inspection of the property',
      });
      itemizedCosts.push({
        name: 'Survey Fee',
        amount: 350,
        category: 'other',
        description: 'Survey to verify property boundaries',
      });
    } else {
      // Seller costs
      itemizedCosts.push({
        name: 'Real Estate Commission',
        amount: Math.round(homePrice * 0.05),
        category: 'other',
        description: 'Commission paid to real estate agents (typically 5-6%)',
      });
      itemizedCosts.push({
        name: 'Transfer Tax',
        amount: Math.round(homePrice * transferTaxRate),
        category: 'government',
        description: 'State/local tax on property transfer',
      });
      itemizedCosts.push({
        name: 'Title Insurance (Owner)',
        amount: Math.round(homePrice * 0.005),
        category: 'title',
        description: 'Title insurance for the buyer',
      });
      itemizedCosts.push({
        name: 'Settlement Fee',
        amount: 400,
        category: 'title',
        description: 'Fee for conducting the closing',
      });
      itemizedCosts.push({
        name: 'Attorney Fees',
        amount: 750,
        category: 'other',
        description: 'Legal fees for closing',
      });
      itemizedCosts.push({
        name: 'Recording Fees',
        amount: 100,
        category: 'government',
        description: 'Fee to record the deed',
      });
      itemizedCosts.push({
        name: 'Prorated Property Taxes',
        amount: Math.round((homePrice * 0.012) / 12),
        category: 'prepaid',
        description: 'Property taxes owed up to closing date',
      });
    }

    const totalClosingCosts = itemizedCosts.reduce((sum, item) => sum + item.amount, 0);

    const costsByCategory = itemizedCosts.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.amount;
      return acc;
    }, {} as Record<string, number>);

    setResult({
      totalClosingCosts,
      percentOfHomePrice: (totalClosingCosts / homePrice) * 100,
      percentOfLoanAmount: loanAmount > 0 ? (totalClosingCosts / loanAmount) * 100 : 0,
      itemizedCosts,
      costsByCategory,
    });
  }, []);

  const reset = useCallback(() => {
    setResult(null);
  }, []);

  return { result, calculate, reset };
}
