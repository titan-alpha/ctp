import { ChurnRateCalculator } from '@/components/tools/churn-rate-calculator';

export const metadata = {
  title: 'Churn Rate Calculator | Customer Retention Analysis Tool',
  description: 'Free churn rate calculator to measure customer churn, retention rate, and project future customer counts. Analyze monthly and annual churn for your business.',
  keywords: ['churn rate calculator', 'customer churn', 'retention rate', 'customer attrition', 'SaaS churn', 'customer lifetime value', 'business metrics'],
  openGraph: {
    title: 'Churn Rate Calculator | Customer Retention Analysis Tool',
    description: 'Free churn rate calculator to measure customer churn, retention rate, and project future customer counts. Analyze monthly and annual churn for your business.',
    type: 'website',
    url: '/tools/churn-rate-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Churn Rate Calculator | Customer Retention Analysis Tool',
    description: 'Free churn rate calculator to measure customer churn, retention rate, and project future customer counts. Analyze monthly and annual churn for your business.',
  },
};

export default function ChurnRateCalculatorPage() {
  return <ChurnRateCalculator />;
}
