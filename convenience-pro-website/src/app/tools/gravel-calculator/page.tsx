import { GravelCalculator } from '@/components/tools/gravel-calculator';

export const metadata = {
  title: 'Gravel Calculator | Calculate Cubic Yards & Tons Needed',
  description: 'Calculate how much gravel you need for driveways, pathways, and landscaping. Get results in cubic yards, tons, and estimate material costs.',
  keywords: ['gravel calculator', 'cubic yards calculator', 'gravel volume calculator', 'how much gravel do I need', 'gravel driveway calculator', 'landscaping gravel calculator'],
  openGraph: {
    title: 'Gravel Calculator | Calculate Cubic Yards & Tons Needed',
    description: 'Calculate how much gravel you need for driveways, pathways, and landscaping. Get results in cubic yards, tons, and estimate material costs.',
    type: 'website',
    url: '/tools/gravel-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gravel Calculator | Calculate Cubic Yards & Tons Needed',
    description: 'Calculate how much gravel you need for driveways, pathways, and landscaping. Get results in cubic yards, tons, and estimate material costs.',
  },
};

export default function GravelCalculatorPage() {
  return <GravelCalculator />;
}
