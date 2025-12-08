import { HashtagGenerator } from '@/components/tools/hashtag-generator';

export const metadata = {
  title: 'Hashtag Generator | Generate Hashtags for Instagram, Twitter & TikTok',
  description: 'Generate relevant hashtags for your social media posts. Get popular, niche, and related hashtags optimized for Instagram, Twitter, and TikTok.',
  keywords: ['hashtag generator', 'instagram hashtags', 'twitter hashtags', 'tiktok hashtags', 'social media hashtags', 'trending hashtags', 'hashtag tool'],
  openGraph: {
    title: 'Hashtag Generator | Generate Hashtags for Instagram, Twitter & TikTok',
    description: 'Generate relevant hashtags for your social media posts. Get popular, niche, and related hashtags optimized for Instagram, Twitter, and TikTok.',
    type: 'website',
    url: '/tools/hashtag-generator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hashtag Generator | Generate Hashtags for Instagram, Twitter & TikTok',
    description: 'Generate relevant hashtags for your social media posts. Get popular, niche, and related hashtags optimized for Instagram, Twitter, and TikTok.',
  },
};

export default function HashtagGeneratorPage() {
  return <HashtagGenerator />;
}
