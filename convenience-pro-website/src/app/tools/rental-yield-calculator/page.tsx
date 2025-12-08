import { RentalYieldCalculator } from '@/components/tools/rental-yield-calculator';

export const metadata = {
  title: 'Rental Yield Calculator | Calculate Gross & Net Rental Return',
  description: 'Calculate rental yield, cash-on-cash return, and analyze investment property profitability. Free tool for real estate investors to evaluate rental properties.',
  keywords: ['rental yield calculator', 'rental return', 'property investment', 'cash on cash return', 'gross yield', 'net yield', 'real estate calculator'],
  openGraph: {
    title: 'Rental Yield Calculator | Calculate Gross & Net Rental Return',
    description: 'Calculate rental yield, cash-on-cash return, and analyze investment property profitability. Free tool for real estate investors to evaluate rental properties.',
    type: 'website',
    url: '/tools/rental-yield-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rental Yield Calculator | Calculate Gross & Net Rental Return',
    description: 'Calculate rental yield, cash-on-cash return, and analyze investment property profitability. Free tool for real estate investors to evaluate rental properties.',
  },
};

export default function RentalYieldCalculatorPage() {
  return <RentalYieldCalculator />;
}
