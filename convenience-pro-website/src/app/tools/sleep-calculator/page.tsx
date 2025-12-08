import { SleepCalculator } from '@/components/tools/sleep-calculator';

export const metadata = {
  title: 'Sleep Calculator | Find Your Optimal Bedtime & Wake Time',
  description: 'Calculate the best times to sleep and wake up based on 90-minute sleep cycles. Wake up refreshed by timing your sleep to complete full cycles.',
  keywords: ['sleep calculator', 'bedtime calculator', 'wake up time', 'sleep cycles', 'sleep schedule', 'circadian rhythm', 'sleep health'],
  openGraph: {
    title: 'Sleep Calculator | Find Your Optimal Bedtime & Wake Time',
    description: 'Calculate the best times to sleep and wake up based on 90-minute sleep cycles. Wake up refreshed by timing your sleep to complete full cycles.',
    type: 'website',
    url: '/tools/sleep-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sleep Calculator | Find Your Optimal Bedtime & Wake Time',
    description: 'Calculate the best times to sleep and wake up based on 90-minute sleep cycles. Wake up refreshed by timing your sleep to complete full cycles.',
  },
};

export default function SleepCalculatorPage() {
  return <SleepCalculator />;
}
