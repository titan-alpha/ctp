/**
 * @conveniencepro/ctp-core
 *
 * Core types and interfaces for the ConveniencePro Tool Protocol (CTP).
 *
 * CTP is a protocol for defining, discovering, and executing browser-native
 * utility tools. It extends MCP (Model Context Protocol) principles to
 * client-side execution with privacy-first design.
 *
 * @packageDocumentation
 * @module @conveniencepro/ctp-core
 * @version 1.0.0
 */

// =============================================================================
// TYPES
// =============================================================================

export {
  // Protocol metadata
  CTP_VERSION,
  type CTProtocolVersion,

  // Parameter types
  type FieldType,
  type FieldOption,
  type ParameterSchema,

  // Tool definition types
  type ToolExample,
  type HttpMethod,
  type ExecutionMode,
  type ToolCapabilities,
  type RateLimitConfig,
  type ToolDefinition,

  // Result types
  type ToolResultBase,
  type ToolResultMeta,
  type ToolResultSuccess,
  type ToolResultError,
  type ToolResult,
  type ValidationError,

  // Function types
  type ToolParams,
  type NormalizedParams,
  type ToolFunctionSync,
  type ToolFunctionAsync,
  type ToolFunction,

  // Registry types
  type ToolRegistryEntry,
  type ToolRegistry,

  // Manifest types
  type CTManifest,
  type CategoryInfo,

  // Utility types
  type DeepPartial,
  type RequireKeys,
  type CompleteToolDefinition,
  type ToolId,

  // Utility functions
  createToolId,
  isValidToolId,
} from './types';

// =============================================================================
// VALIDATORS
// =============================================================================

export {
  // Validation result type
  type ValidationResult,

  // Tool definition validators
  validateToolDefinition,
  validateParameterSchema,
  validateToolExample,

  // Parameter validators
  isValidFieldType,
  validateParameters,
  validateParameterValue,

  // Result validators
  validateToolResult,
  isSuccessResult,
  isErrorResult,

  // Helper functions
  normalizeParams,
  getDefaultParams,
  mergeWithDefaults,
} from './validators';

// =============================================================================
// CONVENIENCE FUNCTIONS
// =============================================================================

import { CTP_VERSION, ToolDefinition, ToolResult, NormalizedParams } from './types';
import { validateToolDefinition, validateParameters, ValidationResult } from './validators';

/**
 * Create a validated tool definition
 *
 * @param definition - The tool definition to validate
 * @returns The validated definition
 * @throws Error if validation fails
 */
export function defineT<T extends ToolDefinition>(definition: T): T {
  const result = validateToolDefinition(definition);
  if (!result.valid) {
    const errorMessages = result.errors.map(e => `  - ${e.field}: ${e.message}`).join('\n');
    throw new Error(`Invalid tool definition:\n${errorMessages}`);
  }
  return definition;
}

/**
 * Alias for defineT for more explicit naming
 */
export const defineTool = defineT;

/**
 * Create a successful tool result
 */
export function success<T extends Record<string, unknown>>(data: T): ToolResult<T> {
  return {
    success: true,
    ...data,
  };
}

/**
 * Create a failed tool result
 */
export function failure(error: string, errorCode?: string): ToolResult {
  return {
    success: false,
    error,
    ...(errorCode ? { errorCode } : {}),
  };
}

/**
 * Validate and execute a tool safely
 */
export async function safeExecute<T extends Record<string, unknown>>(
  fn: (params: NormalizedParams) => ToolResult<T> | Promise<ToolResult<T>>,
  params: NormalizedParams,
  definition?: ToolDefinition
): Promise<ToolResult<T>> {
  try {
    // Validate parameters if definition provided
    if (definition) {
      const validation = validateParameters(params, definition);
      if (!validation.valid) {
        return {
          success: false,
          error: 'Validation failed',
          validationErrors: validation.errors,
        } as ToolResult<T>;
      }
    }

    // Execute the tool
    const result = await fn(params);
    return result;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    } as ToolResult<T>;
  }
}

/**
 * Get protocol information
 */
export function getProtocolInfo() {
  return {
    name: 'ConveniencePro Tool Protocol',
    shortName: 'CTP',
    version: CTP_VERSION,
    specification: 'https://conveniencepro.cc/docs/ctp/spec',
    repository: 'https://github.com/conveniencepro/convenience-pro',
  };
}
