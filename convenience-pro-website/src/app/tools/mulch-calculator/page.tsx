import { MulchCalculator } from '@/components/tools/mulch-calculator';

export const metadata = {
  title: 'Mulch Calculator | Calculate How Much Mulch You Need',
  description: 'Calculate exactly how much mulch you need for your garden beds. Get results in cubic yards for bulk orders or bag counts for store purchases.',
  keywords: ['mulch calculator', 'how much mulch do I need', 'garden mulch calculator', 'cubic yards mulch', 'mulch coverage calculator', 'landscaping calculator'],
  openGraph: {
    title: 'Mulch Calculator | Calculate How Much Mulch You Need',
    description: 'Calculate exactly how much mulch you need for your garden beds. Get results in cubic yards for bulk orders or bag counts for store purchases.',
    type: 'website',
    url: '/tools/mulch-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mulch Calculator | Calculate How Much Mulch You Need',
    description: 'Calculate exactly how much mulch you need for your garden beds. Get results in cubic yards for bulk orders or bag counts for store purchases.',
  },
};

export default function MulchCalculatorPage() {
  return <MulchCalculator />;
}
