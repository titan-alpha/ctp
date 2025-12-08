import { YoutubeThumbnailMaker } from '@/components/tools/youtube-thumbnail-maker';

export const metadata = {
  title: 'YouTube Thumbnail Maker | Create Eye-Catching Thumbnails Free',
  description: 'Create professional YouTube thumbnails with custom text overlays, backgrounds, and effects. Free online tool with 1280x720 resolution for optimal quality.',
  keywords: ['youtube thumbnail maker', 'thumbnail creator', 'youtube thumbnail generator', 'free thumbnail maker', 'video thumbnail', 'custom thumbnail', 'youtube thumbnail size'],
  openGraph: {
    title: 'YouTube Thumbnail Maker | Create Eye-Catching Thumbnails Free',
    description: 'Create professional YouTube thumbnails with custom text overlays, backgrounds, and effects. Free online tool with 1280x720 resolution for optimal quality.',
    type: 'website',
    url: '/tools/youtube-thumbnail-maker',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YouTube Thumbnail Maker | Create Eye-Catching Thumbnails Free',
    description: 'Create professional YouTube thumbnails with custom text overlays, backgrounds, and effects. Free online tool with 1280x720 resolution for optimal quality.',
  },
};

export default function YoutubeThumbnailMakerPage() {
  return <YoutubeThumbnailMaker />;
}
