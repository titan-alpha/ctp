import { AppUpdatePrivacyDiff } from '@/components/tools/app-update-privacy-diff';

export const metadata = {
  title: 'App Update Privacy Diff Tool | Compare App Versions for Privacy Changes',
  description: 'Compare privacy policies and permissions between app versions. Identify new data collection, tracking SDKs, and privacy risks before updating mobile apps.',
  keywords: ['app update privacy', 'privacy diff', 'permission comparison', 'app version compare', 'privacy changes', 'SDK tracking', 'mobile app privacy', 'update analysis'],
  openGraph: {
    title: 'App Update Privacy Diff Tool | Compare App Versions for Privacy Changes',
    description: 'Compare privacy policies and permissions between app versions. Identify new data collection, tracking SDKs, and privacy risks before updating mobile apps.',
    type: 'website',
    url: '/tools/app-update-privacy-diff',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'App Update Privacy Diff Tool | Compare App Versions for Privacy Changes',
    description: 'Compare privacy policies and permissions between app versions. Identify new data collection, tracking SDKs, and privacy risks before updating mobile apps.',
  },
};

export default function AppUpdatePrivacyDiffPage() {
  return <AppUpdatePrivacyDiff />;
}
