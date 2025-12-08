import { AlcoholDilutionCalculator } from '@/components/tools/alcohol-dilution-calculator';

export const metadata = {
  title: 'Alcohol Dilution Calculator | Calculate Water to Add for Target ABV',
  description: 'Calculate how much water to add to dilute spirits to your desired ABV. Perfect for whiskey, vodka, rum, and other spirits. Free online dilution calculator.',
  keywords: ['alcohol dilution calculator', 'spirit dilution', 'ABV calculator', 'water to add', 'whiskey dilution', 'proof calculator', 'alcohol water ratio'],
  openGraph: {
    title: 'Alcohol Dilution Calculator | Calculate Water to Add for Target ABV',
    description: 'Calculate how much water to add to dilute spirits to your desired ABV. Perfect for whiskey, vodka, rum, and other spirits.',
    type: 'website',
    url: '/tools/alcohol-dilution-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alcohol Dilution Calculator | Calculate Water to Add for Target ABV',
    description: 'Calculate how much water to add to dilute spirits to your desired ABV. Perfect for whiskey, vodka, rum, and other spirits.',
  },
};

export default function AlcoholDilutionCalculatorPage() {
  return <AlcoholDilutionCalculator />;
}
