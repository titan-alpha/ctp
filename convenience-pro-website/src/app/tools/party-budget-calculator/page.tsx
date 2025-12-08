import { PartyBudgetCalculator } from '@/components/tools/party-budget-calculator';

export const metadata = {
  title: 'Party Budget Calculator | Plan Your Event Spending',
  description: 'Plan your party budget by category. Calculate per-person costs and allocate spending for food, venue, decorations, entertainment, and more.',
  keywords: ['party budget calculator', 'event budget planner', 'party cost calculator', 'per person cost', 'event planning', 'party expense tracker'],
  openGraph: {
    title: 'Party Budget Calculator | Plan Your Event Spending',
    description: 'Plan your party budget by category. Calculate per-person costs and allocate spending for food, venue, decorations, entertainment, and more.',
    type: 'website',
    url: '/tools/party-budget-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Party Budget Calculator | Plan Your Event Spending',
    description: 'Plan your party budget by category. Calculate per-person costs and allocate spending for food, venue, decorations, entertainment, and more.',
  },
};

export default function PartyBudgetCalculatorPage() {
  return <PartyBudgetCalculator />;
}
