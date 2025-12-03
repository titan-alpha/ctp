/**
 * ConveniencePro Tool Protocol (CTP) - Core Types
 *
 * Version: 1.0.0
 *
 * This module defines all core types and interfaces for the CTP protocol.
 * These types are the contract between tool definitions, runtimes, and consumers.
 *
 * @module @conveniencepro/ctp-core/types
 */

// =============================================================================
// PROTOCOL METADATA
// =============================================================================

/**
 * Current protocol version
 */
export const CTP_VERSION = '1.0.0' as const;

/**
 * Protocol version type
 */
export type CTProtocolVersion = typeof CTP_VERSION;

// =============================================================================
// PARAMETER TYPES
// =============================================================================

/**
 * Supported field types for tool parameters
 */
export type FieldType =
  | 'text'      // Single-line text input
  | 'textarea'  // Multi-line text input
  | 'number'    // Numeric input
  | 'boolean'   // True/false toggle
  | 'select'    // Dropdown selection
  | 'json'      // JSON input with validation
  | 'file'      // File input (base64 encoded)
  | 'color'     // Color picker input
  | 'date'      // Date input
  | 'datetime'  // Date and time input
  | 'url'       // URL input with validation
  | 'email';    // Email input with validation

/**
 * Option for select-type fields
 */
export interface FieldOption {
  /** The value to be used in the API call */
  value: string;
  /** Human-readable label for the option */
  label: string;
  /** Optional description for the option */
  description?: string;
}

/**
 * Schema definition for a tool parameter
 */
export interface ParameterSchema {
  /** Parameter name (used in API calls) */
  name: string;
  /** Field type determining input UI and validation */
  type: FieldType;
  /** Human-readable label */
  label: string;
  /** Description of the parameter's purpose */
  description: string;
  /** Whether the parameter is required */
  required: boolean;
  /** Placeholder text for input fields */
  placeholder?: string;
  /** Default value if not provided */
  default?: unknown;

  // Validation constraints
  /** Minimum value (for number type) */
  min?: number;
  /** Maximum value (for number type) */
  max?: number;
  /** Minimum length (for text/textarea) */
  minLength?: number;
  /** Maximum length (for text/textarea) */
  maxLength?: number;
  /** Regex pattern for validation */
  pattern?: string;
  /** Custom error message for pattern validation */
  patternError?: string;

  // UI hints
  /** Number of rows (for textarea) */
  rows?: number;
  /** Options (for select type) */
  options?: FieldOption[];
  /** Whether to allow multiple selections (for select) */
  multiple?: boolean;
  /** Step value (for number type) */
  step?: number;
  /** Input prefix (e.g., "$" for currency) */
  prefix?: string;
  /** Input suffix (e.g., "px" for dimensions) */
  suffix?: string;

  // Advanced options
  /** Whether the field should be hidden in UI but available in API */
  hidden?: boolean;
  /** Deprecated - will be removed in future versions */
  deprecated?: boolean;
  /** Deprecation message */
  deprecationMessage?: string;
  /** Conditional visibility based on other parameters */
  visibleWhen?: {
    field: string;
    equals?: unknown;
    notEquals?: unknown;
  };
}

// =============================================================================
// TOOL DEFINITION TYPES
// =============================================================================

/**
 * Example input/output pair for documentation and testing
 */
export interface ToolExample {
  /** Example name/description */
  name?: string;
  /** Example input parameters */
  input: Record<string, unknown>;
  /** Expected output */
  output: Record<string, unknown>;
}

/**
 * HTTP method for the tool API
 */
export type HttpMethod = 'GET' | 'POST';

/**
 * Tool execution mode
 */
export type ExecutionMode =
  | 'client'    // Runs only in browser
  | 'server'    // Runs only on server
  | 'both'      // Can run in either environment
  | 'hybrid';   // Requires both (e.g., client processing with server storage)

/**
 * Tool capability flags
 */
export interface ToolCapabilities {
  /** Tool has an HTTP API endpoint */
  hasApi: boolean;
  /** Tool can be embedded via iframe */
  isEmbeddable: boolean;
  /** Tool has AI/LLM integration */
  hasAiSupport: boolean;
  /** Tool supports streaming output */
  supportsStreaming?: boolean;
  /** Tool supports batch processing */
  supportsBatch?: boolean;
  /** Tool can work offline */
  worksOffline?: boolean;
  /** Tool requires authentication */
  requiresAuth?: boolean;
}

/**
 * Tool rate limiting configuration
 */
export interface RateLimitConfig {
  /** Requests per window */
  requests: number;
  /** Window duration in seconds */
  windowSeconds: number;
  /** Whether limit is per-user or global */
  scope: 'user' | 'global' | 'ip';
}

/**
 * Complete tool definition
 *
 * This is the primary interface for defining a CTP-compliant tool.
 */
export interface ToolDefinition {
  // === Required Metadata ===
  /** Unique tool identifier (URL-safe slug) */
  id: string;
  /** Human-readable tool name */
  name: string;
  /** Tool description for users and LLMs */
  description: string;
  /** Tool category for organization */
  category: string;
  /** Search/discovery tags */
  tags: string[];

  // === API Configuration ===
  /** HTTP method for API calls */
  method: HttpMethod;
  /** Parameter definitions */
  parameters: ParameterSchema[];
  /** Description of the output format */
  outputDescription: string;
  /** Example input/output pairs */
  example: ToolExample;
  /** Additional examples for testing */
  examples?: ToolExample[];

  // === Execution Configuration ===
  /** Where the tool can execute */
  executionMode?: ExecutionMode;
  /** Tool capabilities */
  capabilities?: ToolCapabilities;
  /** Rate limiting configuration */
  rateLimit?: RateLimitConfig;
  /** Timeout in milliseconds */
  timeout?: number;

  // === Discovery & Documentation ===
  /** Tool icon (emoji or URL) */
  icon?: string;
  /** Full documentation URL */
  docsUrl?: string;
  /** Changelog URL */
  changelogUrl?: string;
  /** Related tool IDs */
  relatedTools?: string[];

  // === Versioning ===
  /** Tool version (semver) */
  version?: string;
  /** Minimum CTP protocol version required */
  minProtocolVersion?: CTProtocolVersion;
  /** Whether the tool is deprecated */
  deprecated?: boolean;
  /** Deprecation message with migration path */
  deprecationMessage?: string;
  /** Replacement tool ID if deprecated */
  replacedBy?: string;

  // === Status ===
  /** Tool availability status */
  status?: 'available' | 'beta' | 'coming-soon' | 'deprecated' | 'maintenance';
}

// =============================================================================
// TOOL RESULT TYPES
// =============================================================================

/**
 * Base result interface for all tool executions
 */
export interface ToolResultBase {
  /** Whether the operation succeeded */
  success: boolean;
  /** Error message if success is false */
  error?: string;
  /** Error code for programmatic handling */
  errorCode?: string;
  /** Execution metadata */
  _meta?: ToolResultMeta;
}

/**
 * Metadata attached to tool results
 */
export interface ToolResultMeta {
  /** Tool ID that generated this result */
  toolId: string;
  /** Protocol version used */
  protocolVersion: CTProtocolVersion;
  /** Execution timestamp (ISO 8601) */
  timestamp: string;
  /** Execution duration in milliseconds */
  durationMs?: number;
  /** Where the tool executed */
  executedOn: 'client' | 'server';
  /** Cache status */
  cached?: boolean;
  /** Rate limit remaining */
  rateLimitRemaining?: number;
}

/**
 * Successful tool result
 */
export interface ToolResultSuccess<T = Record<string, unknown>> extends ToolResultBase {
  success: true;
  error?: never;
  errorCode?: never;
  /** Result data (tool-specific) */
  data?: T;
  /** Allow any additional properties */
  [key: string]: unknown;
}

/**
 * Failed tool result
 */
export interface ToolResultError extends ToolResultBase {
  success: false;
  error: string;
  errorCode?: string;
  /** Stack trace (only in development) */
  stack?: string;
  /** Validation errors */
  validationErrors?: ValidationError[];
}

/**
 * Validation error detail
 */
export interface ValidationError {
  /** Parameter that failed validation */
  field: string;
  /** Error message */
  message: string;
  /** Error code */
  code: 'required' | 'type' | 'min' | 'max' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  /** Received value (if safe to expose) */
  received?: unknown;
  /** Expected value/constraint */
  expected?: unknown;
}

/**
 * Union type for all tool results
 */
export type ToolResult<T = Record<string, unknown>> =
  | ToolResultSuccess<T>
  | ToolResultError;

// =============================================================================
// TOOL FUNCTION TYPES
// =============================================================================

/**
 * Tool function parameter types
 */
export type ToolParams =
  | URLSearchParams
  | Record<string, string | undefined>
  | FormData;

/**
 * Normalized parameters after parsing
 */
export type NormalizedParams = Record<string, string | undefined>;

/**
 * Synchronous tool function signature
 */
export type ToolFunctionSync<T = Record<string, unknown>> = (
  params: NormalizedParams
) => ToolResult<T>;

/**
 * Asynchronous tool function signature
 */
export type ToolFunctionAsync<T = Record<string, unknown>> = (
  params: NormalizedParams
) => Promise<ToolResult<T>>;

/**
 * Tool function signature (sync or async)
 */
export type ToolFunction<T = Record<string, unknown>> =
  | ToolFunctionSync<T>
  | ToolFunctionAsync<T>;

// =============================================================================
// TOOL REGISTRY TYPES
// =============================================================================

/**
 * Registry entry for a tool
 */
export interface ToolRegistryEntry<T = Record<string, unknown>> {
  /** Tool definition metadata */
  definition: ToolDefinition;
  /** Tool implementation function */
  fn: ToolFunction<T>;
}

/**
 * Tool registry interface
 */
export interface ToolRegistry {
  /** Register a tool */
  register<T = Record<string, unknown>>(
    definition: ToolDefinition,
    fn: ToolFunction<T>
  ): void;

  /** Get a tool by ID */
  get(id: string): ToolRegistryEntry | undefined;

  /** Check if a tool exists */
  has(id: string): boolean;

  /** Get all tool IDs */
  list(): string[];

  /** Get all tool definitions */
  definitions(): ToolDefinition[];

  /** Get tools by category */
  getByCategory(category: string): ToolRegistryEntry[];

  /** Search tools by tags */
  searchByTags(tags: string[]): ToolRegistryEntry[];

  /** Execute a tool by ID */
  execute<T = Record<string, unknown>>(
    id: string,
    params: ToolParams
  ): Promise<ToolResult<T>>;
}

// =============================================================================
// MANIFEST TYPES
// =============================================================================

/**
 * CTP Tool Manifest
 *
 * Published at /.well-known/ctp-manifest.json
 */
export interface CTManifest {
  /** Schema version */
  schema_version: '1.0';
  /** Protocol version */
  protocol_version: CTProtocolVersion;
  /** Provider information */
  provider: {
    name: string;
    url: string;
    logo?: string;
    description?: string;
    contact?: string;
  };
  /** API configuration */
  api: {
    /** Base URL for tool execution */
    base_url: string;
    /** API version */
    version?: string;
    /** Authentication method */
    auth?: 'none' | 'api_key' | 'oauth2' | 'bearer';
  };
  /** Available tools */
  tools: ToolDefinition[];
  /** Discovery endpoints */
  discovery?: {
    /** OpenAPI specification URL */
    openapi?: string;
    /** AI tools manifest URL */
    ai_tools?: string;
    /** LLMs.txt URL */
    llms_txt?: string;
  };
  /** Last updated timestamp */
  updated_at: string;
}

// =============================================================================
// CATEGORY TYPES
// =============================================================================

/**
 * Category metadata
 */
export interface CategoryInfo {
  /** Category ID (slug) */
  id: string;
  /** Display name */
  name: string;
  /** Category icon (emoji or URL) */
  icon: string;
  /** Category description */
  description: string;
  /** Sort order */
  order?: number;
  /** Number of tools in category */
  toolCount?: number;
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

/**
 * Deep partial type for nested objects
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Make specific keys required
 */
export type RequireKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Tool definition with all optional fields filled
 */
export type CompleteToolDefinition = RequireKeys<
  ToolDefinition,
  'executionMode' | 'capabilities' | 'version' | 'status'
>;

/**
 * Branded type for tool IDs
 */
export type ToolId = string & { readonly __brand: 'ToolId' };

/**
 * Create a branded tool ID
 */
export function createToolId(id: string): ToolId {
  if (!isValidToolId(id)) {
    throw new Error(`Invalid tool ID: ${id}. Must be lowercase alphanumeric with hyphens.`);
  }
  return id as ToolId;
}

/**
 * Validate a tool ID format
 */
export function isValidToolId(id: string): boolean {
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(id);
}
