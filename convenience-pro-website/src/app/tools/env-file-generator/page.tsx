import { EnvFileGenerator } from '@/components/tools/env-file-generator';

export const metadata = {
  title: 'Env File Generator | Create .env Files for Any Framework',
  description: 'Generate .env files with templates for Next.js, React, Node.js, Django, Laravel, and Rails. Free online environment variable file generator with validation.',
  keywords: ['env file generator', 'dotenv generator', 'environment variables', 'env template', 'nextjs env', 'react env', 'node env', 'django env', 'laravel env'],
  openGraph: {
    title: 'Env File Generator | Create .env Files for Any Framework',
    description: 'Generate .env files with templates for Next.js, React, Node.js, Django, Laravel, and Rails. Free online environment variable file generator with validation.',
    type: 'website',
    url: '/tools/env-file-generator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Env File Generator | Create .env Files for Any Framework',
    description: 'Generate .env files with templates for Next.js, React, Node.js, Django, Laravel, and Rails. Free online environment variable file generator with validation.',
  },
};

export default function EnvFileGeneratorPage() {
  return <EnvFileGenerator />;
}
