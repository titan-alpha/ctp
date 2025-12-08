import { SoilCalculator } from '@/components/tools/soil-calculator';

export const metadata = {
  title: 'Soil Calculator | Calculate How Much Soil You Need',
  description: 'Calculate how much soil you need for your garden beds in cubic yards and bags. Enter dimensions and depth to get accurate volume estimates.',
  keywords: ['soil calculator', 'how much soil do I need', 'garden soil calculator', 'cubic yard calculator', 'raised bed soil', 'topsoil calculator'],
  openGraph: {
    title: 'Soil Calculator | Calculate How Much Soil You Need',
    description: 'Calculate how much soil you need for your garden beds in cubic yards and bags. Enter dimensions and depth to get accurate volume estimates.',
    type: 'website',
    url: '/tools/soil-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Soil Calculator | Calculate How Much Soil You Need',
    description: 'Calculate how much soil you need for your garden beds in cubic yards and bags. Enter dimensions and depth to get accurate volume estimates.',
  },
};

export default function SoilCalculatorPage() {
  return <SoilCalculator />;
}
