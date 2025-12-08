import { CryptoProfitCalculator } from '@/components/tools/crypto-profit-calculator';

export const metadata = {
  title: 'Crypto Profit Calculator | Calculate Trading Profit & ROI',
  description: 'Free crypto profit calculator to calculate cryptocurrency trading profit, loss, and ROI. Account for exchange fees and see your net returns instantly.',
  keywords: ['crypto profit calculator', 'cryptocurrency calculator', 'bitcoin profit calculator', 'crypto ROI calculator', 'trading profit calculator', 'crypto fee calculator'],
  openGraph: {
    title: 'Crypto Profit Calculator | Calculate Trading Profit & ROI',
    description: 'Free crypto profit calculator to calculate cryptocurrency trading profit, loss, and ROI. Account for exchange fees and see your net returns instantly.',
    type: 'website',
    url: '/tools/crypto-profit-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Crypto Profit Calculator | Calculate Trading Profit & ROI',
    description: 'Free crypto profit calculator to calculate cryptocurrency trading profit, loss, and ROI. Account for exchange fees and see your net returns instantly.',
  },
};

export default function CryptoProfitCalculatorPage() {
  return <CryptoProfitCalculator />;
}
