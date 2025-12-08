import { PaversCalculator } from '@/components/tools/pavers-calculator';

export const metadata = {
  title: 'Pavers Calculator | Calculate Paving Stones Needed',
  description: 'Calculate how many pavers you need for your patio, driveway, or walkway project. Account for wastage and plan your paver purchase accurately.',
  keywords: ['pavers calculator', 'paving stones', 'patio pavers', 'driveway pavers', 'brick pavers', 'paver wastage', 'landscaping calculator'],
  openGraph: {
    title: 'Pavers Calculator | Calculate Paving Stones Needed',
    description: 'Calculate how many pavers you need for your patio, driveway, or walkway project. Account for wastage and plan your paver purchase accurately.',
    type: 'website',
    url: '/tools/pavers-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pavers Calculator | Calculate Paving Stones Needed',
    description: 'Calculate how many pavers you need for your patio, driveway, or walkway project. Account for wastage and plan your paver purchase accurately.',
  },
};

export default function PaversCalculatorPage() {
  return <PaversCalculator />;
}
