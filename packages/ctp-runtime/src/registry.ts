/**
 * ConveniencePro Tool Protocol (CTP) - Tool Registry
 *
 * A registry for managing tool definitions and their implementations.
 * Provides registration, lookup, and execution capabilities.
 *
 * @module @conveniencepro/ctp-runtime/registry
 */

import {
  ToolDefinition,
  ToolFunction,
  ToolResult,
  ToolParams,
  NormalizedParams,
  ToolRegistry,
  ToolRegistryEntry,
  CTP_VERSION,
  ToolResultMeta,
  validateToolDefinition,
  validateParameters,
  normalizeParams,
  mergeWithDefaults,
} from '@conveniencepro/ctp-core';

// =============================================================================
// REGISTRY IMPLEMENTATION
// =============================================================================

/**
 * Create a new tool registry
 */
export function createRegistry(): ToolRegistry {
  const tools = new Map<string, ToolRegistryEntry>();

  return {
    /**
     * Register a tool with its definition and implementation
     */
    register<T = Record<string, unknown>>(
      definition: ToolDefinition,
      fn: ToolFunction<T>
    ): void {
      // Validate definition
      const validation = validateToolDefinition(definition);
      if (!validation.valid) {
        const errors = validation.errors.map(e => `${e.field}: ${e.message}`).join(', ');
        throw new Error(`Invalid tool definition for "${definition.id}": ${errors}`);
      }

      // Check for duplicate
      if (tools.has(definition.id)) {
        throw new Error(`Tool "${definition.id}" is already registered`);
      }

      tools.set(definition.id, {
        definition,
        fn: fn as ToolFunction,
      });
    },

    /**
     * Get a tool by ID
     */
    get(id: string): ToolRegistryEntry | undefined {
      return tools.get(id);
    },

    /**
     * Check if a tool exists
     */
    has(id: string): boolean {
      return tools.has(id);
    },

    /**
     * Get all registered tool IDs
     */
    list(): string[] {
      return Array.from(tools.keys());
    },

    /**
     * Get all tool definitions
     */
    definitions(): ToolDefinition[] {
      return Array.from(tools.values()).map(entry => entry.definition);
    },

    /**
     * Get tools by category
     */
    getByCategory(category: string): ToolRegistryEntry[] {
      return Array.from(tools.values()).filter(
        entry => entry.definition.category === category
      );
    },

    /**
     * Search tools by tags
     */
    searchByTags(tags: string[]): ToolRegistryEntry[] {
      const lowerTags = tags.map(t => t.toLowerCase());
      return Array.from(tools.values()).filter(entry =>
        entry.definition.tags.some(t => lowerTags.includes(t.toLowerCase()))
      );
    },

    /**
     * Execute a tool by ID
     */
    async execute<T = Record<string, unknown>>(
      id: string,
      params: ToolParams
    ): Promise<ToolResult<T>> {
      const startTime = Date.now();
      const entry = tools.get(id);

      if (!entry) {
        return {
          success: false,
          error: `Tool not found: ${id}`,
          errorCode: 'TOOL_NOT_FOUND',
        };
      }

      try {
        // Normalize and merge with defaults
        const normalized = normalizeParams(params);
        const merged = mergeWithDefaults(normalized, entry.definition);

        // Validate parameters
        const validation = validateParameters(merged, entry.definition);
        if (!validation.valid) {
          return {
            success: false,
            error: 'Validation failed',
            errorCode: 'VALIDATION_ERROR',
            validationErrors: validation.errors,
          } as ToolResult<T>;
        }

        // Execute the tool
        const result = await entry.fn(merged);
        const duration = Date.now() - startTime;

        // Add metadata
        const meta: ToolResultMeta = {
          toolId: id,
          protocolVersion: CTP_VERSION,
          timestamp: new Date().toISOString(),
          durationMs: duration,
          executedOn: typeof window !== 'undefined' ? 'client' : 'server',
        };

        return {
          ...result,
          _meta: meta,
        } as ToolResult<T>;
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          errorCode: 'EXECUTION_ERROR',
        };
      }
    },
  };
}

// =============================================================================
// GLOBAL REGISTRY
// =============================================================================

/**
 * Global registry instance
 */
let globalRegistry: ToolRegistry | null = null;

/**
 * Get or create the global registry
 */
export function getGlobalRegistry(): ToolRegistry {
  if (!globalRegistry) {
    globalRegistry = createRegistry();
  }
  return globalRegistry;
}

/**
 * Reset the global registry (useful for testing)
 */
export function resetGlobalRegistry(): void {
  globalRegistry = null;
}

// =============================================================================
// CONVENIENCE FUNCTIONS
// =============================================================================

/**
 * Register a tool in the global registry
 */
export function registerTool<T = Record<string, unknown>>(
  definition: ToolDefinition,
  fn: ToolFunction<T>
): void {
  getGlobalRegistry().register(definition, fn);
}

/**
 * Execute a tool from the global registry
 */
export async function executeTool<T = Record<string, unknown>>(
  id: string,
  params: ToolParams
): Promise<ToolResult<T>> {
  return getGlobalRegistry().execute<T>(id, params);
}

/**
 * Get a tool from the global registry
 */
export function getTool(id: string): ToolRegistryEntry | undefined {
  return getGlobalRegistry().get(id);
}

/**
 * Check if a tool exists in the global registry
 */
export function hasTool(id: string): boolean {
  return getGlobalRegistry().has(id);
}

/**
 * List all tools in the global registry
 */
export function listTools(): string[] {
  return getGlobalRegistry().list();
}

/**
 * Get all definitions from the global registry
 */
export function getAllDefinitions(): ToolDefinition[] {
  return getGlobalRegistry().definitions();
}

// =============================================================================
// BATCH EXECUTION
// =============================================================================

/**
 * Batch execution request
 */
export interface BatchRequest {
  id: string;
  toolId: string;
  params: ToolParams;
}

/**
 * Batch execution result
 */
export interface BatchResult<T = Record<string, unknown>> {
  id: string;
  toolId: string;
  result: ToolResult<T>;
}

/**
 * Execute multiple tools in parallel
 */
export async function executeBatch(
  requests: BatchRequest[],
  registry?: ToolRegistry
): Promise<BatchResult[]> {
  const reg = registry || getGlobalRegistry();

  const promises = requests.map(async (request): Promise<BatchResult> => {
    const result = await reg.execute(request.toolId, request.params);
    return {
      id: request.id,
      toolId: request.toolId,
      result,
    };
  });

  return Promise.all(promises);
}

/**
 * Execute tools sequentially (for dependent operations)
 */
export async function executeSequential(
  requests: BatchRequest[],
  registry?: ToolRegistry
): Promise<BatchResult[]> {
  const reg = registry || getGlobalRegistry();
  const results: BatchResult[] = [];

  for (const request of requests) {
    const result = await reg.execute(request.toolId, request.params);
    results.push({
      id: request.id,
      toolId: request.toolId,
      result,
    });

    // Stop on first failure if desired
    if (!result.success) {
      break;
    }
  }

  return results;
}

// =============================================================================
// TOOL BUILDER
// =============================================================================

/**
 * Fluent builder for creating tools
 */
export class ToolBuilder<T = Record<string, unknown>> {
  private definition: Partial<ToolDefinition> = {
    tags: [],
    parameters: [],
    method: 'GET',
  };
  private implementation?: ToolFunction<T>;

  /**
   * Set the tool ID
   */
  id(id: string): this {
    this.definition.id = id;
    return this;
  }

  /**
   * Set the tool name
   */
  name(name: string): this {
    this.definition.name = name;
    return this;
  }

  /**
   * Set the tool description
   */
  description(description: string): this {
    this.definition.description = description;
    return this;
  }

  /**
   * Set the tool category
   */
  category(category: string): this {
    this.definition.category = category;
    return this;
  }

  /**
   * Add tags
   */
  tags(...tags: string[]): this {
    this.definition.tags = [...(this.definition.tags || []), ...tags];
    return this;
  }

  /**
   * Set HTTP method
   */
  method(method: 'GET' | 'POST'): this {
    this.definition.method = method;
    return this;
  }

  /**
   * Add a parameter
   */
  param(param: import('@conveniencepro/ctp-core').ParameterSchema): this {
    this.definition.parameters = [...(this.definition.parameters || []), param];
    return this;
  }

  /**
   * Set output description
   */
  output(description: string): this {
    this.definition.outputDescription = description;
    return this;
  }

  /**
   * Set example
   */
  example(
    input: Record<string, unknown>,
    output: Record<string, unknown>
  ): this {
    this.definition.example = { input, output };
    return this;
  }

  /**
   * Set the implementation function
   */
  implement(fn: ToolFunction<T>): this {
    this.implementation = fn;
    return this;
  }

  /**
   * Build and register the tool
   */
  register(registry?: ToolRegistry): ToolDefinition {
    if (!this.implementation) {
      throw new Error('Tool implementation is required');
    }

    const definition = this.definition as ToolDefinition;
    const reg = registry || getGlobalRegistry();
    reg.register(definition, this.implementation);

    return definition;
  }

  /**
   * Build without registering (for testing)
   */
  build(): { definition: ToolDefinition; fn: ToolFunction<T> } {
    if (!this.implementation) {
      throw new Error('Tool implementation is required');
    }

    return {
      definition: this.definition as ToolDefinition,
      fn: this.implementation,
    };
  }
}

/**
 * Create a new tool builder
 */
export function tool<T = Record<string, unknown>>(): ToolBuilder<T> {
  return new ToolBuilder<T>();
}
