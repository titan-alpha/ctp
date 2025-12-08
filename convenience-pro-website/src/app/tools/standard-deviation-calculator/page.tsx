import { StandardDeviationCalculator } from '@/components/tools/standard-deviation-calculator';

export const metadata = {
  title: 'Standard Deviation Calculator | Calculate Population & Sample Std Dev',
  description: 'Free standard deviation calculator with step-by-step solutions. Calculate population and sample standard deviation, variance, and mean from any data set.',
  keywords: ['standard deviation calculator', 'std dev calculator', 'variance calculator', 'statistics calculator', 'sample standard deviation', 'population standard deviation'],
  openGraph: {
    title: 'Standard Deviation Calculator | Calculate Population & Sample Std Dev',
    description: 'Free standard deviation calculator with step-by-step solutions. Calculate population and sample standard deviation, variance, and mean from any data set.',
    type: 'website',
    url: '/tools/standard-deviation-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Standard Deviation Calculator | Calculate Population & Sample Std Dev',
    description: 'Free standard deviation calculator with step-by-step solutions. Calculate population and sample standard deviation, variance, and mean from any data set.',
  },
};

export default function StandardDeviationCalculatorPage() {
  return <StandardDeviationCalculator />;
}
