import { CssGridGenerator } from '@/components/tools/css-grid-generator';

export const metadata = {
  title: 'CSS Grid Generator | Free Visual Grid Layout Builder',
  description: 'Create CSS Grid layouts visually with our free generator. Control columns, rows, gaps, alignment, and template areas. Copy generated code instantly.',
  keywords: ['css grid generator', 'grid layout builder', 'css grid tool', 'grid template', 'css layout generator', 'flexbox alternative', 'web layout tool', 'responsive grid'],
  openGraph: {
    title: 'CSS Grid Generator | Free Visual Grid Layout Builder',
    description: 'Create CSS Grid layouts visually with our free generator. Control columns, rows, gaps, alignment, and template areas.',
    type: 'website',
    url: '/tools/css-grid-generator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CSS Grid Generator | Free Visual Grid Layout Builder',
    description: 'Create CSS Grid layouts visually with our free generator. Control columns, rows, gaps, alignment, and template areas.',
  },
};

export default function CssGridGeneratorPage() {
  return <CssGridGenerator />;
}
