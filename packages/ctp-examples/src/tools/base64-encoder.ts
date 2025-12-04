/**
 * Base64 Encoder/Decoder Tool
 *
 * Example demonstrating bidirectional operations with select parameter.
 */

import type { ToolDefinition, ToolFunction, ToolResult } from '@conveniencepro/ctp-core';

/**
 * Tool result data type
 */
interface Base64Result {
  output: string;
  mode: 'encode' | 'decode';
  inputLength: number;
  outputLength: number;
}

/**
 * Tool definition
 */
export const base64EncoderDefinition: ToolDefinition = {
  id: 'base64-encoder',
  name: 'Base64 Encoder/Decoder',
  description: 'Encode text to Base64 or decode Base64 back to text. Supports UTF-8 encoding for international characters.',
  category: 'encoders',
  tags: ['base64', 'encode', 'decode', 'text', 'binary'],
  method: 'POST',
  parameters: [
    {
      name: 'input',
      type: 'textarea',
      label: 'Input',
      description: 'Text to encode or Base64 string to decode',
      required: true,
      placeholder: 'Hello, World!',
      minLength: 1,
      maxLength: 500000,
    },
    {
      name: 'mode',
      type: 'select',
      label: 'Mode',
      description: 'Operation to perform',
      required: false,
      default: 'encode',
      options: [
        { value: 'encode', label: 'Encode', description: 'Convert text to Base64' },
        { value: 'decode', label: 'Decode', description: 'Convert Base64 to text' },
      ],
    },
    {
      name: 'urlSafe',
      type: 'boolean',
      label: 'URL Safe',
      description: 'Use URL-safe Base64 variant (replaces +/ with -_)',
      required: false,
      default: false,
    },
  ],
  outputDescription: 'Encoded Base64 string or decoded text',
  example: {
    input: {
      input: 'Hello, World!',
      mode: 'encode',
      urlSafe: false,
    },
    output: {
      output: 'SGVsbG8sIFdvcmxkIQ==',
      mode: 'encode',
      inputLength: 13,
      outputLength: 20,
    },
    name: 'Encode a simple greeting to Base64',
  },
  version: '1.0.0',
  icon: '🔤',
  relatedTools: ['url-encoder', 'hex-encoder'],
  executionMode: 'client',
};

/**
 * Encode string to Base64 (browser-compatible)
 */
function encodeBase64(str: string, urlSafe: boolean): string {
  // Handle UTF-8 encoding
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  let result = btoa(binary);

  if (urlSafe) {
    result = result.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  }

  return result;
}

/**
 * Decode Base64 to string (browser-compatible)
 */
function decodeBase64(str: string, urlSafe: boolean): string {
  let input = str;

  if (urlSafe) {
    // Restore standard Base64 characters
    input = input.replace(/-/g, '+').replace(/_/g, '/');
    // Add padding if needed
    const padding = 4 - (input.length % 4);
    if (padding !== 4) {
      input += '='.repeat(padding);
    }
  }

  const binary = atob(input);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return new TextDecoder().decode(bytes);
}

/**
 * Tool implementation
 */
export const base64EncoderFn: ToolFunction<Base64Result> = (
  params
): ToolResult<Base64Result> => {
  const startTime = performance.now();

  // Extract parameters
  const input = params.input as string;
  const mode = (params.mode as 'encode' | 'decode') || 'encode';
  const urlSafe = params.urlSafe === 'true' || Boolean(params.urlSafe);

  // Validate input
  if (!input || typeof input !== 'string') {
    return {
      success: false,
      error: 'Input is required',
      errorCode: 'MISSING_REQUIRED',
    };
  }

  try {
    let output: string;

    if (mode === 'encode') {
      output = encodeBase64(input, urlSafe);
    } else {
      output = decodeBase64(input, urlSafe);
    }

    const executionTime = performance.now() - startTime;

    return {
      success: true,
      data: {
        output,
        mode,
        inputLength: input.length,
        outputLength: output.length,
      },
      metadata: {
        executionTime,
        inputSize: input.length,
        outputSize: output.length,
      },
    };
  } catch (e) {
    const error = e as Error;
    return {
      success: false,
      error: `${mode === 'decode' ? 'Invalid Base64 input' : 'Encoding failed'}: ${error.message}`,
      errorCode: 'INVALID_INPUT',
    };
  }
};

export default {
  definition: base64EncoderDefinition,
  fn: base64EncoderFn,
};
