import { FabricCalculator } from '@/components/tools/fabric-calculator';

export const metadata = {
  title: 'Fabric Calculator | Calculate Yards & Meters for Sewing Projects',
  description: 'Free fabric calculator to determine how much fabric you need for sewing. Calculate yardage for curtains, tablecloths, quilts, pillowcases, and more.',
  keywords: ['fabric calculator', 'yardage calculator', 'sewing calculator', 'fabric estimator', 'quilting calculator', 'curtain fabric calculator', 'how much fabric do I need'],
  openGraph: {
    title: 'Fabric Calculator | Calculate Yards & Meters for Sewing Projects',
    description: 'Free fabric calculator to determine how much fabric you need for sewing. Calculate yardage for curtains, tablecloths, quilts, pillowcases, and more.',
    type: 'website',
    url: '/tools/fabric-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fabric Calculator | Calculate Yards & Meters for Sewing Projects',
    description: 'Free fabric calculator to determine how much fabric you need for sewing. Calculate yardage for curtains, tablecloths, quilts, pillowcases, and more.',
  },
};

export default function FabricCalculatorPage() {
  return <FabricCalculator />;
}
