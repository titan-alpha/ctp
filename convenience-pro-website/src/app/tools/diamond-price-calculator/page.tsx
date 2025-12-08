import { DiamondPriceCalculator } from '@/components/tools/diamond-price-calculator';

export const metadata = {
  title: 'Diamond Price Calculator | Estimate Diamond Value by 4Cs',
  description: 'Estimate diamond prices based on Carat, Cut, Color, and Clarity (4Cs). Free diamond value calculator with price ranges for informed buying decisions.',
  keywords: ['diamond price calculator', 'diamond value estimator', '4Cs diamonds', 'diamond carat price', 'diamond cost calculator', 'diamond buying guide', 'diamond clarity chart', 'diamond color grades'],
  openGraph: {
    title: 'Diamond Price Calculator | Estimate Diamond Value by 4Cs',
    description: 'Estimate diamond prices based on Carat, Cut, Color, and Clarity (4Cs). Free diamond value calculator with price ranges for informed buying decisions.',
    type: 'website',
    url: '/tools/diamond-price-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Diamond Price Calculator | Estimate Diamond Value by 4Cs',
    description: 'Estimate diamond prices based on Carat, Cut, Color, and Clarity (4Cs). Free diamond value calculator with price ranges for informed buying decisions.',
  },
};

export default function DiamondPriceCalculatorPage() {
  return <DiamondPriceCalculator />;
}
