/**
 * ConveniencePro Tool Protocol (CTP) - Client Runtime
 *
 * Browser-based tool execution runtime.
 * Uses Web APIs (Web Crypto, btoa/atob, etc.) for processing.
 *
 * @module @conveniencepro/ctp-runtime/client
 */

import {
  ToolResult,
  NormalizedParams,
  success,
  failure,
} from '@conveniencepro/ctp-core';

// =============================================================================
// ENVIRONMENT DETECTION
// =============================================================================

/**
 * Check if running in browser environment
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.document !== 'undefined';
}

/**
 * Check if Web Crypto API is available
 */
export function hasWebCrypto(): boolean {
  return (
    isBrowser() &&
    typeof window.crypto !== 'undefined' &&
    typeof window.crypto.subtle !== 'undefined'
  );
}

/**
 * Assert browser environment
 */
export function assertBrowser(): void {
  if (!isBrowser()) {
    throw new Error('This function requires a browser environment');
  }
}

// =============================================================================
// ENCODING UTILITIES (Browser)
// =============================================================================

/**
 * Encode text to Base64 (browser)
 */
export function base64Encode(text: string, urlSafe = false): string {
  assertBrowser();

  // Handle Unicode properly
  const encoded = btoa(unescape(encodeURIComponent(text)));

  if (urlSafe) {
    return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  }

  return encoded;
}

/**
 * Decode Base64 to text (browser)
 */
export function base64Decode(input: string): string {
  assertBrowser();

  // Handle URL-safe base64
  let normalized = input.replace(/-/g, '+').replace(/_/g, '/');

  // Add padding if needed
  while (normalized.length % 4) {
    normalized += '=';
  }

  return decodeURIComponent(escape(atob(normalized)));
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
// HASHING UTILITIES (Browser - Web Crypto)
// =============================================================================

/**
 * Supported hash algorithms
 */
export type HashAlgorithm = 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512';

/**
 * Hash text using Web Crypto API
 */
export async function hash(text: string, algorithm: HashAlgorithm): Promise<string> {
  if (!hasWebCrypto()) {
    throw new Error('Web Crypto API is not available');
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * SHA-256 hash
 */
export async function sha256(text: string): Promise<string> {
  return hash(text, 'SHA-256');
}

/**
 * SHA-512 hash
 */
export async function sha512(text: string): Promise<string> {
  return hash(text, 'SHA-512');
}

/**
 * SHA-1 hash (deprecated for security)
 */
export async function sha1(text: string): Promise<string> {
  return hash(text, 'SHA-1');
}

// =============================================================================
// UUID GENERATION (Browser)
// =============================================================================

/**
 * Generate a UUID v4 using crypto.randomUUID or fallback
 */
export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback implementation
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Validate UUID format
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Get UUID version
 */
export function getUUIDVersion(uuid: string): number | null {
  if (!isValidUUID(uuid)) return null;
  return parseInt(uuid.charAt(14), 16);
}

// =============================================================================
// JSON UTILITIES (Browser)
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
// TEXT UTILITIES (Browser)
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
  // Normalize: split into words
  const words = text
    .replace(/([a-z])([A-Z])/g, '$1 $2') // camelCase -> camel Case
    .replace(/[_-]/g, ' ')               // snake_case/kebab-case -> spaces
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
// CLIENT RUNTIME CLASS
// =============================================================================

/**
 * Client runtime configuration
 */
export interface ClientRuntimeConfig {
  /** Timeout for async operations (ms) */
  timeout?: number;
  /** Enable performance tracking */
  trackPerformance?: boolean;
}

/**
 * Client runtime instance
 */
export class ClientRuntime {
  private config: Required<ClientRuntimeConfig>;

  constructor(config: ClientRuntimeConfig = {}) {
    this.config = {
      timeout: config.timeout ?? 30000,
      trackPerformance: config.trackPerformance ?? false,
    };
  }

  /**
   * Check environment compatibility
   */
  checkEnvironment(): { compatible: boolean; features: Record<string, boolean> } {
    return {
      compatible: isBrowser(),
      features: {
        webCrypto: hasWebCrypto(),
        btoa: typeof btoa === 'function',
        textEncoder: typeof TextEncoder === 'function',
        randomUUID: typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function',
      },
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
   * Execute and track performance
   */
  async track<T>(
    name: string,
    fn: () => T | Promise<T>
  ): Promise<{ result: T; duration: number }> {
    const start = performance.now();
    const result = await fn();
    const duration = performance.now() - start;

    if (this.config.trackPerformance) {
      console.debug(`[CTP] ${name}: ${duration.toFixed(2)}ms`);
    }

    return { result, duration };
  }
}

/**
 * Create a client runtime instance
 */
export function createClientRuntime(config?: ClientRuntimeConfig): ClientRuntime {
  return new ClientRuntime(config);
}

/**
 * Default client runtime
 */
export const clientRuntime = createClientRuntime();
