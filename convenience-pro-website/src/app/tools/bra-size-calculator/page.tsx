import { BraSizeCalculator } from '@/components/tools/bra-size-calculator';

export const metadata = {
  title: 'Bra Size Calculator | US, UK, EU Size Guide',
  description: 'Calculate your bra size from band and bust measurements. Get accurate US, UK, and EU bra sizes with our free online calculator.',
  keywords: ['bra size calculator', 'bra size chart', 'US bra size', 'UK bra size', 'EU bra size', 'cup size calculator', 'band size calculator'],
  openGraph: {
    title: 'Bra Size Calculator | US, UK, EU Size Guide',
    description: 'Calculate your bra size from band and bust measurements. Get accurate US, UK, and EU bra sizes with our free online calculator.',
    type: 'website',
    url: '/tools/bra-size-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bra Size Calculator | US, UK, EU Size Guide',
    description: 'Calculate your bra size from band and bust measurements. Get accurate US, UK, and EU bra sizes with our free online calculator.',
  },
};

export default function BraSizeCalculatorPage() {
  return <BraSizeCalculator />;
}
