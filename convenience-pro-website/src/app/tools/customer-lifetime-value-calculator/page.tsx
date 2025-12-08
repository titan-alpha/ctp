import { CustomerLifetimeValueCalculator } from '@/components/tools/customer-lifetime-value-calculator';

export const metadata = {
  title: 'Customer Lifetime Value Calculator | CLV Calculator Online',
  description: 'Free CLV calculator to compute customer lifetime value from ARPU, gross margin, and churn rate. Get 5-year projections and formula breakdowns.',
  keywords: ['CLV calculator', 'customer lifetime value', 'LTV calculator', 'ARPU calculator', 'churn rate', 'customer value', 'SaaS metrics'],
  openGraph: {
    title: 'Customer Lifetime Value Calculator | CLV Calculator Online',
    description: 'Free CLV calculator to compute customer lifetime value from ARPU, gross margin, and churn rate. Get 5-year projections and formula breakdowns.',
    type: 'website',
    url: '/tools/customer-lifetime-value-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Customer Lifetime Value Calculator | CLV Calculator Online',
    description: 'Free CLV calculator to compute customer lifetime value from ARPU, gross margin, and churn rate. Get 5-year projections and formula breakdowns.',
  },
};

export default function CustomerLifetimeValueCalculatorPage() {
  return <CustomerLifetimeValueCalculator />;
}
