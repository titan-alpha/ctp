import { FenceCalculator } from '@/components/tools/fence-calculator';

export const metadata = {
  title: 'Fence Calculator | Calculate Fencing Materials Needed',
  description: 'Calculate how many fence posts, rails, and boards you need. Enter perimeter, height, and spacing to get accurate material estimates and cost projections.',
  keywords: ['fence calculator', 'fencing materials calculator', 'fence post calculator', 'how many fence boards', 'fence cost estimator', 'privacy fence calculator'],
  openGraph: {
    title: 'Fence Calculator | Calculate Fencing Materials Needed',
    description: 'Calculate how many fence posts, rails, and boards you need. Enter perimeter, height, and spacing to get accurate material estimates and cost projections.',
    type: 'website',
    url: '/tools/fence-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fence Calculator | Calculate Fencing Materials Needed',
    description: 'Calculate how many fence posts, rails, and boards you need. Enter perimeter, height, and spacing to get accurate material estimates and cost projections.',
  },
};

export default function FenceCalculatorPage() {
  return <FenceCalculator />;
}
