import { HeadlineAnalyzer } from '@/components/tools/headline-analyzer';

export const metadata = {
  title: 'Headline Analyzer | Score & Improve Your Headlines for Maximum Engagement',
  description: 'Analyze your headlines with our free tool. Get a score from 0-100, detailed breakdowns of power words, emotional appeal, and actionable suggestions to boost clicks.',
  keywords: ['headline analyzer', 'headline score', 'headline generator', 'blog title analyzer', 'headline optimizer', 'power words', 'emotional headlines', 'click-through rate'],
  openGraph: {
    title: 'Headline Analyzer | Score & Improve Your Headlines for Maximum Engagement',
    description: 'Analyze your headlines with our free tool. Get a score from 0-100, detailed breakdowns of power words, emotional appeal, and actionable suggestions to boost clicks.',
    type: 'website',
    url: '/tools/headline-analyzer',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Headline Analyzer | Score & Improve Your Headlines for Maximum Engagement',
    description: 'Analyze your headlines with our free tool. Get a score from 0-100, detailed breakdowns of power words, emotional appeal, and actionable suggestions to boost clicks.',
  },
};

export default function HeadlineAnalyzerPage() {
  return <HeadlineAnalyzer />;
}
