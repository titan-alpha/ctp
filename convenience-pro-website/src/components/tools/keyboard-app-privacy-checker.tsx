'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useKeyboardAppPrivacyChecker } from '@/hooks/useKeyboardAppPrivacyChecker';

const FEATURES = [
  {
    title: 'Full Access Analysis',
    description: 'Identify keyboards with "Full Access" permissions that can read everything you type.',
  },
  {
    title: 'Cloud Sync Detection',
    description: 'Detect keyboards syncing your typing data to cloud servers.',
  },
  {
    title: 'Privacy Risk Scoring',
    description: 'Get comprehensive privacy scores for each keyboard app based on permissions and data collection.',
  },
];

const FAQS = [
  {
    question: 'What is "Full Access" for keyboards?',
    answer: 'Full Access allows a keyboard app to transmit typed data, access network, and potentially send everything you type to remote servers. System keyboards don\'t need this permission.',
  },
  {
    question: 'Why are third-party keyboards a privacy risk?',
    answer: 'Third-party keyboards can log passwords, credit card numbers, messages, and search queries. They may sync this data to cloud servers or sell it to advertisers.',
  },
  {
    question: 'Which keyboard is most privacy-friendly?',
    answer: 'Built-in system keyboards (iOS keyboard, Android Gboard when logged out) are generally most private as they process data locally without cloud sync.',
  },
  {
    question: 'Can keyboards see my passwords?',
    answer: 'Yes, keyboards with Full Access can potentially see passwords unless the app specifically uses secure text entry fields that bypass custom keyboards.',
  },
  {
    question: 'What data do keyboard apps collect?',
    answer: 'Third-party keyboards may collect typed text, contact names, locations, search queries, and typing patterns for auto-correction and personalization.',
  },
  {
    question: 'How do I check my keyboard permissions?',
    answer: 'On iOS: Settings > General > Keyboard > Keyboards. On Android: Settings > System > Languages & input > Virtual keyboard.',
  },
];

export function KeyboardAppPrivacyChecker() {
  const { result, auditKeyboards, parseKeyboardData, reset } = useKeyboardAppPrivacyChecker();
  const [fileFormat, setFileFormat] = useState<'json' | 'csv'>('json');
  const [sampleData, setSampleData] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        try {
          const keyboards = parseKeyboardData(content, fileFormat);
          auditKeyboards(keyboards);
        } catch (error) {
          alert('Error parsing file. Please check format and try again.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSampleAnalysis = () => {
    if (sampleData.trim()) {
      try {
        const keyboards = parseKeyboardData(sampleData, fileFormat);
        auditKeyboards(keyboards);
      } catch (error) {
        alert('Error parsing data. Please check format and try again.');
      }
    }
  };

  const loadSampleData = () => {
    const sample = JSON.stringify([
      {
        name: 'Gboard',
        vendor: 'Google',
        fullAccess: true,
        cloudSync: true,
        networkAccess: true,
        learnedWords: 1500,
        dataCollection: ['Typed text', 'Search queries', 'Voice input', 'Location']
      },
      {
        name: 'SwiftKey',
        vendor: 'Microsoft',
        fullAccess: true,
        cloudSync: true,
        networkAccess: true,
        learnedWords: 2200,
        dataCollection: ['Typed text', 'Contact names', 'Typing patterns']
      },
      {
        name: 'iOS Keyboard',
        vendor: 'Apple',
        fullAccess: false,
        cloudSync: false,
        networkAccess: false,
        learnedWords: 300,
        dataCollection: ['Local autocorrection only']
      }
    ], null, 2);
    setSampleData(sample);
    setFileFormat('json');
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Keyboard App Privacy Checker',
    description: 'Audit mobile keyboard app privacy and data collection practices.',
    applicationCategory: 'SecurityApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <SiteLayout toolName="Keyboard App Privacy Checker" category="privacy-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Check Keyboard Privacy
          </h2>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              File Format
            </label>
            <select
              value={fileFormat}
              onChange={(e) => setFileFormat(e.target.value as 'json' | 'csv')}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="json">JSON</option>
              <option value="csv">CSV</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Upload Keyboard Data
            </label>
            <input
              type="file"
              accept=".json,.csv"
              onChange={handleFileUpload}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Upload keyboard configuration and permissions data
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Or Paste Keyboard Data
            </label>
            <textarea
              value={sampleData}
              onChange={(e) => setSampleData(e.target.value)}
              placeholder="Paste keyboard data here..."
              rows={8}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm resize-none"
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleSampleAnalysis}
              disabled={!sampleData.trim()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
            >
              Check Privacy
            </button>
            <button
              onClick={loadSampleData}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
            >
              Load Sample
            </button>
            <button
              onClick={reset}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {result && (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Privacy Overview
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {result.keyboardsAnalyzed}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Keyboards Analyzed</div>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                    {result.averagePrivacyScore}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Avg Privacy Score</div>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                    {result.highRiskCount}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">High Risk Keyboards</div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Keyboard Privacy Analysis
              </h3>

              <div className="space-y-4">
                {result.analyses.map((analysis, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{analysis.keyboardName}</h4>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        analysis.riskLevel === 'Critical' ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400' :
                        analysis.riskLevel === 'High' ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400' :
                        analysis.riskLevel === 'Medium' ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400' :
                        'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
                      }`}>
                        {analysis.riskLevel} Risk
                      </span>
                    </div>

                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Privacy Score</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{analysis.privacyScore}/100</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            analysis.privacyScore >= 70 ? 'bg-red-500' :
                            analysis.privacyScore >= 50 ? 'bg-orange-500' :
                            analysis.privacyScore >= 30 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${analysis.privacyScore}%` }}
                        />
                      </div>
                    </div>

                    {analysis.concerns.length > 0 && (
                      <div className="mb-3">
                        <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Privacy Concerns:</h5>
                        <ul className="space-y-1">
                          {analysis.concerns.map((concern, i) => (
                            <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                              <span className="text-red-500 mr-2">•</span>
                              <span>{concern}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {analysis.dataCollected.length > 0 && (
                      <div className="mb-3">
                        <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Data Collected:</h5>
                        <div className="flex flex-wrap gap-2">
                          {analysis.dataCollected.map((data, i) => (
                            <span key={i} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">
                              {data}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                      <h5 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">Recommendations:</h5>
                      <ul className="space-y-1">
                        {analysis.recommendations.map((rec, i) => (
                          <li key={i} className="text-sm text-blue-800 dark:text-blue-300 flex items-start">
                            <span className="mr-2">→</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                General Recommendations
              </h3>

              <ul className="space-y-3">
                {result.generalRecommendations.map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map((feature, index) => (
              <div key={index}>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h4>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Frequently Asked Questions
          </h3>
          <div className="space-y-6">
            {FAQS.map((faq, index) => (
              <div key={index}>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{faq.question}</h4>
                <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
