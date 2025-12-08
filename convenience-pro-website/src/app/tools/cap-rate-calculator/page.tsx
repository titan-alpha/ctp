import { CapRateCalculator } from '@/components/tools/cap-rate-calculator';

export const metadata = {
  title: 'Cap Rate Calculator | Calculate Real Estate Capitalization Rate',
  description: 'Calculate cap rate (capitalization rate) for real estate investments. Determine property value from NOI or calculate returns with our free cap rate calculator.',
  keywords: ['cap rate calculator', 'capitalization rate', 'real estate calculator', 'NOI calculator', 'property value calculator', 'investment property', 'real estate investing'],
  openGraph: {
    title: 'Cap Rate Calculator | Calculate Real Estate Capitalization Rate',
    description: 'Calculate cap rate (capitalization rate) for real estate investments. Determine property value from NOI or calculate returns with our free cap rate calculator.',
    type: 'website',
    url: '/tools/cap-rate-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cap Rate Calculator | Calculate Real Estate Capitalization Rate',
    description: 'Calculate cap rate (capitalization rate) for real estate investments. Determine property value from NOI or calculate returns with our free cap rate calculator.',
  },
};

export default function CapRateCalculatorPage() {
  return <CapRateCalculator />;
}
