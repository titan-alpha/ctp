import { GitIgnoreGenerator } from '@/components/tools/git-ignore-generator';

export const metadata = {
  title: '.gitignore Generator | Create Gitignore Files for Any Project',
  description: 'Generate .gitignore files for Node.js, Python, Java, Go, Rust, React, Next.js with OS and IDE patterns. Free online gitignore generator.',
  keywords: ['gitignore generator', 'gitignore', 'git ignore', 'gitignore template', 'gitignore nodejs', 'gitignore python', 'gitignore react', 'gitignore nextjs'],
  openGraph: {
    title: '.gitignore Generator | Create Gitignore Files for Any Project',
    description: 'Generate .gitignore files for Node.js, Python, Java, Go, Rust, React, Next.js with OS and IDE patterns. Free online gitignore generator.',
    type: 'website',
    url: '/tools/git-ignore-generator',
  },
  twitter: {
    card: 'summary_large_image',
    title: '.gitignore Generator | Create Gitignore Files for Any Project',
    description: 'Generate .gitignore files for Node.js, Python, Java, Go, Rust, React, Next.js with OS and IDE patterns. Free online gitignore generator.',
  },
};

export default function GitIgnoreGeneratorPage() {
  return <GitIgnoreGenerator />;
}
