import { RentVsBuyCalculator } from '@/components/tools/rent-vs-buy-calculator';

export const metadata = {
  title: 'Rent vs Buy Calculator | Compare Renting vs Buying a Home',
  description: 'Compare the true costs of renting versus buying a home. Calculate break-even points, multi-year projections, tax benefits, and get personalized recommendations.',
  keywords: ['rent vs buy calculator', 'rent or buy', 'home buying calculator', 'mortgage calculator', 'rent comparison', 'break even analysis', 'real estate calculator'],
  openGraph: {
    title: 'Rent vs Buy Calculator | Compare Renting vs Buying a Home',
    description: 'Compare the true costs of renting versus buying a home. Calculate break-even points, multi-year projections, tax benefits, and get personalized recommendations.',
    type: 'website',
    url: '/tools/rent-vs-buy-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rent vs Buy Calculator | Compare Renting vs Buying a Home',
    description: 'Compare the true costs of renting versus buying a home. Calculate break-even points, multi-year projections, tax benefits, and get personalized recommendations.',
  },
};

export default function RentVsBuyCalculatorPage() {
  return <RentVsBuyCalculator />;
}
