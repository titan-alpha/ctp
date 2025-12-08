import { HttpRequestBuilder } from '@/components/tools/http-request-builder';

export const metadata = {
  title: 'HTTP Request Builder | Build & Generate curl and Fetch Code',
  description: 'Build HTTP requests with custom headers, query parameters, and body. Generate curl commands and JavaScript fetch code for API testing and development.',
  keywords: ['http request builder', 'curl generator', 'fetch code generator', 'api request builder', 'rest api tester', 'http client', 'request headers'],
  openGraph: {
    title: 'HTTP Request Builder | Build & Generate curl and Fetch Code',
    description: 'Build HTTP requests with custom headers, query parameters, and body. Generate curl commands and JavaScript fetch code for API testing and development.',
    type: 'website',
    url: '/tools/http-request-builder',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HTTP Request Builder | Build & Generate curl and Fetch Code',
    description: 'Build HTTP requests with custom headers, query parameters, and body. Generate curl commands and JavaScript fetch code for API testing and development.',
  },
};

export default function HttpRequestBuilderPage() {
  return <HttpRequestBuilder />;
}
