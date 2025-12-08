import { EngagementRateCalculator } from '@/components/tools/engagement-rate-calculator';

export const metadata = {
  title: 'Engagement Rate Calculator | Social Media Engagement Calculator',
  description: 'Free engagement rate calculator for Instagram, Facebook, Twitter, LinkedIn, TikTok, and YouTube. Calculate your social media engagement percentage with industry benchmarks.',
  keywords: ['engagement rate calculator', 'social media engagement', 'Instagram engagement rate', 'TikTok engagement', 'social media metrics', 'influencer analytics', 'engagement benchmark'],
  openGraph: {
    title: 'Engagement Rate Calculator | Social Media Engagement Calculator',
    description: 'Free engagement rate calculator for Instagram, Facebook, Twitter, LinkedIn, TikTok, and YouTube. Calculate your social media engagement percentage with industry benchmarks.',
    type: 'website',
    url: '/tools/engagement-rate-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Engagement Rate Calculator | Social Media Engagement Calculator',
    description: 'Free engagement rate calculator for Instagram, Facebook, Twitter, LinkedIn, TikTok, and YouTube. Calculate your social media engagement percentage with industry benchmarks.',
  },
};

export default function EngagementRateCalculatorPage() {
  return <EngagementRateCalculator />;
}
