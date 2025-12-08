import { MacroCalculator } from '@/components/tools/macro-calculator';

export const metadata = {
  title: 'Macro Calculator | Calculate Your Daily Macros',
  description: 'Calculate your daily protein, carbs, and fat needs based on your TDEE and fitness goals. Get personalized macro splits for cutting, maintenance, or bulking.',
  keywords: ['macro calculator', 'macronutrient calculator', 'protein calculator', 'carbs calculator', 'TDEE calculator', 'diet calculator', 'fitness macros'],
  openGraph: {
    title: 'Macro Calculator | Calculate Your Daily Macros',
    description: 'Calculate your daily protein, carbs, and fat needs based on your TDEE and fitness goals. Get personalized macro splits for cutting, maintenance, or bulking.',
    type: 'website',
    url: '/tools/macro-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Macro Calculator | Calculate Your Daily Macros',
    description: 'Calculate your daily protein, carbs, and fat needs based on your TDEE and fitness goals. Get personalized macro splits for cutting, maintenance, or bulking.',
  },
};

export default function MacroCalculatorPage() {
  return <MacroCalculator />;
}
