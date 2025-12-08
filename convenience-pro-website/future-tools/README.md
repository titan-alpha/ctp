# Future Tools Roadmap

**Purpose**: Stratified, prioritized list of tools to build
**Source**: GitHub feedback analysis + strategic planning
**Status**: Separate git repository (init required)

---

## ⚠️ MANDATORY: Check for Duplicates First

**Before analyzing OR building ANY tool, read**:
- `DUPLICATE_CHECK_PROTOCOL.md`

Prevents wasted effort on tools that already exist.

---

## Structure

```
future-tools/
├── README.md                    # This file
├── TEMPLATE.md                  # Tool analysis template
├── high-priority/              # Build next (P0-P1)
├── medium-priority/            # Build later (P2)
├── low-priority/               # Backlog (P3)
└── analyzed-feedback/          # Processed GitHub issues
```

## Priority Criteria

### High Priority (P0-P1)
- Safety Score: 9-10
- Value Score: 8-10
- Traffic Projection: >10K/mo
- Complexity: Low-Medium
- Competitive Gap: High demand, few quality alternatives

### Medium Priority (P2)
- Safety Score: 7-10
- Value Score: 6-8
- Traffic Projection: 5K-10K/mo
- Complexity: Medium
- Competitive Gap: Moderate demand

### Low Priority (P3)
- Safety Score: 5-10
- Value Score: 4-6
- Traffic Projection: <5K/mo
- Complexity: High
- Competitive Gap: Low demand or saturated market

## Workflow

1. Engineering team pulls from `conveniencepro/feedback` repo
2. Analyzes each issue using TEMPLATE.md
3. Ranks by safety, value, traffic, complexity
4. Places in appropriate priority folder
5. COO reviews and approves
6. Engineering builds from high-priority/ first
