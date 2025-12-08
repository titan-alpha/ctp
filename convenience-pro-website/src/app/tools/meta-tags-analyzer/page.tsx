import { MetaTagsAnalyzer } from '@/components/tools/meta-tags-analyzer';

export const metadata = {
  title: 'Meta Tags Analyzer | Check SEO Meta Tags, Open Graph & Twitter Cards',
  description: 'Free meta tags analyzer tool. Validate title, description, Open Graph, and Twitter Card tags. Get SEO scores and recommendations to optimize your website metadata.',
  keywords: ['meta tags analyzer', 'seo meta tags', 'open graph checker', 'twitter card validator', 'meta description checker', 'title tag analyzer', 'seo audit tool', 'website meta tags'],
  openGraph: {
    title: 'Meta Tags Analyzer | Check SEO Meta Tags, Open Graph & Twitter Cards',
    description: 'Free meta tags analyzer tool. Validate title, description, Open Graph, and Twitter Card tags. Get SEO scores and recommendations to optimize your website metadata.',
    type: 'website',
    url: '/tools/meta-tags-analyzer',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Meta Tags Analyzer | Check SEO Meta Tags, Open Graph & Twitter Cards',
    description: 'Free meta tags analyzer tool. Validate title, description, Open Graph, and Twitter Card tags. Get SEO scores and recommendations to optimize your website metadata.',
  },
};

export default function MetaTagsAnalyzerPage() {
  return <MetaTagsAnalyzer />;
}
