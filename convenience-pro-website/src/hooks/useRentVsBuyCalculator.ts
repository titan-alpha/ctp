import { useState, useCallback } from 'react';

interface RentScenario {
  monthlyRent: number;
  annualRentIncrease: number;
  rentersInsurance: number;
}

interface BuyScenario {
  homePrice: number;
  downPaymentPercent: number;
  interestRate: number;
  loanTermYears: number;
  propertyTaxRate: number;
  homeInsurance: number;
  maintenancePercent: number;
  hoaFees: number;
  appreciationRate: number;
  closingCostPercent: number;
  sellingCostPercent: number;
  marginalTaxRate: number;
}

interface RentVsBuyInput {
  rent: RentScenario;
  buy: BuyScenario;
  yearsToStay: number;
  investmentReturnRate: number;
}

interface YearlyProjection {
  year: number;
  rentTotalCost: number;
  rentCumulativeCost: number;
  buyTotalCost: number;
  buyCumulativeCost: number;
  homeValue: number;
  homeEquity: number;
  remainingLoan: number;
  investmentValue: number;
  rentNetWorth: number;
  buyNetWorth: number;
}

interface RentVsBuyResult {
  recommendation: 'rent' | 'buy' | 'neutral';
  breakEvenYear: number | null;
  totalRentCost: number;
  totalBuyCost: number;
  rentNetWorth: number;
  buyNetWorth: number;
  netWorthDifference: number;
  monthlyMortgage: number;
  downPayment: number;
  closingCosts: number;
  projections: YearlyProjection[];
}

interface UseRentVsBuyCalculatorReturn {
  result: RentVsBuyResult | null;
  calculate: (input: RentVsBuyInput) => void;
  reset: () => void;
}

export function useRentVsBuyCalculator(): UseRentVsBuyCalculatorReturn {
  const [result, setResult] = useState<RentVsBuyResult | null>(null);

  const calculate = useCallback((input: RentVsBuyInput) => {
    const { rent, buy, yearsToStay, investmentReturnRate } = input;

    // Calculate buying costs
    const downPayment = buy.homePrice * (buy.downPaymentPercent / 100);
    const loanAmount = buy.homePrice - downPayment;
    const closingCosts = buy.homePrice * (buy.closingCostPercent / 100);

    // Monthly mortgage payment (P&I)
    const monthlyRate = buy.interestRate / 100 / 12;
    const numPayments = buy.loanTermYears * 12;
    const monthlyMortgage = monthlyRate > 0
      ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
        (Math.pow(1 + monthlyRate, numPayments) - 1)
      : loanAmount / numPayments;

    const projections: YearlyProjection[] = [];

    let rentCumulativeCost = 0;
    let buyCumulativeCost = downPayment + closingCosts;
    let remainingLoan = loanAmount;
    let homeValue = buy.homePrice;
    let investmentValue = downPayment + closingCosts; // What renter invests instead
    let currentRent = rent.monthlyRent;

    for (let year = 1; year <= yearsToStay; year++) {
      // Rent costs for the year
      const yearlyRent = currentRent * 12;
      const yearlyRentersInsurance = rent.rentersInsurance;
      const rentTotalCost = yearlyRent + yearlyRentersInsurance;
      rentCumulativeCost += rentTotalCost;

      // Buy costs for the year
      const yearlyMortgage = monthlyMortgage * 12;
      const yearlyPropertyTax = homeValue * (buy.propertyTaxRate / 100);
      const yearlyInsurance = buy.homeInsurance;
      const yearlyMaintenance = homeValue * (buy.maintenancePercent / 100);
      const yearlyHoa = buy.hoaFees * 12;

      // Calculate interest paid this year (for tax deduction)
      let yearlyInterest = 0;
      let tempLoan = remainingLoan;
      for (let month = 0; month < 12 && tempLoan > 0; month++) {
        const monthlyInterest = tempLoan * monthlyRate;
        yearlyInterest += monthlyInterest;
        const principal = monthlyMortgage - monthlyInterest;
        tempLoan -= principal;
      }
      remainingLoan = Math.max(0, tempLoan);

      // Tax benefit from mortgage interest and property tax deduction
      const taxDeduction = (yearlyInterest + yearlyPropertyTax) * (buy.marginalTaxRate / 100);

      const buyTotalCost = yearlyMortgage + yearlyPropertyTax + yearlyInsurance +
                           yearlyMaintenance + yearlyHoa - taxDeduction;
      buyCumulativeCost += buyTotalCost;

      // Home appreciation
      homeValue *= (1 + buy.appreciationRate / 100);
      const homeEquity = homeValue - remainingLoan;

      // Investment growth for renter (difference saved + returns)
      const monthlySavings = (monthlyMortgage + yearlyPropertyTax/12 + buy.homeInsurance/12 +
                             yearlyMaintenance/12 + buy.hoaFees) -
                            (currentRent + rent.rentersInsurance/12);
      if (monthlySavings > 0) {
        investmentValue += monthlySavings * 12;
      }
      investmentValue *= (1 + investmentReturnRate / 100);

      // Net worth calculations
      const rentNetWorth = investmentValue;
      const sellingCosts = homeValue * (buy.sellingCostPercent / 100);
      const buyNetWorth = homeEquity - sellingCosts;

      projections.push({
        year,
        rentTotalCost,
        rentCumulativeCost,
        buyTotalCost,
        buyCumulativeCost,
        homeValue,
        homeEquity,
        remainingLoan,
        investmentValue,
        rentNetWorth,
        buyNetWorth,
      });

      // Increase rent for next year
      currentRent *= (1 + rent.annualRentIncrease / 100);
    }

    // Find break-even year
    let breakEvenYear: number | null = null;
    for (const proj of projections) {
      if (proj.buyNetWorth >= proj.rentNetWorth) {
        breakEvenYear = proj.year;
        break;
      }
    }

    const finalProjection = projections[projections.length - 1];
    const netWorthDifference = finalProjection.buyNetWorth - finalProjection.rentNetWorth;

    let recommendation: 'rent' | 'buy' | 'neutral';
    if (netWorthDifference > buy.homePrice * 0.02) {
      recommendation = 'buy';
    } else if (netWorthDifference < -buy.homePrice * 0.02) {
      recommendation = 'rent';
    } else {
      recommendation = 'neutral';
    }

    setResult({
      recommendation,
      breakEvenYear,
      totalRentCost: rentCumulativeCost,
      totalBuyCost: buyCumulativeCost,
      rentNetWorth: finalProjection.rentNetWorth,
      buyNetWorth: finalProjection.buyNetWorth,
      netWorthDifference,
      monthlyMortgage,
      downPayment,
      closingCosts,
      projections,
    });
  }, []);

  const reset = useCallback(() => {
    setResult(null);
  }, []);

  return { result, calculate, reset };
}
