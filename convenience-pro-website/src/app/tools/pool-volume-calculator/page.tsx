import { PoolVolumeCalculator } from '@/components/tools/pool-volume-calculator';

export const metadata = {
  title: 'Pool Volume Calculator | Calculate Pool Water Volume in Gallons & Liters',
  description: 'Calculate swimming pool water volume for rectangular, oval, and kidney-shaped pools. Get accurate results in gallons and liters for chemical dosing and maintenance.',
  keywords: ['pool volume calculator', 'pool gallon calculator', 'swimming pool water volume', 'pool capacity calculator', 'how many gallons in my pool', 'pool size calculator'],
  openGraph: {
    title: 'Pool Volume Calculator | Calculate Pool Water Volume in Gallons & Liters',
    description: 'Calculate swimming pool water volume for rectangular, oval, and kidney-shaped pools. Get accurate results in gallons and liters for chemical dosing and maintenance.',
    type: 'website',
    url: '/tools/pool-volume-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pool Volume Calculator | Calculate Pool Water Volume in Gallons & Liters',
    description: 'Calculate swimming pool water volume for rectangular, oval, and kidney-shaped pools. Get accurate results in gallons and liters for chemical dosing and maintenance.',
  },
};

export default function PoolVolumeCalculatorPage() {
  return <PoolVolumeCalculator />;
}
