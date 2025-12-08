import { LcmCalculator } from '@/components/tools/lcm-calculator';

export const metadata = {
  title: 'LCM Calculator | Find Least Common Multiple Online',
  description: 'Calculate the Least Common Multiple (LCM) of two or more numbers instantly. Step-by-step solutions using GCD method. Free online LCM calculator.',
  keywords: ['lcm calculator', 'least common multiple', 'lcm finder', 'lcm of two numbers', 'lcm multiple numbers', 'gcd lcm calculator', 'math calculator'],
  openGraph: {
    title: 'LCM Calculator | Find Least Common Multiple Online',
    description: 'Calculate the Least Common Multiple (LCM) of two or more numbers instantly. Step-by-step solutions using GCD method.',
    type: 'website',
    url: '/tools/lcm-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LCM Calculator | Find Least Common Multiple Online',
    description: 'Calculate the Least Common Multiple (LCM) of two or more numbers instantly. Step-by-step solutions using GCD method.',
  },
};

export default function LcmCalculatorPage() {
  return <LcmCalculator />;
}
