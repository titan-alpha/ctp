/**
 * @conveniencepro/ctp-runtime
 *
 * Dual execution runtime for the ConveniencePro Tool Protocol.
 * Provides both browser (client) and Node.js (server) runtimes.
 *
 * @packageDocumentation
 * @module @conveniencepro/ctp-runtime
 * @version 1.0.0
 */

// =============================================================================
// RE-EXPORT CORE TYPES
// =============================================================================

export {
  // Types
  type ToolDefinition,
  type ParameterSchema,
  type ToolResult,
  type ToolFunction,
  type NormalizedParams,
  type ToolParams,
  type ToolRegistry,
  type ToolRegistryEntry,

  // Functions
  success,
  failure,
  validateToolDefinition,
  validateParameters,
  normalizeParams,
} from '@conveniencepro/ctp-core';

// =============================================================================
// REGISTRY EXPORTS
// =============================================================================

export {
  // Registry creation
  createRegistry,
  getGlobalRegistry,
  resetGlobalRegistry,

  // Convenience functions
  registerTool,
  executeTool,
  getTool,
  hasTool,
  listTools,
  getAllDefinitions,

  // Batch execution
  type BatchRequest,
  type BatchResult,
  executeBatch,
  executeSequential,

  // Tool builder
  ToolBuilder,
  tool,
} from './registry';

// =============================================================================
// ENVIRONMENT-AGNOSTIC UTILITIES
// =============================================================================

/**
 * Detect the current runtime environment
 */
export function detectEnvironment(): 'browser' | 'node' | 'unknown' {
  if (typeof window !== 'undefined' && typeof window.document !== 'undefined') {
    return 'browser';
  }
  if (typeof process !== 'undefined' && process.versions?.node) {
    return 'node';
  }
  return 'unknown';
}

/**
 * Check if running in browser
 */
export function isBrowser(): boolean {
  return detectEnvironment() === 'browser';
}

/**
 * Check if running in Node.js
 */
export function isNode(): boolean {
  return detectEnvironment() === 'node';
}

// =============================================================================
// UNIVERSAL UTILITIES (work in both environments)
// =============================================================================

/**
 * URL encode text (works in both environments)
 */
export function urlEncode(text: string): string {
  return encodeURIComponent(text);
}

/**
 * URL decode text (works in both environments)
 */
export function urlDecode(input: string): string {
  return decodeURIComponent(input);
}

/**
 * HTML encode (works in both environments)
 */
export function htmlEncode(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * HTML decode (works in both environments)
 */
export function htmlDecode(input: string): string {
  return input
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/');
}

/**
 * Validate UUID format (works in both environments)
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Format JSON (works in both environments)
 */
export function formatJSON(json: string, indent = 2): import('@conveniencepro/ctp-core').ToolResult {
  const { success, failure } = require('@conveniencepro/ctp-core');
  try {
    const parsed = JSON.parse(json);
    const formatted = JSON.stringify(parsed, null, indent);
    return success({
      formatted,
      valid: true,
      type: Array.isArray(parsed) ? 'array' : typeof parsed,
    });
  } catch (e) {
    return failure(`Invalid JSON: ${e instanceof Error ? e.message : 'Unknown error'}`);
  }
}

/**
 * Minify JSON (works in both environments)
 */
export function minifyJSON(json: string): import('@conveniencepro/ctp-core').ToolResult {
  const { success, failure } = require('@conveniencepro/ctp-core');
  try {
    const parsed = JSON.parse(json);
    const minified = JSON.stringify(parsed);
    return success({
      minified,
      originalLength: json.length,
      minifiedLength: minified.length,
    });
  } catch (e) {
    return failure(`Invalid JSON: ${e instanceof Error ? e.message : 'Unknown error'}`);
  }
}

/**
 * Text statistics (works in both environments)
 */
export function getTextStats(text: string): Record<string, number> {
  const lines = text.split('\n');
  const words = text.trim().split(/\s+/).filter(w => w.length > 0);

  return {
    characters: text.length,
    charactersNoSpaces: text.replace(/\s/g, '').length,
    words: words.length,
    lines: lines.length,
  };
}

/**
 * Case conversion types
 */
export type CaseType =
  | 'upper'
  | 'lower'
  | 'title'
  | 'sentence'
  | 'camel'
  | 'pascal'
  | 'snake'
  | 'kebab'
  | 'constant';

/**
 * Convert text case (works in both environments)
 */
export function convertCase(text: string, to: CaseType): string {
  const words = text
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]/g, ' ')
    .toLowerCase()
    .split(/\s+/)
    .filter(w => w.length > 0);

  switch (to) {
    case 'upper':
      return text.toUpperCase();
    case 'lower':
      return text.toLowerCase();
    case 'title':
      return words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    case 'sentence':
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    case 'camel':
      return words
        .map((w, i) => (i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1)))
        .join('');
    case 'pascal':
      return words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
    case 'snake':
      return words.join('_');
    case 'kebab':
      return words.join('-');
    case 'constant':
      return words.join('_').toUpperCase();
    default:
      return text;
  }
}

// =============================================================================
// RUNTIME FACTORY
// =============================================================================

/**
 * Runtime configuration
 */
export interface RuntimeConfig {
  /** Timeout for operations (ms) */
  timeout?: number;
  /** Enable debug mode */
  debug?: boolean;
}

/**
 * Create a runtime appropriate for the current environment
 */
export function createRuntime(config?: RuntimeConfig) {
  const env = detectEnvironment();

  if (env === 'browser') {
    const { createClientRuntime } = require('./client');
    return createClientRuntime(config);
  }

  if (env === 'node') {
    const { createServerRuntime } = require('./server');
    return createServerRuntime(config);
  }

  throw new Error('Unknown runtime environment');
}
