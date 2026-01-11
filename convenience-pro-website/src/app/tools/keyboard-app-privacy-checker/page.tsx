import { KeyboardAppPrivacyChecker } from '@/components/tools/keyboard-app-privacy-checker';

export const metadata = {
  title: 'Keyboard App Privacy Checker | Audit Mobile Keyboard Data Collection',
  description: 'Analyze mobile keyboard app privacy including full access permissions, cloud sync, and data collection. Protect your typing privacy.',
  keywords: ['keyboard privacy', 'keyboard app checker', 'typing privacy', 'keyboard data collection', 'full access permission', 'mobile privacy', 'keyboard security', 'privacy audit'],
  openGraph: {
    title: 'Keyboard App Privacy Checker | Audit Mobile Keyboard Data Collection',
    description: 'Analyze mobile keyboard app privacy including full access permissions, cloud sync, and data collection. Protect your typing privacy.',
    type: 'website',
    url: '/tools/keyboard-app-privacy-checker',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Keyboard App Privacy Checker | Audit Mobile Keyboard Data Collection',
    description: 'Analyze mobile keyboard app privacy including full access permissions, cloud sync, and data collection. Protect your typing privacy.',
  },
};

export default function KeyboardAppPrivacyCheckerPage() {
  return <KeyboardAppPrivacyChecker />;
}
