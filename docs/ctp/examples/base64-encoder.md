# Base64 Encoder/Decoder Tool

Reference implementation of a bidirectional CTP tool.

## Overview

| Property | Value |
|----------|-------|
| **ID** | `base64-encoder` |
| **Category** | `encoders` |
| **Execution Mode** | `client` |
| **Method** | `POST` |

## Description

Encode text to Base64 or decode Base64 back to text. Supports UTF-8 encoding and URL-safe variants.

## Parameters

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `input` | `textarea` | Yes | - | Text or Base64 string |
| `mode` | `select` | No | `encode` | Operation mode |
| `urlSafe` | `boolean` | No | `false` | Use URL-safe Base64 |

### Mode Options

| Value | Description |
|-------|-------------|
| `encode` | Convert text → Base64 |
| `decode` | Convert Base64 → text |

### URL-Safe Mode

When enabled (encode only):
- `+` becomes `-`
- `/` becomes `_`
- Padding `=` is removed

## Example

**Encode:**
```json
{
  "input": "Hello, World!",
  "mode": "encode"
}
```

**Output:**
```json
{
  "success": true,
  "data": {
    "output": "SGVsbG8sIFdvcmxkIQ==",
    "mode": "encode",
    "inputLength": 13,
    "outputLength": 20
  }
}
```

**Decode:**
```json
{
  "input": "SGVsbG8sIFdvcmxkIQ==",
  "mode": "decode"
}
```

**Output:**
```json
{
  "success": true,
  "data": {
    "output": "Hello, World!",
    "mode": "decode",
    "inputLength": 20,
    "outputLength": 13
  }
}
```

## Implementation

```typescript
import type { ToolDefinition, ToolFunction, ToolResult } from '@conveniencepro/ctp-core';

interface Base64Result {
  output: string;
  mode: 'encode' | 'decode';
  inputLength: number;
  outputLength: number;
}

export const base64EncoderDefinition: ToolDefinition = {
  id: 'base64-encoder',
  name: 'Base64 Encoder/Decoder',
  description: 'Encode text to Base64 or decode Base64 back to text.',
  category: 'encoders',
  tags: ['base64', 'encode', 'decode', 'text'],
  method: 'POST',
  parameters: [
    {
      name: 'input',
      type: 'textarea',
      label: 'Input',
      description: 'Text to encode or Base64 to decode',
      required: true,
    },
    {
      name: 'mode',
      type: 'select',
      label: 'Mode',
      description: 'Operation mode',
      required: false,
      defaultValue: 'encode',
      options: [
        { value: 'encode', label: 'Encode' },
        { value: 'decode', label: 'Decode' },
      ],
    },
    {
      name: 'urlSafe',
      type: 'boolean',
      label: 'URL Safe',
      description: 'Use URL-safe Base64',
      required: false,
      defaultValue: false,
      dependsOn: [{ field: 'mode', condition: 'equals', value: 'encode' }],
    },
  ],
  outputDescription: 'Encoded or decoded string',
  example: {
    input: { input: 'Hello', mode: 'encode' },
    output: { output: 'SGVsbG8=', mode: 'encode', inputLength: 5, outputLength: 8 },
  },
  executionMode: 'client',
};

function encodeBase64(str: string, urlSafe: boolean): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  bytes.forEach(byte => { binary += String.fromCharCode(byte); });
  let result = btoa(binary);
  if (urlSafe) {
    result = result.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  }
  return result;
}

function decodeBase64(str: string): string {
  let input = str.replace(/-/g, '+').replace(/_/g, '/');
  while (input.length % 4) input += '=';
  const binary = atob(input);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

export const base64EncoderFn: ToolFunction<Base64Result> = (params) => {
  const input = params.input as string;
  const mode = (params.mode as 'encode' | 'decode') || 'encode';
  const urlSafe = params.urlSafe === true || params.urlSafe === 'true';

  if (!input) {
    return { success: false, error: 'Input is required', errorCode: 'MISSING_REQUIRED' };
  }

  try {
    const output = mode === 'encode' ? encodeBase64(input, urlSafe) : decodeBase64(input);
    return {
      success: true,
      data: { output, mode, inputLength: input.length, outputLength: output.length },
    };
  } catch (e) {
    return {
      success: false,
      error: `${mode === 'decode' ? 'Invalid Base64' : 'Failed'}: ${(e as Error).message}`,
      errorCode: 'INVALID_INPUT',
    };
  }
};

export default { definition: base64EncoderDefinition, fn: base64EncoderFn };
```

## Key Patterns

### Bidirectional Operations

This tool demonstrates a single tool handling two opposite operations:

```typescript
options: [
  { value: 'encode', label: 'Encode' },
  { value: 'decode', label: 'Decode' },
]
```

### Conditional Parameters

The `urlSafe` parameter only appears when `mode` is `encode`:

```typescript
dependsOn: [{ field: 'mode', condition: 'equals', value: 'encode' }]
```

### UTF-8 Support

Proper handling of international characters:

```typescript
// Encode: TextEncoder handles UTF-8
const bytes = new TextEncoder().encode(str);

// Decode: TextDecoder restores UTF-8
return new TextDecoder().decode(bytes);
```

## Error Handling

| Error Code | Cause |
|------------|-------|
| `MISSING_REQUIRED` | `input` not provided |
| `INVALID_INPUT` | Invalid Base64 string (decode mode) |

## Related Tools

- `url-encoder` - URL encoding/decoding
- `html-encoder` - HTML entity encoding
- `hex-encoder` - Hexadecimal encoding
