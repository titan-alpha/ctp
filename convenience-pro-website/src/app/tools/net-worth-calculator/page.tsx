import { NetWorthCalculator } from '@/components/tools/net-worth-calculator';

export const metadata = {
  title: 'Net Worth Calculator | Personal Balance Sheet Calculator',
  description: 'Calculate your net worth by tracking assets and liabilities. Create a personal balance sheet and monitor your financial health.',
  keywords: ['net worth calculator', 'personal balance sheet', 'assets liabilities calculator', 'wealth calculator', 'financial health'],
  openGraph: {
    title: 'Net Worth Calculator | Personal Balance Sheet Calculator',
    description: 'Calculate your net worth by tracking assets and liabilities. Create a personal balance sheet and monitor your financial health.',
    type: 'website',
    url: '/tools/net-worth-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Net Worth Calculator | Personal Balance Sheet Calculator',
    description: 'Calculate your net worth by tracking assets and liabilities. Create a personal balance sheet and monitor your financial health.',
  },
};

export default function NetWorthCalculatorPage() {
  return <NetWorthCalculator />;
}
