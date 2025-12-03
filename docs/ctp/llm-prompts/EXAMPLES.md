# CTP Tool Examples

> **Purpose:** Complete, working examples for reference when generating CTP tools.

---

## Example 1: JSON Formatter

Full-featured formatter with multiple options.

```typescript
/**
 * JSON Formatter
 *
 * Format, validate, and beautify JSON data with customizable indentation.
 */

import type { ToolDefinition, ToolFunction, ToolResult } from '@conveniencepro/ctp-core';

// ============================================================================
// TYPES
// ============================================================================

interface JsonFormatterResult {
  formatted: string;
  valid: boolean;
  lineCount: number;
  characterCount: number;
}

// ============================================================================
// DEFINITION
// ============================================================================

export const jsonFormatterDefinition: ToolDefinition = {
  id: 'json-formatter',
  name: 'JSON Formatter',
  description: 'Format, validate, and beautify JSON data with customizable indentation. Supports minification and key sorting.',
  category: 'formatters',
  tags: ['json', 'format', 'beautify', 'validate', 'minify'],
  method: 'POST',
  parameters: [
    {
      name: 'json',
      type: 'textarea',
      label: 'JSON Input',
      description: 'The JSON string to format',
      required: true,
      placeholder: '{"name": "example", "value": 123}',
      validation: {
        minLength: 1,
        maxLength: 1000000,
      },
      aiHint: 'Accepts any valid JSON including objects, arrays, and primitives',
    },
    {
      name: 'indent',
      type: 'select',
      label: 'Indentation',
      description: 'Number of spaces for indentation',
      required: false,
      defaultValue: '2',
      options: [
        { value: '0', label: 'Minified', description: 'No whitespace' },
        { value: '2', label: '2 spaces', description: 'Standard' },
        { value: '4', label: '4 spaces', description: 'Wide' },
        { value: 'tab', label: 'Tab', description: 'Tab character' },
      ],
      aiHint: 'Use 0 for production, 2 for debugging',
    },
    {
      name: 'sortKeys',
      type: 'boolean',
      label: 'Sort Keys',
      description: 'Sort object keys alphabetically',
      required: false,
      defaultValue: false,
      aiHint: 'Enable for consistent output when comparing JSON',
    },
  ],
  outputDescription: 'Formatted JSON string with proper indentation',
  example: {
    input: {
      json: '{"name":"John","age":30,"city":"NYC"}',
      indent: '2',
      sortKeys: false,
    },
    output: {
      formatted: '{\n  "name": "John",\n  "age": 30,\n  "city": "NYC"\n}',
      valid: true,
      lineCount: 5,
      characterCount: 48,
    },
    description: 'Format a simple JSON object with 2-space indentation',
  },
  version: '1.0.0',
  icon: '📋',
  keywords: ['prettify', 'lint'],
  relatedTools: ['json-validator', 'json-minifier'],
  aiInstructions: 'When formatting JSON for display, use 2-space indentation. When formatting for transmission, use minified (0).',
  executionMode: 'client',
};

// ============================================================================
// IMPLEMENTATION
// ============================================================================

function sortObjectKeys(obj: unknown): unknown {
  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys);
  }
  if (obj !== null && typeof obj === 'object') {
    const sorted: Record<string, unknown> = {};
    const keys = Object.keys(obj as Record<string, unknown>).sort();
    for (const key of keys) {
      sorted[key] = sortObjectKeys((obj as Record<string, unknown>)[key]);
    }
    return sorted;
  }
  return obj;
}

export const jsonFormatterFn: ToolFunction<JsonFormatterResult> = (params) => {
  const startTime = performance.now();

  const jsonInput = params.json as string;
  const indentOption = (params.indent as string) || '2';
  const sortKeys = params.sortKeys === true || params.sortKeys === 'true';

  if (!jsonInput) {
    return {
      success: false,
      error: 'JSON input is required',
      errorCode: 'MISSING_REQUIRED',
    };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonInput);
  } catch (e) {
    return {
      success: false,
      error: `Invalid JSON: ${(e as SyntaxError).message}`,
      errorCode: 'INVALID_INPUT',
    };
  }

  if (sortKeys) {
    parsed = sortObjectKeys(parsed);
  }

  let indent: string | number;
  switch (indentOption) {
    case '0': indent = 0; break;
    case '2': indent = 2; break;
    case '4': indent = 4; break;
    case 'tab': indent = '\t'; break;
    default: indent = 2;
  }

  const formatted = JSON.stringify(parsed, null, indent);
  const lines = formatted.split('\n');

  return {
    success: true,
    data: {
      formatted,
      valid: true,
      lineCount: lines.length,
      characterCount: formatted.length,
    },
    metadata: {
      executionTime: performance.now() - startTime,
      inputSize: jsonInput.length,
      outputSize: formatted.length,
    },
  };
};

export default {
  definition: jsonFormatterDefinition,
  fn: jsonFormatterFn,
};
```

---

## Example 2: Base64 Encoder/Decoder

Bidirectional tool with mode selection.

```typescript
/**
 * Base64 Encoder/Decoder
 *
 * Encode text to Base64 or decode Base64 back to text.
 */

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
  description: 'Encode text to Base64 or decode Base64 back to text. Supports UTF-8 and URL-safe variants.',
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
    },
    {
      name: 'mode',
      type: 'select',
      label: 'Mode',
      description: 'Operation to perform',
      required: false,
      defaultValue: 'encode',
      options: [
        { value: 'encode', label: 'Encode', description: 'Text → Base64' },
        { value: 'decode', label: 'Decode', description: 'Base64 → Text' },
      ],
      aiHint: 'Choose encode for plain text, decode for Base64 strings',
    },
    {
      name: 'urlSafe',
      type: 'boolean',
      label: 'URL Safe',
      description: 'Use URL-safe Base64 (replaces +/ with -_)',
      required: false,
      defaultValue: false,
      dependsOn: [
        { field: 'mode', condition: 'equals', value: 'encode' },
      ],
    },
  ],
  outputDescription: 'Encoded Base64 string or decoded text',
  example: {
    input: { input: 'Hello, World!', mode: 'encode', urlSafe: false },
    output: {
      output: 'SGVsbG8sIFdvcmxkIQ==',
      mode: 'encode',
      inputLength: 13,
      outputLength: 20,
    },
  },
  version: '1.0.0',
  icon: '🔤',
  executionMode: 'client',
};

function encodeBase64(str: string, urlSafe: boolean): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  let result = btoa(binary);
  if (urlSafe) {
    result = result.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  }
  return result;
}

function decodeBase64(str: string): string {
  let input = str.replace(/-/g, '+').replace(/_/g, '/');
  const padding = 4 - (input.length % 4);
  if (padding !== 4) input += '='.repeat(padding);
  const binary = atob(input);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

export const base64EncoderFn: ToolFunction<Base64Result> = (params) => {
  const input = params.input as string;
  const mode = (params.mode as 'encode' | 'decode') || 'encode';
  const urlSafe = params.urlSafe === true || params.urlSafe === 'true';

  if (!input) {
    return {
      success: false,
      error: 'Input is required',
      errorCode: 'MISSING_REQUIRED',
    };
  }

  try {
    const output = mode === 'encode'
      ? encodeBase64(input, urlSafe)
      : decodeBase64(input);

    return {
      success: true,
      data: {
        output,
        mode,
        inputLength: input.length,
        outputLength: output.length,
      },
    };
  } catch (e) {
    return {
      success: false,
      error: `${mode === 'decode' ? 'Invalid Base64' : 'Encoding failed'}: ${(e as Error).message}`,
      errorCode: 'INVALID_INPUT',
    };
  }
};

export default {
  definition: base64EncoderDefinition,
  fn: base64EncoderFn,
};
```

---

## Example 3: UUID Generator

Generator with multiple versions.

```typescript
/**
 * UUID Generator
 *
 * Generate universally unique identifiers (UUIDs).
 */

import type { ToolDefinition, ToolFunction, ToolResult } from '@conveniencepro/ctp-core';

interface UuidGeneratorResult {
  uuid: string;
  version: number;
  count: number;
  uuids?: string[];
}

export const uuidGeneratorDefinition: ToolDefinition = {
  id: 'uuid-generator',
  name: 'UUID Generator',
  description: 'Generate universally unique identifiers (UUIDs). Supports v4 (random) with options for batch generation.',
  category: 'generators',
  tags: ['uuid', 'guid', 'unique', 'identifier', 'random'],
  method: 'GET',
  parameters: [
    {
      name: 'count',
      type: 'number',
      label: 'Count',
      description: 'Number of UUIDs to generate',
      required: false,
      defaultValue: 1,
      validation: {
        min: 1,
        max: 100,
      },
    },
    {
      name: 'uppercase',
      type: 'boolean',
      label: 'Uppercase',
      description: 'Output in uppercase',
      required: false,
      defaultValue: false,
    },
    {
      name: 'noDashes',
      type: 'boolean',
      label: 'No Dashes',
      description: 'Remove dashes from output',
      required: false,
      defaultValue: false,
    },
  ],
  outputDescription: 'Generated UUID(s)',
  example: {
    input: { count: 1, uppercase: false, noDashes: false },
    output: {
      uuid: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
      version: 4,
      count: 1,
    },
  },
  version: '1.0.0',
  icon: '🔑',
  executionMode: 'client',
  aiInstructions: 'Generate single UUID by default. Use count parameter only if user asks for multiple.',
};

export const uuidGeneratorFn: ToolFunction<UuidGeneratorResult> = (params) => {
  const count = Math.min(Math.max(parseInt(String(params.count)) || 1, 1), 100);
  const uppercase = params.uppercase === true || params.uppercase === 'true';
  const noDashes = params.noDashes === true || params.noDashes === 'true';

  const uuids: string[] = [];
  for (let i = 0; i < count; i++) {
    let uuid = crypto.randomUUID();
    if (noDashes) uuid = uuid.replace(/-/g, '');
    if (uppercase) uuid = uuid.toUpperCase();
    uuids.push(uuid);
  }

  return {
    success: true,
    data: {
      uuid: uuids[0],
      version: 4,
      count,
      uuids: count > 1 ? uuids : undefined,
    },
  };
};

export default {
  definition: uuidGeneratorDefinition,
  fn: uuidGeneratorFn,
};
```

---

## Example 4: Color Converter

Converter with multiple formats.

```typescript
/**
 * Color Converter
 *
 * Convert colors between HEX, RGB, and HSL formats.
 */

import type { ToolDefinition, ToolFunction, ToolResult } from '@conveniencepro/ctp-core';

interface ColorConverterResult {
  hex: string;
  rgb: { r: number; g: number; b: number };
  rgbString: string;
  hsl: { h: number; s: number; l: number };
  hslString: string;
}

export const colorConverterDefinition: ToolDefinition = {
  id: 'color-converter',
  name: 'Color Converter',
  description: 'Convert colors between HEX, RGB, and HSL formats. Input any format and get all others.',
  category: 'converters',
  tags: ['color', 'hex', 'rgb', 'hsl', 'convert'],
  method: 'POST',
  parameters: [
    {
      name: 'color',
      type: 'text',
      label: 'Color',
      description: 'Color in HEX (#ff0000), RGB (rgb(255,0,0)), or HSL (hsl(0,100%,50%)) format',
      required: true,
      placeholder: '#ff0000',
      aiHint: 'Accepts HEX with or without #, RGB, or HSL formats',
    },
  ],
  outputDescription: 'Color in all supported formats (HEX, RGB, HSL)',
  example: {
    input: { color: '#ff0000' },
    output: {
      hex: '#ff0000',
      rgb: { r: 255, g: 0, b: 0 },
      rgbString: 'rgb(255, 0, 0)',
      hsl: { h: 0, s: 100, l: 50 },
      hslString: 'hsl(0, 100%, 50%)',
    },
  },
  version: '1.0.0',
  icon: '🎨',
  executionMode: 'client',
};

function parseColor(input: string): { r: number; g: number; b: number } | null {
  input = input.trim().toLowerCase();

  // HEX
  const hexMatch = input.match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/);
  if (hexMatch) {
    let hex = hexMatch[1];
    if (hex.length === 3) {
      hex = hex.split('').map(c => c + c).join('');
    }
    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16),
    };
  }

  // RGB
  const rgbMatch = input.match(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);
  if (rgbMatch) {
    return {
      r: Math.min(255, parseInt(rgbMatch[1])),
      g: Math.min(255, parseInt(rgbMatch[2])),
      b: Math.min(255, parseInt(rgbMatch[3])),
    };
  }

  // HSL
  const hslMatch = input.match(/hsl\s*\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?\s*\)/);
  if (hslMatch) {
    const h = parseInt(hslMatch[1]) / 360;
    const s = parseInt(hslMatch[2]) / 100;
    const l = parseInt(hslMatch[3]) / 100;
    // HSL to RGB conversion
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    return {
      r: Math.round(hue2rgb(p, q, h + 1/3) * 255),
      g: Math.round(hue2rgb(p, q, h) * 255),
      b: Math.round(hue2rgb(p, q, h - 1/3) * 255),
    };
  }

  return null;
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export const colorConverterFn: ToolFunction<ColorConverterResult> = (params) => {
  const color = params.color as string;

  if (!color) {
    return {
      success: false,
      error: 'Color input is required',
      errorCode: 'MISSING_REQUIRED',
    };
  }

  const rgb = parseColor(color);
  if (!rgb) {
    return {
      success: false,
      error: 'Invalid color format. Use HEX (#ff0000), RGB (rgb(255,0,0)), or HSL (hsl(0,100%,50%))',
      errorCode: 'INVALID_INPUT',
    };
  }

  const hex = '#' + [rgb.r, rgb.g, rgb.b]
    .map(c => c.toString(16).padStart(2, '0'))
    .join('');
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  return {
    success: true,
    data: {
      hex,
      rgb,
      rgbString: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      hsl,
      hslString: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
    },
  };
};

export default {
  definition: colorConverterDefinition,
  fn: colorConverterFn,
};
```

---

## Key Patterns Summary

| Pattern | Example |
|---------|---------|
| **Simple transform** | Text Reverser |
| **Multiple outputs** | Word Counter |
| **Async operation** | Hash Generator |
| **Bidirectional** | Base64 Encoder |
| **Batch generation** | UUID Generator |
| **Format conversion** | Color Converter |
| **Conditional params** | JSON Formatter (sortKeys) |
| **Validation** | JSON Formatter (try/catch parse) |
| **Metadata** | JSON Formatter (executionTime) |
