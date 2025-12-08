import { BitcoinFeeCalculator } from '@/components/tools/bitcoin-fee-calculator';

export const metadata = {
  title: 'Bitcoin Fee Calculator | Estimate BTC Transaction Fees',
  description: 'Calculate Bitcoin transaction fees based on transaction size and priority. Get fee estimates in sat/byte and USD for optimal transaction timing.',
  keywords: ['bitcoin fee calculator', 'btc fee', 'sat/byte', 'bitcoin transaction fee', 'crypto fees', 'mempool fees', 'satoshi calculator'],
  openGraph: {
    title: 'Bitcoin Fee Calculator | Estimate BTC Transaction Fees',
    description: 'Calculate Bitcoin transaction fees based on transaction size and priority. Get fee estimates in sat/byte and USD for optimal transaction timing.',
    type: 'website',
    url: '/tools/bitcoin-fee-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bitcoin Fee Calculator | Estimate BTC Transaction Fees',
    description: 'Calculate Bitcoin transaction fees based on transaction size and priority. Get fee estimates in sat/byte and USD for optimal transaction timing.',
  },
};

export default function BitcoinFeeCalculatorPage() {
  return <BitcoinFeeCalculator />;
}
