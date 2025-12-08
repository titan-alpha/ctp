import { CanonicalUrlGenerator } from '@/components/tools/canonical-url-generator';

export const metadata = {
  title: 'Canonical URL Generator | Create SEO-Friendly Canonical Tags',
  description: 'Generate canonical URL tags for SEO. Clean URLs by removing parameters, normalizing case, and handling trailing slashes. Free online tool for webmasters and SEO professionals.',
  keywords: ['canonical url generator', 'canonical tag', 'seo tools', 'duplicate content', 'url normalization', 'canonical link', 'seo optimization', 'url cleaning'],
  openGraph: {
    title: 'Canonical URL Generator | Create SEO-Friendly Canonical Tags',
    description: 'Generate canonical URL tags for SEO. Clean URLs by removing parameters, normalizing case, and handling trailing slashes. Free online tool for webmasters and SEO professionals.',
    type: 'website',
    url: '/tools/canonical-url-generator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Canonical URL Generator | Create SEO-Friendly Canonical Tags',
    description: 'Generate canonical URL tags for SEO. Clean URLs by removing parameters, normalizing case, and handling trailing slashes. Free online tool for webmasters and SEO professionals.',
  },
};

export default function CanonicalUrlGeneratorPage() {
  return <CanonicalUrlGenerator />;
}
