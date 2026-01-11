import { MobileNetworkTrafficAnalyzer } from '@/components/tools/mobile-network-traffic-analyzer';

export const metadata = {
  title: 'Mobile Network Traffic Analyzer | Detect Tracking & Unencrypted Connections',
  description: 'Analyze mobile app network traffic to identify tracking, third-party data sharing, and unencrypted HTTP connections. Audit privacy risks in your mobile apps.',
  keywords: ['network traffic analyzer', 'mobile privacy', 'app tracking detection', 'HTTP analyzer', 'network security', 'traffic monitoring', 'privacy audit', 'tracker detection'],
  openGraph: {
    title: 'Mobile Network Traffic Analyzer | Detect Tracking & Unencrypted Connections',
    description: 'Analyze mobile app network traffic to identify tracking, third-party data sharing, and unencrypted HTTP connections. Audit privacy risks in your mobile apps.',
    type: 'website',
    url: '/tools/mobile-network-traffic-analyzer',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mobile Network Traffic Analyzer | Detect Tracking & Unencrypted Connections',
    description: 'Analyze mobile app network traffic to identify tracking, third-party data sharing, and unencrypted HTTP connections. Audit privacy risks in your mobile apps.',
  },
};

export default function MobileNetworkTrafficAnalyzerPage() {
  return <MobileNetworkTrafficAnalyzer />;
}
