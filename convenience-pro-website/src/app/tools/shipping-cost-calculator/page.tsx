import { ShippingCostCalculator } from '@/components/tools/shipping-cost-calculator';

export const metadata = {
  title: 'Shipping Cost Calculator | Compare USPS, UPS, FedEx & DHL Rates',
  description: 'Estimate shipping costs and compare carrier rates for USPS, UPS, FedEx, and DHL. Calculate dimensional weight, compare delivery times, and find the best shipping option.',
  keywords: ['shipping cost calculator', 'shipping rate calculator', 'USPS rates', 'UPS rates', 'FedEx rates', 'DHL rates', 'dimensional weight calculator', 'shipping zone calculator', 'carrier comparison'],
  openGraph: {
    title: 'Shipping Cost Calculator | Compare USPS, UPS, FedEx & DHL Rates',
    description: 'Estimate shipping costs and compare carrier rates for USPS, UPS, FedEx, and DHL. Calculate dimensional weight, compare delivery times, and find the best shipping option.',
    type: 'website',
    url: '/tools/shipping-cost-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shipping Cost Calculator | Compare USPS, UPS, FedEx & DHL Rates',
    description: 'Estimate shipping costs and compare carrier rates for USPS, UPS, FedEx, and DHL. Calculate dimensional weight, compare delivery times, and find the best shipping option.',
  },
};

export default function ShippingCostCalculatorPage() {
  return <ShippingCostCalculator />;
}
