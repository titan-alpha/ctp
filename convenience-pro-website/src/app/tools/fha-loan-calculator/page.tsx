import { FHALoanCalculator } from '@/components/tools/fha-loan-calculator';

export const metadata = {
  title: 'FHA Loan Calculator | FHA Mortgage Payment Calculator',
  description: 'Calculate FHA mortgage payments including MIP, down payment requirements, and total monthly costs. Compare FHA vs conventional loans.',
  keywords: ['fha loan calculator', 'fha mortgage calculator', 'fha mip calculator', 'fha down payment', 'fha loan limits'],
  openGraph: {
    title: 'FHA Loan Calculator | FHA Mortgage Payment Calculator',
    description: 'Calculate FHA mortgage payments including MIP, down payment requirements, and total monthly costs. Compare FHA vs conventional loans.',
    type: 'website',
    url: '/tools/fha-loan-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FHA Loan Calculator | FHA Mortgage Payment Calculator',
    description: 'Calculate FHA mortgage payments including MIP, down payment requirements, and total monthly costs. Compare FHA vs conventional loans.',
  },
};

export default function FHALoanCalculatorPage() {
  return <FHALoanCalculator />;
}
