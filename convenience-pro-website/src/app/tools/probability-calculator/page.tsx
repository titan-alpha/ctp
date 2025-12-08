import { ProbabilityCalculator } from '@/components/tools/probability-calculator';

export const metadata = {
  title: 'Probability Calculator | Calculate Event Probability Online',
  description: 'Free probability calculator for single events, combined events (AND, OR, NOT), permutations, and combinations. Calculate odds, percentages, and arrangements instantly.',
  keywords: ['probability calculator', 'probability formula', 'permutation calculator', 'combination calculator', 'odds calculator', 'AND OR probability', 'event probability'],
  openGraph: {
    title: 'Probability Calculator | Calculate Event Probability Online',
    description: 'Free probability calculator for single events, combined events (AND, OR, NOT), permutations, and combinations. Calculate odds, percentages, and arrangements instantly.',
    type: 'website',
    url: '/tools/probability-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Probability Calculator | Calculate Event Probability Online',
    description: 'Free probability calculator for single events, combined events (AND, OR, NOT), permutations, and combinations. Calculate odds, percentages, and arrangements instantly.',
  },
};

export default function ProbabilityCalculatorPage() {
  return <ProbabilityCalculator />;
}
