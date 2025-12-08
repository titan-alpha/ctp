import { PaperSizeConverter } from '@/components/tools/paper-size-converter';

export const metadata = {
  title: 'Paper Size Converter | A4, Letter, Legal Size Chart',
  description: 'Convert between paper sizes including A series (A0-A8), Letter, Legal, Tabloid with dimensions in mm and inches. Free online paper size chart and converter.',
  keywords: ['paper size converter', 'A4 size', 'Letter size', 'Legal size', 'paper dimensions', 'A series paper', 'paper size chart', 'mm to inches paper'],
  openGraph: {
    title: 'Paper Size Converter | A4, Letter, Legal Size Chart',
    description: 'Convert between paper sizes including A series (A0-A8), Letter, Legal, Tabloid with dimensions in mm and inches. Free online paper size chart and converter.',
    type: 'website',
    url: '/tools/paper-size-converter',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Paper Size Converter | A4, Letter, Legal Size Chart',
    description: 'Convert between paper sizes including A series (A0-A8), Letter, Legal, Tabloid with dimensions in mm and inches. Free online paper size chart and converter.',
  },
};

export default function PaperSizeConverterPage() {
  return <PaperSizeConverter />;
}
