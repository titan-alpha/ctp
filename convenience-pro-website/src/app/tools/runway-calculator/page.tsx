import { RunwayCalculator } from '@/components/tools/runway-calculator';

export const metadata = {
  title: 'Startup Runway Calculator | Calculate Months of Runway & End Date',
  description: 'Calculate your startup runway in months based on cash balance and monthly burn rate. Visualize timeline with milestone markers and month-by-month projections.',
  keywords: ['runway calculator', 'startup runway', 'cash runway', 'burn rate', 'startup finances', 'financial planning', 'runway projection'],
  openGraph: {
    title: 'Startup Runway Calculator | Calculate Months of Runway & End Date',
    description: 'Calculate your startup runway in months based on cash balance and monthly burn rate. Visualize timeline with milestone markers and month-by-month projections.',
    type: 'website',
    url: '/tools/runway-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Startup Runway Calculator | Calculate Months of Runway & End Date',
    description: 'Calculate your startup runway in months based on cash balance and monthly burn rate. Visualize timeline with milestone markers and month-by-month projections.',
  },
};

export default function RunwayCalculatorPage() {
  return <RunwayCalculator />;
}
