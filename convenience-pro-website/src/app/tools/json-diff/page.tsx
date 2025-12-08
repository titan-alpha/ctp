import { JsonDiff } from '@/components/tools/json-diff';

export const metadata = {
  title: 'JSON Diff Tool | Compare JSON Objects Online',
  description: 'Compare two JSON objects and find differences instantly. Deep comparison with color-coded results showing added, removed, and modified properties. Free and private.',
  keywords: ['json diff', 'json compare', 'compare json', 'json difference', 'json comparison tool', 'json diff online', 'compare json objects', 'json delta'],
  openGraph: {
    title: 'JSON Diff Tool | Compare JSON Objects Online',
    description: 'Compare two JSON objects and find differences instantly. Deep comparison with color-coded results showing added, removed, and modified properties.',
    type: 'website',
    url: '/tools/json-diff',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JSON Diff Tool | Compare JSON Objects Online',
    description: 'Compare two JSON objects and find differences instantly. Deep comparison with color-coded results showing added, removed, and modified properties.',
  },
};

export default function JsonDiffPage() {
  return <JsonDiff />;
}
