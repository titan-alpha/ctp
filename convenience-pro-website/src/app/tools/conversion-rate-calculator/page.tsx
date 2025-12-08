import { ConversionRateCalculator } from '@/components/tools/conversion-rate-calculator';

export const metadata = {
  title: 'Conversion Rate Calculator | A/B Test Significance Calculator',
  description: 'Free conversion rate calculator with A/B test statistical significance analysis. Calculate conversion rates, lift, p-values, and confidence levels for marketing optimization.',
  keywords: ['conversion rate calculator', 'A/B test calculator', 'statistical significance', 'conversion optimization', 'split test calculator', 'CRO tool', 'marketing analytics'],
  openGraph: {
    title: 'Conversion Rate Calculator | A/B Test Significance Calculator',
    description: 'Free conversion rate calculator with A/B test statistical significance analysis. Calculate conversion rates, lift, p-values, and confidence levels for marketing optimization.',
    type: 'website',
    url: '/tools/conversion-rate-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Conversion Rate Calculator | A/B Test Significance Calculator',
    description: 'Free conversion rate calculator with A/B test statistical significance analysis. Calculate conversion rates, lift, p-values, and confidence levels for marketing optimization.',
  },
};

export default function ConversionRateCalculatorPage() {
  return <ConversionRateCalculator />;
}
