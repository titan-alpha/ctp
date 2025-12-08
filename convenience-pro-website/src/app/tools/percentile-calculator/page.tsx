import { PercentileCalculator } from '@/components/tools/percentile-calculator';

export const metadata = {
  title: 'Percentile Calculator | Find Percentile Rank Online',
  description: 'Free percentile calculator to find percentile rank from a data set or calculate the value at a given percentile. Get statistics including mean, median, and standard deviation.',
  keywords: ['percentile calculator', 'percentile rank', 'statistics calculator', 'find percentile', 'data analysis', 'percentile formula'],
  openGraph: {
    title: 'Percentile Calculator | Find Percentile Rank Online',
    description: 'Free percentile calculator to find percentile rank from a data set or calculate the value at a given percentile. Get statistics including mean, median, and standard deviation.',
    type: 'website',
    url: '/tools/percentile-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Percentile Calculator | Find Percentile Rank Online',
    description: 'Free percentile calculator to find percentile rank from a data set or calculate the value at a given percentile. Get statistics including mean, median, and standard deviation.',
  },
};

export default function PercentileCalculatorPage() {
  return <PercentileCalculator />;
}
