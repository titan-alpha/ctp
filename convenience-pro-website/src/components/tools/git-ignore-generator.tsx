'use client';

import { useState, useEffect } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useGitIgnoreGenerator, Framework, OS, IDE } from '@/hooks/useGitIgnoreGenerator';

const FRAMEWORKS: { value: Framework; label: string }[] = [
  { value: 'node', label: 'Node.js' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'react', label: 'React' },
  { value: 'nextjs', label: 'Next.js' },
];

const OS_OPTIONS: { value: OS; label: string }[] = [
  { value: 'macos', label: 'macOS' },
  { value: 'windows', label: 'Windows' },
  { value: 'linux', label: 'Linux' },
];

const IDE_OPTIONS: { value: IDE; label: string }[] = [
  { value: 'vscode', label: 'VS Code' },
  { value: 'intellij', label: 'IntelliJ IDEA' },
  { value: 'vim', label: 'Vim' },
];

const FEATURES = [
  {
    title: 'Multiple Languages',
    description: 'Support for Node.js, Python, Java, Go, Rust, React, and Next.js with appropriate ignore patterns.',
  },
  {
    title: 'OS-Specific Patterns',
    description: 'Include patterns for macOS, Windows, and Linux system files that clutter repositories.',
  },
  {
    title: 'IDE Integration',
    description: 'Add patterns for VS Code, IntelliJ IDEA, and Vim editor-specific files and folders.',
  },
];

const FAQS = [
  {
    question: 'What is a .gitignore file?',
    answer: 'A .gitignore file tells Git which files and directories to ignore when tracking changes. This prevents unnecessary files like dependencies, build outputs, and IDE configurations from being committed to your repository.',
  },
  {
    question: 'Why should I use a .gitignore file?',
    answer: 'Using a .gitignore file keeps your repository clean, reduces its size, prevents sensitive data from being committed, and avoids conflicts between developers using different operating systems or IDEs.',
  },
  {
    question: 'Can I combine multiple templates?',
    answer: 'Yes! Our generator allows you to select multiple frameworks, operating systems, and IDEs. All patterns will be combined into a single comprehensive .gitignore file.',
  },
  {
    question: 'Where should I place the .gitignore file?',
    answer: 'The .gitignore file should be placed in the root directory of your Git repository. You can also create additional .gitignore files in subdirectories for more specific rules.',
  },
  {
    question: 'Do .gitignore patterns work retroactively?',
    answer: 'No, adding patterns to .gitignore only affects untracked files. Files already tracked by Git will continue to be tracked. Use "git rm --cached" to untrack files that should be ignored.',
  },
  {
    question: 'How do I ignore files globally across all repositories?',
    answer: 'You can create a global .gitignore file and configure Git to use it with: git config --global core.excludesfile ~/.gitignore_global. This is useful for OS and IDE patterns.',
  },
];

export function GitIgnoreGenerator() {
  const { content, generate, reset } = useGitIgnoreGenerator();
  const [selectedFrameworks, setSelectedFrameworks] = useState<Framework[]>([]);
  const [selectedOS, setSelectedOS] = useState<OS[]>([]);
  const [selectedIDEs, setSelectedIDEs] = useState<IDE[]>([]);
  const [copied, setCopied] = useState(false);

  const toggleFramework = (fw: Framework) => {
    setSelectedFrameworks((prev) =>
      prev.includes(fw) ? prev.filter((f) => f !== fw) : [...prev, fw]
    );
  };

  const toggleOS = (os: OS) => {
    setSelectedOS((prev) =>
      prev.includes(os) ? prev.filter((o) => o !== os) : [...prev, os]
    );
  };

  const toggleIDE = (ide: IDE) => {
    setSelectedIDEs((prev) =>
      prev.includes(ide) ? prev.filter((i) => i !== ide) : [...prev, ide]
    );
  };

  useEffect(() => {
    if (selectedFrameworks.length > 0 || selectedOS.length > 0 || selectedIDEs.length > 0) {
      generate(selectedFrameworks, selectedOS, selectedIDEs);
    } else {
      reset();
    }
  }, [selectedFrameworks, selectedOS, selectedIDEs, generate, reset]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '.gitignore';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setSelectedFrameworks([]);
    setSelectedOS([]);
    setSelectedIDEs([]);
    reset();
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: '.gitignore Generator',
    description: 'Generate .gitignore files for your projects with templates for popular languages, frameworks, operating systems, and IDEs.',
    applicationCategory: 'DeveloperApplication',
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
    <SiteLayout toolName=".gitignore Generator" category="developer-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Generate .gitignore
          </h2>

          {/* Frameworks Multi-select */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Languages / Frameworks
            </label>
            <div className="flex flex-wrap gap-2">
              {FRAMEWORKS.map((fw) => (
                <button
                  key={fw.value}
                  onClick={() => toggleFramework(fw.value)}
                  className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                    selectedFrameworks.includes(fw.value)
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {fw.label}
                </button>
              ))}
            </div>
          </div>

          {/* OS Checkboxes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Operating Systems
            </label>
            <div className="flex flex-wrap gap-4">
              {OS_OPTIONS.map((os) => (
                <label key={os.value} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedOS.includes(os.value)}
                    onChange={() => toggleOS(os.value)}
                    className="mr-2 w-4 h-4 text-blue-600"
                  />
                  <span className="text-gray-700 dark:text-gray-300">{os.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* IDE Checkboxes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              IDEs / Editors
            </label>
            <div className="flex flex-wrap gap-4">
              {IDE_OPTIONS.map((ide) => (
                <label key={ide.value} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedIDEs.includes(ide.value)}
                    onChange={() => toggleIDE(ide.value)}
                    className="mr-2 w-4 h-4 text-blue-600"
                  />
                  <span className="text-gray-700 dark:text-gray-300">{ide.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
          >
            Reset
          </button>
        </div>

        {/* Preview Output */}
        {content && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Preview
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  Download .gitignore
                </button>
              </div>
            </div>
            <pre className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg overflow-auto max-h-96 text-sm text-gray-800 dark:text-gray-200">
              {content}
            </pre>
          </div>
        )}

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {FEATURES.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* FAQs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <div
                key={index}
                className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
