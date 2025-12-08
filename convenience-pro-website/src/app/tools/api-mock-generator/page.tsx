import { ApiMockGenerator } from '@/components/tools/api-mock-generator';

export const metadata = {
  title: 'API Mock Generator | Generate Mock JSON Data',
  description: 'Generate realistic mock JSON responses for API testing and development. Create fake user, product, order, and post data with customizable fields.',
  keywords: ['api mock generator', 'mock json generator', 'fake api data', 'mock data generator', 'json generator', 'api testing data', 'mock api response'],
  openGraph: {
    title: 'API Mock Generator | Generate Mock JSON Data',
    description: 'Generate realistic mock JSON responses for API testing and development. Create fake user, product, order, and post data with customizable fields.',
    type: 'website',
    url: '/tools/api-mock-generator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'API Mock Generator | Generate Mock JSON Data',
    description: 'Generate realistic mock JSON responses for API testing and development. Create fake user, product, order, and post data with customizable fields.',
  },
};

export default function ApiMockGeneratorPage() {
  return <ApiMockGenerator />;
}
