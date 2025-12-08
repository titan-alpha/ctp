import { WallpaperCalculator } from '@/components/tools/wallpaper-calculator';

export const metadata = {
  title: 'Wallpaper Calculator | Calculate How Many Rolls You Need',
  description: 'Calculate exactly how many wallpaper rolls you need for your room. Enter wall dimensions, roll size, and pattern repeat to get accurate estimates with wastage allowance.',
  keywords: ['wallpaper calculator', 'how many rolls of wallpaper', 'wallpaper estimator', 'wall covering calculator', 'pattern repeat calculator', 'wallpaper rolls needed'],
  openGraph: {
    title: 'Wallpaper Calculator | Calculate How Many Rolls You Need',
    description: 'Calculate exactly how many wallpaper rolls you need for your room. Enter wall dimensions, roll size, and pattern repeat to get accurate estimates with wastage allowance.',
    type: 'website',
    url: '/tools/wallpaper-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wallpaper Calculator | Calculate How Many Rolls You Need',
    description: 'Calculate exactly how many wallpaper rolls you need for your room. Enter wall dimensions, roll size, and pattern repeat to get accurate estimates with wastage allowance.',
  },
};

export default function WallpaperCalculatorPage() {
  return <WallpaperCalculator />;
}
