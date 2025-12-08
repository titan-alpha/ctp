import { RafterCalculator } from '@/components/tools/rafter-calculator';

export const metadata = {
  title: 'Rafter Calculator | Calculate Roof Rafter Length & Rise',
  description: 'Calculate roof rafter length and rise based on span and pitch. Free online rafter calculator for construction, roofing, and home improvement projects.',
  keywords: ['rafter calculator', 'roof rafter length', 'roof pitch calculator', 'rafter length calculator', 'roof rise calculator', 'roofing calculator', 'construction calculator'],
  openGraph: {
    title: 'Rafter Calculator | Calculate Roof Rafter Length & Rise',
    description: 'Calculate roof rafter length and rise based on span and pitch. Free online rafter calculator for construction, roofing, and home improvement projects.',
    type: 'website',
    url: '/tools/rafter-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rafter Calculator | Calculate Roof Rafter Length & Rise',
    description: 'Calculate roof rafter length and rise based on span and pitch. Free online rafter calculator for construction, roofing, and home improvement projects.',
  },
};

export default function RafterCalculatorPage() {
  return <RafterCalculator />;
}
