import { PregnancyWeightGainCalculator } from '@/components/tools/pregnancy-weight-gain-calculator';

export const metadata = {
  title: 'Pregnancy Weight Gain Calculator | Healthy Weight Gain by Week',
  description: 'Calculate healthy pregnancy weight gain based on IOM guidelines. Get personalized recommendations by trimester based on your pre-pregnancy BMI.',
  keywords: ['pregnancy weight gain calculator', 'pregnancy weight tracker', 'healthy pregnancy weight', 'IOM pregnancy guidelines', 'BMI pregnancy', 'trimester weight gain'],
  openGraph: {
    title: 'Pregnancy Weight Gain Calculator | Healthy Weight Gain by Week',
    description: 'Calculate healthy pregnancy weight gain based on IOM guidelines. Get personalized recommendations by trimester based on your pre-pregnancy BMI.',
    type: 'website',
    url: '/tools/pregnancy-weight-gain-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pregnancy Weight Gain Calculator | Healthy Weight Gain by Week',
    description: 'Calculate healthy pregnancy weight gain based on IOM guidelines. Get personalized recommendations by trimester based on your pre-pregnancy BMI.',
  },
};

export default function PregnancyWeightGainCalculatorPage() {
  return <PregnancyWeightGainCalculator />;
}
