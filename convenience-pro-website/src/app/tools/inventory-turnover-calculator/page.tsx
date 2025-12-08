import { InventoryTurnoverCalculator } from '@/components/tools/inventory-turnover-calculator';

export const metadata = {
  title: 'Inventory Turnover Calculator | Calculate DSI & Turnover Ratio',
  description: 'Calculate inventory turnover ratio and days sales of inventory (DSI). Analyze your inventory efficiency and compare against industry benchmarks.',
  keywords: ['inventory turnover calculator', 'inventory turnover ratio', 'days sales of inventory', 'DSI calculator', 'COGS', 'inventory management', 'stock turnover'],
  openGraph: {
    title: 'Inventory Turnover Calculator | Calculate DSI & Turnover Ratio',
    description: 'Calculate inventory turnover ratio and days sales of inventory (DSI). Analyze your inventory efficiency and compare against industry benchmarks.',
    type: 'website',
    url: '/tools/inventory-turnover-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Inventory Turnover Calculator | Calculate DSI & Turnover Ratio',
    description: 'Calculate inventory turnover ratio and days sales of inventory (DSI). Analyze your inventory efficiency and compare against industry benchmarks.',
  },
};

export default function InventoryTurnoverCalculatorPage() {
  return <InventoryTurnoverCalculator />;
}
