/**
 * ConveniencePro Tool Protocol (CTP) - OpenAPI Generator
 *
 * Generate OpenAPI 3.1 specifications from CTP tool definitions.
 *
 * @module @conveniencepro/ctp-discovery/openapi
 */

import {
  ToolDefinition,
  ParameterSchema,
  CTP_VERSION,
} from '@conveniencepro/ctp-core';

// =============================================================================
// OPENAPI TYPES
// =============================================================================

/**
 * OpenAPI 3.1 Schema object
 */
export interface OpenAPISchema {
  type?: string;
  format?: string;
  description?: string;
  enum?: string[];
  default?: unknown;
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  items?: OpenAPISchema;
  properties?: Record<string, OpenAPISchema>;
  required?: string[];
  oneOf?: OpenAPISchema[];
}

/**
 * OpenAPI 3.1 Parameter object
 */
export interface OpenAPIParameter {
  name: string;
  in: 'query' | 'path' | 'header' | 'cookie';
  description?: string;
  required?: boolean;
  schema: OpenAPISchema;
  example?: unknown;
}

/**
 * OpenAPI 3.1 Request Body object
 */
export interface OpenAPIRequestBody {
  description?: string;
  required?: boolean;
  content: {
    [mediaType: string]: {
      schema: OpenAPISchema;
      example?: unknown;
    };
  };
}

/**
 * OpenAPI 3.1 Response object
 */
export interface OpenAPIResponse {
  description: string;
  content?: {
    [mediaType: string]: {
      schema: OpenAPISchema;
      example?: unknown;
    };
  };
}

/**
 * OpenAPI 3.1 Operation object
 */
export interface OpenAPIOperation {
  operationId: string;
  summary: string;
  description?: string;
  tags?: string[];
  parameters?: OpenAPIParameter[];
  requestBody?: OpenAPIRequestBody;
  responses: Record<string, OpenAPIResponse>;
}

/**
 * OpenAPI 3.1 Path Item object
 */
export interface OpenAPIPathItem {
  get?: OpenAPIOperation;
  post?: OpenAPIOperation;
  summary?: string;
  description?: string;
}

/**
 * OpenAPI 3.1 Document
 */
export interface OpenAPIDocument {
  openapi: '3.1.0';
  info: {
    title: string;
    description?: string;
    version: string;
    termsOfService?: string;
    contact?: {
      name?: string;
      url?: string;
      email?: string;
    };
    license?: {
      name: string;
      url?: string;
    };
  };
  servers?: Array<{
    url: string;
    description?: string;
  }>;
  paths: Record<string, OpenAPIPathItem>;
  tags?: Array<{
    name: string;
    description?: string;
  }>;
  components?: {
    schemas?: Record<string, OpenAPISchema>;
    responses?: Record<string, OpenAPIResponse>;
  };
  externalDocs?: {
    description?: string;
    url: string;
  };
}

// =============================================================================
// GENERATOR OPTIONS
// =============================================================================

/**
 * Options for OpenAPI generation
 */
export interface OpenAPIGeneratorOptions {
  /** API title */
  title?: string;
  /** API description */
  description?: string;
  /** API version */
  version?: string;
  /** Base URL for the API */
  baseUrl?: string;
  /** Contact information */
  contact?: {
    name?: string;
    url?: string;
    email?: string;
  };
  /** License information */
  license?: {
    name: string;
    url?: string;
  };
  /** Terms of service URL */
  termsOfService?: string;
  /** External documentation URL */
  docsUrl?: string;
  /** Path prefix for tool endpoints */
  pathPrefix?: string;
  /** Include example requests/responses */
  includeExamples?: boolean;
  /** Group tools by category as tags */
  groupByCategory?: boolean;
}

// =============================================================================
// SCHEMA CONVERSION
// =============================================================================

/**
 * Convert CTP field type to OpenAPI type
 */
function fieldTypeToOpenAPI(type: ParameterSchema['type']): { type: string; format?: string } {
  switch (type) {
    case 'text':
    case 'textarea':
      return { type: 'string' };
    case 'number':
      return { type: 'number' };
    case 'boolean':
      return { type: 'boolean' };
    case 'select':
      return { type: 'string' };
    case 'json':
      return { type: 'object' };
    case 'file':
      return { type: 'string', format: 'binary' };
    case 'color':
      return { type: 'string', format: 'color' };
    case 'date':
      return { type: 'string', format: 'date' };
    case 'datetime':
      return { type: 'string', format: 'date-time' };
    case 'url':
      return { type: 'string', format: 'uri' };
    case 'email':
      return { type: 'string', format: 'email' };
    default:
      return { type: 'string' };
  }
}

/**
 * Convert CTP parameter to OpenAPI schema
 */
function parameterToSchema(param: ParameterSchema): OpenAPISchema {
  const { type, format } = fieldTypeToOpenAPI(param.type);

  const schema: OpenAPISchema = {
    type,
    description: param.description,
  };

  if (format) {
    schema.format = format;
  }

  if (param.default !== undefined) {
    schema.default = param.default;
  }

  if (param.type === 'select' && param.options) {
    schema.enum = param.options.map(o => o.value);
  }

  if (param.min !== undefined) {
    schema.minimum = param.min;
  }

  if (param.max !== undefined) {
    schema.maximum = param.max;
  }

  if (param.minLength !== undefined) {
    schema.minLength = param.minLength;
  }

  if (param.maxLength !== undefined) {
    schema.maxLength = param.maxLength;
  }

  if (param.pattern) {
    schema.pattern = param.pattern;
  }

  return schema;
}

/**
 * Convert CTP parameter to OpenAPI parameter (for GET)
 */
function parameterToOpenAPIParam(param: ParameterSchema): OpenAPIParameter {
  return {
    name: param.name,
    in: 'query',
    description: param.description,
    required: param.required,
    schema: parameterToSchema(param),
    ...(param.placeholder ? { example: param.placeholder } : {}),
  };
}

// =============================================================================
// GENERATOR
// =============================================================================

/**
 * Generate OpenAPI specification from tool definitions
 */
export function generateOpenAPI(
  tools: ToolDefinition[],
  options: OpenAPIGeneratorOptions = {}
): OpenAPIDocument {
  const {
    title = 'ConveniencePro Tools API',
    description = 'API for ConveniencePro utility tools',
    version = CTP_VERSION,
    baseUrl = 'https://conveniencepro.cc',
    contact,
    license,
    termsOfService,
    docsUrl,
    pathPrefix = '/run',
    includeExamples = true,
    groupByCategory = true,
  } = options;

  // Collect unique categories for tags
  const categories = new Set<string>();
  tools.forEach(tool => categories.add(tool.category));

  // Build paths
  const paths: Record<string, OpenAPIPathItem> = {};

  for (const tool of tools) {
    const path = `${pathPrefix}/${tool.id}`;
    const operation = toolToOperation(tool, includeExamples);

    if (groupByCategory) {
      operation.tags = [tool.category];
    }

    paths[path] = {
      [tool.method.toLowerCase()]: operation,
      summary: tool.name,
      description: tool.description,
    };
  }

  // Build document
  const doc: OpenAPIDocument = {
    openapi: '3.1.0',
    info: {
      title,
      description,
      version,
      ...(termsOfService ? { termsOfService } : {}),
      ...(contact ? { contact } : {}),
      ...(license ? { license } : {}),
    },
    servers: [
      {
        url: baseUrl,
        description: 'Production server',
      },
    ],
    paths,
    tags: groupByCategory
      ? Array.from(categories).map(cat => ({
          name: cat,
          description: `Tools in the ${cat} category`,
        }))
      : undefined,
    components: {
      schemas: {
        ToolResult: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Whether the operation succeeded',
            },
            error: {
              type: 'string',
              description: 'Error message if success is false',
            },
          },
          required: ['success'],
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', enum: ['false'] },
            error: { type: 'string' },
            errorCode: { type: 'string' },
          },
          required: ['success', 'error'],
        },
      },
    },
    ...(docsUrl
      ? {
          externalDocs: {
            description: 'Full documentation',
            url: docsUrl,
          },
        }
      : {}),
  };

  return doc;
}

/**
 * Convert a tool definition to an OpenAPI operation
 */
function toolToOperation(
  tool: ToolDefinition,
  includeExamples: boolean
): OpenAPIOperation {
  const operation: OpenAPIOperation = {
    operationId: tool.id.replace(/-/g, '_'),
    summary: tool.name,
    description: `${tool.description}\n\nOutput: ${tool.outputDescription}`,
    responses: {
      '200': {
        description: 'Successful operation',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: { type: 'boolean' },
              },
              required: ['success'],
            },
            ...(includeExamples && tool.example
              ? { example: tool.example.output }
              : {}),
          },
        },
      },
      '400': {
        description: 'Invalid parameters',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' } as unknown as OpenAPISchema,
          },
        },
      },
    },
  };

  if (tool.method === 'GET') {
    // GET: parameters go in query string
    operation.parameters = tool.parameters.map(parameterToOpenAPIParam);
  } else {
    // POST: parameters go in request body
    const requiredParams = tool.parameters
      .filter(p => p.required)
      .map(p => p.name);

    const properties: Record<string, OpenAPISchema> = {};
    for (const param of tool.parameters) {
      properties[param.name] = parameterToSchema(param);
    }

    operation.requestBody = {
      description: 'Tool parameters',
      required: requiredParams.length > 0,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties,
            required: requiredParams.length > 0 ? requiredParams : undefined,
          },
          ...(includeExamples && tool.example
            ? { example: tool.example.input }
            : {}),
        },
        'application/x-www-form-urlencoded': {
          schema: {
            type: 'object',
            properties,
            required: requiredParams.length > 0 ? requiredParams : undefined,
          },
        },
      },
    };
  }

  return operation;
}

/**
 * Generate OpenAPI spec as YAML string
 */
export function generateOpenAPIYAML(
  tools: ToolDefinition[],
  options?: OpenAPIGeneratorOptions
): string {
  const doc = generateOpenAPI(tools, options);
  return jsonToYAML(doc);
}

/**
 * Simple JSON to YAML converter
 */
function jsonToYAML(obj: unknown, indent = 0): string {
  const spaces = '  '.repeat(indent);

  if (obj === null || obj === undefined) {
    return 'null';
  }

  if (typeof obj === 'boolean' || typeof obj === 'number') {
    return String(obj);
  }

  if (typeof obj === 'string') {
    // Check if string needs quoting
    if (
      obj.includes('\n') ||
      obj.includes(':') ||
      obj.includes('#') ||
      obj.includes('"') ||
      obj.includes("'") ||
      obj.startsWith(' ') ||
      obj.endsWith(' ')
    ) {
      return `"${obj.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`;
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    if (obj.length === 0) {
      return '[]';
    }
    return obj
      .map(item => {
        const value = jsonToYAML(item, indent + 1);
        if (typeof item === 'object' && item !== null) {
          return `${spaces}- ${value.trim().replace(/^\n/, '').replace(/\n/g, `\n${spaces}  `)}`;
        }
        return `${spaces}- ${value}`;
      })
      .join('\n');
  }

  if (typeof obj === 'object') {
    const entries = Object.entries(obj).filter(([, v]) => v !== undefined);
    if (entries.length === 0) {
      return '{}';
    }
    return entries
      .map(([key, value]) => {
        const yamlValue = jsonToYAML(value, indent + 1);
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          return `${spaces}${key}:\n${yamlValue}`;
        }
        if (Array.isArray(value)) {
          return `${spaces}${key}:\n${yamlValue}`;
        }
        return `${spaces}${key}: ${yamlValue}`;
      })
      .join('\n');
  }

  return String(obj);
}
