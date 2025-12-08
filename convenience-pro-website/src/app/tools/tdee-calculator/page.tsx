import { TDEECalculator } from '@/components/tools/tdee-calculator';

export const metadata = {
  title: 'TDEE Calculator | Calculate Your Daily Calorie Needs',
  description: 'Calculate your Total Daily Energy Expenditure (TDEE) and Basal Metabolic Rate (BMR) using the Mifflin-St Jeor formula. Get calorie goals for weight loss, maintenance, or muscle gain.',
  keywords: ['TDEE calculator', 'BMR calculator', 'calorie calculator', 'basal metabolic rate', 'total daily energy expenditure', 'weight loss calculator', 'calorie needs'],
  openGraph: {
    title: 'TDEE Calculator | Calculate Your Daily Calorie Needs',
    description: 'Calculate your Total Daily Energy Expenditure (TDEE) and Basal Metabolic Rate (BMR) using the Mifflin-St Jeor formula. Get calorie goals for weight loss, maintenance, or muscle gain.',
    type: 'website',
    url: '/tools/tdee-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TDEE Calculator | Calculate Your Daily Calorie Needs',
    description: 'Calculate your Total Daily Energy Expenditure (TDEE) and Basal Metabolic Rate (BMR) using the Mifflin-St Jeor formula. Get calorie goals for weight loss, maintenance, or muscle gain.',
  },
};

export default function TDEECalculatorPage() {
  return <TDEECalculator />;
}
