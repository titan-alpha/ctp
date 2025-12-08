import { FlooringCalculator } from '@/components/tools/flooring-calculator';

export const metadata = {
  title: 'Flooring Calculator | Calculate Flooring Material Needed',
  description: 'Calculate how much flooring you need for your project. Get square footage, wastage estimation, and box count for hardwood, laminate, vinyl, and more.',
  keywords: ['flooring calculator', 'hardwood flooring', 'laminate flooring', 'vinyl plank', 'square footage calculator', 'flooring wastage', 'flooring boxes needed'],
  openGraph: {
    title: 'Flooring Calculator | Calculate Flooring Material Needed',
    description: 'Calculate how much flooring you need for your project. Get square footage, wastage estimation, and box count for hardwood, laminate, vinyl, and more.',
    type: 'website',
    url: '/tools/flooring-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Flooring Calculator | Calculate Flooring Material Needed',
    description: 'Calculate how much flooring you need for your project. Get square footage, wastage estimation, and box count for hardwood, laminate, vinyl, and more.',
  },
};

export default function FlooringCalculatorPage() {
  return <FlooringCalculator />;
}
