import { BusinessNameGenerator } from '@/components/tools/business-name-generator';

export const metadata = {
  title: 'Business Name Generator | Create Unique Company Names',
  description: 'Generate creative and unique business names based on your keywords, industry, and preferred naming style. Free online business name generator tool.',
  keywords: ['business name generator', 'company name generator', 'brand name generator', 'startup name ideas', 'business naming tool', 'creative business names'],
  openGraph: {
    title: 'Business Name Generator | Create Unique Company Names',
    description: 'Generate creative and unique business names based on your keywords, industry, and preferred naming style. Free online business name generator tool.',
    type: 'website',
    url: '/tools/business-name-generator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Business Name Generator | Create Unique Company Names',
    description: 'Generate creative and unique business names based on your keywords, industry, and preferred naming style. Free online business name generator tool.',
  },
};

export default function BusinessNameGeneratorPage() {
  return <BusinessNameGenerator />;
}
