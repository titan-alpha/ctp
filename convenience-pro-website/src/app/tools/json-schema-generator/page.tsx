import { JsonSchemaGenerator } from '@/components/tools/json-schema-generator';

export const metadata = {
  title: 'JSON Schema Generator | Generate Schema from JSON Online',
  description: 'Generate JSON Schema from sample JSON data instantly. Auto-detects types, formats, required fields, and nested structures. Free online tool.',
  keywords: ['json schema generator', 'json to schema', 'generate json schema', 'json schema online', 'json schema creator', 'json schema from json', 'json validation schema'],
  openGraph: {
    title: 'JSON Schema Generator | Generate Schema from JSON Online',
    description: 'Generate JSON Schema from sample JSON data instantly. Auto-detects types, formats, required fields, and nested structures.',
    type: 'website',
    url: '/tools/json-schema-generator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JSON Schema Generator | Generate Schema from JSON Online',
    description: 'Generate JSON Schema from sample JSON data instantly. Auto-detects types, formats, required fields, and nested structures.',
  },
};

export default function JsonSchemaGeneratorPage() {
  return <JsonSchemaGenerator />;
}
