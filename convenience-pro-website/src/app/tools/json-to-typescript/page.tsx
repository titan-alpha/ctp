import { JsonToTypescript } from '@/components/tools/json-to-typescript';

export const metadata = {
  title: 'JSON to TypeScript Converter | Generate Interfaces Online',
  description: 'Convert JSON to TypeScript interfaces instantly. Generate type definitions with support for nested objects, arrays, and optional fields. Free and private.',
  keywords: ['json to typescript', 'json to ts', 'typescript interface generator', 'json to interface', 'typescript types from json', 'convert json to typescript', 'json schema to typescript'],
  openGraph: {
    title: 'JSON to TypeScript Converter | Generate Interfaces Online',
    description: 'Convert JSON to TypeScript interfaces instantly. Generate type definitions with support for nested objects, arrays, and optional fields.',
    type: 'website',
    url: '/tools/json-to-typescript',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JSON to TypeScript Converter | Generate Interfaces Online',
    description: 'Convert JSON to TypeScript interfaces instantly. Generate type definitions with support for nested objects, arrays, and optional fields.',
  },
};

export default function JsonToTypescriptPage() {
  return <JsonToTypescript />;
}
