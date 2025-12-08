import { BrickCalculator } from '@/components/tools/brick-calculator';

export const metadata = {
  title: 'Brick Calculator | Calculate Bricks Needed for Wall',
  description: 'Calculate how many bricks you need for your wall project. Account for mortar joints, wastage, and get accurate brick counts for construction planning.',
  keywords: ['brick calculator', 'bricks needed', 'wall bricks', 'mortar joint', 'brick wastage', 'bricks per square meter', 'construction calculator'],
  openGraph: {
    title: 'Brick Calculator | Calculate Bricks Needed for Wall',
    description: 'Calculate how many bricks you need for your wall project. Account for mortar joints, wastage, and get accurate brick counts for construction planning.',
    type: 'website',
    url: '/tools/brick-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Brick Calculator | Calculate Bricks Needed for Wall',
    description: 'Calculate how many bricks you need for your wall project. Account for mortar joints, wastage, and get accurate brick counts for construction planning.',
  },
};

export default function BrickCalculatorPage() {
  return <BrickCalculator />;
}
