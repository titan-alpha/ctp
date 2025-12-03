/**
 * ConveniencePro Tool Protocol (CTP) - AI Tools Manifest Generator
 *
 * Generate AI tools manifest for LLM integration and discovery.
 *
 * @module @conveniencepro/ctp-discovery/ai-tools
 */

import {
  ToolDefinition,
  ParameterSchema,
  CTManifest,
  CTP_VERSION,
} from '@conveniencepro/ctp-core';

// =============================================================================
// AI TOOLS MANIFEST TYPES
// =============================================================================

/**
 * AI Tool parameter definition
 */
export interface AIToolParameter {
  name: string;
  type: string;
  description: string;
  required: boolean;
  default?: unknown;
  enum?: string[];
  minimum?: number;
  maximum?: number;
}

/**
 * AI Tool definition for LLM consumption
 */
export interface AIToolDefinition {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  endpoint: string;
  method: 'GET' | 'POST';
  parameters: AIToolParameter[];
  output: string;
  example?: {
    input: Record<string, unknown>;
    output: Record<string, unknown>;
  };
}

/**
 * AI Tools Manifest structure
 */
export interface AIToolsManifest {
  version: string;
  name: string;
  description: string;
  base_url: string;
  auth: 'none' | 'api_key' | 'oauth2';
  tools: AIToolDefinition[];
  categories: Array<{
    id: string;
    name: string;
    description: string;
    tool_count: number;
  }>;
  updated_at: string;
}

// =============================================================================
// GENERATOR OPTIONS
// =============================================================================

/**
 * Options for AI Tools manifest generation
 */
export interface AIToolsGeneratorOptions {
  /** Service name */
  name?: string;
  /** Service description */
  description?: string;
  /** Base URL for API calls */
  baseUrl?: string;
  /** Authentication method */
  auth?: 'none' | 'api_key' | 'oauth2';
  /** Path prefix for tool endpoints */
  pathPrefix?: string;
  /** Include examples in output */
  includeExamples?: boolean;
  /** Category descriptions */
  categoryDescriptions?: Record<string, string>;
}

// =============================================================================
// PARAMETER CONVERSION
// =============================================================================

/**
 * Convert CTP parameter to AI tool parameter
 */
function parameterToAIParam(param: ParameterSchema): AIToolParameter {
  const aiParam: AIToolParameter = {
    name: param.name,
    type: mapFieldType(param.type),
    description: param.description,
    required: param.required,
  };

  if (param.default !== undefined) {
    aiParam.default = param.default;
  }

  if (param.type === 'select' && param.options) {
    aiParam.enum = param.options.map(o => o.value);
  }

  if (param.min !== undefined) {
    aiParam.minimum = param.min;
  }

  if (param.max !== undefined) {
    aiParam.maximum = param.max;
  }

  return aiParam;
}

/**
 * Map CTP field type to simple type string
 */
function mapFieldType(type: ParameterSchema['type']): string {
  switch (type) {
    case 'text':
    case 'textarea':
    case 'color':
    case 'date':
    case 'datetime':
    case 'url':
    case 'email':
      return 'string';
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'select':
      return 'string';
    case 'json':
      return 'object';
    case 'file':
      return 'file';
    default:
      return 'string';
  }
}

// =============================================================================
// GENERATOR
// =============================================================================

/**
 * Generate AI Tools manifest from tool definitions
 */
export function generateAIToolsManifest(
  tools: ToolDefinition[],
  options: AIToolsGeneratorOptions = {}
): AIToolsManifest {
  const {
    name = 'ConveniencePro',
    description = 'Browser-native utility tools with full privacy',
    baseUrl = 'https://conveniencepro.cc',
    auth = 'none',
    pathPrefix = '/run',
    includeExamples = true,
    categoryDescriptions = {},
  } = options;

  // Collect categories
  const categoryMap = new Map<string, number>();
  for (const tool of tools) {
    categoryMap.set(
      tool.category,
      (categoryMap.get(tool.category) || 0) + 1
    );
  }

  // Build tool definitions
  const aiTools: AIToolDefinition[] = tools.map(tool => ({
    id: tool.id,
    name: tool.name,
    description: tool.description,
    category: tool.category,
    tags: tool.tags,
    endpoint: `${pathPrefix}/${tool.id}`,
    method: tool.method,
    parameters: tool.parameters.map(parameterToAIParam),
    output: tool.outputDescription,
    ...(includeExamples && tool.example ? { example: tool.example } : {}),
  }));

  // Build categories
  const categories = Array.from(categoryMap.entries()).map(([id, count]) => ({
    id,
    name: formatCategoryName(id),
    description: categoryDescriptions[id] || `Tools in the ${id} category`,
    tool_count: count,
  }));

  return {
    version: CTP_VERSION,
    name,
    description,
    base_url: baseUrl,
    auth,
    tools: aiTools,
    categories,
    updated_at: new Date().toISOString(),
  };
}

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
 * Generate AI Tools manifest as JSON string
 */
export function generateAIToolsJSON(
  tools: ToolDefinition[],
  options?: AIToolsGeneratorOptions
): string {
  const manifest = generateAIToolsManifest(tools, options);
  return JSON.stringify(manifest, null, 2);
}

// =============================================================================
// CTP MANIFEST GENERATOR
// =============================================================================

/**
 * Options for CTP manifest generation
 */
export interface CTManifestOptions {
  /** Provider name */
  providerName?: string;
  /** Provider URL */
  providerUrl?: string;
  /** Provider logo URL */
  providerLogo?: string;
  /** Provider description */
  providerDescription?: string;
  /** Contact email */
  contactEmail?: string;
  /** Base URL for API */
  baseUrl?: string;
  /** API version */
  apiVersion?: string;
  /** Authentication method */
  auth?: 'none' | 'api_key' | 'oauth2' | 'bearer';
  /** OpenAPI spec URL */
  openapiUrl?: string;
  /** AI tools manifest URL */
  aiToolsUrl?: string;
  /** LLMs.txt URL */
  llmsTxtUrl?: string;
}

/**
 * Generate CTP manifest
 */
export function generateCTManifest(
  tools: ToolDefinition[],
  options: CTManifestOptions = {}
): CTManifest {
  const {
    providerName = 'ConveniencePro',
    providerUrl = 'https://conveniencepro.cc',
    providerLogo,
    providerDescription = 'Browser-native utility tools',
    contactEmail,
    baseUrl = 'https://conveniencepro.cc/run',
    apiVersion = '1.0',
    auth = 'none',
    openapiUrl,
    aiToolsUrl,
    llmsTxtUrl,
  } = options;

  return {
    schema_version: '1.0',
    protocol_version: CTP_VERSION,
    provider: {
      name: providerName,
      url: providerUrl,
      ...(providerLogo ? { logo: providerLogo } : {}),
      ...(providerDescription ? { description: providerDescription } : {}),
      ...(contactEmail ? { contact: contactEmail } : {}),
    },
    api: {
      base_url: baseUrl,
      version: apiVersion,
      auth,
    },
    tools,
    discovery: {
      ...(openapiUrl ? { openapi: openapiUrl } : {}),
      ...(aiToolsUrl ? { ai_tools: aiToolsUrl } : {}),
      ...(llmsTxtUrl ? { llms_txt: llmsTxtUrl } : {}),
    },
    updated_at: new Date().toISOString(),
  };
}

/**
 * Generate CTP manifest as JSON string
 */
export function generateCTManifestJSON(
  tools: ToolDefinition[],
  options?: CTManifestOptions
): string {
  const manifest = generateCTManifest(tools, options);
  return JSON.stringify(manifest, null, 2);
}

// =============================================================================
// CHATGPT PLUGIN MANIFEST
// =============================================================================

/**
 * ChatGPT Plugin manifest (ai-plugin.json format)
 */
export interface ChatGPTPluginManifest {
  schema_version: string;
  name_for_human: string;
  name_for_model: string;
  description_for_human: string;
  description_for_model: string;
  auth: {
    type: 'none' | 'api_key' | 'oauth';
  };
  api: {
    type: 'openapi';
    url: string;
  };
  logo_url?: string;
  contact_email?: string;
  legal_info_url?: string;
}

/**
 * Options for ChatGPT plugin manifest
 */
export interface ChatGPTPluginOptions {
  nameForHuman?: string;
  nameForModel?: string;
  descriptionForHuman?: string;
  descriptionForModel?: string;
  openapiUrl?: string;
  logoUrl?: string;
  contactEmail?: string;
  legalInfoUrl?: string;
}

/**
 * Generate ChatGPT plugin manifest
 */
export function generateChatGPTPlugin(
  options: ChatGPTPluginOptions = {}
): ChatGPTPluginManifest {
  const {
    nameForHuman = 'ConveniencePro Tools',
    nameForModel = 'conveniencepro',
    descriptionForHuman = 'Access 200+ utility tools for text, encoding, hashing, and more.',
    descriptionForModel = 'Use ConveniencePro tools for text manipulation, encoding/decoding, hashing, JSON formatting, UUID generation, regex operations, and more. All tools run privately in the browser.',
    openapiUrl = 'https://conveniencepro.cc/.well-known/openapi.yaml',
    logoUrl,
    contactEmail,
    legalInfoUrl,
  } = options;

  return {
    schema_version: 'v1',
    name_for_human: nameForHuman,
    name_for_model: nameForModel,
    description_for_human: descriptionForHuman,
    description_for_model: descriptionForModel,
    auth: { type: 'none' },
    api: {
      type: 'openapi',
      url: openapiUrl,
    },
    ...(logoUrl ? { logo_url: logoUrl } : {}),
    ...(contactEmail ? { contact_email: contactEmail } : {}),
    ...(legalInfoUrl ? { legal_info_url: legalInfoUrl } : {}),
  };
}

/**
 * Generate ChatGPT plugin manifest as JSON string
 */
export function generateChatGPTPluginJSON(
  options?: ChatGPTPluginOptions
): string {
  const manifest = generateChatGPTPlugin(options);
  return JSON.stringify(manifest, null, 2);
}
