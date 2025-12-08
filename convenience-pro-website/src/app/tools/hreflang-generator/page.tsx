import { HreflangGenerator } from '@/components/tools/hreflang-generator';

export const metadata = {
  title: 'Hreflang Tag Generator | Create Multilingual SEO Tags',
  description:
    'Generate hreflang tags for multilingual and multi-regional websites. Support for language-region codes, x-default, and quick presets. Free online hreflang generator.',
  keywords: [
    'hreflang generator',
    'hreflang tags',
    'multilingual seo',
    'international seo',
    'hreflang x-default',
    'language tags',
    'regional seo',
    'hreflang tool',
  ],
  openGraph: {
    title: 'Hreflang Tag Generator | Create Multilingual SEO Tags',
    description:
      'Generate hreflang tags for multilingual and multi-regional websites. Support for language-region codes, x-default, and quick presets.',
    type: 'website',
    url: '/tools/hreflang-generator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hreflang Tag Generator | Create Multilingual SEO Tags',
    description:
      'Generate hreflang tags for multilingual and multi-regional websites. Support for language-region codes, x-default, and quick presets.',
  },
};

export default function HreflangGeneratorPage() {
  return <HreflangGenerator />;
}
