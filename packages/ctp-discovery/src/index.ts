/**
 * @conveniencepro/ctp-discovery
 *
 * Discovery manifest generators for the ConveniencePro Tool Protocol.
 * Generate OpenAPI, AI tools manifests, llms.txt, and more.
 *
 * @packageDocumentation
 * @module @conveniencepro/ctp-discovery
 * @version 1.0.0
 */

// =============================================================================
// RE-EXPORT CORE TYPES
// =============================================================================

export {
  type ToolDefinition,
  type ParameterSchema,
  type CTManifest,
  CTP_VERSION,
} from '@conveniencepro/ctp-core';

// =============================================================================
// OPENAPI EXPORTS
// =============================================================================

export {
  // Types
  type OpenAPISchema,
  type OpenAPIParameter,
  type OpenAPIRequestBody,
  type OpenAPIResponse,
  type OpenAPIOperation,
  type OpenAPIPathItem,
  type OpenAPIDocument,
  type OpenAPIGeneratorOptions,

  // Generators
  generateOpenAPI,
  generateOpenAPIYAML,
} from './openapi';

// =============================================================================
// AI TOOLS EXPORTS
// =============================================================================

export {
  // Types
  type AIToolParameter,
  type AIToolDefinition,
  type AIToolsManifest,
  type AIToolsGeneratorOptions,
  type CTManifestOptions,
  type ChatGPTPluginManifest,
  type ChatGPTPluginOptions,

  // Generators
  generateAIToolsManifest,
  generateAIToolsJSON,
  generateCTManifest,
  generateCTManifestJSON,
  generateChatGPTPlugin,
  generateChatGPTPluginJSON,
} from './ai-tools';

// =============================================================================
// LLMS.TXT EXPORTS
// =============================================================================

export {
  // Types
  type LLMsTxtGeneratorOptions,

  // Generators
  generateLLMsTxt,
  generateLLMsFullTxt,
  generateToolsMarkdown,
} from './llms-txt';

// =============================================================================
// CONVENIENCE FUNCTIONS
// =============================================================================

import { ToolDefinition } from '@conveniencepro/ctp-core';
import { generateOpenAPI, generateOpenAPIYAML, OpenAPIGeneratorOptions } from './openapi';
import { generateAIToolsManifest, generateCTManifest, AIToolsGeneratorOptions, CTManifestOptions } from './ai-tools';
import { generateLLMsTxt, generateLLMsFullTxt, LLMsTxtGeneratorOptions } from './llms-txt';

/**
 * Combined options for generating all discovery files
 */
export interface DiscoveryOptions {
  /** Base URL for all endpoints */
  baseUrl?: string;
  /** Service name */
  name?: string;
  /** Service description */
  description?: string;
  /** Path prefix for tool endpoints */
  pathPrefix?: string;
  /** Include examples in output */
  includeExamples?: boolean;
  /** OpenAPI-specific options */
  openapi?: OpenAPIGeneratorOptions;
  /** AI Tools-specific options */
  aiTools?: AIToolsGeneratorOptions;
  /** LLMs.txt-specific options */
  llmsTxt?: LLMsTxtGeneratorOptions;
  /** CTP Manifest-specific options */
  ctManifest?: CTManifestOptions;
}

/**
 * Generated discovery files
 */
export interface DiscoveryFiles {
  /** OpenAPI 3.1 specification (JSON) */
  openapiJson: string;
  /** OpenAPI 3.1 specification (YAML) */
  openapiYaml: string;
  /** AI Tools manifest (JSON) */
  aiToolsJson: string;
  /** CTP manifest (JSON) */
  ctManifestJson: string;
  /** LLMs.txt (concise) */
  llmsTxt: string;
  /** LLMs-full.txt (detailed) */
  llmsFullTxt: string;
}

/**
 * Generate all discovery files at once
 */
export function generateAllDiscoveryFiles(
  tools: ToolDefinition[],
  options: DiscoveryOptions = {}
): DiscoveryFiles {
  const {
    baseUrl = 'https://conveniencepro.cc',
    name = 'ConveniencePro',
    description = 'Browser-native utility tools',
    pathPrefix = '/run',
    includeExamples = true,
    openapi = {},
    aiTools = {},
    llmsTxt = {},
    ctManifest = {},
  } = options;

  // Merge shared options
  const sharedOpenapiOptions: OpenAPIGeneratorOptions = {
    baseUrl,
    title: `${name} Tools API`,
    description,
    pathPrefix,
    includeExamples,
    ...openapi,
  };

  const sharedAiToolsOptions: AIToolsGeneratorOptions = {
    baseUrl,
    name,
    description,
    pathPrefix,
    includeExamples,
    ...aiTools,
  };

  const sharedLlmsTxtOptions: LLMsTxtGeneratorOptions = {
    baseUrl,
    name,
    description,
    pathPrefix,
    includeExamples,
    ...llmsTxt,
  };

  const sharedCtManifestOptions: CTManifestOptions = {
    providerName: name,
    providerUrl: baseUrl,
    providerDescription: description,
    baseUrl: `${baseUrl}${pathPrefix}`,
    openapiUrl: `${baseUrl}/.well-known/openapi.yaml`,
    aiToolsUrl: `${baseUrl}/.well-known/ai-tools.json`,
    llmsTxtUrl: `${baseUrl}/llms.txt`,
    ...ctManifest,
  };

  // Generate all files
  const openapiDoc = generateOpenAPI(tools, sharedOpenapiOptions);
  const aiToolsManifest = generateAIToolsManifest(tools, sharedAiToolsOptions);
  const ctManifestDoc = generateCTManifest(tools, sharedCtManifestOptions);

  return {
    openapiJson: JSON.stringify(openapiDoc, null, 2),
    openapiYaml: generateOpenAPIYAML(tools, sharedOpenapiOptions),
    aiToolsJson: JSON.stringify(aiToolsManifest, null, 2),
    ctManifestJson: JSON.stringify(ctManifestDoc, null, 2),
    llmsTxt: generateLLMsTxt(tools, sharedLlmsTxtOptions),
    llmsFullTxt: generateLLMsFullTxt(tools, { ...sharedLlmsTxtOptions, fullDetails: true }),
  };
}

/**
 * Get recommended file paths for discovery files
 */
export function getRecommendedFilePaths(): Record<keyof DiscoveryFiles, string> {
  return {
    openapiJson: '.well-known/openapi.json',
    openapiYaml: '.well-known/openapi.yaml',
    aiToolsJson: '.well-known/ai-tools.json',
    ctManifestJson: '.well-known/ctp-manifest.json',
    llmsTxt: 'llms.txt',
    llmsFullTxt: 'llms-full.txt',
  };
}
