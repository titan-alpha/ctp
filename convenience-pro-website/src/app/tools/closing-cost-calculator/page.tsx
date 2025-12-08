import { ClosingCostCalculator } from '@/components/tools/closing-cost-calculator';

export const metadata = {
  title: 'Closing Cost Calculator | Estimate Home Buying & Selling Costs',
  description: 'Calculate estimated closing costs for buying or selling a home. Get itemized breakdown of lender fees, title insurance, taxes, and other expenses.',
  keywords: ['closing cost calculator', 'home buying costs', 'seller closing costs', 'real estate fees', 'title insurance', 'transfer tax', 'mortgage closing costs'],
  openGraph: {
    title: 'Closing Cost Calculator | Estimate Home Buying & Selling Costs',
    description: 'Calculate estimated closing costs for buying or selling a home. Get itemized breakdown of lender fees, title insurance, taxes, and other expenses.',
    type: 'website',
    url: '/tools/closing-cost-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Closing Cost Calculator | Estimate Home Buying & Selling Costs',
    description: 'Calculate estimated closing costs for buying or selling a home. Get itemized breakdown of lender fees, title insurance, taxes, and other expenses.',
  },
};

export default function ClosingCostCalculatorPage() {
  return <ClosingCostCalculator />;
}
