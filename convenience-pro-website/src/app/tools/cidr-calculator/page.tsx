import { CidrCalculator } from '@/components/tools/cidr-calculator';

export const metadata = {
  title: 'CIDR Calculator | IP Subnet Calculator Online',
  description: 'Free CIDR calculator to compute network address, broadcast address, first and last usable hosts, subnet mask, and total hosts from CIDR notation.',
  keywords: ['CIDR calculator', 'subnet calculator', 'IP calculator', 'network address calculator', 'subnet mask', 'CIDR notation', 'IP subnetting'],
  openGraph: {
    title: 'CIDR Calculator | IP Subnet Calculator Online',
    description: 'Free CIDR calculator to compute network address, broadcast address, first and last usable hosts, subnet mask, and total hosts from CIDR notation.',
    type: 'website',
    url: '/tools/cidr-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CIDR Calculator | IP Subnet Calculator Online',
    description: 'Free CIDR calculator to compute network address, broadcast address, first and last usable hosts, subnet mask, and total hosts from CIDR notation.',
  },
};

export default function CidrCalculatorPage() {
  return <CidrCalculator />;
}
