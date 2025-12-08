import type { Metadata } from 'next';
import MarketShareCalculatorComponent from '@/components/tools/market-share-calculator';

export const metadata: Metadata = {
  title: 'Market Share Calculator - Calculate Market Share Percentage | Free Online Tool',
  description: 'Free online market share calculator. Calculate market share percentages, compare competitors, and visualize market distribution with interactive pie charts.',
  keywords: [
    'market share calculator',
    'market share percentage',
    'competitor analysis',
    'market analysis tool',
    'business calculator',
    'market share formula',
  ],
  openGraph: {
    title: 'Market Share Calculator - Calculate Market Share Percentage',
    description: 'Free online market share calculator. Calculate and compare market share percentages with visual pie chart analysis.',
    type: 'website',
    url: 'https://conveniencepro.com/tools/market-share-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Market Share Calculator - Free Online Tool',
    description: 'Calculate market share percentages and compare competitors with visual analysis.',
  },
  alternates: {
    canonical: 'https://conveniencepro.com/tools/market-share-calculator',
  },
};

export default function MarketShareCalculatorPage() {
  return <MarketShareCalculatorComponent />;
}
