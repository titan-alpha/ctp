import { BacklinkChecker } from '@/components/tools/backlink-checker';

export const metadata = {
  title: 'Backlink Checker | Analyze Domain Authority & Link Profile',
  description: 'Free backlink checker tool to analyze your website link profile. Check domain authority, page authority, trust flow, and get SEO recommendations to improve your rankings.',
  keywords: ['backlink checker', 'backlink analyzer', 'domain authority checker', 'SEO tool', 'link profile', 'trust flow', 'citation flow', 'referring domains'],
  openGraph: {
    title: 'Backlink Checker | Analyze Domain Authority & Link Profile',
    description: 'Free backlink checker tool to analyze your website link profile. Check domain authority, page authority, trust flow, and get SEO recommendations to improve your rankings.',
    type: 'website',
    url: '/tools/backlink-checker',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Backlink Checker | Analyze Domain Authority & Link Profile',
    description: 'Free backlink checker tool to analyze your website link profile. Check domain authority, page authority, trust flow, and get SEO recommendations to improve your rankings.',
  },
};

export default function BacklinkCheckerPage() {
  return <BacklinkChecker />;
}
