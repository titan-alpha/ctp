import { BillableHoursCalculator } from '@/components/tools/billable-hours-calculator';

export const metadata = {
  title: 'Billable Hours Calculator | Track Time & Invoice Clients',
  description: 'Free billable hours calculator to track time entries across multiple projects and clients. Calculate totals, generate invoice summaries, and manage hourly rates.',
  keywords: ['billable hours calculator', 'time tracking', 'invoice calculator', 'hourly rate calculator', 'freelance billing', 'project time tracker', 'client billing'],
  openGraph: {
    title: 'Billable Hours Calculator | Track Time & Invoice Clients',
    description: 'Free billable hours calculator to track time entries across multiple projects and clients. Calculate totals, generate invoice summaries, and manage hourly rates.',
    type: 'website',
    url: '/tools/billable-hours-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Billable Hours Calculator | Track Time & Invoice Clients',
    description: 'Free billable hours calculator to track time entries across multiple projects and clients. Calculate totals, generate invoice summaries, and manage hourly rates.',
  },
};

export default function BillableHoursCalculatorPage() {
  return <BillableHoursCalculator />;
}
