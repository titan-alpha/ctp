import { PaintCalculator } from '@/components/tools/paint-calculator';

export const metadata = {
  title: 'Paint Calculator | Calculate How Much Paint You Need',
  description: 'Calculate exactly how much paint you need for your room. Enter dimensions, doors, windows, and number of coats to get accurate gallon estimates.',
  keywords: ['paint calculator', 'how much paint do I need', 'wall paint calculator', 'room paint estimate', 'paint coverage calculator', 'gallon calculator'],
  openGraph: {
    title: 'Paint Calculator | Calculate How Much Paint You Need',
    description: 'Calculate exactly how much paint you need for your room. Enter dimensions, doors, windows, and number of coats to get accurate gallon estimates.',
    type: 'website',
    url: '/tools/paint-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Paint Calculator | Calculate How Much Paint You Need',
    description: 'Calculate exactly how much paint you need for your room. Enter dimensions, doors, windows, and number of coats to get accurate gallon estimates.',
  },
};

export default function PaintCalculatorPage() {
  return <PaintCalculator />;
}
