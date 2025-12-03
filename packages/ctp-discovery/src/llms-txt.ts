/**
 * ConveniencePro Tool Protocol (CTP) - LLMs.txt Generator
 *
 * Generate llms.txt and llms-full.txt files for LLM context injection.
 * These files provide tool information in a format optimized for LLM consumption.
 *
 * @module @conveniencepro/ctp-discovery/llms-txt
 */

import {
  ToolDefinition,
  ParameterSchema,
  CTP_VERSION,
} from '@conveniencepro/ctp-core';

// =============================================================================
// GENERATOR OPTIONS
// =============================================================================

/**
 * Options for LLMs.txt generation
 */
export interface LLMsTxtGeneratorOptions {
  /** Service name */
  name?: string;
  /** Service description */
  description?: string;
  /** Base URL */
  baseUrl?: string;
  /** Path prefix for tool endpoints */
  pathPrefix?: string;
  /** Include full parameter details */
  fullDetails?: boolean;
  /** Include examples */
  includeExamples?: boolean;
  /** Maximum line width (for wrapping) */
  maxLineWidth?: number;
  /** Group tools by category */
  groupByCategory?: boolean;
}

// =============================================================================
// GENERATOR
// =============================================================================

/**
 * Generate llms.txt content (concise version)
 */
export function generateLLMsTxt(
  tools: ToolDefinition[],
  options: LLMsTxtGeneratorOptions = {}
): string {
  const {
    name = 'ConveniencePro',
    description = 'Browser-native utility tools API',
    baseUrl = 'https://conveniencepro.cc',
    pathPrefix = '/run',
    groupByCategory = true,
  } = options;

  const lines: string[] = [];

  // Header
  lines.push(`# ${name}`);
  lines.push(`# ${description}`);
  lines.push(`# Base URL: ${baseUrl}`);
  lines.push(`# Protocol: CTP ${CTP_VERSION}`);
  lines.push('');
  lines.push('# Available Tools');
  lines.push('');

  if (groupByCategory) {
    // Group tools by category
    const categories = new Map<string, ToolDefinition[]>();
    for (const tool of tools) {
      const cat = categories.get(tool.category) || [];
      cat.push(tool);
      categories.set(tool.category, cat);
    }

    for (const [category, categoryTools] of categories) {
      lines.push(`## ${formatCategoryName(category)}`);
      lines.push('');
      for (const tool of categoryTools) {
        lines.push(`- ${tool.name} (${tool.id}): ${tool.description}`);
        lines.push(`  Endpoint: ${tool.method} ${pathPrefix}/${tool.id}`);
        const requiredParams = tool.parameters.filter(p => p.required).map(p => p.name);
        if (requiredParams.length > 0) {
          lines.push(`  Required: ${requiredParams.join(', ')}`);
        }
        lines.push('');
      }
    }
  } else {
    // Flat list
    for (const tool of tools) {
      lines.push(`- ${tool.name} (${tool.id}): ${tool.description}`);
      lines.push(`  ${tool.method} ${pathPrefix}/${tool.id}`);
      lines.push('');
    }
  }

  // Footer
  lines.push('# Usage');
  lines.push('# GET tools: pass parameters as query string');
  lines.push('# POST tools: send JSON body or form data');
  lines.push('# All tools return: { success: boolean, ...result }');
  lines.push('');
  lines.push(`# Full documentation: ${baseUrl}/docs`);
  lines.push(`# OpenAPI spec: ${baseUrl}/.well-known/openapi.yaml`);

  return lines.join('\n');
}

/**
 * Generate llms-full.txt content (detailed version)
 */
export function generateLLMsFullTxt(
  tools: ToolDefinition[],
  options: LLMsTxtGeneratorOptions = {}
): string {
  const {
    name = 'ConveniencePro',
    description = 'Browser-native utility tools API',
    baseUrl = 'https://conveniencepro.cc',
    pathPrefix = '/run',
    includeExamples = true,
    maxLineWidth = 80,
  } = options;

  const lines: string[] = [];

  // Header
  lines.push('='.repeat(maxLineWidth));
  lines.push(centerText(name, maxLineWidth));
  lines.push(centerText(description, maxLineWidth));
  lines.push('='.repeat(maxLineWidth));
  lines.push('');
  lines.push(`Base URL: ${baseUrl}`);
  lines.push(`API Path: ${pathPrefix}/{tool-id}`);
  lines.push(`Protocol: ConveniencePro Tool Protocol (CTP) v${CTP_VERSION}`);
  lines.push(`Total Tools: ${tools.length}`);
  lines.push('');
  lines.push('-'.repeat(maxLineWidth));
  lines.push('');

  // Group by category
  const categories = new Map<string, ToolDefinition[]>();
  for (const tool of tools) {
    const cat = categories.get(tool.category) || [];
    cat.push(tool);
    categories.set(tool.category, cat);
  }

  for (const [category, categoryTools] of categories) {
    lines.push(`## ${formatCategoryName(category)} (${categoryTools.length} tools)`);
    lines.push('');

    for (const tool of categoryTools) {
      lines.push(`### ${tool.name}`);
      lines.push(`ID: ${tool.id}`);
      lines.push(`Description: ${tool.description}`);
      lines.push(`Method: ${tool.method}`);
      lines.push(`Endpoint: ${pathPrefix}/${tool.id}`);
      lines.push(`Tags: ${tool.tags.join(', ')}`);
      lines.push('');

      // Parameters
      if (tool.parameters.length > 0) {
        lines.push('Parameters:');
        for (const param of tool.parameters) {
          lines.push(formatParameter(param));
        }
        lines.push('');
      }

      // Output
      lines.push(`Output: ${tool.outputDescription}`);
      lines.push('');

      // Example
      if (includeExamples && tool.example) {
        lines.push('Example:');
        lines.push(`  Input: ${JSON.stringify(tool.example.input)}`);
        lines.push(`  Output: ${JSON.stringify(tool.example.output)}`);
        lines.push('');
      }

      lines.push('-'.repeat(40));
      lines.push('');
    }
  }

  // Response format
  lines.push('='.repeat(maxLineWidth));
  lines.push('RESPONSE FORMAT');
  lines.push('='.repeat(maxLineWidth));
  lines.push('');
  lines.push('All tools return JSON with this structure:');
  lines.push('');
  lines.push('Success:');
  lines.push('  {');
  lines.push('    "success": true,');
  lines.push('    ...tool-specific fields');
  lines.push('  }');
  lines.push('');
  lines.push('Error:');
  lines.push('  {');
  lines.push('    "success": false,');
  lines.push('    "error": "Error message",');
  lines.push('    "errorCode": "ERROR_CODE" (optional)');
  lines.push('  }');
  lines.push('');

  // Usage examples
  lines.push('='.repeat(maxLineWidth));
  lines.push('USAGE EXAMPLES');
  lines.push('='.repeat(maxLineWidth));
  lines.push('');
  lines.push('GET Request:');
  lines.push(`  curl "${baseUrl}${pathPrefix}/base64-encode?text=Hello%20World"`);
  lines.push('');
  lines.push('POST Request:');
  lines.push(`  curl -X POST "${baseUrl}${pathPrefix}/json-format" \\`);
  lines.push('    -H "Content-Type: application/json" \\');
  lines.push('    -d \'{"json": "{\\"key\\": \\"value\\"}"}\'');
  lines.push('');

  // Footer
  lines.push('='.repeat(maxLineWidth));
  lines.push(`Documentation: ${baseUrl}/docs`);
  lines.push(`OpenAPI: ${baseUrl}/.well-known/openapi.yaml`);
  lines.push(`AI Tools: ${baseUrl}/.well-known/ai-tools.json`);
  lines.push('='.repeat(maxLineWidth));

  return lines.join('\n');
}

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Format category ID to display name
 */
function formatCategoryName(id: string): string {
  return id
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Format parameter for display
 */
function formatParameter(param: ParameterSchema): string {
  const parts: string[] = [];

  // Name and type
  parts.push(`  - ${param.name} (${param.type})`);

  // Required indicator
  if (param.required) {
    parts[0] += ' [REQUIRED]';
  }

  // Description
  parts.push(`    ${param.description}`);

  // Default value
  if (param.default !== undefined) {
    parts.push(`    Default: ${JSON.stringify(param.default)}`);
  }

  // Constraints
  const constraints: string[] = [];
  if (param.min !== undefined) constraints.push(`min: ${param.min}`);
  if (param.max !== undefined) constraints.push(`max: ${param.max}`);
  if (param.minLength !== undefined) constraints.push(`minLength: ${param.minLength}`);
  if (param.maxLength !== undefined) constraints.push(`maxLength: ${param.maxLength}`);
  if (param.pattern) constraints.push(`pattern: ${param.pattern}`);

  if (constraints.length > 0) {
    parts.push(`    Constraints: ${constraints.join(', ')}`);
  }

  // Options for select
  if (param.type === 'select' && param.options) {
    parts.push(`    Options: ${param.options.map(o => o.value).join(', ')}`);
  }

  return parts.join('\n');
}

/**
 * Center text within a given width
 */
function centerText(text: string, width: number): string {
  if (text.length >= width) return text;
  const padding = Math.floor((width - text.length) / 2);
  return ' '.repeat(padding) + text;
}

// =============================================================================
// MARKDOWN GENERATOR
// =============================================================================

/**
 * Generate Markdown documentation for tools
 */
export function generateToolsMarkdown(
  tools: ToolDefinition[],
  options: LLMsTxtGeneratorOptions = {}
): string {
  const {
    name = 'ConveniencePro Tools',
    description = 'Browser-native utility tools',
    baseUrl = 'https://conveniencepro.cc',
    pathPrefix = '/run',
    includeExamples = true,
  } = options;

  const lines: string[] = [];

  lines.push(`# ${name}`);
  lines.push('');
  lines.push(description);
  lines.push('');
  lines.push(`**Base URL:** \`${baseUrl}\``);
  lines.push(`**API Path:** \`${pathPrefix}/{tool-id}\``);
  lines.push('');

  // Table of contents
  lines.push('## Table of Contents');
  lines.push('');

  const categories = new Map<string, ToolDefinition[]>();
  for (const tool of tools) {
    const cat = categories.get(tool.category) || [];
    cat.push(tool);
    categories.set(tool.category, cat);
  }

  for (const [category] of categories) {
    const anchor = category.toLowerCase().replace(/\s+/g, '-');
    lines.push(`- [${formatCategoryName(category)}](#${anchor})`);
  }
  lines.push('');

  // Categories and tools
  for (const [category, categoryTools] of categories) {
    lines.push(`## ${formatCategoryName(category)}`);
    lines.push('');

    for (const tool of categoryTools) {
      lines.push(`### ${tool.name}`);
      lines.push('');
      lines.push(`**ID:** \`${tool.id}\``);
      lines.push('');
      lines.push(tool.description);
      lines.push('');
      lines.push(`**Endpoint:** \`${tool.method} ${pathPrefix}/${tool.id}\``);
      lines.push('');

      // Parameters table
      if (tool.parameters.length > 0) {
        lines.push('**Parameters:**');
        lines.push('');
        lines.push('| Name | Type | Required | Description |');
        lines.push('|------|------|----------|-------------|');
        for (const param of tool.parameters) {
          lines.push(`| \`${param.name}\` | ${param.type} | ${param.required ? 'Yes' : 'No'} | ${param.description} |`);
        }
        lines.push('');
      }

      // Example
      if (includeExamples && tool.example) {
        lines.push('**Example:**');
        lines.push('');
        lines.push('```json');
        lines.push(`// Input`);
        lines.push(JSON.stringify(tool.example.input, null, 2));
        lines.push('');
        lines.push(`// Output`);
        lines.push(JSON.stringify(tool.example.output, null, 2));
        lines.push('```');
        lines.push('');
      }

      lines.push('---');
      lines.push('');
    }
  }

  return lines.join('\n');
}
