import { NpsCalculator } from '@/components/tools/nps-calculator';

export const metadata = {
  title: 'NPS Calculator | Net Promoter Score Calculator Online',
  description: 'Free NPS calculator to measure customer loyalty. Calculate Net Promoter Score from survey responses with breakdown of promoters, passives, and detractors.',
  keywords: ['NPS calculator', 'Net Promoter Score', 'customer loyalty', 'NPS survey', 'promoters', 'detractors', 'customer satisfaction'],
  openGraph: {
    title: 'NPS Calculator | Net Promoter Score Calculator Online',
    description: 'Free NPS calculator to measure customer loyalty. Calculate Net Promoter Score from survey responses with breakdown of promoters, passives, and detractors.',
    type: 'website',
    url: '/tools/nps-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NPS Calculator | Net Promoter Score Calculator Online',
    description: 'Free NPS calculator to measure customer loyalty. Calculate Net Promoter Score from survey responses with breakdown of promoters, passives, and detractors.',
  },
};

export default function NpsCalculatorPage() {
  return <NpsCalculator />;
}
