import { CarbonFootprintCalculator } from '@/components/tools/carbon-footprint-calculator';

export const metadata = {
  title: 'Carbon Footprint Calculator | Estimate Your CO2 Emissions',
  description:
    'Calculate your annual carbon footprint from travel, home energy, and diet. Compare to the US average and get personalized tips to reduce your environmental impact.',
  keywords: [
    'carbon footprint calculator',
    'CO2 emissions calculator',
    'carbon calculator',
    'environmental impact',
    'greenhouse gas calculator',
    'sustainability calculator',
  ],
  openGraph: {
    title: 'Carbon Footprint Calculator | Estimate Your CO2 Emissions',
    description:
      'Calculate your annual carbon footprint from travel, home energy, and diet. Compare to the US average and get personalized tips to reduce your environmental impact.',
    type: 'website',
    url: '/tools/carbon-footprint-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Carbon Footprint Calculator | Estimate Your CO2 Emissions',
    description:
      'Calculate your annual carbon footprint from travel, home energy, and diet. Compare to the US average and get personalized tips to reduce your environmental impact.',
  },
};

export default function CarbonFootprintCalculatorPage() {
  return <CarbonFootprintCalculator />;
}
