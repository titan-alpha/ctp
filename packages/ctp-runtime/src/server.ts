/**
 * ConveniencePro Tool Protocol (CTP) - Server Runtime
 *
 * Node.js-based tool execution runtime.
 * Uses Node.js APIs (crypto, Buffer, etc.) for processing.
 *
 * @module @conveniencepro/ctp-runtime/server
 */

import {
  ToolResult,
  success,
  failure,
} from '@conveniencepro/ctp-core';

// =============================================================================
// ENVIRONMENT DETECTION
// =============================================================================

/**
 * Check if running in Node.js environment
 */
export function isNode(): boolean {
  return (
    typeof process !== 'undefined' &&
    process.versions != null &&
    process.versions.node != null
  );
}

/**
 * Assert Node.js environment
 */
export function assertNode(): void {
  if (!isNode()) {
    throw new Error('This function requires a Node.js environment');
  }
}

/**
 * Get Node.js version
 */
export function getNodeVersion(): string | null {
  if (!isNode()) return null;
  return process.versions.node;
}

// =============================================================================
// DYNAMIC IMPORTS (to avoid bundler issues)
// =============================================================================

/**
 * Dynamically import Node.js crypto module
 */
async function getCrypto(): Promise<typeof import('crypto')> {
  assertNode();
  return await import('crypto');
}

// =============================================================================
// ENCODING UTILITIES (Server)
// =============================================================================

/**
 * Encode text to Base64 (Node.js)
 */
export function base64Encode(text: string, urlSafe = false): string {
  assertNode();
  let encoded = Buffer.from(text, 'utf-8').toString('base64');

  if (urlSafe) {
    encoded = encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  }

  return encoded;
}

/**
 * Decode Base64 to text (Node.js)
 */
export function base64Decode(input: string): string {
  assertNode();

  // Handle URL-safe base64
  let normalized = input.replace(/-/g, '+').replace(/_/g, '/');

  // Add padding if needed
  while (normalized.length % 4) {
    normalized += '=';
  }

  return Buffer.from(normalized, 'base64').toString('utf-8');
}

/**
 * URL encode text
 */
export function urlEncode(text: string): string {
  return encodeURIComponent(text);
}

/**
 * URL decode text
 */
export function urlDecode(input: string): string {
  return decodeURIComponent(input);
}

/**
 * HTML encode (escape special characters)
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
 * HTML decode (unescape entities)
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

// =============================================================================
// HASHING UTILITIES (Server - Node.js Crypto)
// =============================================================================

/**
 * Supported hash algorithms (Node.js naming)
 */
export type HashAlgorithm = 'sha1' | 'sha256' | 'sha384' | 'sha512' | 'md5';

/**
 * Hash text using Node.js crypto
 */
export async function hash(text: string, algorithm: HashAlgorithm): Promise<string> {
  const crypto = await getCrypto();
  return crypto.createHash(algorithm).update(text, 'utf-8').digest('hex');
}

/**
 * SHA-256 hash
 */
export async function sha256(text: string): Promise<string> {
  return hash(text, 'sha256');
}

/**
 * SHA-512 hash
 */
export async function sha512(text: string): Promise<string> {
  return hash(text, 'sha512');
}

/**
 * SHA-1 hash (deprecated for security)
 */
export async function sha1(text: string): Promise<string> {
  return hash(text, 'sha1');
}

/**
 * MD5 hash (not secure for cryptographic purposes)
 */
export async function md5(text: string): Promise<string> {
  return hash(text, 'md5');
}

/**
 * Synchronous hash (for SSR where async isn't ideal)
 */
export function hashSync(text: string, algorithm: HashAlgorithm): string {
  assertNode();
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const crypto = require('crypto');
  return crypto.createHash(algorithm).update(text, 'utf-8').digest('hex');
}

// =============================================================================
// UUID GENERATION (Server)
// =============================================================================

/**
 * Generate a UUID v4 using Node.js crypto
 */
export async function generateUUID(): Promise<string> {
  const crypto = await getCrypto();

  // Use crypto.randomUUID if available (Node 14.17+)
  if (typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  // Fallback to manual generation
  const bytes = crypto.randomBytes(16);

  // Set version (4) and variant (RFC 4122)
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = bytes.toString('hex');
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32),
  ].join('-');
}

/**
 * Synchronous UUID generation
 */
export function generateUUIDSync(): string {
  assertNode();
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const crypto = require('crypto');

  if (typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  const bytes = crypto.randomBytes(16);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = bytes.toString('hex');
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32),
  ].join('-');
}

/**
 * Validate UUID format
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

// =============================================================================
// JSON UTILITIES (Server)
// =============================================================================

/**
 * Format JSON with indentation
 */
export function formatJSON(json: string, indent = 2): ToolResult {
  try {
    const parsed = JSON.parse(json);
    const formatted = JSON.stringify(parsed, null, indent);
    return success({
      formatted,
      valid: true,
      type: Array.isArray(parsed) ? 'array' : typeof parsed,
      ...(typeof parsed === 'object' && parsed !== null
        ? { keys: Object.keys(parsed).length }
        : {}),
    });
  } catch (e) {
    return failure(`Invalid JSON: ${e instanceof Error ? e.message : 'Unknown error'}`);
  }
}

/**
 * Minify JSON
 */
export function minifyJSON(json: string): ToolResult {
  try {
    const parsed = JSON.parse(json);
    const minified = JSON.stringify(parsed);
    return success({
      minified,
      originalLength: json.length,
      minifiedLength: minified.length,
      reduction: `${Math.round((1 - minified.length / json.length) * 100)}%`,
    });
  } catch (e) {
    return failure(`Invalid JSON: ${e instanceof Error ? e.message : 'Unknown error'}`);
  }
}

/**
 * Validate JSON
 */
export function validateJSON(json: string): ToolResult {
  try {
    const parsed = JSON.parse(json);
    return success({
      valid: true,
      type: Array.isArray(parsed) ? 'array' : typeof parsed,
      ...(typeof parsed === 'object' && parsed !== null
        ? {
            keys: Object.keys(parsed).length,
            depth: getJSONDepth(parsed),
          }
        : {}),
    });
  } catch (e) {
    return failure(`Invalid JSON: ${e instanceof Error ? e.message : 'Unknown error'}`);
  }
}

/**
 * Get depth of JSON structure
 */
function getJSONDepth(obj: unknown, depth = 0): number {
  if (typeof obj !== 'object' || obj === null) {
    return depth;
  }

  const values = Array.isArray(obj) ? obj : Object.values(obj);
  if (values.length === 0) {
    return depth + 1;
  }

  return Math.max(...values.map(v => getJSONDepth(v, depth + 1)));
}

// =============================================================================
// TEXT UTILITIES (Server)
// =============================================================================

/**
 * Get text statistics
 */
export function getTextStats(text: string): ToolResult {
  const lines = text.split('\n');
  const words = text.trim().split(/\s+/).filter(w => w.length > 0);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);

  return success({
    characters: text.length,
    charactersNoSpaces: text.replace(/\s/g, '').length,
    words: words.length,
    sentences: sentences.length,
    paragraphs: paragraphs.length,
    lines: lines.length,
    averageWordLength: words.length > 0
      ? Math.round((words.reduce((sum, w) => sum + w.length, 0) / words.length) * 10) / 10
      : 0,
  });
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
 * Convert text case
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
// SERVER RUNTIME CLASS
// =============================================================================

/**
 * Server runtime configuration
 */
export interface ServerRuntimeConfig {
  /** Timeout for async operations (ms) */
  timeout?: number;
  /** Enable debug logging */
  debug?: boolean;
}

/**
 * Server runtime instance
 */
export class ServerRuntime {
  private config: Required<ServerRuntimeConfig>;

  constructor(config: ServerRuntimeConfig = {}) {
    this.config = {
      timeout: config.timeout ?? 30000,
      debug: config.debug ?? false,
    };
  }

  /**
   * Check environment compatibility
   */
  checkEnvironment(): { compatible: boolean; nodeVersion: string | null } {
    return {
      compatible: isNode(),
      nodeVersion: getNodeVersion(),
    };
  }

  /**
   * Execute a function with timeout
   */
  async withTimeout<T>(
    fn: () => Promise<T>,
    timeout?: number
  ): Promise<T> {
    const ms = timeout ?? this.config.timeout;

    return Promise.race([
      fn(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`Operation timed out after ${ms}ms`)), ms)
      ),
    ]);
  }

  /**
   * Log debug message
   */
  debug(message: string, ...args: unknown[]): void {
    if (this.config.debug) {
      console.debug(`[CTP Server] ${message}`, ...args);
    }
  }
}

/**
 * Create a server runtime instance
 */
export function createServerRuntime(config?: ServerRuntimeConfig): ServerRuntime {
  return new ServerRuntime(config);
}

/**
 * Default server runtime
 */
export const serverRuntime = createServerRuntime();
