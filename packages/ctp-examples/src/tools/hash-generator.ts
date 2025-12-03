/**
 * Hash Generator Tool
 *
 * Example demonstrating async operations with Web Crypto API.
 * Shows multiple algorithm support and output format options.
 */

import type { ToolDefinition, ToolFunction, ToolResult } from '@conveniencepro/ctp-core';

/**
 * Tool result data type
 */
interface HashResult {
  hash: string;
  algorithm: string;
  format: string;
  inputLength: number;
}

/**
 * Supported hash algorithms
 */
type HashAlgorithm = 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512';

/**
 * Output formats
 */
type OutputFormat = 'hex' | 'base64';

/**
 * Tool definition
 */
export const hashGeneratorDefinition: ToolDefinition = {
  id: 'hash-generator',
  name: 'Hash Generator',
  description: 'Generate cryptographic hashes using SHA-1, SHA-256, SHA-384, or SHA-512. Supports hex and Base64 output formats.',
  category: 'generators',
  tags: ['hash', 'sha256', 'sha512', 'checksum', 'crypto'],
  method: 'POST',
  parameters: [
    {
      name: 'input',
      type: 'textarea',
      label: 'Input Text',
      description: 'Text to hash',
      required: true,
      placeholder: 'Enter text to hash',
      validation: {
        minLength: 1,
        maxLength: 1000000,
      },
    },
    {
      name: 'algorithm',
      type: 'select',
      label: 'Algorithm',
      description: 'Hash algorithm to use',
      required: false,
      defaultValue: 'SHA-256',
      options: [
        { value: 'SHA-1', label: 'SHA-1', description: '160-bit (not secure, legacy only)' },
        { value: 'SHA-256', label: 'SHA-256', description: '256-bit (recommended)' },
        { value: 'SHA-384', label: 'SHA-384', description: '384-bit' },
        { value: 'SHA-512', label: 'SHA-512', description: '512-bit (strongest)' },
      ],
      aiHint: 'Use SHA-256 for general purposes. SHA-1 is deprecated for security.',
    },
    {
      name: 'format',
      type: 'select',
      label: 'Output Format',
      description: 'How to format the hash output',
      required: false,
      defaultValue: 'hex',
      options: [
        { value: 'hex', label: 'Hexadecimal', description: 'Lowercase hex string' },
        { value: 'base64', label: 'Base64', description: 'Base64 encoded string' },
      ],
    },
  ],
  outputDescription: 'Cryptographic hash of the input text',
  example: {
    input: {
      input: 'hello world',
      algorithm: 'SHA-256',
      format: 'hex',
    },
    output: {
      hash: 'b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9',
      algorithm: 'SHA-256',
      format: 'hex',
      inputLength: 11,
    },
    description: 'Generate SHA-256 hash of "hello world"',
  },
  version: '1.0.0',
  icon: '🔐',
  keywords: ['checksum', 'digest', 'fingerprint', 'integrity'],
  relatedTools: ['hmac-generator', 'uuid-generator'],
  aiInstructions: 'Use SHA-256 for most use cases. SHA-1 should only be used for legacy compatibility. SHA-512 provides the highest security but longer output.',
  executionMode: 'client',
};

/**
 * Generate hash using Web Crypto API
 */
async function generateHash(
  input: string,
  algorithm: HashAlgorithm,
  format: OutputFormat
): Promise<string> {
  // Encode input as UTF-8
  const encoder = new TextEncoder();
  const data = encoder.encode(input);

  // Generate hash
  const hashBuffer = await crypto.subtle.digest(algorithm, data);

  // Convert to desired format
  const hashArray = new Uint8Array(hashBuffer);

  if (format === 'base64') {
    let binary = '';
    hashArray.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    return btoa(binary);
  }

  // Hex format
  return Array.from(hashArray)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Tool implementation (async)
 */
export const hashGeneratorFn: ToolFunction<HashResult> = async (
  params
): Promise<ToolResult<HashResult>> => {
  const startTime = performance.now();

  // Extract parameters
  const input = params.input as string;
  const algorithm = (params.algorithm as HashAlgorithm) || 'SHA-256';
  const format = (params.format as OutputFormat) || 'hex';

  // Validate input
  if (!input || typeof input !== 'string') {
    return {
      success: false,
      error: 'Input text is required',
      errorCode: 'MISSING_REQUIRED',
    };
  }

  // Validate algorithm
  const validAlgorithms: HashAlgorithm[] = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];
  if (!validAlgorithms.includes(algorithm)) {
    return {
      success: false,
      error: `Invalid algorithm. Must be one of: ${validAlgorithms.join(', ')}`,
      errorCode: 'INVALID_INPUT',
    };
  }

  try {
    const hash = await generateHash(input, algorithm, format);
    const executionTime = performance.now() - startTime;

    return {
      success: true,
      data: {
        hash,
        algorithm,
        format,
        inputLength: input.length,
      },
      metadata: {
        executionTime,
        inputSize: input.length,
        outputSize: hash.length,
        warnings: algorithm === 'SHA-1'
          ? ['SHA-1 is deprecated for security purposes. Consider using SHA-256.']
          : undefined,
      },
    };
  } catch (e) {
    const error = e as Error;
    return {
      success: false,
      error: `Hash generation failed: ${error.message}`,
      errorCode: 'EXECUTION_ERROR',
    };
  }
};

export default {
  definition: hashGeneratorDefinition,
  fn: hashGeneratorFn,
};
