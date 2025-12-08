import { useState, useCallback } from 'react';

export type DietType = 'vegan' | 'vegetarian' | 'average' | 'meat-heavy';
export type HomeType = 'apartment' | 'small-house' | 'medium-house' | 'large-house';

interface CarbonFootprintInput {
  // Travel
  carMilesPerWeek: number;
  flightsPerYear: number; // short-haul flights
  longFlightsPerYear: number; // long-haul flights
  // Home Energy
  electricityKwhPerMonth: number;
  naturalGasThermsPerMonth: number;
  homeType: HomeType;
  // Diet
  dietType: DietType;
}

interface CategoryBreakdown {
  travel: number;
  homeEnergy: number;
  diet: number;
}

interface CarbonFootprintResult {
  totalCO2TonsPerYear: number;
  breakdown: CategoryBreakdown;
  comparisonToAverage: number; // percentage compared to US average (~16 tons)
  rating: 'excellent' | 'good' | 'average' | 'high' | 'very-high';
  tips: string[];
}

interface UseCarbonFootprintCalculatorReturn {
  result: CarbonFootprintResult | null;
  calculate: (input: CarbonFootprintInput) => void;
  reset: () => void;
}

// CO2 emission factors
const CAR_CO2_PER_MILE = 0.000404; // tons CO2 per mile (average car)
const SHORT_FLIGHT_CO2 = 0.255; // tons CO2 per short-haul flight
const LONG_FLIGHT_CO2 = 1.5; // tons CO2 per long-haul flight
const ELECTRICITY_CO2_PER_KWH = 0.000417; // tons CO2 per kWh (US average)
const NATURAL_GAS_CO2_PER_THERM = 0.00549; // tons CO2 per therm

// Diet CO2 emissions (tons per year)
const DIET_CO2: Record<DietType, number> = {
  vegan: 1.5,
  vegetarian: 2.0,
  average: 2.5,
  'meat-heavy': 3.3,
};

// Home type multiplier for energy usage
const HOME_MULTIPLIER: Record<HomeType, number> = {
  apartment: 0.7,
  'small-house': 1.0,
  'medium-house': 1.3,
  'large-house': 1.6,
};

const US_AVERAGE_CO2 = 16; // tons per person per year

export function useCarbonFootprintCalculator(): UseCarbonFootprintCalculatorReturn {
  const [result, setResult] = useState<CarbonFootprintResult | null>(null);

  const calculate = useCallback((input: CarbonFootprintInput) => {
    // Travel emissions
    const carEmissions = input.carMilesPerWeek * 52 * CAR_CO2_PER_MILE;
    const flightEmissions =
      input.flightsPerYear * SHORT_FLIGHT_CO2 +
      input.longFlightsPerYear * LONG_FLIGHT_CO2;
    const travelTotal = carEmissions + flightEmissions;

    // Home energy emissions
    const electricityEmissions =
      input.electricityKwhPerMonth * 12 * ELECTRICITY_CO2_PER_KWH * HOME_MULTIPLIER[input.homeType];
    const gasEmissions =
      input.naturalGasThermsPerMonth * 12 * NATURAL_GAS_CO2_PER_THERM * HOME_MULTIPLIER[input.homeType];
    const homeEnergyTotal = electricityEmissions + gasEmissions;

    // Diet emissions
    const dietTotal = DIET_CO2[input.dietType];

    // Total
    const totalCO2TonsPerYear = travelTotal + homeEnergyTotal + dietTotal;
    const comparisonToAverage = ((totalCO2TonsPerYear - US_AVERAGE_CO2) / US_AVERAGE_CO2) * 100;

    // Rating
    let rating: CarbonFootprintResult['rating'];
    if (totalCO2TonsPerYear < 6) rating = 'excellent';
    else if (totalCO2TonsPerYear < 10) rating = 'good';
    else if (totalCO2TonsPerYear < 16) rating = 'average';
    else if (totalCO2TonsPerYear < 22) rating = 'high';
    else rating = 'very-high';

    // Tips based on highest category
    const tips: string[] = [];
    if (travelTotal > 5) {
      tips.push('Consider carpooling, using public transit, or switching to an electric vehicle.');
      tips.push('Reduce air travel or consider carbon offsets for flights.');
    }
    if (homeEnergyTotal > 4) {
      tips.push('Switch to renewable energy sources or install solar panels.');
      tips.push('Improve home insulation and use energy-efficient appliances.');
    }
    if (dietTotal > 2.5) {
      tips.push('Reduce red meat consumption and incorporate more plant-based meals.');
    }
    if (tips.length === 0) {
      tips.push('Great job! Continue your sustainable practices.');
    }

    setResult({
      totalCO2TonsPerYear: Math.round(totalCO2TonsPerYear * 10) / 10,
      breakdown: {
        travel: Math.round(travelTotal * 10) / 10,
        homeEnergy: Math.round(homeEnergyTotal * 10) / 10,
        diet: Math.round(dietTotal * 10) / 10,
      },
      comparisonToAverage: Math.round(comparisonToAverage),
      rating,
      tips,
    });
  }, []);

  const reset = useCallback(() => {
    setResult(null);
  }, []);

  return { result, calculate, reset };
}
