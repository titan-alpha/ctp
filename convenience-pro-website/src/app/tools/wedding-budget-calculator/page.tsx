import { WeddingBudgetCalculator } from '@/components/tools/wedding-budget-calculator';

export const metadata = {
  title: 'Wedding Budget Calculator | Plan Your Wedding Expenses by Category',
  description: 'Plan your wedding budget with industry-standard percentages. Track actual vs planned spending across all categories including venue, photography, attire, and more.',
  keywords: ['wedding budget calculator', 'wedding cost calculator', 'wedding planning budget', 'wedding expense tracker', 'wedding budget breakdown', 'how much does a wedding cost'],
  openGraph: {
    title: 'Wedding Budget Calculator | Plan Your Wedding Expenses by Category',
    description: 'Plan your wedding budget with industry-standard percentages. Track actual vs planned spending across all categories including venue, photography, attire, and more.',
    type: 'website',
    url: '/tools/wedding-budget-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wedding Budget Calculator | Plan Your Wedding Expenses by Category',
    description: 'Plan your wedding budget with industry-standard percentages. Track actual vs planned spending across all categories including venue, photography, attire, and more.',
  },
};

export default function WeddingBudgetCalculatorPage() {
  return <WeddingBudgetCalculator />;
}
