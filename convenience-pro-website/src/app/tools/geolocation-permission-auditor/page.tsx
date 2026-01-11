import { GeolocationPermissionAuditor } from '@/components/tools/geolocation-permission-auditor';

export const metadata = {
  title: 'Geolocation Permission Auditor | Analyze App Location Tracking Privacy',
  description: 'Audit mobile app location permissions to identify privacy risks from background tracking and "Always" location access. Protect your location privacy.',
  keywords: ['location permission auditor', 'geolocation privacy', 'app tracking', 'location privacy', 'GPS tracking', 'background location', 'mobile privacy', 'permission audit'],
  openGraph: {
    title: 'Geolocation Permission Auditor | Analyze App Location Tracking Privacy',
    description: 'Audit mobile app location permissions to identify privacy risks from background tracking and "Always" location access. Protect your location privacy.',
    type: 'website',
    url: '/tools/geolocation-permission-auditor',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Geolocation Permission Auditor | Analyze App Location Tracking Privacy',
    description: 'Audit mobile app location permissions to identify privacy risks from background tracking and "Always" location access. Protect your location privacy.',
  },
};

export default function GeolocationPermissionAuditorPage() {
  return <GeolocationPermissionAuditor />;
}
