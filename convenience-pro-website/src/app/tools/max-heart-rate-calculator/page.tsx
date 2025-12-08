import { MaxHeartRateCalculator } from '@/components/tools/max-heart-rate-calculator';

export const metadata = {
  title: 'Max Heart Rate Calculator | Calculate Your MHR & Training Zones',
  description: 'Calculate your maximum heart rate using multiple formulas (220-age, Tanaka, Gulati). Get personalized target heart rate zones for optimal training.',
  keywords: ['max heart rate calculator', 'MHR calculator', 'maximum heart rate', 'heart rate zones', 'target heart rate', 'Tanaka formula', 'Gulati formula', 'training zones'],
  openGraph: {
    title: 'Max Heart Rate Calculator | Calculate Your MHR & Training Zones',
    description: 'Calculate your maximum heart rate using multiple formulas (220-age, Tanaka, Gulati). Get personalized target heart rate zones for optimal training.',
    type: 'website',
    url: '/tools/max-heart-rate-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Max Heart Rate Calculator | Calculate Your MHR & Training Zones',
    description: 'Calculate your maximum heart rate using multiple formulas (220-age, Tanaka, Gulati). Get personalized target heart rate zones for optimal training.',
  },
};

export default function MaxHeartRateCalculatorPage() {
  return <MaxHeartRateCalculator />;
}
