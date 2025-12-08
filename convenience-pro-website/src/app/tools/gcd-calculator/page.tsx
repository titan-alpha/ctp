import { GcdCalculator } from '@/components/tools/gcd-calculator';

export const metadata = {
  title: 'GCD Calculator | Greatest Common Divisor Calculator',
  description: 'Calculate the Greatest Common Divisor (GCD) of multiple numbers using the Euclidean algorithm. View step-by-step solutions and learn how GCD works.',
  keywords: ['GCD calculator', 'greatest common divisor', 'GCF calculator', 'greatest common factor', 'HCF calculator', 'Euclidean algorithm', 'math calculator'],
  openGraph: {
    title: 'GCD Calculator | Greatest Common Divisor Calculator',
    description: 'Calculate the Greatest Common Divisor (GCD) of multiple numbers using the Euclidean algorithm. View step-by-step solutions and learn how GCD works.',
    type: 'website',
    url: '/tools/gcd-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GCD Calculator | Greatest Common Divisor Calculator',
    description: 'Calculate the Greatest Common Divisor (GCD) of multiple numbers using the Euclidean algorithm. View step-by-step solutions and learn how GCD works.',
  },
};

export default function GcdCalculatorPage() {
  return <GcdCalculator />;
}
