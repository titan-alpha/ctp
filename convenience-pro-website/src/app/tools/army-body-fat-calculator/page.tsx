import { ArmyBodyFatCalculator } from '@/components/tools/army-body-fat-calculator';

export const metadata = {
  title: 'Army Body Fat Calculator | U.S. Military Body Composition Tool',
  description: 'Calculate your body fat percentage using the official U.S. Army circumference-based method. Check if you meet military body composition standards with our free calculator.',
  keywords: ['army body fat calculator', 'military body fat', 'body fat percentage', 'army tape test', 'body composition', 'AR 600-9', 'military fitness standards'],
  openGraph: {
    title: 'Army Body Fat Calculator | U.S. Military Body Composition Tool',
    description: 'Calculate your body fat percentage using the official U.S. Army circumference-based method. Check if you meet military body composition standards with our free calculator.',
    type: 'website',
    url: '/tools/army-body-fat-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Army Body Fat Calculator | U.S. Military Body Composition Tool',
    description: 'Calculate your body fat percentage using the official U.S. Army circumference-based method. Check if you meet military body composition standards with our free calculator.',
  },
};

export default function ArmyBodyFatCalculatorPage() {
  return <ArmyBodyFatCalculator />;
}
