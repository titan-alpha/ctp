import { NumerologyCalculator } from '@/components/tools/numerology-calculator';

export const metadata = {
  title: 'Numerology Calculator | Life Path & Expression Number Calculator',
  description: 'Calculate your Life Path Number from your birthdate and Expression Number from your name. Discover meanings, master numbers, and numerology interpretations.',
  keywords: ['numerology calculator', 'life path number', 'expression number', 'numerology meanings', 'master numbers', 'name numerology', 'birthdate numerology'],
  openGraph: {
    title: 'Numerology Calculator | Life Path & Expression Number Calculator',
    description: 'Calculate your Life Path Number from your birthdate and Expression Number from your name. Discover meanings, master numbers, and numerology interpretations.',
    type: 'website',
    url: '/tools/numerology-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Numerology Calculator | Life Path & Expression Number Calculator',
    description: 'Calculate your Life Path Number from your birthdate and Expression Number from your name. Discover meanings, master numbers, and numerology interpretations.',
  },
};

export default function NumerologyCalculatorPage() {
  return <NumerologyCalculator />;
}
