/**
 * @conveniencepro/ctp-examples
 *
 * Example tool implementations for the ConveniencePro Tool Protocol.
 * Demonstrates best practices and patterns for building CTP tools.
 *
 * @packageDocumentation
 * @module @conveniencepro/ctp-examples
 * @version 1.0.0
 */

import { createRegistry } from '@conveniencepro/ctp-runtime';
import type { ToolDefinition, ToolFunction, ToolRegistry } from '@conveniencepro/ctp-core';

// Import tools
import jsonFormatter from './tools/json-formatter';
import base64Encoder from './tools/base64-encoder';
import hashGenerator from './tools/hash-generator';

// =============================================================================
// TOOL EXPORTS
// =============================================================================

export { jsonFormatterDefinition, jsonFormatterFn } from './tools/json-formatter';
export { base64EncoderDefinition, base64EncoderFn } from './tools/base64-encoder';
export { hashGeneratorDefinition, hashGeneratorFn } from './tools/hash-generator';

// =============================================================================
// TOOL COLLECTION
// =============================================================================

/**
 * Tool entry with definition and function
 */
export interface ToolEntry {
  definition: ToolDefinition;
  fn: ToolFunction<unknown>;
}

/**
 * All example tools
 */
export const exampleTools: ToolEntry[] = [
  jsonFormatter,
  base64Encoder,
  hashGenerator,
];

/**
 * Get all tool definitions
 */
export function getToolDefinitions(): ToolDefinition[] {
  return exampleTools.map((tool) => tool.definition);
}

/**
 * Get tool by ID
 */
export function getToolById(id: string): ToolEntry | undefined {
  return exampleTools.find((tool) => tool.definition.id === id);
}

// =============================================================================
// REGISTRY INTEGRATION
// =============================================================================

/**
 * Create a registry with all example tools pre-registered
 */
export function createExampleRegistry(): ToolRegistry {
  const registry = createRegistry();

  for (const tool of exampleTools) {
    registry.register(tool.definition, tool.fn);
  }

  return registry;
}

/**
 * Register all example tools in an existing registry
 */
export function registerExampleTools(registry: ToolRegistry): void {
  for (const tool of exampleTools) {
    registry.register(tool.definition, tool.fn);
  }
}

// =============================================================================
// DEFAULT EXPORT
// =============================================================================

export default {
  tools: exampleTools,
  getDefinitions: getToolDefinitions,
  getById: getToolById,
  createRegistry: createExampleRegistry,
  register: registerExampleTools,
};
