'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import {
  useGraphqlQueryBuilder,
  QueryField,
  OperationType,
} from '@/hooks/useGraphqlQueryBuilder';

const FEATURES = [
  {
    title: 'Visual Query Building',
    description: 'Build GraphQL queries visually with an intuitive interface. Add fields, nest objects, and configure arguments without writing code.',
  },
  {
    title: 'Real-Time Preview',
    description: 'See your generated GraphQL query update in real-time as you build. Copy the formatted output directly to your application.',
  },
  {
    title: 'Full GraphQL Support',
    description: 'Support for queries and mutations, operation names, variables, field aliases, and nested field selection.',
  },
];

const FAQS = [
  {
    question: 'What is a GraphQL query builder?',
    answer: 'A GraphQL query builder is a visual tool that helps you construct GraphQL queries without writing the syntax manually. You select fields, add arguments, and the tool generates the proper GraphQL query string.',
  },
  {
    question: 'What is the difference between a query and a mutation?',
    answer: 'In GraphQL, a query is used to fetch data (read operations), while a mutation is used to modify data (create, update, delete operations). Both use similar syntax but serve different purposes.',
  },
  {
    question: 'What are GraphQL variables?',
    answer: 'Variables allow you to pass dynamic values to your GraphQL operations. Instead of hardcoding values, you define variables with types and pass their values separately, making queries reusable.',
  },
  {
    question: 'How do I add nested fields?',
    answer: 'Click the "Add Nested Field" button on any field to add a child field. This creates the nested object selection syntax in GraphQL, allowing you to query related data.',
  },
  {
    question: 'What is a field alias in GraphQL?',
    answer: 'An alias allows you to rename a field in the response. This is useful when querying the same field multiple times with different arguments, as each result needs a unique name.',
  },
  {
    question: 'Is this tool free to use?',
    answer: 'Yes, this GraphQL query builder is completely free. All processing happens in your browser with no data sent to any server.',
  },
];

interface FieldBuilderProps {
  field: QueryField;
  depth: number;
  onUpdate: (id: string, updates: Partial<QueryField>) => void;
  onRemove: (id: string) => void;
  onAddChild: (parentId: string) => void;
  onAddArgument: (fieldId: string) => void;
  onUpdateArgument: (fieldId: string, argIndex: number, updates: { name?: string; value?: string; type?: 'string' | 'number' | 'boolean' | 'variable' }) => void;
  onRemoveArgument: (fieldId: string, argIndex: number) => void;
}

function FieldBuilder({
  field,
  depth,
  onUpdate,
  onRemove,
  onAddChild,
  onAddArgument,
  onUpdateArgument,
  onRemoveArgument,
}: FieldBuilderProps) {
  return (
    <div className={`border-l-2 border-blue-300 dark:border-blue-600 pl-4 ${depth > 0 ? 'ml-4 mt-2' : ''}`}>
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-2">
        <div className="flex flex-wrap gap-2 mb-2">
          <input
            type="text"
            value={field.name}
            onChange={(e) => onUpdate(field.id, { name: e.target.value })}
            placeholder="Field name"
            className="flex-1 min-w-32 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
          <input
            type="text"
            value={field.alias || ''}
            onChange={(e) => onUpdate(field.id, { alias: e.target.value })}
            placeholder="Alias (optional)"
            className="w-32 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
          <button
            onClick={() => onRemove(field.id)}
            className="px-2 py-1 text-sm text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded"
          >
            Remove
          </button>
        </div>

        {/* Arguments */}
        {field.arguments.length > 0 && (
          <div className="mb-2 space-y-1">
            <span className="text-xs text-gray-500 dark:text-gray-400">Arguments:</span>
            {field.arguments.map((arg, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={arg.name}
                  onChange={(e) => onUpdateArgument(field.id, idx, { name: e.target.value })}
                  placeholder="Arg name"
                  className="w-24 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                <select
                  value={arg.type}
                  onChange={(e) => onUpdateArgument(field.id, idx, { type: e.target.value as 'string' | 'number' | 'boolean' | 'variable' })}
                  className="w-20 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="string">String</option>
                  <option value="number">Number</option>
                  <option value="boolean">Boolean</option>
                  <option value="variable">Variable</option>
                </select>
                <input
                  type="text"
                  value={arg.value}
                  onChange={(e) => onUpdateArgument(field.id, idx, { value: e.target.value })}
                  placeholder="Value"
                  className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                <button
                  onClick={() => onRemoveArgument(field.id, idx)}
                  className="text-red-500 text-xs hover:underline"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={() => onAddArgument(field.id)}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
          >
            + Add Argument
          </button>
          <button
            onClick={() => onAddChild(field.id)}
            className="text-xs text-green-600 dark:text-green-400 hover:underline"
          >
            + Add Nested Field
          </button>
        </div>
      </div>

      {/* Child fields */}
      {field.children.map((child) => (
        <FieldBuilder
          key={child.id}
          field={child}
          depth={depth + 1}
          onUpdate={onUpdate}
          onRemove={onRemove}
          onAddChild={onAddChild}
          onAddArgument={onAddArgument}
          onUpdateArgument={onUpdateArgument}
          onRemoveArgument={onRemoveArgument}
        />
      ))}
    </div>
  );
}

export function GraphqlQueryBuilder() {
  const {
    query,
    queryString,
    setOperationType,
    setOperationName,
    addVariable,
    updateVariable,
    removeVariable,
    addField,
    updateField,
    removeField,
    addArgument,
    updateArgument,
    removeArgument,
    resetQuery,
  } = useGraphqlQueryBuilder();

  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(queryString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'GraphQL Query Builder',
    description: 'Build GraphQL queries visually with support for fields, arguments, nested queries, and variables.',
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
    <SiteLayout toolName="GraphQL Query Builder" category="developer-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-5xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Build Your GraphQL Query
          </h2>

          {/* Operation Type and Name */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Operation Type
              </label>
              <select
                value={query.operationType}
                onChange={(e) => setOperationType(e.target.value as OperationType)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="query">Query</option>
                <option value="mutation">Mutation</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Operation Name (optional)
              </label>
              <input
                type="text"
                value={query.operationName}
                onChange={(e) => setOperationName(e.target.value)}
                placeholder="GetUsers, CreatePost, etc."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Variables */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Variables
              </label>
              <button
                onClick={addVariable}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                + Add Variable
              </button>
            </div>
            {query.variables.length > 0 && (
              <div className="space-y-2">
                {query.variables.map((variable, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={variable.name}
                      onChange={(e) => updateVariable(idx, 'name', e.target.value)}
                      placeholder="Variable name"
                      className="flex-1 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <input
                      type="text"
                      value={variable.type}
                      onChange={(e) => updateVariable(idx, 'type', e.target.value)}
                      placeholder="Type (e.g., ID!, String)"
                      className="flex-1 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <input
                      type="text"
                      value={variable.defaultValue || ''}
                      onChange={(e) => updateVariable(idx, 'defaultValue', e.target.value)}
                      placeholder="Default (optional)"
                      className="w-32 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <button
                      onClick={() => removeVariable(idx)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Fields */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Fields
              </label>
              <button
                onClick={() => addField()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                + Add Field
              </button>
            </div>
            <div className="min-h-32 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              {query.fields.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No fields added yet. Click &quot;Add Field&quot; to start building your query.
                </p>
              ) : (
                query.fields.map((field) => (
                  <FieldBuilder
                    key={field.id}
                    field={field}
                    depth={0}
                    onUpdate={updateField}
                    onRemove={removeField}
                    onAddChild={addField}
                    onAddArgument={addArgument}
                    onUpdateArgument={updateArgument}
                    onRemoveArgument={removeArgument}
                  />
                ))
              )}
            </div>
          </div>

          <button
            onClick={resetQuery}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-lg transition-colors"
          >
            Reset Query
          </button>
        </div>

        {/* Generated Query Output */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Generated GraphQL Query
            </h3>
            <button
              onClick={copyToClipboard}
              disabled={!queryString}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {copied ? 'Copied!' : 'Copy Query'}
            </button>
          </div>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm min-h-24">
            <code>{queryString || '# Add fields to generate your query'}</code>
          </pre>
        </div>

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
