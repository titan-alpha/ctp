'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useAppUpdatePrivacyDiff, AppVersion } from '@/hooks/useAppUpdatePrivacyDiff';

const FEATURES = [
  {
    title: 'Permission Comparison',
    description: 'Compare permissions between app versions to identify new privacy-invasive requests.',
  },
  {
    title: 'SDK Analysis',
    description: 'Track changes in third-party tracking SDKs and analytics libraries.',
  },
  {
    title: 'Risk Assessment',
    description: 'Get overall privacy risk change assessment to inform update decisions.',
  },
];

const FAQS = [
  {
    question: 'Why should I check privacy changes before updating?',
    answer: 'App updates often introduce new permissions, tracking SDKs, or data collection practices. Checking changes helps you make informed decisions about whether to update or look for alternatives.',
  },
  {
    question: 'What are third-party SDKs?',
    answer: 'SDKs (Software Development Kits) are code libraries from companies like Facebook, Google, or analytics providers that apps integrate. They often collect user data for tracking, advertising, or analytics.',
  },
  {
    question: 'Should I skip updates with increased privacy risks?',
    answer: 'Balance privacy against security - security updates are important. For privacy-degrading updates, you can delay updating, disable new permissions, or switch to privacy-friendly alternatives.',
  },
  {
    question: 'How do I get app version data?',
    answer: 'APK files can be analyzed with tools like APK Analyzer (Android Studio) or third-party services. iOS app packages (IPA) can be examined similarly with appropriate tools.',
  },
  {
    question: 'What permissions are highest risk?',
    answer: 'Camera, microphone, location, contacts, SMS, and phone permissions are highest risk as they access sensitive personal information.',
  },
  {
    question: 'Can I decline new permissions after updating?',
    answer: 'On modern mobile OS versions, yes. You can deny permissions in app settings, though some app functionality may be limited.',
  },
];

export function AppUpdatePrivacyDiff() {
  const { result, compareVersions, parseVersionData, reset } = useAppUpdatePrivacyDiff();
  const [oldVersionData, setOldVersionData] = useState('');
  const [newVersionData, setNewVersionData] = useState('');

  const handleCompare = () => {
    if (oldVersionData.trim() && newVersionData.trim()) {
      try {
        const oldVersions = parseVersionData(oldVersionData, 'json');
        const newVersions = parseVersionData(newVersionData, 'json');

        if (oldVersions.length > 0 && newVersions.length > 0) {
          compareVersions(oldVersions[0], newVersions[0]);
        } else {
          alert('Invalid version data');
        }
      } catch (error) {
        alert('Error parsing data. Please check format and try again.');
      }
    }
  };

  const loadSampleData = () => {
    const oldSample = JSON.stringify({
      version: '2.5.0',
      releaseDate: '2025-12-01',
      permissions: ['INTERNET', 'NETWORK_STATE', 'STORAGE'],
      thirdPartySDKs: ['Firebase'],
      dataCollection: ['Usage statistics', 'Crash reports']
    }, null, 2);

    const newSample = JSON.stringify({
      version: '2.6.0',
      releaseDate: '2026-01-10',
      permissions: ['INTERNET', 'NETWORK_STATE', 'STORAGE', 'CAMERA', 'LOCATION'],
      thirdPartySDKs: ['Firebase', 'Facebook SDK', 'Google Analytics'],
      dataCollection: ['Usage statistics', 'Crash reports', 'Location data', 'Photo metadata']
    }, null, 2);

    setOldVersionData(oldSample);
    setNewVersionData(newSample);
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'App Update Privacy Diff Tool',
    description: 'Compare privacy policies and permissions between app versions to identify new data collection.',
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
    <SiteLayout toolName="App Update Privacy Diff" category="privacy-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Compare App Versions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Old Version Data (JSON)
              </label>
              <textarea
                value={oldVersionData}
                onChange={(e) => setOldVersionData(e.target.value)}
                placeholder="Paste old version data here..."
                rows={10}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                New Version Data (JSON)
              </label>
              <textarea
                value={newVersionData}
                onChange={(e) => setNewVersionData(e.target.value)}
                placeholder="Paste new version data here..."
                rows={10}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm resize-none"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleCompare}
              disabled={!oldVersionData.trim() || !newVersionData.trim()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
            >
              Compare Versions
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
                Version Comparison Summary
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Comparing</div>
                  <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    {result.oldVersion} → {result.newVersion}
                  </div>
                </div>
                <div className={`p-4 rounded-lg ${
                  result.overallRiskChange === 'Increased' ? 'bg-red-50 dark:bg-red-900/20' :
                  result.overallRiskChange === 'Decreased' ? 'bg-green-50 dark:bg-green-900/20' :
                  'bg-gray-50 dark:bg-gray-700'
                }`}>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Privacy Risk</div>
                  <div className={`text-xl font-bold ${
                    result.overallRiskChange === 'Increased' ? 'text-red-600 dark:text-red-400' :
                    result.overallRiskChange === 'Decreased' ? 'text-green-600 dark:text-green-400' :
                    'text-gray-600 dark:text-gray-400'
                  }`}>
                    {result.overallRiskChange}
                  </div>
                </div>
                <div className={`p-4 rounded-lg ${
                  result.shouldUpdate ? 'bg-green-50 dark:bg-green-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'
                }`}>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Recommendation</div>
                  <div className={`text-xl font-bold ${
                    result.shouldUpdate ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'
                  }`}>
                    {result.shouldUpdate ? 'Safe to Update' : 'Review Carefully'}
                  </div>
                </div>
              </div>
            </div>

            {result.permissionChanges.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Permission Changes ({result.permissionChanges.length})
                </h3>

                <div className="space-y-3">
                  {result.permissionChanges.map((change, index) => (
                    <div key={index} className={`p-4 rounded-lg border ${
                      change.changeType === 'added' ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20' :
                      'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
                    }`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-900 dark:text-white">{change.permission}</span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              change.severity === 'high' ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400' :
                              change.severity === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400' :
                              'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400'
                            }`}>
                              {change.severity}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{change.description}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          change.changeType === 'added' ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400' :
                          'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
                        }`}>
                          {change.changeType}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.sdkChanges.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Third-Party SDK Changes ({result.sdkChanges.length})
                </h3>

                <div className="space-y-3">
                  {result.sdkChanges.map((change, index) => (
                    <div key={index} className={`p-4 rounded-lg border ${
                      change.changeType === 'added' ? 'border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20' :
                      'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
                    }`}>
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-gray-900 dark:text-white">{change.sdkName}</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          change.changeType === 'added' ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400' :
                          'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
                        }`}>
                          {change.changeType}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{change.privacyImpact}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.dataCollectionChanges.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Data Collection Changes ({result.dataCollectionChanges.length})
                </h3>

                <div className="space-y-2">
                  {result.dataCollectionChanges.map((change, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                      <span className="text-gray-900 dark:text-white">{change.dataType}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{change.impact}</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          change.changeType === 'added' ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400' :
                          'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
                        }`}>
                          {change.changeType}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Recommendations
              </h3>

              <ul className="space-y-3">
                {result.recommendations.map((rec, index) => (
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
