import { EtsyFeeCalculator } from '@/components/tools/etsy-fee-calculator';

export const metadata = {
  title: 'Etsy Fee Calculator | Calculate Seller Fees & Profit Margin',
  description: 'Calculate Etsy seller fees including listing, transaction, payment processing, and offsite ad fees. Determine your net profit and profit margin instantly.',
  keywords: ['etsy fee calculator', 'etsy seller fees', 'etsy transaction fee', 'etsy profit calculator', 'etsy listing fee', 'etsy payment processing'],
  openGraph: {
    title: 'Etsy Fee Calculator | Calculate Seller Fees & Profit Margin',
    description: 'Calculate Etsy seller fees including listing, transaction, payment processing, and offsite ad fees. Determine your net profit and profit margin instantly.',
    type: 'website',
    url: '/tools/etsy-fee-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Etsy Fee Calculator | Calculate Seller Fees & Profit Margin',
    description: 'Calculate Etsy seller fees including listing, transaction, payment processing, and offsite ad fees. Determine your net profit and profit margin instantly.',
  },
};

export default function EtsyFeeCalculatorPage() {
  return <EtsyFeeCalculator />;
}
