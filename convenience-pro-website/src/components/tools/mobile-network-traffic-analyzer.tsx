'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useMobileNetworkTrafficAnalyzer } from '@/hooks/useMobileNetworkTrafficAnalyzer';

const FEATURES = [
  {
    title: 'Encryption Analysis',
    description: 'Detect unencrypted HTTP traffic that exposes your data to network eavesdropping.',
  },
  {
    title: 'Tracker Detection',
    description: 'Identify analytics and advertising trackers collecting data about your mobile usage.',
  },
  {
    title: 'Third-Party Analysis',
    description: 'See which third-party services your apps communicate with and what data they might share.',
  },
];

const FAQS = [
  {
    question: 'How do I capture mobile network traffic?',
    answer: 'You can use tools like Charles Proxy, mitmproxy, or Wireshark with your device configured to route traffic through the proxy. Export the capture as CSV or JSON for analysis.',
  },
  {
    question: 'Why is unencrypted traffic a privacy risk?',
    answer: 'HTTP traffic (unencrypted) can be intercepted and read by anyone on the same network. This includes passwords, personal information, and browsing activity. Always prefer apps that use HTTPS.',
  },
  {
    question: 'What are third-party trackers?',
    answer: 'Trackers are services like Google Analytics, Facebook SDK, or advertising networks that collect data about your app usage, behavior, and sometimes personal information to build profiles for advertising.',
  },
  {
    question: 'How is the privacy score calculated?',
    answer: 'Each app is scored based on percentage of unencrypted traffic (40%), number of tracker domains (35%), and third-party connections (25%). Higher scores indicate greater privacy risk.',
  },
  {
    question: 'What should I do about high-risk apps?',
    answer: 'Consider uninstalling high-risk apps, using privacy-focused alternatives, disabling background data, or using a VPN to encrypt all network traffic.',
  },
  {
    question: 'Can this tool block trackers?',
    answer: 'This tool analyzes traffic but doesn\'t block it. To block trackers, use DNS-based solutions like NextDNS, Pi-hole, or a privacy-focused VPN.',
  },
];

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 10) / 10 + ' ' + sizes[i];
}

export function MobileNetworkTrafficAnalyzer() {
  const { result, analyzeTraffic, parseTrafficData, reset } = useMobileNetworkTrafficAnalyzer();
  const [fileFormat, setFileFormat] = useState<'json' | 'csv' | 'pcap'>('json');
  const [sampleData, setSampleData] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        try {
          const traffic = parseTrafficData(content, fileFormat);
          analyzeTraffic(traffic);
        } catch (error: any) {
          alert(error.message || 'Error parsing file. Please check format and try again.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSampleAnalysis = () => {
    if (sampleData.trim()) {
      try {
        const traffic = parseTrafficData(sampleData, fileFormat);
        analyzeTraffic(traffic);
      } catch (error: any) {
        alert(error.message || 'Error parsing data. Please check format and try again.');
      }
    }
  };

  const loadSampleData = () => {
    const sample = JSON.stringify([
      { timestamp: '2026-01-10T14:30:00Z', appName: 'Social Media App', domain: 'graph.facebook.com', protocol: 'HTTPS', bytesTransferred: 15420 },
      { timestamp: '2026-01-10T14:30:05Z', appName: 'Social Media App', domain: 'google-analytics.com', protocol: 'HTTPS', bytesTransferred: 3240 },
      { timestamp: '2026-01-10T14:30:10Z', appName: 'Weather App', domain: 'weather-api.com', protocol: 'HTTP', bytesTransferred: 8500 },
      { timestamp: '2026-01-10T14:30:15Z', appName: 'Weather App', domain: 'doubleclick.net', protocol: 'HTTPS', bytesTransferred: 5200 },
      { timestamp: '2026-01-10T14:30:20Z', appName: 'News App', domain: 'news-cdn.com', protocol: 'HTTPS', bytesTransferred: 125000 },
      { timestamp: '2026-01-10T14:30:25Z', appName: 'News App', domain: 'chartbeat.com', protocol: 'HTTPS', bytesTransferred: 2800 },
      { timestamp: '2026-01-10T14:30:30Z', appName: 'Game App', domain: 'game-servers.net', protocol: 'HTTP', bytesTransferred: 45000 },
      { timestamp: '2026-01-10T14:30:35Z', appName: 'Game App', domain: 'admob.com', protocol: 'HTTPS', bytesTransferred: 18500 }
    ], null, 2);
    setSampleData(sample);
    setFileFormat('json');
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Mobile Network Traffic Analyzer',
    description: 'Analyze mobile app network traffic to detect tracking, unencrypted connections, and privacy risks.',
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
    <SiteLayout toolName="Mobile Network Traffic Analyzer" category="privacy-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Analyze Network Traffic
          </h2>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              File Format
            </label>
            <select
              value={fileFormat}
              onChange={(e) => setFileFormat(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="json">JSON</option>
              <option value="csv">CSV</option>
              <option value="pcap">PCAP (Limited Support)</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Upload Traffic Capture
            </label>
            <input
              type="file"
              accept=".json,.csv,.pcap"
              onChange={handleFileUpload}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Upload network traffic capture from Charles Proxy, mitmproxy, or similar tools
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Or Paste Traffic Data
            </label>
            <textarea
              value={sampleData}
              onChange={(e) => setSampleData(e.target.value)}
              placeholder="Paste traffic data here..."
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
              Analyze Traffic
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
                Traffic Overview
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {result.totalRequests}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Requests</div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {formatBytes(result.totalBytes)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Data Transferred</div>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                    {result.unencryptedPercentage}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Unencrypted</div>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                    {result.trackerPercentage}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Tracker Traffic</div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                App Privacy Profiles
              </h3>

              <div className="space-y-4">
                {result.appProfiles.map((app, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{app.appName}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {app.totalRequests} requests • {formatBytes(app.totalBytes)}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        app.riskLevel === 'High' ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400' :
                        app.riskLevel === 'Medium' ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400' :
                        'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
                      }`}>
                        {app.riskLevel} Risk
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Privacy Score:</span>
                        <span className="ml-2 font-semibold text-gray-900 dark:text-white">{app.privacyScore}/100</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Unencrypted:</span>
                        <span className="ml-2 font-semibold text-gray-900 dark:text-white">{app.unencryptedRequests}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Trackers:</span>
                        <span className="ml-2 font-semibold text-gray-900 dark:text-white">{app.trackerDomains}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">3rd Party:</span>
                        <span className="ml-2 font-semibold text-gray-900 dark:text-white">{app.thirdPartyDomains}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Top Domains ({result.domains.length})
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 text-gray-900 dark:text-white">Domain</th>
                      <th className="text-left py-3 px-4 text-gray-900 dark:text-white">Category</th>
                      <th className="text-left py-3 px-4 text-gray-900 dark:text-white">Requests</th>
                      <th className="text-left py-3 px-4 text-gray-900 dark:text-white">Data</th>
                      <th className="text-left py-3 px-4 text-gray-900 dark:text-white">Apps</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.domains.slice(0, 20).map((domain, index) => (
                      <tr key={index} className="border-b border-gray-100 dark:border-gray-700">
                        <td className="py-3 px-4 text-gray-900 dark:text-white font-mono text-sm">
                          {domain.domain}
                          {domain.isTracker && (
                            <span className="ml-2 px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 text-xs rounded">
                              Tracker
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{domain.category}</td>
                        <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{domain.requests}</td>
                        <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{formatBytes(domain.bytes)}</td>
                        <td className="py-3 px-4 text-gray-700 dark:text-gray-300 text-sm">{domain.apps.length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
