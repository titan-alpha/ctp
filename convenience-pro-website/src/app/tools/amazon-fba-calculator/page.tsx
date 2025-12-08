import { AmazonFbaCalculator } from '@/components/tools/amazon-fba-calculator';

export const metadata = {
  title: 'Amazon FBA Calculator | Calculate FBA Fees & Profit Margins',
  description: 'Free Amazon FBA calculator to estimate fulfillment fees, referral fees, storage costs, and profit margins. Make informed product sourcing decisions.',
  keywords: ['amazon fba calculator', 'fba fees', 'amazon seller fees', 'fba profit calculator', 'amazon fulfillment fees', 'fba roi calculator'],
  openGraph: {
    title: 'Amazon FBA Calculator | Calculate FBA Fees & Profit Margins',
    description: 'Free Amazon FBA calculator to estimate fulfillment fees, referral fees, storage costs, and profit margins. Make informed product sourcing decisions.',
    type: 'website',
    url: '/tools/amazon-fba-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Amazon FBA Calculator | Calculate FBA Fees & Profit Margins',
    description: 'Free Amazon FBA calculator to estimate fulfillment fees, referral fees, storage costs, and profit margins. Make informed product sourcing decisions.',
  },
};

export default function AmazonFbaCalculatorPage() {
  return <AmazonFbaCalculator />;
}
