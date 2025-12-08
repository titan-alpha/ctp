import { ConcreteCalculator } from '@/components/tools/concrete-calculator';

export const metadata = {
  title: 'Concrete Calculator | Calculate Cubic Yards & Meters Needed',
  description: 'Calculate how much concrete you need for slabs, footings, and foundations. Get results in cubic yards, cubic meters, and bag estimates for DIY projects.',
  keywords: ['concrete calculator', 'cubic yards calculator', 'concrete volume calculator', 'how much concrete do I need', 'concrete slab calculator', 'cement calculator'],
  openGraph: {
    title: 'Concrete Calculator | Calculate Cubic Yards & Meters Needed',
    description: 'Calculate how much concrete you need for slabs, footings, and foundations. Get results in cubic yards, cubic meters, and bag estimates for DIY projects.',
    type: 'website',
    url: '/tools/concrete-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Concrete Calculator | Calculate Cubic Yards & Meters Needed',
    description: 'Calculate how much concrete you need for slabs, footings, and foundations. Get results in cubic yards, cubic meters, and bag estimates for DIY projects.',
  },
};

export default function ConcreteCalculatorPage() {
  return <ConcreteCalculator />;
}
