import { SampleSizeCalculator } from '@/components/tools/sample-size-calculator';

export const metadata = {
  title: 'Sample Size Calculator | Calculate Survey Sample Size Online',
  description: 'Free sample size calculator to determine how many respondents you need for statistically valid survey results. Calculate based on population, confidence level, and margin of error.',
  keywords: ['sample size calculator', 'survey sample size', 'sample size formula', 'statistical sample size', 'research sample calculator', 'confidence interval calculator'],
  openGraph: {
    title: 'Sample Size Calculator | Calculate Survey Sample Size Online',
    description: 'Free sample size calculator to determine how many respondents you need for statistically valid survey results. Calculate based on population, confidence level, and margin of error.',
    type: 'website',
    url: '/tools/sample-size-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sample Size Calculator | Calculate Survey Sample Size Online',
    description: 'Free sample size calculator to determine how many respondents you need for statistically valid survey results. Calculate based on population, confidence level, and margin of error.',
  },
};

export default function SampleSizeCalculatorPage() {
  return <SampleSizeCalculator />;
}
