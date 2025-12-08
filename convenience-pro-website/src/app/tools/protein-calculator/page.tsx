import { ProteinCalculator } from '@/components/tools/protein-calculator';

export const metadata = {
  title: 'Protein Calculator | Calculate Your Daily Protein Needs',
  description: 'Calculate your optimal daily protein intake based on activity level and fitness goals. Get personalized recommendations for muscle building, fat loss, or maintenance.',
  keywords: ['protein calculator', 'daily protein intake', 'protein per kg', 'muscle building protein', 'protein for weight loss', 'athlete protein needs'],
  openGraph: {
    title: 'Protein Calculator | Calculate Your Daily Protein Needs',
    description: 'Calculate your optimal daily protein intake based on activity level and fitness goals. Get personalized recommendations for muscle building, fat loss, or maintenance.',
    type: 'website',
    url: '/tools/protein-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Protein Calculator | Calculate Your Daily Protein Needs',
    description: 'Calculate your optimal daily protein intake based on activity level and fitness goals. Get personalized recommendations for muscle building, fat loss, or maintenance.',
  },
};

export default function ProteinCalculatorPage() {
  return <ProteinCalculator />;
}
