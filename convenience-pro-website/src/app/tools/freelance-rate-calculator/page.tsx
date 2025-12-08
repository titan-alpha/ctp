import { FreelanceRateCalculator } from '@/components/tools/freelance-rate-calculator';

export const metadata = {
  title: 'Freelance Rate Calculator | Hourly Rate Calculator for Freelancers',
  description: 'Calculate your ideal freelance hourly rate based on desired income, expenses, and billable hours. Set profitable project rates.',
  keywords: ['freelance rate calculator', 'hourly rate calculator', 'freelancer pricing', 'consulting rate', 'project rate calculator'],
  openGraph: {
    title: 'Freelance Rate Calculator | Hourly Rate Calculator for Freelancers',
    description: 'Calculate your ideal freelance hourly rate based on desired income, expenses, and billable hours. Set profitable project rates.',
    type: 'website',
    url: '/tools/freelance-rate-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Freelance Rate Calculator | Hourly Rate Calculator for Freelancers',
    description: 'Calculate your ideal freelance hourly rate based on desired income, expenses, and billable hours. Set profitable project rates.',
  },
};

export default function FreelanceRateCalculatorPage() {
  return <FreelanceRateCalculator />;
}
