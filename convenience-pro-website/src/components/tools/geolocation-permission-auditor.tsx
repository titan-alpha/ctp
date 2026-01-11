'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useGeolocationPermissionAuditor } from '@/hooks/useGeolocationPermissionAuditor';

const FEATURES = [
  {
    title: 'Permission Analysis',
    description: 'Audit which apps have access to your location and identify overly permissive settings.',
  },
  {
    title: 'Background Tracking Detection',
    description: 'Identify apps that track your location even when you\'re not using them.',
  },
  {
    title: 'Risk Assessment',
    description: 'Get privacy risk scores for each app based on location permission configuration.',
  },
];

const FAQS = [
  {
    question: 'What is the difference between "While Using" and "Always"?',
    answer: '"While Using App" only allows location access when the app is open and active. "Always" allows the app to access your location at any time, even in the background, which poses greater privacy risks.',
  },
  {
    question: 'Why is precise location a privacy concern?',
    answer: 'Precise location provides your exact GPS coordinates, which can reveal sensitive places you visit (home, work, medical facilities). Approximate location provides general area without exact coordinates.',
  },
  {
    question: 'Which apps should have "Always" location access?',
    answer: 'Very few apps legitimately need "Always" access - typically only navigation, find-my-phone, or location-based automation apps. Most apps work fine with "While Using App".',
  },
  {
    question: 'How do I export location permissions from my phone?',
    answer: 'On iOS, check Settings > Privacy > Location Services. On Android, Settings > Apps > Permissions > Location. You\'ll need to manually create a list or use third-party apps to export.',
  },
  {
    question: 'Can apps track me even with location disabled?',
    answer: 'Apps can still estimate location through IP address, WiFi networks, and Bluetooth beacons, but precision is much lower than GPS. Disabling location significantly reduces tracking accuracy.',
  },
  {
    question: 'What should I do about high-risk apps?',
    answer: 'Change permission to "While Using App", disable precise location, or uninstall apps that don\'t justify their location access requirements.',
  },
];

export function GeolocationPermissionAuditor() {
  const { result, auditPermissions, parsePermissionData, reset } = useGeolocationPermissionAuditor();
  const [fileFormat, setFileFormat] = useState<'json' | 'csv'>('json');
  const [sampleData, setSampleData] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        try {
          const permissions = parsePermissionData(content, fileFormat);
          auditPermissions(permissions);
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
        const permissions = parsePermissionData(sampleData, fileFormat);
        auditPermissions(permissions);
      } catch (error) {
        alert('Error parsing data. Please check format and try again.');
      }
    }
  };

  const loadSampleData = () => {
    const sample = JSON.stringify([
      {
        appName: 'Social Media App',
        locationPermission: 'Always',
        preciseLocation: true,
        backgroundUsage: true,
        lastAccessed: '2026-01-10T14:30:00Z',
        frequency: 'High'
      },
      {
        appName: 'Weather App',
        locationPermission: 'While Using',
        preciseLocation: true,
        backgroundUsage: false,
        lastAccessed: '2026-01-10T08:15:00Z',
        frequency: 'Medium'
      },
      {
        appName: 'Navigation App',
        locationPermission: 'Always',
        preciseLocation: true,
        backgroundUsage: true,
        lastAccessed: '2026-01-09T18:45:00Z',
        frequency: 'Low'
      },
      {
        appName: 'Shopping App',
        locationPermission: 'While Using',
        preciseLocation: false,
        backgroundUsage: false,
        lastAccessed: '2026-01-08T12:00:00Z',
        frequency: 'Low'
      },
      {
        appName: 'Fitness Tracker',
        locationPermission: 'Always',
        preciseLocation: true,
        backgroundUsage: true,
        lastAccessed: '2026-01-10T07:30:00Z',
        frequency: 'High'
      }
    ], null, 2);
    setSampleData(sample);
    setFileFormat('json');
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Geolocation Permission Auditor',
    description: 'Audit mobile app location permissions and identify privacy risks from background tracking.',
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
    <SiteLayout toolName="Geolocation Permission Auditor" category="privacy-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Audit Location Permissions
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
              Upload Permission Data
            </label>
            <input
              type="file"
              accept=".json,.csv"
              onChange={handleFileUpload}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Upload your app location permissions data
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Or Paste Permission Data
            </label>
            <textarea
              value={sampleData}
              onChange={(e) => setSampleData(e.target.value)}
              placeholder="Paste permission data here..."
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
              Audit Permissions
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
                Audit Summary
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {result.totalApps}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Apps</div>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                    {result.alwaysAllowedApps}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">"Always" Allowed</div>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                    {result.backgroundApps}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Background Access</div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {result.preciseLocationApps}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Precise Location</div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Privacy Risk Assessment
              </h3>

              <div className="space-y-4">
                {result.risks.map((risk, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{risk.appName}</h4>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        risk.riskLevel === 'Critical' ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400' :
                        risk.riskLevel === 'High' ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400' :
                        risk.riskLevel === 'Medium' ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400' :
                        'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
                      }`}>
                        {risk.riskLevel} Risk
                      </span>
                    </div>
                    <ul className="mb-3 space-y-1">
                      {risk.reasons.map((reason, i) => (
                        <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                          <span className="mr-2">•</span>
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                      <p className="text-sm text-blue-800 dark:text-blue-300">
                        <strong>Recommendation:</strong> {risk.recommendation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Privacy Recommendations
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
