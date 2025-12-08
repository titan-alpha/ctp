import { FakeAddressGenerator } from '@/components/tools/fake-address-generator';

export const metadata = {
  title: 'Fake Address Generator | Generate Test Addresses',
  description: 'Generate realistic fake addresses for testing and development. Create random US, UK, Canada, Australia, and Germany addresses with valid formatting for form testing.',
  keywords: ['fake address generator', 'random address generator', 'test address generator', 'mock address', 'dummy address', 'address for testing', 'fake US address'],
  openGraph: {
    title: 'Fake Address Generator | Generate Test Addresses',
    description: 'Generate realistic fake addresses for testing and development. Create random US, UK, Canada, Australia, and Germany addresses with valid formatting for form testing.',
    type: 'website',
    url: '/tools/fake-address-generator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fake Address Generator | Generate Test Addresses',
    description: 'Generate realistic fake addresses for testing and development. Create random US, UK, Canada, Australia, and Germany addresses with valid formatting for form testing.',
  },
};

export default function FakeAddressGeneratorPage() {
  return <FakeAddressGenerator />;
}
