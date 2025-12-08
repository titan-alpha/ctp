import { useState, useCallback } from 'react';

interface PackageDimensions {
  length: number;
  width: number;
  height: number;
  weight: number;
}

interface ShippingInput {
  dimensions: PackageDimensions;
  originZone: string;
  destinationZone: string;
}

interface CarrierRate {
  carrier: string;
  service: string;
  price: number;
  estimatedDays: string;
  features: string[];
}

interface ShippingResult {
  dimensionalWeight: number;
  billableWeight: number;
  zoneDistance: number;
  rates: CarrierRate[];
  cheapest: CarrierRate;
  fastest: CarrierRate;
}

interface UseShippingCostCalculatorReturn {
  result: ShippingResult | null;
  calculate: (input: ShippingInput) => void;
  reset: () => void;
}

const ZONE_DISTANCES: Record<string, Record<string, number>> = {
  '1': { '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8 },
  '2': { '1': 2, '2': 1, '3': 2, '4': 3, '5': 4, '6': 5, '7': 6, '8': 7 },
  '3': { '1': 3, '2': 2, '3': 1, '4': 2, '5': 3, '6': 4, '7': 5, '8': 6 },
  '4': { '1': 4, '2': 3, '3': 2, '4': 1, '5': 2, '6': 3, '7': 4, '8': 5 },
  '5': { '1': 5, '2': 4, '3': 3, '4': 2, '5': 1, '6': 2, '7': 3, '8': 4 },
  '6': { '1': 6, '2': 5, '3': 4, '4': 3, '5': 2, '6': 1, '7': 2, '8': 3 },
  '7': { '1': 7, '2': 6, '3': 5, '4': 4, '5': 3, '6': 2, '7': 1, '8': 2 },
  '8': { '1': 8, '2': 7, '3': 6, '4': 5, '5': 4, '6': 3, '7': 2, '8': 1 },
};

const DIM_FACTOR = 139; // Standard dimensional factor for domestic shipping

export function useShippingCostCalculator(): UseShippingCostCalculatorReturn {
  const [result, setResult] = useState<ShippingResult | null>(null);

  const calculateCarrierRates = (billableWeight: number, zoneDistance: number): CarrierRate[] => {
    const baseRate = billableWeight * 0.5 + zoneDistance * 2;

    return [
      {
        carrier: 'USPS',
        service: 'Priority Mail',
        price: parseFloat((baseRate * 0.85).toFixed(2)),
        estimatedDays: zoneDistance <= 3 ? '1-3' : '2-5',
        features: ['Tracking', 'Insurance up to $100', 'Free pickup'],
      },
      {
        carrier: 'USPS',
        service: 'Ground Advantage',
        price: parseFloat((baseRate * 0.65).toFixed(2)),
        estimatedDays: zoneDistance <= 3 ? '2-5' : '4-8',
        features: ['Tracking', 'Delivery confirmation'],
      },
      {
        carrier: 'UPS',
        service: 'Ground',
        price: parseFloat((baseRate * 0.95).toFixed(2)),
        estimatedDays: zoneDistance <= 3 ? '1-5' : '3-7',
        features: ['Tracking', 'Insurance available', 'Scheduled pickup'],
      },
      {
        carrier: 'UPS',
        service: '2-Day Air',
        price: parseFloat((baseRate * 2.2).toFixed(2)),
        estimatedDays: '2',
        features: ['Tracking', 'Guaranteed delivery', 'Insurance included'],
      },
      {
        carrier: 'UPS',
        service: 'Next Day Air',
        price: parseFloat((baseRate * 3.5).toFixed(2)),
        estimatedDays: '1',
        features: ['Tracking', 'Guaranteed delivery', 'Insurance included', 'Morning delivery option'],
      },
      {
        carrier: 'FedEx',
        service: 'Ground',
        price: parseFloat((baseRate * 0.92).toFixed(2)),
        estimatedDays: zoneDistance <= 3 ? '1-5' : '3-7',
        features: ['Tracking', 'Money-back guarantee', 'Delivery alerts'],
      },
      {
        carrier: 'FedEx',
        service: 'Express Saver',
        price: parseFloat((baseRate * 2.0).toFixed(2)),
        estimatedDays: '3',
        features: ['Tracking', 'Money-back guarantee', 'Delivery by 4:30 PM'],
      },
      {
        carrier: 'FedEx',
        service: 'Priority Overnight',
        price: parseFloat((baseRate * 3.8).toFixed(2)),
        estimatedDays: '1',
        features: ['Tracking', 'Money-back guarantee', 'Morning delivery', 'Saturday delivery'],
      },
      {
        carrier: 'DHL',
        service: 'Express',
        price: parseFloat((baseRate * 2.5).toFixed(2)),
        estimatedDays: '1-2',
        features: ['Tracking', 'On-demand delivery', 'Signature required'],
      },
    ];
  };

  const calculate = useCallback((input: ShippingInput) => {
    const { dimensions, originZone, destinationZone } = input;
    const { length, width, height, weight } = dimensions;

    // Calculate dimensional weight
    const dimensionalWeight = (length * width * height) / DIM_FACTOR;

    // Billable weight is the greater of actual weight or dimensional weight
    const billableWeight = Math.max(weight, dimensionalWeight);

    // Get zone distance
    const zoneDistance = ZONE_DISTANCES[originZone]?.[destinationZone] || 4;

    // Calculate rates for all carriers
    const rates = calculateCarrierRates(billableWeight, zoneDistance);

    // Sort by price to find cheapest
    const sortedByPrice = [...rates].sort((a, b) => a.price - b.price);
    const cheapest = sortedByPrice[0];

    // Sort by delivery time to find fastest
    const sortedByTime = [...rates].sort((a, b) => {
      const aDays = parseInt(a.estimatedDays.split('-')[0]);
      const bDays = parseInt(b.estimatedDays.split('-')[0]);
      return aDays - bDays;
    });
    const fastest = sortedByTime[0];

    setResult({
      dimensionalWeight: parseFloat(dimensionalWeight.toFixed(2)),
      billableWeight: parseFloat(billableWeight.toFixed(2)),
      zoneDistance,
      rates,
      cheapest,
      fastest,
    });
  }, []);

  const reset = useCallback(() => {
    setResult(null);
  }, []);

  return { result, calculate, reset };
}
