import { ColorContrastChecker } from '@/components/tools/color-contrast-checker';

export const metadata = {
  title: 'Color Contrast Checker | WCAG Accessibility Tool',
  description: 'Check color contrast ratios for WCAG 2.1 AA and AAA compliance. Test foreground and background colors with real-time preview and accessibility badges.',
  keywords: ['color contrast checker', 'WCAG', 'accessibility', 'contrast ratio', 'AA compliance', 'AAA compliance', 'web accessibility', 'color picker'],
  openGraph: {
    title: 'Color Contrast Checker | WCAG Accessibility Tool',
    description: 'Check color contrast ratios for WCAG 2.1 AA and AAA compliance. Test foreground and background colors with real-time preview and accessibility badges.',
    type: 'website',
    url: '/tools/color-contrast-checker',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Color Contrast Checker | WCAG Accessibility Tool',
    description: 'Check color contrast ratios for WCAG 2.1 AA and AAA compliance. Test foreground and background colors with real-time preview and accessibility badges.',
  },
};

export default function ColorContrastCheckerPage() {
  return <ColorContrastChecker />;
}
