/**
 * ConveniencePro Tool Protocol (CTP) - Validators
 *
 * This module provides validation functions for CTP types.
 * Used for runtime validation of tool definitions and parameters.
 *
 * @module @conveniencepro/ctp-core/validators
 */

import {
  ToolDefinition,
  ParameterSchema,
  ToolResult,
  ToolExample,
  FieldType,
  ValidationError,
  NormalizedParams,
  isValidToolId,
} from './types';

// =============================================================================
// VALIDATION RESULT TYPES
// =============================================================================

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

/**
 * Create a successful validation result
 */
function validResult(): ValidationResult {
  return { valid: true, errors: [] };
}

/**
 * Create a failed validation result
 */
function invalidResult(errors: ValidationError[]): ValidationResult {
  return { valid: false, errors };
}

// =============================================================================
// TOOL DEFINITION VALIDATORS
// =============================================================================

/**
 * Validate a complete tool definition
 */
export function validateToolDefinition(definition: unknown): ValidationResult {
  const errors: ValidationError[] = [];

  if (!definition || typeof definition !== 'object') {
    return invalidResult([{
      field: 'definition',
      message: 'Tool definition must be an object',
      code: 'type',
    }]);
  }

  const def = definition as Record<string, unknown>;

  // Required string fields
  const requiredStrings: Array<keyof ToolDefinition> = [
    'id', 'name', 'description', 'category', 'method', 'outputDescription'
  ];

  for (const field of requiredStrings) {
    if (!def[field] || typeof def[field] !== 'string') {
      errors.push({
        field,
        message: `${field} is required and must be a string`,
        code: 'required',
      });
    }
  }

  // Validate ID format
  if (typeof def.id === 'string' && !isValidToolId(def.id)) {
    errors.push({
      field: 'id',
      message: 'Tool ID must be lowercase alphanumeric with hyphens (e.g., "json-format")',
      code: 'pattern',
      received: def.id,
    });
  }

  // Validate method
  if (def.method && !['GET', 'POST'].includes(def.method as string)) {
    errors.push({
      field: 'method',
      message: 'Method must be "GET" or "POST"',
      code: 'type',
      received: def.method,
      expected: ['GET', 'POST'],
    });
  }

  // Validate tags
  if (!Array.isArray(def.tags)) {
    errors.push({
      field: 'tags',
      message: 'Tags must be an array of strings',
      code: 'type',
    });
  } else if (!def.tags.every((t: unknown) => typeof t === 'string')) {
    errors.push({
      field: 'tags',
      message: 'All tags must be strings',
      code: 'type',
    });
  }

  // Validate parameters
  if (!Array.isArray(def.parameters)) {
    errors.push({
      field: 'parameters',
      message: 'Parameters must be an array',
      code: 'type',
    });
  } else {
    for (let i = 0; i < def.parameters.length; i++) {
      const paramResult = validateParameterSchema(def.parameters[i]);
      if (!paramResult.valid) {
        for (const err of paramResult.errors) {
          errors.push({
            ...err,
            field: `parameters[${i}].${err.field}`,
          });
        }
      }
    }
  }

  // Validate example
  if (!def.example || typeof def.example !== 'object') {
    errors.push({
      field: 'example',
      message: 'Example is required and must be an object',
      code: 'required',
    });
  } else {
    const exampleResult = validateToolExample(def.example as ToolExample);
    if (!exampleResult.valid) {
      for (const err of exampleResult.errors) {
        errors.push({
          ...err,
          field: `example.${err.field}`,
        });
      }
    }
  }

  return errors.length > 0 ? invalidResult(errors) : validResult();
}

/**
 * Validate a parameter schema
 */
export function validateParameterSchema(schema: unknown): ValidationResult {
  const errors: ValidationError[] = [];

  if (!schema || typeof schema !== 'object') {
    return invalidResult([{
      field: 'schema',
      message: 'Parameter schema must be an object',
      code: 'type',
    }]);
  }

  const param = schema as Record<string, unknown>;

  // Required fields
  if (!param.name || typeof param.name !== 'string') {
    errors.push({
      field: 'name',
      message: 'Parameter name is required',
      code: 'required',
    });
  }

  if (!param.type || typeof param.type !== 'string') {
    errors.push({
      field: 'type',
      message: 'Parameter type is required',
      code: 'required',
    });
  } else if (!isValidFieldType(param.type as string)) {
    errors.push({
      field: 'type',
      message: `Invalid field type: ${param.type}`,
      code: 'type',
      received: param.type,
      expected: VALID_FIELD_TYPES,
    });
  }

  if (!param.label || typeof param.label !== 'string') {
    errors.push({
      field: 'label',
      message: 'Parameter label is required',
      code: 'required',
    });
  }

  if (!param.description || typeof param.description !== 'string') {
    errors.push({
      field: 'description',
      message: 'Parameter description is required',
      code: 'required',
    });
  }

  if (typeof param.required !== 'boolean') {
    errors.push({
      field: 'required',
      message: 'Required must be a boolean',
      code: 'type',
    });
  }

  // Validate select options if type is select
  if (param.type === 'select') {
    if (!Array.isArray(param.options) || param.options.length === 0) {
      errors.push({
        field: 'options',
        message: 'Select type requires non-empty options array',
        code: 'required',
      });
    } else {
      for (let i = 0; i < param.options.length; i++) {
        const opt = param.options[i] as Record<string, unknown>;
        if (!opt.value || typeof opt.value !== 'string') {
          errors.push({
            field: `options[${i}].value`,
            message: 'Option value is required',
            code: 'required',
          });
        }
        if (!opt.label || typeof opt.label !== 'string') {
          errors.push({
            field: `options[${i}].label`,
            message: 'Option label is required',
            code: 'required',
          });
        }
      }
    }
  }

  // Validate numeric constraints
  if (param.type === 'number') {
    if (param.min !== undefined && typeof param.min !== 'number') {
      errors.push({
        field: 'min',
        message: 'Min must be a number',
        code: 'type',
      });
    }
    if (param.max !== undefined && typeof param.max !== 'number') {
      errors.push({
        field: 'max',
        message: 'Max must be a number',
        code: 'type',
      });
    }
    if (
      typeof param.min === 'number' &&
      typeof param.max === 'number' &&
      param.min > param.max
    ) {
      errors.push({
        field: 'min',
        message: 'Min cannot be greater than max',
        code: 'custom',
      });
    }
  }

  return errors.length > 0 ? invalidResult(errors) : validResult();
}

/**
 * Validate a tool example
 */
export function validateToolExample(example: unknown): ValidationResult {
  const errors: ValidationError[] = [];

  if (!example || typeof example !== 'object') {
    return invalidResult([{
      field: 'example',
      message: 'Example must be an object',
      code: 'type',
    }]);
  }

  const ex = example as Record<string, unknown>;

  if (!ex.input || typeof ex.input !== 'object') {
    errors.push({
      field: 'input',
      message: 'Example input is required and must be an object',
      code: 'required',
    });
  }

  if (!ex.output || typeof ex.output !== 'object') {
    errors.push({
      field: 'output',
      message: 'Example output is required and must be an object',
      code: 'required',
    });
  }

  // Validate output has success field
  if (ex.output && typeof ex.output === 'object') {
    const output = ex.output as Record<string, unknown>;
    if (typeof output.success !== 'boolean') {
      errors.push({
        field: 'output.success',
        message: 'Example output must have a boolean success field',
        code: 'required',
      });
    }
  }

  return errors.length > 0 ? invalidResult(errors) : validResult();
}

// =============================================================================
// PARAMETER VALUE VALIDATORS
// =============================================================================

/**
 * Valid field types
 */
const VALID_FIELD_TYPES: FieldType[] = [
  'text', 'textarea', 'number', 'boolean', 'select', 'json',
  'file', 'color', 'date', 'datetime', 'url', 'email'
];

/**
 * Check if a string is a valid field type
 */
export function isValidFieldType(type: string): type is FieldType {
  return VALID_FIELD_TYPES.includes(type as FieldType);
}

/**
 * Validate parameters against a tool definition
 */
export function validateParameters(
  params: NormalizedParams,
  definition: ToolDefinition
): ValidationResult {
  const errors: ValidationError[] = [];

  for (const schema of definition.parameters) {
    const value = params[schema.name];
    const paramErrors = validateParameterValue(value, schema);
    errors.push(...paramErrors);
  }

  return errors.length > 0 ? invalidResult(errors) : validResult();
}

/**
 * Validate a single parameter value against its schema
 */
export function validateParameterValue(
  value: string | undefined,
  schema: ParameterSchema
): ValidationError[] {
  const errors: ValidationError[] = [];

  // Check required
  if (schema.required && (value === undefined || value === '')) {
    errors.push({
      field: schema.name,
      message: `${schema.label} is required`,
      code: 'required',
    });
    return errors; // Stop validation if required field is missing
  }

  // If value is empty and not required, skip other validations
  if (value === undefined || value === '') {
    return errors;
  }

  // Type-specific validation
  switch (schema.type) {
    case 'number': {
      const num = parseFloat(value);
      if (isNaN(num)) {
        errors.push({
          field: schema.name,
          message: `${schema.label} must be a number`,
          code: 'type',
          received: value,
        });
      } else {
        if (schema.min !== undefined && num < schema.min) {
          errors.push({
            field: schema.name,
            message: `${schema.label} must be at least ${schema.min}`,
            code: 'min',
            received: num,
            expected: schema.min,
          });
        }
        if (schema.max !== undefined && num > schema.max) {
          errors.push({
            field: schema.name,
            message: `${schema.label} must be at most ${schema.max}`,
            code: 'max',
            received: num,
            expected: schema.max,
          });
        }
      }
      break;
    }

    case 'boolean':
      if (!['true', 'false', '1', '0'].includes(value.toLowerCase())) {
        errors.push({
          field: schema.name,
          message: `${schema.label} must be a boolean`,
          code: 'type',
          received: value,
          expected: ['true', 'false'],
        });
      }
      break;

    case 'select':
      if (schema.options) {
        const validValues = schema.options.map(o => o.value);
        if (!validValues.includes(value)) {
          errors.push({
            field: schema.name,
            message: `${schema.label} must be one of: ${validValues.join(', ')}`,
            code: 'type',
            received: value,
            expected: validValues,
          });
        }
      }
      break;

    case 'json':
      try {
        JSON.parse(value);
      } catch {
        errors.push({
          field: schema.name,
          message: `${schema.label} must be valid JSON`,
          code: 'type',
          received: value.substring(0, 50) + (value.length > 50 ? '...' : ''),
        });
      }
      break;

    case 'email':
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errors.push({
          field: schema.name,
          message: `${schema.label} must be a valid email address`,
          code: 'pattern',
          received: value,
        });
      }
      break;

    case 'url':
      try {
        new URL(value);
      } catch {
        errors.push({
          field: schema.name,
          message: `${schema.label} must be a valid URL`,
          code: 'pattern',
          received: value,
        });
      }
      break;

    case 'color':
      if (!/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(value)) {
        errors.push({
          field: schema.name,
          message: `${schema.label} must be a valid hex color`,
          code: 'pattern',
          received: value,
        });
      }
      break;

    case 'date':
      if (isNaN(Date.parse(value))) {
        errors.push({
          field: schema.name,
          message: `${schema.label} must be a valid date`,
          code: 'pattern',
          received: value,
        });
      }
      break;
  }

  // String length validation (for text/textarea)
  if (['text', 'textarea'].includes(schema.type)) {
    if (schema.minLength !== undefined && value.length < schema.minLength) {
      errors.push({
        field: schema.name,
        message: `${schema.label} must be at least ${schema.minLength} characters`,
        code: 'minLength',
        received: value.length,
        expected: schema.minLength,
      });
    }
    if (schema.maxLength !== undefined && value.length > schema.maxLength) {
      errors.push({
        field: schema.name,
        message: `${schema.label} must be at most ${schema.maxLength} characters`,
        code: 'maxLength',
        received: value.length,
        expected: schema.maxLength,
      });
    }
  }

  // Pattern validation
  if (schema.pattern) {
    try {
      const regex = new RegExp(schema.pattern);
      if (!regex.test(value)) {
        errors.push({
          field: schema.name,
          message: schema.patternError || `${schema.label} format is invalid`,
          code: 'pattern',
          received: value,
          expected: schema.pattern,
        });
      }
    } catch {
      // Invalid regex pattern - skip validation
    }
  }

  return errors;
}

// =============================================================================
// TOOL RESULT VALIDATORS
// =============================================================================

/**
 * Validate a tool result
 */
export function validateToolResult(result: unknown): ValidationResult {
  const errors: ValidationError[] = [];

  if (!result || typeof result !== 'object') {
    return invalidResult([{
      field: 'result',
      message: 'Tool result must be an object',
      code: 'type',
    }]);
  }

  const res = result as Record<string, unknown>;

  if (typeof res.success !== 'boolean') {
    errors.push({
      field: 'success',
      message: 'Result must have a boolean success field',
      code: 'required',
    });
  }

  if (res.success === false && typeof res.error !== 'string') {
    errors.push({
      field: 'error',
      message: 'Failed result must have an error message',
      code: 'required',
    });
  }

  return errors.length > 0 ? invalidResult(errors) : validResult();
}

/**
 * Check if a result indicates success
 */
export function isSuccessResult(result: ToolResult): result is ToolResult & { success: true } {
  return result.success === true;
}

/**
 * Check if a result indicates failure
 */
export function isErrorResult(result: ToolResult): result is ToolResult & { success: false; error: string } {
  return result.success === false;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Normalize parameters from various input types
 */
export function normalizeParams(params: unknown): NormalizedParams {
  if (params instanceof URLSearchParams) {
    const result: NormalizedParams = {};
    params.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }

  if (params instanceof FormData) {
    const result: NormalizedParams = {};
    params.forEach((value, key) => {
      if (typeof value === 'string') {
        result[key] = value;
      }
    });
    return result;
  }

  if (typeof params === 'object' && params !== null) {
    const result: NormalizedParams = {};
    for (const [key, value] of Object.entries(params)) {
      result[key] = value === undefined ? undefined : String(value);
    }
    return result;
  }

  return {};
}

/**
 * Extract default values from a tool definition
 */
export function getDefaultParams(definition: ToolDefinition): NormalizedParams {
  const defaults: NormalizedParams = {};

  for (const param of definition.parameters) {
    if (param.default !== undefined) {
      defaults[param.name] = String(param.default);
    }
  }

  return defaults;
}

/**
 * Merge params with defaults
 */
export function mergeWithDefaults(
  params: NormalizedParams,
  definition: ToolDefinition
): NormalizedParams {
  const defaults = getDefaultParams(definition);
  return { ...defaults, ...params };
}
