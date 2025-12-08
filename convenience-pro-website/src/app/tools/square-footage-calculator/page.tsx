import { SquareFootageCalculator } from '@/components/tools/square-footage-calculator';

export const metadata = {
  title: 'Square Footage Calculator | Calculate Area for Rooms & Properties',
  description: 'Free square footage calculator for rooms, properties, and land. Calculate area for rectangles, circles, triangles, and irregular shapes. Add multiple rooms for total sq ft.',
  keywords: ['square footage calculator', 'sq ft calculator', 'area calculator', 'room size calculator', 'floor area calculator', 'property square footage', 'land area calculator'],
  openGraph: {
    title: 'Square Footage Calculator | Calculate Area for Rooms & Properties',
    description: 'Free square footage calculator for rooms, properties, and land. Calculate area for rectangles, circles, triangles, and irregular shapes. Add multiple rooms for total sq ft.',
    type: 'website',
    url: '/tools/square-footage-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Square Footage Calculator | Calculate Area for Rooms & Properties',
    description: 'Free square footage calculator for rooms, properties, and land. Calculate area for rectangles, circles, triangles, and irregular shapes. Add multiple rooms for total sq ft.',
  },
};

export default function SquareFootageCalculatorPage() {
  return <SquareFootageCalculator />;
}
