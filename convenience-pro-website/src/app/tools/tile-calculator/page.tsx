import { TileCalculator } from '@/components/tools/tile-calculator';

export const metadata = {
  title: 'Tile Calculator | Calculate Tiles Needed for Floor & Wall',
  description: 'Calculate how many tiles you need for your flooring or wall project. Account for wastage, get box counts, and plan your tile purchase accurately.',
  keywords: ['tile calculator', 'floor tiles', 'wall tiles', 'tile wastage', 'tiles per square meter', 'tile box calculator', 'flooring calculator'],
  openGraph: {
    title: 'Tile Calculator | Calculate Tiles Needed for Floor & Wall',
    description: 'Calculate how many tiles you need for your flooring or wall project. Account for wastage, get box counts, and plan your tile purchase accurately.',
    type: 'website',
    url: '/tools/tile-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tile Calculator | Calculate Tiles Needed for Floor & Wall',
    description: 'Calculate how many tiles you need for your flooring or wall project. Account for wastage, get box counts, and plan your tile purchase accurately.',
  },
};

export default function TileCalculatorPage() {
  return <TileCalculator />;
}
