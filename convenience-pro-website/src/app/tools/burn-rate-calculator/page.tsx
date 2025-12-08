import { BurnRateCalculator } from '@/components/tools/burn-rate-calculator';

export const metadata = {
  title: 'Burn Rate Calculator | Calculate Startup Runway & Cash Flow',
  description: 'Calculate your startup burn rate, runway in months, and financial health. Track expenses, revenue, and cash balance to plan your funding strategy.',
  keywords: ['burn rate calculator', 'startup runway', 'cash runway', 'burn rate', 'startup finances', 'monthly expenses', 'financial planning'],
  openGraph: {
    title: 'Burn Rate Calculator | Calculate Startup Runway & Cash Flow',
    description: 'Calculate your startup burn rate, runway in months, and financial health. Track expenses, revenue, and cash balance to plan your funding strategy.',
    type: 'website',
    url: '/tools/burn-rate-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Burn Rate Calculator | Calculate Startup Runway & Cash Flow',
    description: 'Calculate your startup burn rate, runway in months, and financial health. Track expenses, revenue, and cash balance to plan your funding strategy.',
  },
};

export default function BurnRateCalculatorPage() {
  return <BurnRateCalculator />;
}
