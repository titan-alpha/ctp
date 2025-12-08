import { ProfitMarginCalculator } from '@/components/tools/profit-margin-calculator';

export const metadata = {
  title: 'Profit Margin Calculator | Gross & Net Margin Calculator',
  description: 'Calculate gross profit margin, net profit margin, and markup percentage. Analyze business profitability with our free calculator.',
  keywords: ['profit margin calculator', 'gross margin calculator', 'net margin calculator', 'markup calculator', 'profitability calculator'],
  openGraph: {
    title: 'Profit Margin Calculator | Gross & Net Margin Calculator',
    description: 'Calculate gross profit margin, net profit margin, and markup percentage. Analyze business profitability with our free calculator.',
    type: 'website',
    url: '/tools/profit-margin-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Profit Margin Calculator | Gross & Net Margin Calculator',
    description: 'Calculate gross profit margin, net profit margin, and markup percentage. Analyze business profitability with our free calculator.',
  },
};

export default function ProfitMarginCalculatorPage() {
  return <ProfitMarginCalculator />;
}
