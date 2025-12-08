# Duplicate Check Protocol

**Purpose**: Prevent building tools that already exist
**Audience**: Product analysts, Engineering teams
**Status**: MANDATORY - check before analysis or implementation

---

## Check Before Analysis (Product Team)

### 1. Search Existing Tools

```bash
# Check tools data
grep -i "keyword" src/data/tools.ts

# Search tool names
grep -i "name.*keyword" src/data/tools.ts

# Search descriptions
grep -i "description.*keyword" src/data/tools.ts

# Search keywords
grep -i "keywords.*keyword" src/data/tools.ts
```

### 2. Browse Live Site

Visit: https://conveniencepro.cc/tools
- Search for related terms
- Check all categories
- Review similar functionality

### 3. Decision Tree

**Exact Duplicate Found**:
- STOP analysis
- Comment on GitHub issue: "Tool already exists: [URL]"
- Close issue as duplicate
- Label: `duplicate`

**Similar Tool Found**:
- Document in analysis: "Similar to [tool-name] but differs in [X]"
- Justify differentiation
- Proceed only if clear value-add
- Label GitHub issue: `enhancement` (if improving existing) or `related-tool`

**Enhancement to Existing Tool**:
- STOP new tool analysis
- Create enhancement spec instead
- Reference existing tool
- Document proposed improvements
- Label GitHub issue: `enhancement`

**No Duplicate**:
- Proceed with analysis
- Document checked tools in "Competitive Analysis" section
- Label GitHub issue: `analyzed`, `priority-[level]`

---

## Check Before Implementation (Engineering Team)

### 1. Verify Product Analysis

Read future-tools spec:
- Check "Competitive Analysis" section
- Verify no internal duplicates noted
- Confirm differentiation is clear

### 2. Final Code Check

```bash
# Search for similar components
find src/app -name "*[keyword]*"

# Search tool IDs
grep -r "id:.*keyword" src/data/tools.ts

# Check category
ls src/app/[category]/
```

### 3. Decision Tree

**Duplicate Found During Implementation**:
- STOP immediately
- Report to COO with evidence
- Update future-tools spec status: `BLOCKED - Duplicate`
- Request product re-analysis

**Similar Functionality**:
- Implement differentiation clearly
- Document in tool description
- Add comparison note in meta description

**No Duplicate**:
- Proceed with implementation
- Add to tools.ts with unique ID
- Ensure category is correct

---

## Common Duplicate Patterns

### Pattern 1: Different Name, Same Function
Example: "PDF Combiner" vs "PDF Merger"
- **Action**: Mark as duplicate
- **Resolution**: Use existing tool

### Pattern 2: Subset of Existing Tool
Example: "Email Validator" when "Email Checker" does validation + more
- **Action**: Mark as enhancement
- **Resolution**: Add feature to existing tool

### Pattern 3: Different Approach, Same Goal
Example: "QR Code Generator" and "Dynamic QR Code Generator"
- **Action**: Analyze differentiation
- **Resolution**: Proceed if clear unique value (e.g., different QR type support)

### Pattern 4: Category Confusion
Example: Tool exists in wrong category
- **Action**: Check all categories
- **Resolution**: Move/recategorize existing tool if needed

---

## Automated Checks (Future)

```bash
# Script to check for duplicates (future enhancement)
# node scripts/check-duplicate.js --keyword "pdf merge"
```

---

## Reporting Duplicates

### In GitHub Issue
```markdown
Duplicate of existing tool: [Tool Name]
URL: https://conveniencepro.cc/[category]/[tool-id]
Reason: [Exact same functionality | Subset of features | etc]
Recommendation: [Close | Enhance existing | etc]
```

### In Product Analysis
```markdown
## DUPLICATE DETECTED

**Existing Tool**: [Tool Name] ([URL])
**Overlap**: [Description]
**Differentiation**: [None | Limited | Clear]
**Recommendation**: REJECT - Duplicate
```

### In Engineering Blocker
```markdown
BLOCKED: Duplicate found during implementation

**Conflicting Tool**: [Tool Name]
**Code Location**: src/app/[category]/[tool-id]
**Status**: Halted implementation
**Next Steps**: Request product team re-analysis
```

---

## Best Practices

1. **Check early** - Before investing time in analysis
2. **Check categories** - Tool may exist in unexpected category
3. **Check keywords** - Similar tools may use different terminology
4. **Check live site** - Data file may not reflect all tools
5. **Document checks** - Note what you searched for
6. **When in doubt, ask** - Flag to COO for review

---

## Examples

### ✅ Good Check
```
Analyzed: "CSV to JSON Converter"
Searched: grep -i "csv\|json" src/data/tools.ts
Found: JSON Formatter (different function)
Found: CSV Viewer (different function)
Result: No duplicate, proceed
```

### ❌ Missed Duplicate
```
Analyzed: "PDF Splitter"
Searched: grep -i "splitter" src/data/tools.ts
Found: Nothing
Built: PDF Splitter tool
ERROR: PDF Page Extractor already exists (same functionality, different name)
```

### ✅ Caught Enhancement
```
Analyzed: "QR Code with Logo"
Searched: grep -i "qr" src/data/tools.ts
Found: QR Code Generator (basic)
Result: Enhancement request, not new tool
Action: Update existing tool to support logo upload
```

---

**Last Updated**: 2025-11-17
**Enforcement**: MANDATORY for all product analysis and engineering work
