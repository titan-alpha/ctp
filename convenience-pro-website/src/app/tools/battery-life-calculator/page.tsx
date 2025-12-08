import { BatteryLifeCalculator } from '@/components/tools/battery-life-calculator';

export const metadata = {
  title: 'Battery Life Calculator | Calculate Device Runtime',
  description: 'Calculate how long your battery will last based on capacity (mAh) and power draw (mA). Free online battery runtime calculator for smartphones, laptops, and IoT devices.',
  keywords: ['battery life calculator', 'battery runtime', 'mAh calculator', 'power consumption', 'battery duration', 'device battery life'],
  openGraph: {
    title: 'Battery Life Calculator | Calculate Device Runtime',
    description: 'Calculate how long your battery will last based on capacity (mAh) and power draw (mA). Free online battery runtime calculator for smartphones, laptops, and IoT devices.',
    type: 'website',
    url: '/tools/battery-life-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Battery Life Calculator | Calculate Device Runtime',
    description: 'Calculate how long your battery will last based on capacity (mAh) and power draw (mA). Free online battery runtime calculator for smartphones, laptops, and IoT devices.',
  },
};

export default function BatteryLifeCalculatorPage() {
  return <BatteryLifeCalculator />;
}
