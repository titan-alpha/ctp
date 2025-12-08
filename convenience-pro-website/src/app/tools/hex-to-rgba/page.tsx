import { HexToRgba } from '@/components/tools/hex-to-rgba';

export const metadata = {
  title: 'Hex to RGBA Converter | Free Online Color Tool',
  description: 'Convert hex color codes to RGBA, RGB, and HSL formats instantly. Supports 3, 6, and 8-digit hex with adjustable opacity. Free and privacy-focused.',
  keywords: ['hex to rgba', 'hex to rgb', 'color converter', 'hex color', 'rgba converter', 'css color', 'web color tool', 'opacity slider'],
  openGraph: {
    title: 'Hex to RGBA Converter | Free Online Color Tool',
    description: 'Convert hex color codes to RGBA, RGB, and HSL formats instantly. Supports 3, 6, and 8-digit hex with adjustable opacity.',
    type: 'website',
    url: '/tools/hex-to-rgba',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hex to RGBA Converter | Free Online Color Tool',
    description: 'Convert hex color codes to RGBA, RGB, and HSL formats instantly. Supports 3, 6, and 8-digit hex with adjustable opacity.',
  },
};

export default function HexToRgbaPage() {
  return <HexToRgba />;
}
