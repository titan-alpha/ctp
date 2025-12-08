import { InsulationCalculator } from '@/components/tools/insulation-calculator';

export const metadata = {
  title: 'Insulation Calculator | Calculate How Much Insulation You Need',
  description: 'Calculate exactly how much insulation you need based on area and R-value target. Get accurate quantities for batts, rolls, blown-in, or spray foam insulation.',
  keywords: ['insulation calculator', 'how much insulation do I need', 'R-value calculator', 'attic insulation calculator', 'fiberglass insulation', 'blown insulation calculator'],
  openGraph: {
    title: 'Insulation Calculator | Calculate How Much Insulation You Need',
    description: 'Calculate exactly how much insulation you need based on area and R-value target. Get accurate quantities for batts, rolls, blown-in, or spray foam insulation.',
    type: 'website',
    url: '/tools/insulation-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insulation Calculator | Calculate How Much Insulation You Need',
    description: 'Calculate exactly how much insulation you need based on area and R-value target. Get accurate quantities for batts, rolls, blown-in, or spray foam insulation.',
  },
};

export default function InsulationCalculatorPage() {
  return <InsulationCalculator />;
}
