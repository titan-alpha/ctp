import { WaterIntakeCalculator } from '@/components/tools/water-intake-calculator';

export const metadata = {
  title: 'Water Intake Calculator | Calculate Daily Hydration Needs',
  description: 'Calculate your daily water intake needs based on body weight, activity level, and climate. Get personalized hydration recommendations and reminders.',
  keywords: ['water intake calculator', 'hydration calculator', 'daily water needs', 'water consumption calculator', 'hydration tracker', 'how much water to drink'],
  openGraph: {
    title: 'Water Intake Calculator | Calculate Daily Hydration Needs',
    description: 'Calculate your daily water intake needs based on body weight, activity level, and climate. Get personalized hydration recommendations and reminders.',
    type: 'website',
    url: '/tools/water-intake-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Water Intake Calculator | Calculate Daily Hydration Needs',
    description: 'Calculate your daily water intake needs based on body weight, activity level, and climate. Get personalized hydration recommendations and reminders.',
  },
};

export default function WaterIntakeCalculatorPage() {
  return <WaterIntakeCalculator />;
}
