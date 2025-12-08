import { RedirectChecker } from '@/components/tools/redirect-checker';

export const metadata = {
  title: 'Redirect Checker | Analyze URL Redirects & Chain Issues',
  description: 'Free redirect checker tool to analyze URL redirects, detect redirect chains, and identify SEO issues. Check 301, 302 redirects and get optimization recommendations.',
  keywords: ['redirect checker', 'URL redirect analyzer', '301 redirect', '302 redirect', 'redirect chain', 'SEO tool', 'redirect loop detector', 'HTTP redirect'],
  openGraph: {
    title: 'Redirect Checker | Analyze URL Redirects & Chain Issues',
    description: 'Free redirect checker tool to analyze URL redirects, detect redirect chains, and identify SEO issues. Check 301, 302 redirects and get optimization recommendations.',
    type: 'website',
    url: '/tools/redirect-checker',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Redirect Checker | Analyze URL Redirects & Chain Issues',
    description: 'Free redirect checker tool to analyze URL redirects, detect redirect chains, and identify SEO issues. Check 301, 302 redirects and get optimization recommendations.',
  },
};

export default function RedirectCheckerPage() {
  return <RedirectChecker />;
}
