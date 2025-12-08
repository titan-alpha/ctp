import { KeywordDensityChecker } from '@/components/tools/keyword-density-checker';

export const metadata = {
  title: 'Keyword Density Checker | Free SEO Keyword Analysis Tool',
  description: 'Analyze your content for keyword density and frequency. Get detailed statistics, word clouds, and optimization tips to improve your SEO performance.',
  keywords: ['keyword density checker', 'keyword density tool', 'SEO keyword analysis', 'keyword frequency', 'content optimization', 'keyword stuffing checker', 'SEO tool'],
  openGraph: {
    title: 'Keyword Density Checker | Free SEO Keyword Analysis Tool',
    description: 'Analyze your content for keyword density and frequency. Get detailed statistics, word clouds, and optimization tips to improve your SEO performance.',
    type: 'website',
    url: '/tools/keyword-density-checker',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Keyword Density Checker | Free SEO Keyword Analysis Tool',
    description: 'Analyze your content for keyword density and frequency. Get detailed statistics, word clouds, and optimization tips to improve your SEO performance.',
  },
};

export default function KeywordDensityCheckerPage() {
  return <KeywordDensityChecker />;
}
