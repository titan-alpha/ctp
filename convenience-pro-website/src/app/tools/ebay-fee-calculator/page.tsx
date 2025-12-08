import { EbayFeeCalculator } from '@/components/tools/ebay-fee-calculator';

export const metadata = {
  title: 'eBay Fee Calculator | Calculate Selling Fees & Net Profit',
  description: 'Calculate eBay selling fees including final value fees and payment processing. Estimate your net profit after fees for any eBay sale.',
  keywords: ['ebay fee calculator', 'ebay selling fees', 'ebay final value fee', 'ebay profit calculator', 'ebay seller fees', 'ebay payment processing fee'],
  openGraph: {
    title: 'eBay Fee Calculator | Calculate Selling Fees & Net Profit',
    description: 'Calculate eBay selling fees including final value fees and payment processing. Estimate your net profit after fees for any eBay sale.',
    type: 'website',
    url: '/tools/ebay-fee-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'eBay Fee Calculator | Calculate Selling Fees & Net Profit',
    description: 'Calculate eBay selling fees including final value fees and payment processing. Estimate your net profit after fees for any eBay sale.',
  },
};

export default function EbayFeeCalculatorPage() {
  return <EbayFeeCalculator />;
}
