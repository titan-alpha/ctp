import { DrywallCalculator } from '@/components/tools/drywall-calculator';

export const metadata = {
  title: 'Drywall Calculator | Calculate How Many Sheets You Need',
  description: 'Calculate exactly how many drywall sheets you need for your project. Enter wall dimensions, doors, windows, and sheet size to get accurate estimates with wastage.',
  keywords: ['drywall calculator', 'sheetrock calculator', 'how much drywall do I need', 'drywall sheet calculator', 'gypsum board calculator', 'drywall estimator'],
  openGraph: {
    title: 'Drywall Calculator | Calculate How Many Sheets You Need',
    description: 'Calculate exactly how many drywall sheets you need for your project. Enter wall dimensions, doors, windows, and sheet size to get accurate estimates with wastage.',
    type: 'website',
    url: '/tools/drywall-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Drywall Calculator | Calculate How Many Sheets You Need',
    description: 'Calculate exactly how many drywall sheets you need for your project. Enter wall dimensions, doors, windows, and sheet size to get accurate estimates with wastage.',
  },
};

export default function DrywallCalculatorPage() {
  return <DrywallCalculator />;
}
