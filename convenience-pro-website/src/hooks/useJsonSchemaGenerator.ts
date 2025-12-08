import { useState, useCallback } from 'react';

export interface JsonSchema {
  $schema?: string;
  type: string;
  properties?: Record<string, JsonSchema>;
  items?: JsonSchema;
  required?: string[];
  enum?: unknown[];
  pattern?: string;
  format?: string;
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
}

interface UseJsonSchemaGeneratorReturn {
  jsonInput: string;
  setJsonInput: (value: string) => void;
  schema: JsonSchema | null;
  schemaString: string;
  error: string | null;
  isGenerating: boolean;
  generate: () => void;
  reset: () => void;
}

function detectPattern(value: string): string | undefined {
  if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) return undefined; // use format instead
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  if (/^#[0-9a-fA-F]{6}$/.test(value)) return '^#[0-9a-fA-F]{6}$';
  if (/^#[0-9a-fA-F]{3}$/.test(value)) return '^#[0-9a-fA-F]{3,6}$';
  if (/^\+?[1-9]\d{1,14}$/.test(value)) return '^\\+?[1-9]\\d{1,14}$';
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) return undefined;
  return undefined;
}

function detectFormat(value: string): string | undefined {
  if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) return 'email';
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return 'date';
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) return 'date-time';
  if (/^https?:\/\//.test(value)) return 'uri';
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) return 'uuid';
  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(value)) return 'ipv4';
  return undefined;
}

function generateSchemaFromValue(value: unknown): JsonSchema {
  if (value === null) {
    return { type: 'null' };
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return { type: 'array', items: { type: 'object' } };
    }
    // Generate schema from first item as representative
    const itemSchema = generateSchemaFromValue(value[0]);
    return { type: 'array', items: itemSchema };
  }

  if (typeof value === 'object') {
    const properties: Record<string, JsonSchema> = {};
    const required: string[] = [];

    for (const [key, val] of Object.entries(value)) {
      properties[key] = generateSchemaFromValue(val);
      if (val !== null && val !== undefined) {
        required.push(key);
      }
    }

    const schema: JsonSchema = {
      type: 'object',
      properties,
    };

    if (required.length > 0) {
      schema.required = required;
    }

    return schema;
  }

  if (typeof value === 'string') {
    const schema: JsonSchema = { type: 'string' };
    const format = detectFormat(value);
    if (format) {
      schema.format = format;
    } else {
      const pattern = detectPattern(value);
      if (pattern) {
        schema.pattern = pattern;
      }
    }
    return schema;
  }

  if (typeof value === 'number') {
    return Number.isInteger(value) ? { type: 'integer' } : { type: 'number' };
  }

  if (typeof value === 'boolean') {
    return { type: 'boolean' };
  }

  return { type: 'string' };
}

export function useJsonSchemaGenerator(): UseJsonSchemaGeneratorReturn {
  const [jsonInput, setJsonInput] = useState('');
  const [schema, setSchema] = useState<JsonSchema | null>(null);
  const [schemaString, setSchemaString] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generate = useCallback(() => {
    setError(null);
    setIsGenerating(true);

    try {
      if (!jsonInput.trim()) {
        throw new Error('Please enter JSON to generate schema');
      }

      let parsed: unknown;
      try {
        parsed = JSON.parse(jsonInput);
      } catch {
        throw new Error('Invalid JSON. Please check your input.');
      }

      const generatedSchema: JsonSchema = {
        $schema: 'https://json-schema.org/draft/2020-12/schema',
        ...generateSchemaFromValue(parsed),
      };

      setSchema(generatedSchema);
      setSchemaString(JSON.stringify(generatedSchema, null, 2));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setSchema(null);
      setSchemaString('');
    } finally {
      setIsGenerating(false);
    }
  }, [jsonInput]);

  const reset = useCallback(() => {
    setJsonInput('');
    setSchema(null);
    setSchemaString('');
    setError(null);
  }, []);

  return {
    jsonInput,
    setJsonInput,
    schema,
    schemaString,
    error,
    isGenerating,
    generate,
    reset,
  };
}
