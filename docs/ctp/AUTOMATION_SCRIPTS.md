# CTP Migration Automation Scripts

## Overview

Automation scripts to accelerate the migration of 388 tools to CTP format. These scripts reduce manual work by 50-70% for Tier 1-2 tools.

---

## Script 1: Registry Entry Generator

### Purpose
Convert existing Tool definitions to CTP ExtendedToolDefinition format.

### Usage
```bash
node scripts/generate-ctp-registry-entry.js --tool=<tool-id> [options]
```

### Options
- `--tool=<id>` - Tool ID from existing registry
- `--category=<name>` - Filter to specific category
- `--output=<file>` - Output file (default: stdout)
- `--append` - Append to tools-registry-ctp.ts

### Implementation Pseudocode
```javascript
// Read existing tool definition
const tool = findToolById(toolId)

// Map field types
const parameters = tool.parameters?.map(param => ({
  name: param.name,
  type: mapFieldType(param.type), // text, textarea, number, boolean, select
  label: param.label,
  description: param.description,
  required: param.required || false,
  default: param.default,
  placeholder: param.placeholder,
  options: param.options // for select type
}))

// Generate CTP entry
const ctpTool = {
  id: tool.id,
  name: tool.name,
  description: tool.description,
  category: tool.category,
  tags: tool.keywords || [],
  method: detectMethod(parameters), // POST for mutations, GET for generators
  parameters: parameters,
  outputDescription: generateOutputDescription(tool),
  example: generateExample(tool, parameters),
  executionMode: 'client',
  icon: tool.icon || '🔧',
  embedUrl: `/embed/${tool.id}`,
  hasApi: true,
  isEmbeddable: true,
  hasAiSupport: true,
  embed: {
    minHeight: 300,
    defaultWidth: 600,
    defaultHeight: 400,
    supportsAutoResize: true
  }
}

// Output formatted TypeScript
console.log(formatAsTSObject(ctpTool))
```

### Field Type Mapping
```javascript
function mapFieldType(uiType) {
  const mapping = {
    'text': 'text',
    'textarea': 'textarea',
    'number': 'number',
    'checkbox': 'boolean',
    'select': 'select',
    'radio': 'select',
    'date': 'text',
    'email': 'text',
    'url': 'text'
  }
  return mapping[uiType] || 'text'
}
```

---

## Script 2: Tool Implementation Generator

### Purpose
Generate CTP tool function skeleton from registry entry.

### Usage
```bash
node scripts/generate-ctp-tool.js --tool=<tool-id> [options]
```

### Options
- `--tool=<id>` - Tool ID
- `--template=<tier>` - Use template for tier (1-4)
- `--output=<dir>` - Output directory (default: src/tools/)

### Implementation Pseudocode
```javascript
// Read CTP registry entry
const toolDef = getCTPToolDefinition(toolId)

// Read existing hook for logic reference
const hookPath = `src/hooks/use${pascalCase(toolId)}.ts`
const existingHook = readFile(hookPath)

// Extract core logic patterns
const hasEncoding = toolId.includes('encoder') || toolId.includes('decoder')
const hasHashing = toolId.includes('hash') || toolId.includes('md5') || toolId.includes('sha')
const hasCalculation = toolDef.category === 'calculators'
const hasGeneration = toolDef.category === 'generators'

// Generate implementation
const template = selectTemplate(toolDef.complexity)

// Output
writeFile(`src/tools/${toolId}.ts`, generateToolImplementation(toolDef, template))
```

### Templates

#### Tier 1 Template (Simple)
```typescript
/**
 * ${TOOL_NAME}
 *
 * ${DESCRIPTION}
 */

import { success, failure } from '@conveniencepro/ctp-core'
import type { ToolResult } from '@conveniencepro/ctp-core'

export interface ${TOOL_NAME}Params {
  ${PARAMETERS}
}

export interface ${TOOL_NAME}Result {
  result: string
  ${ADDITIONAL_FIELDS}
}

export function ${toolName}Tool(params: ${TOOL_NAME}Params): ToolResult<${TOOL_NAME}Result> {
  // Validation
  if (!params.${REQUIRED_PARAM}) {
    return failure('${ERROR_MESSAGE}', 'MISSING_REQUIRED')
  }

  try {
    // Core logic
    const result = ${CORE_ALGORITHM}

    return success<${TOOL_NAME}Result>({
      result,
      ${ADDITIONAL_RETURN_FIELDS}
    })
  } catch (error) {
    return failure(
      error instanceof Error ? error.message : 'Execution failed',
      'EXECUTION_ERROR'
    )
  }
}

export default ${toolName}Tool
```

#### Tier 2 Template (Medium)
```typescript
/**
 * ${TOOL_NAME}
 *
 * ${DESCRIPTION}
 */

import { success, failure } from '@conveniencepro/ctp-core'
import type { ToolResult } from '@conveniencepro/ctp-core'

export interface ${TOOL_NAME}Params {
  ${PARAMETERS}
}

export interface ${TOOL_NAME}Result {
  ${RESULT_FIELDS}
}

/**
 * ${HELPER_FUNCTION_1}
 */
function ${helperName1}(${params}): ${returnType} {
  // Implementation
}

/**
 * ${HELPER_FUNCTION_2}
 */
function ${helperName2}(${params}): ${returnType} {
  // Implementation
}

export function ${toolName}Tool(params: ${TOOL_NAME}Params): ToolResult<${TOOL_NAME}Result> {
  // Validation
  const validationError = validateParams(params)
  if (validationError) {
    return failure(validationError, 'INVALID_INPUT')
  }

  try {
    // Complex logic
    const step1 = ${helperName1}(params)
    const step2 = ${helperName2}(step1)
    const result = finalizeResult(step2)

    return success<${TOOL_NAME}Result>(result)
  } catch (error) {
    return failure(
      error instanceof Error ? error.message : 'Execution failed',
      'EXECUTION_ERROR'
    )
  }
}

export default ${toolName}Tool
```

---

## Script 3: Hook Generator

### Purpose
Generate CTP-compatible React hook that wraps tool function.

### Usage
```bash
node scripts/generate-ctp-hook.js --tool=<tool-id> [options]
```

### Options
- `--tool=<id>` - Tool ID
- `--preserve-interface` - Maintain exact interface of original hook
- `--output=<dir>` - Output directory (default: src/hooks/)

### Implementation Pseudocode
```javascript
// Read existing hook interface
const originalHook = parseHookFile(`src/hooks/use${pascalCase(toolId)}.ts`)
const returnType = extractReturnType(originalHook)
const hookInterface = extractInterface(originalHook)

// Determine if we can use generic useToolExecution or need custom wrapper
const canUseGeneric = isCompatibleWithGeneric(hookInterface)

if (canUseGeneric) {
  generateGenericWrapper(toolId, hookInterface)
} else {
  generateCustomWrapper(toolId, originalHook, hookInterface)
}
```

### Template (Generic Wrapper)
```typescript
/**
 * ${TOOL_NAME} Hook - CTP Runtime Version
 *
 * CTP-compliant version that wraps the CTP tool implementation.
 * Provides same interface as original for backward compatibility.
 */

'use client'

import { useToolExecution } from '@/hooks/useToolExecution'
import ${toolName}Tool from '@/tools/${tool-id}'
import type { ${TOOL_NAME}Params, ${TOOL_NAME}Result } from '@/tools/${tool-id}'

export interface Use${TOOL_NAME}Return {
  ${INTERFACE_FIELDS}
}

/**
 * Custom hook for ${TOOL_NAME} using CTP runtime
 *
 * All execution happens via the CTP tool, ensuring consistency across
 * web UI, API endpoints, and AI integrations.
 */
export default function use${TOOL_NAME}Ctp(): Use${TOOL_NAME}Return {
  const {
    params,
    setParam,
    result,
    execute,
    copyToClipboard,
    copied
  } = useToolExecution<${TOOL_NAME}Params, ${TOOL_NAME}Result>(
    ${toolName}Tool,
    {
      ${INITIAL_PARAMS}
    },
    {
      autoExecute: ${AUTO_EXECUTE},
      debounceMs: ${DEBOUNCE_MS}
    }
  )

  // Map CTP result to original interface
  return {
    ${MAP_TO_ORIGINAL_INTERFACE}
  }
}
```

---

## Script 4: Batch Migration Tool

### Purpose
Migrate multiple tools at once with validation and reporting.

### Usage
```bash
node scripts/batch-migrate-ctp.js [options]
```

### Options
- `--category=<name>` - Category to migrate
- `--tier=<1-4>` - Complexity tier
- `--tools=<id1,id2,id3>` - Specific tool IDs
- `--limit=<n>` - Limit number of tools
- `--dry-run` - Show what would be done
- `--skip-tests` - Skip automated tests
- `--auto-commit` - Auto-commit after each tool

### Workflow
```javascript
async function batchMigrate(options) {
  // 1. Get list of tools to migrate
  const tools = getToolsToMigrate(options)

  console.log(`Found ${tools.length} tools to migrate`)

  const results = []

  for (const tool of tools) {
    console.log(`\nMigrating ${tool.id}...`)

    try {
      // 2. Generate registry entry
      const registryEntry = await generateRegistryEntry(tool.id)
      await appendToRegistry(registryEntry)

      // 3. Generate tool implementation
      const toolImpl = await generateToolImpl(tool.id)
      await writeFile(`src/tools/${tool.id}.ts`, toolImpl)

      // 4. Generate hook
      const hook = await generateHook(tool.id)
      await writeFile(`src/hooks/use${pascalCase(tool.id)}Ctp.ts`, hook)

      // 5. Register in API
      await addToApiRegistry(tool.id)

      // 6. Run tests
      if (!options.skipTests) {
        await runTests(tool.id)
      }

      // 7. Commit
      if (options.autoCommit) {
        await gitCommit(tool.id)
      }

      results.push({ tool: tool.id, status: 'success' })
      console.log(`✅ ${tool.id} migrated successfully`)

    } catch (error) {
      results.push({ tool: tool.id, status: 'error', error: error.message })
      console.error(`❌ ${tool.id} failed: ${error.message}`)
    }
  }

  // 8. Generate report
  generateMigrationReport(results)
}
```

### Report Format
```
CTP Migration Report
====================
Date: 2025-12-03
Category: text-tools
Tier: 1

Results:
--------
✅ base64-encoder (Success) - 23s
✅ url-encoder (Success) - 18s
✅ hash-generator (Success) - 21s
❌ complex-tool (Failed) - Error: Missing dependency
✅ case-converter (Success) - 16s

Summary:
--------
Total: 5 tools
Success: 4 (80%)
Failed: 1 (20%)
Total Time: 1m 38s
Average: 19.6s per tool

Failed Tools:
-------------
1. complex-tool: Missing dependency 'special-lib'

Next Steps:
-----------
1. Fix failed tools manually
2. Run tests on migrated tools
3. Update API documentation
4. Commit batch to git
```

---

## Script 5: Migration Progress Tracker

### Purpose
Track migration progress and generate status reports.

### Usage
```bash
node scripts/track-migration-progress.js [options]
```

### Options
- `--report` - Generate progress report
- `--category=<name>` - Filter by category
- `--export=<format>` - Export as json, csv, or markdown

### Implementation
```javascript
function generateProgressReport() {
  // Count tools in original registry
  const totalTools = countToolsInRegistry()

  // Count tools in CTP registry
  const migratedTools = countCTPTools()

  // Analyze by category
  const byCategory = analyzeByCategory()

  // Estimate remaining time
  const estimate = estimateRemainingTime(totalTools, migratedTools)

  return {
    total: totalTools,
    migrated: migratedTools,
    remaining: totalTools - migratedTools,
    percentage: (migratedTools / totalTools * 100).toFixed(1),
    byCategory: byCategory,
    estimate: estimate
  }
}
```

### Output Example
```markdown
# CTP Migration Progress

## Overall Progress
- Total Tools: 388
- Migrated: 10 (2.6%)
- Remaining: 378 (97.4%)

## By Category
| Category | Total | Migrated | Remaining | Progress |
|----------|-------|----------|-----------|----------|
| text-tools | 81 | 6 | 75 | 7.4% |
| calculators | 86 | 1 | 85 | 1.2% |
| converters | 69 | 0 | 69 | 0.0% |
| generators | 47 | 2 | 45 | 4.3% |
| image-tools | 42 | 0 | 42 | 0.0% |
| ai-tools | 36 | 1 | 35 | 2.8% |
| analyzers | 10 | 0 | 10 | 0.0% |
| pdf-tools | 9 | 0 | 9 | 0.0% |

## By Tier
| Tier | Count | Migrated | Remaining | Avg Time |
|------|-------|----------|-----------|----------|
| 1 (Simple) | 80 | 8 | 72 | 30 min |
| 2 (Medium) | 180 | 2 | 178 | 60 min |
| 3 (Complex) | 100 | 0 | 100 | 120 min |
| 4 (Very Complex) | 28 | 0 | 28 | 360 min |

## Time Estimate
- At current pace: 47 weeks
- With automation: 30 weeks
- With 2 developers: 20 weeks

## Next Milestone
- Target: 80 tools (Phase 2 complete)
- Remaining: 70 tools
- Estimated: 2-3 weeks
```

---

## Script 6: Validation & Testing

### Purpose
Validate migrated tools meet CTP standards.

### Usage
```bash
node scripts/validate-ctp-tool.js --tool=<tool-id>
```

### Checks
1. **Registry Entry Valid**
   - Has all required fields
   - Parameters have correct types
   - Example input/output provided
   - Tags and categories valid

2. **Implementation Valid**
   - Exports tool function
   - Uses CTP types correctly
   - Returns ToolResult format
   - Handles errors properly
   - Has JSDoc comments

3. **Hook Valid**
   - Imports tool function
   - Uses useToolExecution correctly
   - Exports proper interface
   - Maintains backward compatibility

4. **API Registered**
   - Added to TOOL_IMPLEMENTATIONS
   - Accessible via GET/POST
   - Returns proper response
   - CORS headers present

5. **Performance**
   - Execution time < 2x original
   - Memory usage reasonable
   - No memory leaks

### Output
```
Validating: base64-encoder
===========================

✅ Registry Entry
  ✅ Has id, name, description
  ✅ Has valid category
  ✅ Has parameters with types
  ✅ Has example input/output
  ✅ Has flags (hasApi, isEmbeddable, hasAiSupport)

✅ Implementation
  ✅ File exists: src/tools/base64-encoder.ts
  ✅ Exports tool function
  ✅ Uses ToolResult type
  ✅ Returns success/failure
  ✅ Has error handling
  ✅ Has JSDoc comments

✅ Hook
  ✅ File exists: src/hooks/useBase64Ctp.ts
  ✅ Imports tool function
  ✅ Uses useToolExecution
  ✅ Exports proper interface

✅ API Registration
  ✅ Added to TOOL_IMPLEMENTATIONS
  ✅ GET endpoint works
  ✅ POST endpoint works
  ✅ Returns valid JSON
  ✅ Has CORS headers

✅ Performance
  ✅ Execution time: 12ms (baseline: 8ms, 1.5x)
  ✅ Memory usage: 2.1 MB
  ✅ No memory leaks detected

Overall: ✅ PASS (All checks passed)
```

---

## Installation & Setup

### Prerequisites
```bash
npm install -D \
  typescript \
  @types/node \
  ts-node \
  commander \
  chalk \
  ora \
  prompts
```

### Directory Structure
```
convenience-pro/
├── scripts/
│   ├── generate-ctp-registry-entry.js
│   ├── generate-ctp-tool.js
│   ├── generate-ctp-hook.js
│   ├── batch-migrate-ctp.js
│   ├── track-migration-progress.js
│   ├── validate-ctp-tool.js
│   ├── lib/
│   │   ├── parsers.js      # Parse existing code
│   │   ├── generators.js    # Generate code
│   │   ├── templates.js     # Code templates
│   │   └── utils.js         # Utilities
│   └── package.json
```

### npm Scripts
```json
{
  "scripts": {
    "ctp:registry": "node scripts/generate-ctp-registry-entry.js",
    "ctp:tool": "node scripts/generate-ctp-tool.js",
    "ctp:hook": "node scripts/generate-ctp-hook.js",
    "ctp:migrate": "node scripts/batch-migrate-ctp.js",
    "ctp:progress": "node scripts/track-migration-progress.js --report",
    "ctp:validate": "node scripts/validate-ctp-tool.js"
  }
}
```

---

## Usage Examples

### Migrate a single tool
```bash
# Generate registry entry
npm run ctp:registry -- --tool=character-counter --append

# Generate implementation
npm run ctp:tool -- --tool=character-counter

# Generate hook
npm run ctp:hook -- --tool=character-counter

# Validate
npm run ctp:validate -- --tool=character-counter
```

### Migrate a batch of tools
```bash
# Dry run first
npm run ctp:migrate -- --category=text-tools --tier=1 --limit=10 --dry-run

# Actually migrate
npm run ctp:migrate -- --category=text-tools --tier=1 --limit=10 --auto-commit
```

### Check progress
```bash
# Terminal report
npm run ctp:progress

# Export to CSV
npm run ctp:progress -- --export=csv > migration-progress.csv

# Export to JSON
npm run ctp:progress -- --export=json > migration-progress.json
```

---

## Best Practices

1. **Always validate** after generating
2. **Test manually** before committing
3. **Migrate in batches** of 10 max
4. **Review generated code** - don't blindly trust
5. **Keep original files** until migration verified
6. **Document edge cases** that need manual fixes
7. **Update progress tracker** after each batch

---

**Document Version:** 1.0
**Last Updated:** 2025-12-03
