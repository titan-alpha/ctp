import { AgeDifferenceCalculator } from '@/components/tools/age-difference-calculator';

export const metadata = {
  title: 'Age Difference Calculator | Calculate Age Gap Between Two People',
  description: 'Calculate the exact age difference between two people in years, months, and days. Free online age gap calculator for comparing birthdates.',
  keywords: ['age difference calculator', 'age gap calculator', 'calculate age difference', 'birthday difference', 'age comparison', 'date difference calculator'],
  openGraph: {
    title: 'Age Difference Calculator | Calculate Age Gap Between Two People',
    description: 'Calculate the exact age difference between two people in years, months, and days. Free online age gap calculator for comparing birthdates.',
    type: 'website',
    url: '/tools/age-difference-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Age Difference Calculator | Calculate Age Gap Between Two People',
    description: 'Calculate the exact age difference between two people in years, months, and days. Free online age gap calculator for comparing birthdates.',
  },
};

export default function AgeDifferenceCalculatorPage() {
  return <AgeDifferenceCalculator />;
}
