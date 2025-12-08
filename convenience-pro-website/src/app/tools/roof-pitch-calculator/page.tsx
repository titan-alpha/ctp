import { RoofPitchCalculator } from '@/components/tools/roof-pitch-calculator';

export const metadata = {
  title: 'Roof Pitch Calculator | Calculate Roof Angle and Slope',
  description: 'Calculate roof pitch from rise and run measurements. Get results as ratio (X:12), degrees, and percentage. Free online roof slope calculator.',
  keywords: ['roof pitch calculator', 'roof angle calculator', 'roof slope calculator', 'pitch to degrees', 'roof rise and run', 'roofing calculator'],
  openGraph: {
    title: 'Roof Pitch Calculator | Calculate Roof Angle and Slope',
    description: 'Calculate roof pitch from rise and run measurements. Get results as ratio (X:12), degrees, and percentage. Free online roof slope calculator.',
    type: 'website',
    url: '/tools/roof-pitch-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Roof Pitch Calculator | Calculate Roof Angle and Slope',
    description: 'Calculate roof pitch from rise and run measurements. Get results as ratio (X:12), degrees, and percentage. Free online roof slope calculator.',
  },
};

export default function RoofPitchCalculatorPage() {
  return <RoofPitchCalculator />;
}
