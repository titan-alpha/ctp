import { StairsCalculator } from '@/components/tools/stairs-calculator';

export const metadata = {
  title: 'Stairs Calculator | Calculate Stair Dimensions & Code Compliance',
  description: 'Calculate stair dimensions including riser count, tread depth, and stair angle. Check building code compliance for safe residential stairs.',
  keywords: ['stairs calculator', 'stair dimensions', 'riser calculator', 'tread depth calculator', 'stair building code', 'staircase calculator'],
  openGraph: {
    title: 'Stairs Calculator | Calculate Stair Dimensions & Code Compliance',
    description: 'Calculate stair dimensions including riser count, tread depth, and stair angle. Check building code compliance for safe residential stairs.',
    type: 'website',
    url: '/tools/stairs-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stairs Calculator | Calculate Stair Dimensions & Code Compliance',
    description: 'Calculate stair dimensions including riser count, tread depth, and stair angle. Check building code compliance for safe residential stairs.',
  },
};

export default function StairsCalculatorPage() {
  return <StairsCalculator />;
}
