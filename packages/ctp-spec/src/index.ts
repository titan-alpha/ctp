/**
 * @conveniencepro/ctp-spec
 *
 * ConveniencePro Tool Protocol (CTP) Specification
 * Provides JSON Schema validation utilities for CTP documents.
 *
 * @packageDocumentation
 * @module @conveniencepro/ctp-spec
 * @version 1.0.0
 */

/**
 * CTP Specification version
 */
export const CTP_SPEC_VERSION = '1.0.0';

/**
 * Schema paths for validation
 */
export const SCHEMA_PATHS = {
  toolDefinition: 'schemas/tool-definition.schema.json',
  toolResult: 'schemas/tool-result.schema.json',
  ctpManifest: 'schemas/ctp-manifest.schema.json',
  embedConfig: 'schemas/embed-config.schema.json',
} as const;

/**
 * Schema IDs for JSON Schema $ref resolution
 */
export const SCHEMA_IDS = {
  toolDefinition: 'https://conveniencepro.cc/schemas/tool-definition.schema.json',
  toolResult: 'https://conveniencepro.cc/schemas/tool-result.schema.json',
  ctpManifest: 'https://conveniencepro.cc/schemas/ctp-manifest.schema.json',
  embedConfig: 'https://conveniencepro.cc/schemas/embed-config.schema.json',
} as const;

/**
 * Standard error codes
 */
export const ERROR_CODES = {
  INVALID_INPUT: 'INVALID_INPUT',
  MISSING_REQUIRED: 'MISSING_REQUIRED',
  TYPE_ERROR: 'TYPE_ERROR',
  CONSTRAINT_VIOLATION: 'CONSTRAINT_VIOLATION',
  EXECUTION_ERROR: 'EXECUTION_ERROR',
  TIMEOUT: 'TIMEOUT',
  RATE_LIMITED: 'RATE_LIMITED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  NOT_FOUND: 'NOT_FOUND',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

/**
 * Standard field types
 */
export const FIELD_TYPES = [
  'text',
  'textarea',
  'number',
  'boolean',
  'select',
  'json',
  'file',
  'color',
  'date',
  'datetime',
  'url',
  'email',
] as const;

/**
 * Standard categories
 */
export const CATEGORIES = [
  'formatters',
  'encoders',
  'generators',
  'converters',
  'validators',
  'analyzers',
  'editors',
  'utilities',
] as const;

/**
 * HTTP methods supported by CTP
 */
export const HTTP_METHODS = ['GET', 'POST'] as const;

/**
 * Execution modes
 */
export const EXECUTION_MODES = ['client', 'server', 'hybrid'] as const;

/**
 * Shadow intensities
 */
export const SHADOW_LEVELS = ['none', 'subtle', 'medium', 'large'] as const;

/**
 * UI density options
 */
export const DENSITY_LEVELS = ['compact', 'normal', 'comfortable'] as const;

/**
 * Dependency conditions for parameter visibility
 */
export const DEPENDENCY_CONDITIONS = ['equals', 'notEquals', 'contains', 'exists'] as const;

/**
 * Type exports for TypeScript consumers
 */
export type FieldType = (typeof FIELD_TYPES)[number];
export type Category = (typeof CATEGORIES)[number];
export type HttpMethod = (typeof HTTP_METHODS)[number];
export type ExecutionMode = (typeof EXECUTION_MODES)[number];
export type ShadowLevel = (typeof SHADOW_LEVELS)[number];
export type DensityLevel = (typeof DENSITY_LEVELS)[number];
export type DependencyCondition = (typeof DEPENDENCY_CONDITIONS)[number];
export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
