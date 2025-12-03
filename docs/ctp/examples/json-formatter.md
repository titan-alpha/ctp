# JSON Formatter Tool

Complete reference implementation of a CTP-compliant JSON formatting tool.

## Overview

| Property | Value |
|----------|-------|
| **ID** | `json-formatter` |
| **Category** | `formatters` |
| **Execution Mode** | `client` |
| **Method** | `POST` |

## Description

Format, validate, and beautify JSON data with customizable indentation. Supports minification and alphabetical key sorting.

## Parameters

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `json` | `textarea` | Yes | - | JSON string to format |
| `indent` | `select` | No | `2` | Indentation style |
| `sortKeys` | `boolean` | No | `false` | Sort object keys alphabetically |

### Indent Options

| Value | Label | Description |
|-------|-------|-------------|
| `0` | Minified | No whitespace |
| `2` | 2 spaces | Standard indentation |
| `4` | 4 spaces | Wide indentation |
| `tab` | Tab | Tab character |

## Example

**Input:**
```json
{
  "json": "{\"name\":\"John\",\"age\":30,\"city\":\"NYC\"}",
  "indent": "2",
  "sortKeys": false
}
```

**Output:**
```json
{
  "success": true,
  "data": {
    "formatted": "{\n  \"name\": \"John\",\n  \"age\": 30,\n  \"city\": \"NYC\"\n}",
    "valid": true,
    "lineCount": 5,
    "characterCount": 48
  },
  "metadata": {
    "executionTime": 0.5,
    "inputSize": 35,
    "outputSize": 48
  }
}
```

## Implementation

```typescript
import type { ToolDefinition, ToolFunction, ToolResult } from '@conveniencepro/ctp-core';

interface JsonFormatterResult {
  formatted: string;
  valid: boolean;
  lineCount: number;
  characterCount: number;
}

export const jsonFormatterDefinition: ToolDefinition = {
  id: 'json-formatter',
  name: 'JSON Formatter',
  description: 'Format, validate, and beautify JSON data with customizable indentation.',
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
      placeholder: '{"name": "example"}',
      validation: { minLength: 1, maxLength: 1000000 },
    },
    {
      name: 'indent',
      type: 'select',
      label: 'Indentation',
      description: 'Number of spaces for indentation',
      required: false,
      defaultValue: '2',
      options: [
        { value: '0', label: 'Minified' },
        { value: '2', label: '2 spaces' },
        { value: '4', label: '4 spaces' },
        { value: 'tab', label: 'Tab' },
      ],
    },
    {
      name: 'sortKeys',
      type: 'boolean',
      label: 'Sort Keys',
      description: 'Sort object keys alphabetically',
      required: false,
      defaultValue: false,
    },
  ],
  outputDescription: 'Formatted JSON string',
  example: {
    input: { json: '{"a":1}', indent: '2' },
    output: { formatted: '{\n  "a": 1\n}', valid: true, lineCount: 3, characterCount: 14 },
  },
  version: '1.0.0',
  icon: '📋',
  executionMode: 'client',
};

function sortObjectKeys(obj: unknown): unknown {
  if (Array.isArray(obj)) return obj.map(sortObjectKeys);
  if (obj !== null && typeof obj === 'object') {
    const sorted: Record<string, unknown> = {};
    Object.keys(obj as Record<string, unknown>).sort().forEach(key => {
      sorted[key] = sortObjectKeys((obj as Record<string, unknown>)[key]);
    });
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
    return { success: false, error: 'JSON input is required', errorCode: 'MISSING_REQUIRED' };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonInput);
  } catch (e) {
    return { success: false, error: `Invalid JSON: ${(e as Error).message}`, errorCode: 'INVALID_INPUT' };
  }

  if (sortKeys) parsed = sortObjectKeys(parsed);

  const indent = indentOption === 'tab' ? '\t' : parseInt(indentOption) || 2;
  const formatted = JSON.stringify(parsed, null, indent);

  return {
    success: true,
    data: {
      formatted,
      valid: true,
      lineCount: formatted.split('\n').length,
      characterCount: formatted.length,
    },
    metadata: {
      executionTime: performance.now() - startTime,
      inputSize: jsonInput.length,
      outputSize: formatted.length,
    },
  };
};

export default { definition: jsonFormatterDefinition, fn: jsonFormatterFn };
```

## Usage

### With Registry

```typescript
import { registerTool, executeTool } from '@conveniencepro/ctp-runtime';
import jsonFormatter from './json-formatter';

registerTool(jsonFormatter.definition, jsonFormatter.fn);

const result = await executeTool('json-formatter', {
  json: '{"b":2,"a":1}',
  indent: '2',
  sortKeys: true,
});

console.log(result.data.formatted);
// {
//   "a": 1,
//   "b": 2
// }
```

### Direct Invocation

```typescript
const result = jsonFormatterFn({
  json: '{"test":true}',
  indent: '4',
});
```

## Error Handling

| Error Code | Cause |
|------------|-------|
| `MISSING_REQUIRED` | `json` parameter not provided |
| `INVALID_INPUT` | JSON parse error |

## Related Tools

- `json-validator` - Validate JSON without formatting
- `json-minifier` - Minify JSON (subset of this tool)
- `json-diff` - Compare two JSON objects
