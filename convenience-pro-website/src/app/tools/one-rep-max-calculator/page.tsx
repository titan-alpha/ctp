import { OneRepMaxCalculator } from '@/components/tools/one-rep-max-calculator';

export const metadata = {
  title: 'One Rep Max Calculator | Calculate Your 1RM',
  description: 'Calculate your one-rep max using Epley and Brzycki formulas. Get training load percentages and rep ranges to optimize your strength training program.',
  keywords: ['one rep max calculator', '1RM calculator', 'strength calculator', 'Epley formula', 'Brzycki formula', 'weightlifting calculator', 'training load calculator'],
  openGraph: {
    title: 'One Rep Max Calculator | Calculate Your 1RM',
    description: 'Calculate your one-rep max using Epley and Brzycki formulas. Get training load percentages and rep ranges to optimize your strength training program.',
    type: 'website',
    url: '/tools/one-rep-max-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'One Rep Max Calculator | Calculate Your 1RM',
    description: 'Calculate your one-rep max using Epley and Brzycki formulas. Get training load percentages and rep ranges to optimize your strength training program.',
  },
};

export default function OneRepMaxCalculatorPage() {
  return <OneRepMaxCalculator />;
}
