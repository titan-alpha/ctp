import { PushNotificationPrivacyAuditor } from '@/components/tools/push-notification-privacy-auditor';

export const metadata = {
  title: 'Push Notification Privacy Auditor | Detect PII Leaks in Lock Screen Notifications',
  description: 'Analyze push notification content for privacy leaks and personally identifiable information (PII) exposure. Audit notification history to identify apps leaking sensitive data on lock screens.',
  keywords: ['push notification privacy', 'notification auditor', 'PII detection', 'lock screen privacy', 'notification security', 'mobile privacy', 'sensitive data', 'notification analysis'],
  openGraph: {
    title: 'Push Notification Privacy Auditor | Detect PII Leaks in Lock Screen Notifications',
    description: 'Analyze push notification content for privacy leaks and personally identifiable information (PII) exposure. Audit notification history to identify apps leaking sensitive data on lock screens.',
    type: 'website',
    url: '/tools/push-notification-privacy-auditor',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Push Notification Privacy Auditor | Detect PII Leaks in Lock Screen Notifications',
    description: 'Analyze push notification content for privacy leaks and personally identifiable information (PII) exposure. Audit notification history to identify apps leaking sensitive data on lock screens.',
  },
};

export default function PushNotificationPrivacyAuditorPage() {
  return <PushNotificationPrivacyAuditor />;
}
