/**
 * JSON Formatter Tool
 *
 * Complete example of a CTP tool implementation.
 * Demonstrates: parameters, validation, execution, error handling.
 */

import type { ToolDefinition, ToolFunction, ToolResult } from '@conveniencepro/ctp-core';

/**
 * Tool result data type
 */
interface JsonFormatterResult {
  formatted: string;
  valid: boolean;
  lineCount: number;
  characterCount: number;
}

/**
 * Tool definition
 */
export const jsonFormatterDefinition: ToolDefinition = {
  id: 'json-formatter',
  name: 'JSON Formatter',
  description: 'Format, validate, and beautify JSON data with customizable indentation. Supports minification and sorting keys alphabetically.',
  category: 'formatters',
  tags: ['json', 'format', 'beautify', 'validate', 'minify'],
  method: 'POST',
  parameters: [
    {
      name: 'json',
      type: 'textarea',
      label: 'JSON Input',
      description: 'The JSON string to format',
      required: true,
      placeholder: '{"name": "example", "value": 123}',
      minLength: 1,
      maxLength: 1000000, // 1MB limit
    },
    {
      name: 'indent',
      type: 'select',
      label: 'Indentation',
      description: 'Number of spaces for indentation',
      required: false,
      default: '2',
      options: [
        { value: '0', label: 'Minified', description: 'No whitespace' },
        { value: '2', label: '2 spaces', description: 'Standard indentation' },
        { value: '4', label: '4 spaces', description: 'Wide indentation' },
        { value: 'tab', label: 'Tab', description: 'Tab character' },
      ],
    },
    {
      name: 'sortKeys',
      type: 'boolean',
      label: 'Sort Keys',
      description: 'Sort object keys alphabetically',
      required: false,
      default: false,
    },
  ],
  outputDescription: 'Formatted JSON string with proper indentation',
  example: {
    input: {
      json: '{"name":"John","age":30,"city":"NYC"}',
      indent: '2',
      sortKeys: false,
    },
    output: {
      formatted: '{\n  "name": "John",\n  "age": 30,\n  "city": "NYC"\n}',
      valid: true,
      lineCount: 5,
      characterCount: 48,
    },
    name: 'Format a simple JSON object with 2-space indentation',
  },
  version: '1.0.0',
  icon: '📋',
  relatedTools: ['json-validator', 'json-minifier'],
  executionMode: 'client',
};

/**
 * Sort object keys recursively
 */
function sortObjectKeys(obj: unknown): unknown {
  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys);
  }

  if (obj !== null && typeof obj === 'object') {
    const sorted: Record<string, unknown> = {};
    const keys = Object.keys(obj as Record<string, unknown>).sort();

    for (const key of keys) {
      sorted[key] = sortObjectKeys((obj as Record<string, unknown>)[key]);
    }

    return sorted;
  }

  return obj;
}

/**
 * Tool implementation
 */
export const jsonFormatterFn: ToolFunction<JsonFormatterResult> = (
  params
): ToolResult<JsonFormatterResult> => {
  const startTime = performance.now();

  // Extract parameters
  const jsonInput = params.json as string;
  const indentOption = (params.indent as string) || '2';
  const sortKeys = params.sortKeys === 'true' || Boolean(params.sortKeys);

  // Validate input exists
  if (!jsonInput || typeof jsonInput !== 'string') {
    return {
      success: false,
      error: 'JSON input is required',
      errorCode: 'MISSING_REQUIRED',
    };
  }

  // Parse JSON
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonInput);
  } catch (e) {
    const error = e as SyntaxError;
    return {
      success: false,
      error: `Invalid JSON: ${error.message}`,
      errorCode: 'INVALID_INPUT',
    };
  }

  // Sort keys if requested
  if (sortKeys) {
    parsed = sortObjectKeys(parsed);
  }

  // Determine indentation
  let indent: string | number;
  switch (indentOption) {
    case '0':
      indent = 0;
      break;
    case '2':
      indent = 2;
      break;
    case '4':
      indent = 4;
      break;
    case 'tab':
      indent = '\t';
      break;
    default:
      indent = 2;
  }

  // Format JSON
  const formatted = JSON.stringify(parsed, null, indent);

  // Calculate stats
  const lines = formatted.split('\n');
  const executionTime = performance.now() - startTime;

  return {
    success: true,
    data: {
      formatted,
      valid: true,
      lineCount: lines.length,
      characterCount: formatted.length,
    },
    metadata: {
      executionTime,
      inputSize: jsonInput.length,
      outputSize: formatted.length,
    },
  };
};

export default {
  definition: jsonFormatterDefinition,
  fn: jsonFormatterFn,
};
