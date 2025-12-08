import { LampWattageCalculator } from '@/components/tools/lamp-wattage-calculator';

export const metadata = {
  title: 'Lamp Wattage Calculator | Calculate Room Lighting Needs',
  description: 'Calculate the lighting needs for any room. Enter dimensions and usage type to get total lumens required and bulb recommendations for LED, CFL, and incandescent options.',
  keywords: ['lamp wattage calculator', 'room lighting calculator', 'lumens calculator', 'how many lumens do I need', 'light bulb calculator', 'LED bulb calculator'],
  openGraph: {
    title: 'Lamp Wattage Calculator | Calculate Room Lighting Needs',
    description: 'Calculate the lighting needs for any room. Enter dimensions and usage type to get total lumens required and bulb recommendations for LED, CFL, and incandescent options.',
    type: 'website',
    url: '/tools/lamp-wattage-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lamp Wattage Calculator | Calculate Room Lighting Needs',
    description: 'Calculate the lighting needs for any room. Enter dimensions and usage type to get total lumens required and bulb recommendations for LED, CFL, and incandescent options.',
  },
};

export default function LampWattageCalculatorPage() {
  return <LampWattageCalculator />;
}
