import { SocialMediaImageResizer } from '@/components/tools/social-media-image-resizer';

export const metadata = {
  title: 'Social Media Image Resizer | Resize Images for Instagram, Facebook, Twitter & LinkedIn',
  description: 'Free online tool to resize images for social media platforms. Get perfect dimensions for Instagram posts, Facebook covers, Twitter headers, and LinkedIn images.',
  keywords: ['social media image resizer', 'instagram image size', 'facebook cover photo size', 'twitter header size', 'linkedin image dimensions', 'resize image for social media', 'image resizer'],
  openGraph: {
    title: 'Social Media Image Resizer | Resize Images for Instagram, Facebook, Twitter & LinkedIn',
    description: 'Free online tool to resize images for social media platforms. Get perfect dimensions for Instagram posts, Facebook covers, Twitter headers, and LinkedIn images.',
    type: 'website',
    url: '/tools/social-media-image-resizer',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Social Media Image Resizer | Resize Images for Instagram, Facebook, Twitter & LinkedIn',
    description: 'Free online tool to resize images for social media platforms. Get perfect dimensions for Instagram posts, Facebook covers, Twitter headers, and LinkedIn images.',
  },
};

export default function SocialMediaImageResizerPage() {
  return <SocialMediaImageResizer />;
}
