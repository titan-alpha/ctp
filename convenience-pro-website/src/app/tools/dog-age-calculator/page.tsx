import { DogAgeCalculator } from '@/components/tools/dog-age-calculator';

export const metadata = {
  title: 'Dog Age Calculator | Convert Dog Years to Human Years',
  description: 'Calculate your dog\'s age in human years with our accurate calculator. Accounts for dog size (small, medium, large) using non-linear aging science.',
  keywords: ['dog age calculator', 'dog years to human years', 'dog age in human years', 'pet age calculator', 'dog life stage', 'dog aging'],
  openGraph: {
    title: 'Dog Age Calculator | Convert Dog Years to Human Years',
    description: 'Calculate your dog\'s age in human years with our accurate calculator. Accounts for dog size (small, medium, large) using non-linear aging science.',
    type: 'website',
    url: '/tools/dog-age-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dog Age Calculator | Convert Dog Years to Human Years',
    description: 'Calculate your dog\'s age in human years with our accurate calculator. Accounts for dog size (small, medium, large) using non-linear aging science.',
  },
};

export default function DogAgeCalculatorPage() {
  return <DogAgeCalculator />;
}
