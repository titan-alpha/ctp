# Hash Generator Tool

Reference implementation of an async CTP tool using Web Crypto API.

## Overview

| Property | Value |
|----------|-------|
| **ID** | `hash-generator` |
| **Category** | `generators` |
| **Execution Mode** | `client` |
| **Method** | `POST` |

## Description

Generate cryptographic hashes using SHA-1, SHA-256, SHA-384, or SHA-512. Supports hexadecimal and Base64 output formats.

## Parameters

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `input` | `textarea` | Yes | - | Text to hash |
| `algorithm` | `select` | No | `SHA-256` | Hash algorithm |
| `format` | `select` | No | `hex` | Output format |

### Algorithm Options

| Value | Bits | Security | Use Case |
|-------|------|----------|----------|
| `SHA-1` | 160 | ❌ Deprecated | Legacy only |
| `SHA-256` | 256 | ✅ Recommended | General use |
| `SHA-384` | 384 | ✅ Strong | Higher security |
| `SHA-512` | 512 | ✅ Strongest | Maximum security |

### Format Options

| Value | Description | Example |
|-------|-------------|---------|
| `hex` | Lowercase hexadecimal | `b94d27b9...` |
| `base64` | Base64 encoded | `uU0nuZ...` |

## Example

**Input:**
```json
{
  "input": "hello world",
  "algorithm": "SHA-256",
  "format": "hex"
}
```

**Output:**
```json
{
  "success": true,
  "data": {
    "hash": "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9",
    "algorithm": "SHA-256",
    "format": "hex",
    "inputLength": 11
  },
  "metadata": {
    "executionTime": 1.2,
    "warnings": null
  }
}
```

**With SHA-1 (warning):**
```json
{
  "success": true,
  "data": {
    "hash": "2aae6c35c94fcfb415dbe95f408b9ce91ee846ed",
    "algorithm": "SHA-1",
    "format": "hex",
    "inputLength": 11
  },
  "metadata": {
    "warnings": ["SHA-1 is deprecated for security purposes"]
  }
}
```

## Implementation

```typescript
import type { ToolDefinition, ToolFunction, ToolResult } from '@conveniencepro/ctp-core';

interface HashGeneratorResult {
  hash: string;
  algorithm: string;
  format: string;
  inputLength: number;
}

type HashAlgorithm = 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512';
type OutputFormat = 'hex' | 'base64';

export const hashGeneratorDefinition: ToolDefinition = {
  id: 'hash-generator',
  name: 'Hash Generator',
  description: 'Generate cryptographic hashes using SHA algorithms.',
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
    },
    {
      name: 'algorithm',
      type: 'select',
      label: 'Algorithm',
      description: 'Hash algorithm',
      required: false,
      defaultValue: 'SHA-256',
      options: [
        { value: 'SHA-1', label: 'SHA-1', description: 'Legacy (not secure)' },
        { value: 'SHA-256', label: 'SHA-256', description: 'Recommended' },
        { value: 'SHA-384', label: 'SHA-384' },
        { value: 'SHA-512', label: 'SHA-512', description: 'Strongest' },
      ],
      aiHint: 'Use SHA-256 unless user specifies otherwise',
    },
    {
      name: 'format',
      type: 'select',
      label: 'Output Format',
      description: 'Hash output format',
      required: false,
      defaultValue: 'hex',
      options: [
        { value: 'hex', label: 'Hexadecimal' },
        { value: 'base64', label: 'Base64' },
      ],
    },
  ],
  outputDescription: 'Cryptographic hash of the input',
  example: {
    input: { input: 'hello', algorithm: 'SHA-256', format: 'hex' },
    output: {
      hash: '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
      algorithm: 'SHA-256',
      format: 'hex',
      inputLength: 5,
    },
  },
  executionMode: 'client',
  aiInstructions: 'Use SHA-256 by default. Warn if user requests SHA-1.',
};

// ASYNC function - uses Web Crypto API
export const hashGeneratorFn: ToolFunction<HashGeneratorResult> = async (params) => {
  const startTime = performance.now();
  const input = params.input as string;
  const algorithm = (params.algorithm as HashAlgorithm) || 'SHA-256';
  const format = (params.format as OutputFormat) || 'hex';

  if (!input) {
    return { success: false, error: 'Input text is required', errorCode: 'MISSING_REQUIRED' };
  }

  try {
    // Encode input as UTF-8
    const encoder = new TextEncoder();
    const data = encoder.encode(input);

    // Generate hash using Web Crypto
    const hashBuffer = await crypto.subtle.digest(algorithm, data);
    const hashArray = new Uint8Array(hashBuffer);

    // Format output
    let hash: string;
    if (format === 'base64') {
      let binary = '';
      hashArray.forEach(byte => { binary += String.fromCharCode(byte); });
      hash = btoa(binary);
    } else {
      hash = Array.from(hashArray).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    return {
      success: true,
      data: { hash, algorithm, format, inputLength: input.length },
      metadata: {
        executionTime: performance.now() - startTime,
        warnings: algorithm === 'SHA-1'
          ? ['SHA-1 is deprecated for security purposes']
          : undefined,
      },
    };
  } catch (e) {
    return {
      success: false,
      error: `Hash generation failed: ${(e as Error).message}`,
      errorCode: 'EXECUTION_ERROR',
    };
  }
};

export default { definition: hashGeneratorDefinition, fn: hashGeneratorFn };
```

## Key Patterns

### Async Tool Function

This tool demonstrates async execution with Web Crypto:

```typescript
export const hashGeneratorFn: ToolFunction<HashGeneratorResult> = async (params) => {
  // ...
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  // ...
};
```

### Conditional Warnings

Metadata can include warnings without failing:

```typescript
metadata: {
  warnings: algorithm === 'SHA-1'
    ? ['SHA-1 is deprecated for security purposes']
    : undefined,
}
```

### AI Hints for Algorithm Selection

Guide AI models to make good choices:

```typescript
aiHint: 'Use SHA-256 unless user specifies otherwise'
```

## Web Crypto API

This tool uses the browser's native cryptographic functions:

```typescript
// Available in all modern browsers
crypto.subtle.digest(algorithm, data)
```

**Supported Algorithms:**
- `SHA-1` (160 bits)
- `SHA-256` (256 bits)
- `SHA-384` (384 bits)
- `SHA-512` (512 bits)

**Note:** MD5 is NOT available in Web Crypto. Use a library if needed.

## Error Handling

| Error Code | Cause |
|------------|-------|
| `MISSING_REQUIRED` | `input` not provided |
| `EXECUTION_ERROR` | Web Crypto failure |

## Related Tools

- `hmac-generator` - HMAC with secret key
- `checksum-calculator` - File checksums
- `password-hasher` - Password hashing (bcrypt)
