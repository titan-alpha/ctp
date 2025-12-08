import { useState, useCallback } from 'react';

export interface ConversionOptions {
  rootName: string;
  useExport: boolean;
}

interface UseJsonToTypescriptReturn {
  jsonInput: string;
  setJsonInput: (value: string) => void;
  options: ConversionOptions;
  setOptions: (options: ConversionOptions) => void;
  typescript: string;
  error: string | null;
  convert: () => void;
  reset: () => void;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function toInterfaceName(key: string): string {
  // Convert snake_case or kebab-case to PascalCase
  return key
    .split(/[-_]/)
    .map(capitalize)
    .join('');
}

function getType(value: unknown): string {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
}

function generateInterfaces(
  obj: unknown,
  name: string,
  interfaces: Map<string, string>,
  useExport: boolean
): string {
  const type = getType(obj);
  const exportKeyword = useExport ? 'export ' : '';

  if (type === 'object' && obj !== null) {
    const entries = Object.entries(obj as Record<string, unknown>);
    const properties: string[] = [];

    for (const [key, value] of entries) {
      const valueType = getType(value);
      const safeName = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `'${key}'`;

      if (valueType === 'object' && value !== null) {
        const nestedName = toInterfaceName(key);
        generateInterfaces(value, nestedName, interfaces, useExport);
        properties.push(`  ${safeName}: ${nestedName};`);
      } else if (valueType === 'array') {
        const arr = value as unknown[];
        if (arr.length === 0) {
          properties.push(`  ${safeName}: unknown[];`);
        } else {
          const firstItem = arr[0];
          const itemType = getType(firstItem);
          if (itemType === 'object' && firstItem !== null) {
            const itemName = toInterfaceName(key.replace(/s$/, '')) + 'Item';
            generateInterfaces(firstItem, itemName, interfaces, useExport);
            properties.push(`  ${safeName}: ${itemName}[];`);
          } else {
            properties.push(`  ${safeName}: ${getPrimitiveType(firstItem)}[];`);
          }
        }
      } else {
        properties.push(`  ${safeName}: ${getPrimitiveType(value)};`);
      }
    }

    const interfaceStr = `${exportKeyword}interface ${name} {\n${properties.join('\n')}\n}`;
    interfaces.set(name, interfaceStr);
    return name;
  }

  if (type === 'array') {
    const arr = obj as unknown[];
    if (arr.length === 0) return 'unknown[]';
    const firstItem = arr[0];
    if (getType(firstItem) === 'object' && firstItem !== null) {
      generateInterfaces(firstItem, name, interfaces, useExport);
      return `${name}[]`;
    }
    return `${getPrimitiveType(firstItem)}[]`;
  }

  return getPrimitiveType(obj);
}

function getPrimitiveType(value: unknown): string {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  const type = typeof value;
  if (type === 'string') return 'string';
  if (type === 'number') return 'number';
  if (type === 'boolean') return 'boolean';
  return 'unknown';
}

export function useJsonToTypescript(): UseJsonToTypescriptReturn {
  const [jsonInput, setJsonInput] = useState('');
  const [options, setOptions] = useState<ConversionOptions>({
    rootName: 'Root',
    useExport: true,
  });
  const [typescript, setTypescript] = useState('');
  const [error, setError] = useState<string | null>(null);

  const convert = useCallback(() => {
    setError(null);

    try {
      if (!jsonInput.trim()) {
        throw new Error('Please enter JSON to convert');
      }

      let parsed: unknown;
      try {
        parsed = JSON.parse(jsonInput);
      } catch {
        throw new Error('Invalid JSON. Please check your input.');
      }

      const interfaces = new Map<string, string>();
      const rootName = options.rootName || 'Root';

      generateInterfaces(parsed, rootName, interfaces, options.useExport);

      // Output interfaces in reverse order (dependencies first)
      const result = Array.from(interfaces.values()).reverse().join('\n\n');
      setTypescript(result || '// No interfaces generated');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setTypescript('');
    }
  }, [jsonInput, options]);

  const reset = useCallback(() => {
    setJsonInput('');
    setTypescript('');
    setError(null);
    setOptions({ rootName: 'Root', useExport: true });
  }, []);

  return {
    jsonInput,
    setJsonInput,
    options,
    setOptions,
    typescript,
    error,
    convert,
    reset,
  };
}
