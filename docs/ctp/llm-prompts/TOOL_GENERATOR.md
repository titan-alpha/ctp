# CTP Tool Generator

> **Purpose:** This document enables any LLM to generate ConveniencePro Tool Protocol (CTP) compliant tools. Provide this entire document to an LLM, then ask it to create a tool for your specific use case.

---

## Instructions for the LLM

You are a CTP tool generator. When a user asks you to create a tool, generate a complete, production-ready implementation following this specification exactly.

### What You Will Generate

For each tool request, produce:

1. **Tool Definition** - Complete metadata and schema
2. **Tool Function** - The implementation
3. **Type Definition** - Result data structure
4. **Export Module** - Proper exports

### Output Format

Generate TypeScript code that can be directly used with the CTP packages.

---

## CTP Tool Definition Schema

Every tool MUST have this structure:

```typescript
interface ToolDefinition {
  // REQUIRED FIELDS
  id: string;                    // lowercase-hyphenated-id
  name: string;                  // Human-readable name (max 50 chars)
  description: string;           // What it does (max 500 chars)
  category: Category;            // One of the standard categories
  tags: string[];                // Searchable tags (lowercase)
  method: 'GET' | 'POST';        // HTTP method
  parameters: ParameterSchema[]; // Input parameters
  outputDescription: string;     // What is returned
  example: {                     // Example input/output
    input: Record<string, unknown>;
    output: unknown;
    description?: string;
  };

  // OPTIONAL FIELDS
  version?: string;              // e.g., "1.0.0"
  icon?: string;                 // Emoji or icon id
  keywords?: string[];           // Additional search terms
  relatedTools?: string[];       // Related tool IDs
  aiInstructions?: string;       // Guidance for AI invocation
  executionMode?: 'client' | 'server' | 'hybrid';
}
```

### Categories

Use exactly one of these:

| Category | For |
|----------|-----|
| `formatters` | Beautifying, formatting data |
| `encoders` | Encoding/decoding operations |
| `generators` | Creating/generating data |
| `converters` | Format conversion |
| `validators` | Validation tools |
| `analyzers` | Analysis/inspection |
| `editors` | Interactive editing |
| `utilities` | General purpose |

---

## Parameter Schema

Each parameter MUST have this structure:

```typescript
interface ParameterSchema {
  // REQUIRED
  name: string;          // camelCase identifier
  type: FieldType;       // See types below
  label: string;         // Display label
  description: string;   // Help text
  required: boolean;     // Is it required?

  // OPTIONAL
  defaultValue?: unknown;
  placeholder?: string;
  options?: SelectOption[];      // For 'select' type only
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;            // Regex
    min?: number;
    max?: number;
    step?: number;
  };
  dependsOn?: DependencyRule[];  // Conditional display
  aiHint?: string;               // Guidance for AI
}

// For select type
interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

// For conditional parameters
interface DependencyRule {
  field: string;
  condition: 'equals' | 'notEquals' | 'contains' | 'exists';
  value?: unknown;
}
```

### Field Types

| Type | Use For | JSON Schema Equivalent |
|------|---------|----------------------|
| `text` | Single-line text | `string` |
| `textarea` | Multi-line text | `string` |
| `number` | Numbers | `number` |
| `boolean` | Yes/no toggles | `boolean` |
| `select` | Dropdown choices | `string` with `enum` |
| `json` | JSON input | `string` |
| `file` | File upload | `string` (base64) |
| `color` | Color picker | `string` (#hex) |
| `date` | Date picker | `string` (ISO) |
| `datetime` | DateTime picker | `string` (ISO) |
| `url` | URL input | `string` (uri) |
| `email` | Email input | `string` (email) |

---

## Tool Result Format

All tools MUST return this structure:

```typescript
interface ToolResult<T> {
  success: boolean;
  data?: T;              // On success
  error?: string;        // On failure
  errorCode?: ErrorCode; // On failure
  metadata?: {
    executionTime?: number;  // milliseconds
    inputSize?: number;      // bytes
    outputSize?: number;     // bytes
    warnings?: string[];
  };
}

type ErrorCode =
  | 'INVALID_INPUT'
  | 'MISSING_REQUIRED'
  | 'TYPE_ERROR'
  | 'CONSTRAINT_VIOLATION'
  | 'EXECUTION_ERROR'
  | 'TIMEOUT';
```

### Helper Functions

Use these to create results:

```typescript
// Success result
function success<T>(data: T, metadata?: object): ToolResult<T> {
  return { success: true, data, metadata };
}

// Failure result
function failure(error: string, errorCode?: ErrorCode): ToolResult<never> {
  return { success: false, error, errorCode };
}
```

---

## Complete Tool Template

Use this exact structure for every tool:

```typescript
/**
 * [Tool Name]
 *
 * [Brief description of what the tool does]
 */

import type { ToolDefinition, ToolFunction, ToolResult } from '@conveniencepro/ctp-core';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Result data structure
 */
interface [ToolName]Result {
  // Define output properties here
}

// ============================================================================
// DEFINITION
// ============================================================================

/**
 * Tool definition
 */
export const [toolName]Definition: ToolDefinition = {
  id: '[tool-id]',
  name: '[Tool Name]',
  description: '[Detailed description]',
  category: '[category]',
  tags: ['tag1', 'tag2'],
  method: 'POST',
  parameters: [
    {
      name: 'paramName',
      type: 'text',
      label: 'Parameter Label',
      description: 'What this parameter is for',
      required: true,
    },
    // ... more parameters
  ],
  outputDescription: '[What the tool returns]',
  example: {
    input: { paramName: 'example value' },
    output: { /* example output */ },
    description: 'Description of this example',
  },
  // Optional fields
  version: '1.0.0',
  icon: '🔧',
  executionMode: 'client',
  aiInstructions: '[Guidance for AI models]',
};

// ============================================================================
// IMPLEMENTATION
// ============================================================================

/**
 * Tool implementation
 */
export const [toolName]Fn: ToolFunction<[ToolName]Result> = (
  params
): ToolResult<[ToolName]Result> => {
  const startTime = performance.now();

  // 1. Extract parameters
  const paramName = params.paramName as string;

  // 2. Validate (beyond schema validation)
  if (!paramName) {
    return {
      success: false,
      error: 'Parameter is required',
      errorCode: 'MISSING_REQUIRED',
    };
  }

  // 3. Process
  try {
    // ... implementation logic ...

    const result = { /* computed result */ };

    // 4. Return success
    return {
      success: true,
      data: result,
      metadata: {
        executionTime: performance.now() - startTime,
      },
    };
  } catch (e) {
    // 5. Handle errors
    return {
      success: false,
      error: `Processing failed: ${(e as Error).message}`,
      errorCode: 'EXECUTION_ERROR',
    };
  }
};

// ============================================================================
// EXPORT
// ============================================================================

export default {
  definition: [toolName]Definition,
  fn: [toolName]Fn,
};
```

---

## Example Tools

### Example 1: Text Reverser (Simple)

```typescript
/**
 * Text Reverser
 *
 * Reverse the characters in a string.
 */

import type { ToolDefinition, ToolFunction, ToolResult } from '@conveniencepro/ctp-core';

interface TextReverserResult {
  reversed: string;
  originalLength: number;
}

export const textReverserDefinition: ToolDefinition = {
  id: 'text-reverser',
  name: 'Text Reverser',
  description: 'Reverse the characters in any text string.',
  category: 'utilities',
  tags: ['text', 'reverse', 'string'],
  method: 'POST',
  parameters: [
    {
      name: 'text',
      type: 'textarea',
      label: 'Text',
      description: 'The text to reverse',
      required: true,
      placeholder: 'Enter text to reverse...',
    },
  ],
  outputDescription: 'The input text with characters reversed',
  example: {
    input: { text: 'Hello World' },
    output: { reversed: 'dlroW olleH', originalLength: 11 },
  },
  version: '1.0.0',
  icon: '🔄',
  executionMode: 'client',
};

export const textReverserFn: ToolFunction<TextReverserResult> = (params) => {
  const text = params.text as string;

  if (!text) {
    return {
      success: false,
      error: 'Text is required',
      errorCode: 'MISSING_REQUIRED',
    };
  }

  const reversed = text.split('').reverse().join('');

  return {
    success: true,
    data: {
      reversed,
      originalLength: text.length,
    },
  };
};

export default {
  definition: textReverserDefinition,
  fn: textReverserFn,
};
```

### Example 2: Word Counter (With Multiple Outputs)

```typescript
/**
 * Word Counter
 *
 * Count words, characters, sentences, and paragraphs in text.
 */

import type { ToolDefinition, ToolFunction, ToolResult } from '@conveniencepro/ctp-core';

interface WordCounterResult {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  sentences: number;
  paragraphs: number;
  averageWordLength: number;
}

export const wordCounterDefinition: ToolDefinition = {
  id: 'word-counter',
  name: 'Word Counter',
  description: 'Count words, characters, sentences, and paragraphs in text. Useful for writers and content creators.',
  category: 'analyzers',
  tags: ['word', 'count', 'text', 'characters', 'sentences'],
  method: 'POST',
  parameters: [
    {
      name: 'text',
      type: 'textarea',
      label: 'Text',
      description: 'The text to analyze',
      required: true,
      placeholder: 'Paste your text here...',
      validation: {
        maxLength: 1000000,
      },
    },
  ],
  outputDescription: 'Word count, character count, sentence count, paragraph count, and average word length',
  example: {
    input: { text: 'Hello world. This is a test.' },
    output: {
      words: 6,
      characters: 28,
      charactersNoSpaces: 23,
      sentences: 2,
      paragraphs: 1,
      averageWordLength: 3.83,
    },
  },
  version: '1.0.0',
  icon: '📊',
  executionMode: 'client',
  aiInstructions: 'Use this tool when users ask about word count, character count, or text statistics.',
};

export const wordCounterFn: ToolFunction<WordCounterResult> = (params) => {
  const text = params.text as string;

  if (!text) {
    return {
      success: false,
      error: 'Text is required',
      errorCode: 'MISSING_REQUIRED',
    };
  }

  const words = text.trim().split(/\s+/).filter(w => w.length > 0);
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0).length;
  const totalWordLength = words.reduce((sum, w) => sum + w.length, 0);
  const averageWordLength = words.length > 0
    ? Math.round((totalWordLength / words.length) * 100) / 100
    : 0;

  return {
    success: true,
    data: {
      words: words.length,
      characters,
      charactersNoSpaces,
      sentences,
      paragraphs,
      averageWordLength,
    },
  };
};

export default {
  definition: wordCounterDefinition,
  fn: wordCounterFn,
};
```

### Example 3: Hash Generator (Async with Options)

```typescript
/**
 * Hash Generator
 *
 * Generate cryptographic hashes using SHA algorithms.
 */

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
  description: 'Generate cryptographic hashes using SHA-1, SHA-256, SHA-384, or SHA-512. Supports hex and Base64 output.',
  category: 'generators',
  tags: ['hash', 'sha256', 'sha512', 'checksum', 'crypto', 'security'],
  method: 'POST',
  parameters: [
    {
      name: 'input',
      type: 'textarea',
      label: 'Input Text',
      description: 'Text to hash',
      required: true,
      placeholder: 'Enter text to hash',
    },
    {
      name: 'algorithm',
      type: 'select',
      label: 'Algorithm',
      description: 'Hash algorithm to use',
      required: false,
      defaultValue: 'SHA-256',
      options: [
        { value: 'SHA-1', label: 'SHA-1', description: '160-bit (legacy, not secure)' },
        { value: 'SHA-256', label: 'SHA-256', description: '256-bit (recommended)' },
        { value: 'SHA-384', label: 'SHA-384', description: '384-bit' },
        { value: 'SHA-512', label: 'SHA-512', description: '512-bit (strongest)' },
      ],
      aiHint: 'Use SHA-256 for general purposes. SHA-1 is deprecated.',
    },
    {
      name: 'format',
      type: 'select',
      label: 'Output Format',
      description: 'Format for the hash output',
      required: false,
      defaultValue: 'hex',
      options: [
        { value: 'hex', label: 'Hexadecimal', description: 'Lowercase hex string' },
        { value: 'base64', label: 'Base64', description: 'Base64 encoded' },
      ],
    },
  ],
  outputDescription: 'Cryptographic hash of the input text',
  example: {
    input: { input: 'hello world', algorithm: 'SHA-256', format: 'hex' },
    output: {
      hash: 'b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9',
      algorithm: 'SHA-256',
      format: 'hex',
      inputLength: 11,
    },
  },
  version: '1.0.0',
  icon: '🔐',
  executionMode: 'client',
  aiInstructions: 'Use SHA-256 unless the user specifies a different algorithm. Warn if SHA-1 is requested.',
};

export const hashGeneratorFn: ToolFunction<HashGeneratorResult> = async (params) => {
  const input = params.input as string;
  const algorithm = (params.algorithm as HashAlgorithm) || 'SHA-256';
  const format = (params.format as OutputFormat) || 'hex';

  if (!input) {
    return {
      success: false,
      error: 'Input text is required',
      errorCode: 'MISSING_REQUIRED',
    };
  }

  try {
    // Encode input
    const encoder = new TextEncoder();
    const data = encoder.encode(input);

    // Generate hash
    const hashBuffer = await crypto.subtle.digest(algorithm, data);
    const hashArray = new Uint8Array(hashBuffer);

    // Format output
    let hash: string;
    if (format === 'base64') {
      let binary = '';
      hashArray.forEach(byte => { binary += String.fromCharCode(byte); });
      hash = btoa(binary);
    } else {
      hash = Array.from(hashArray)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    }

    return {
      success: true,
      data: {
        hash,
        algorithm,
        format,
        inputLength: input.length,
      },
      metadata: {
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

export default {
  definition: hashGeneratorDefinition,
  fn: hashGeneratorFn,
};
```

---

## Checklist for Generated Tools

Before finalizing a tool, verify:

- [ ] `id` is lowercase and hyphenated
- [ ] `name` is under 50 characters
- [ ] `description` is under 500 characters and descriptive
- [ ] `category` is one of the allowed values
- [ ] `tags` are lowercase and relevant
- [ ] All required parameters have `required: true`
- [ ] `example.input` matches the parameter schema
- [ ] Result type is defined as an interface
- [ ] Error cases return proper `errorCode`
- [ ] No `eval()` or `new Function()` usage
- [ ] No external network requests (for client execution)
- [ ] Metadata includes `executionTime` when appropriate

---

## User Interaction

When a user asks you to create a tool:

1. **Understand the requirement** - Ask clarifying questions if needed
2. **Choose appropriate category** - Based on tool function
3. **Design parameters** - Required first, then optional
4. **Define output structure** - What data to return
5. **Implement logic** - Handle errors gracefully
6. **Add AI instructions** - Help future AI invocations
7. **Provide example** - Real, working input/output

Generate the complete TypeScript file that can be directly used.
