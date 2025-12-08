# [Tool Name]

**GitHub Issue**: #[issue-number]
**Date Analyzed**: YYYY-MM-DD
**Analyst**: [Agent/Team Name]
**Status**: 🟡 Analysis | 🟢 Approved | 🔴 Rejected

---

## 0. Duplicate Check (MANDATORY FIRST STEP)

**Protocol**: Read `DUPLICATE_CHECK_PROTOCOL.md` before proceeding

**Searches Performed**:
```bash
grep -i "keyword" src/data/tools.ts
# [Document what you searched for]
```

**Results**:
- [ ] No duplicate found - proceed with analysis
- [ ] Duplicate found - STOP, close issue as duplicate
- [ ] Enhancement to existing tool - convert to enhancement request
- [ ] Similar tool exists - document differentiation below

**Existing Similar Tools**:
- [Tool Name] - [URL] - [How it differs]

---

## 1. Request Summary

**User Request**: [One sentence summary]
**Category**: [text-tools | image-tools | dev-tools | pdf-tools | etc]
**Proposed Name**: [tool-name-generator]

---

## 2. Safety Assessment

**Score**: [1-10] (10 = completely safe)

### Risks Identified
- [ ] Could generate malicious content
- [ ] Privacy/data exposure risk
- [ ] Legal/compliance issues
- [ ] Brand reputation risk
- [ ] Security vulnerabilities

### Mitigations
- [List mitigations or "None required"]

### Decision
- [ ] SAFE - Proceed
- [ ] CONDITIONAL - Proceed with mitigations
- [ ] UNSAFE - Reject

---

## 3. Value Assessment

**Score**: [1-10] (10 = extremely valuable)

### Market Research
- **Search Volume**: [X searches/mo] (source: [tool])
- **Competition**: [High/Medium/Low]
- **Quality Gap**: [Existing tools are: poor/adequate/excellent]
- **Monetization**: [Ad impressions/mo projection]

### User Benefit
- **Problem Solved**: [Description]
- **Time Saved**: [X minutes/task]
- **Frequency**: [Daily/Weekly/Monthly/Rare]

### Traffic Projection
- **Conservative**: [X visits/mo]
- **Realistic**: [X visits/mo]
- **Optimistic**: [X visits/mo]

---

## 4. Technical Complexity

**Score**: [1-10] (1 = trivial, 10 = extremely complex)

### Implementation
- **Frontend**: [Simple form | Complex UI | Interactive canvas | etc]
- **Processing**: [Client-side | Server API | External service]
- **Libraries**: [List required dependencies]
- **Edge Cases**: [List complexity factors]

### Estimated Effort
- **Development**: [X hours]
- **Testing**: [X hours]
- **Documentation**: [X hours]
- **Total**: [X hours]

---

## 5. Competitive Analysis

### Top 3 Competitors
1. **[Competitor Name]** - [URL]
   - Pros: [What they do well]
   - Cons: [Weaknesses/gaps]
   - Monetization: [Ads/Premium/Free]

2. **[Competitor Name]** - [URL]
   - Pros:
   - Cons:
   - Monetization:

3. **[Competitor Name]** - [URL]
   - Pros:
   - Cons:
   - Monetization:

### Our Advantage
- [How we'll differentiate]

---

## 6. Priority Ranking

### Scores Summary
- Safety: [X/10]
- Value: [X/10]
- Complexity: [X/10] (inverted: lower = better)
- Competition Gap: [High/Medium/Low]

### Calculated Priority
```
Priority Score = (Safety × 0.4) + (Value × 0.3) + ((10 - Complexity) × 0.2) + (Gap × 0.1)
              = [X/10]
```

### Classification
- [ ] **P0-P1**: High Priority (Score ≥ 8.0)
- [ ] **P2**: Medium Priority (Score 6.0-7.9)
- [ ] **P3**: Low Priority (Score < 6.0)
- [ ] **REJECT**: Do not build

---

## 7. Implementation Notes

### Requirements
- [Key feature 1]
- [Key feature 2]

### Technical Approach
- [How to implement]

### Integration
- **Category**: [existing category or new?]
- **Related Tools**: [Similar tools we have]
- **Cross-links**: [Tools to reference]

---

## 8. SEO & Marketing

### Target Keywords
1. [primary keyword] ([X searches/mo])
2. [secondary keyword] ([X searches/mo])
3. [tertiary keyword] ([X searches/mo])

### Meta Description
[Draft 150-char description]

### Content Strategy
- [Blog post ideas]
- [Tutorial topics]
- [Backlink opportunities]

---

## 9. Recommendation

### Decision
- [ ] **BUILD NOW** - High priority
- [ ] **BUILD LATER** - Medium priority
- [ ] **BACKLOG** - Low priority
- [ ] **REJECT** - Do not build

### Rationale
[2-3 sentence explanation]

### Next Steps
- [ ] Move to [priority] folder
- [ ] Assign to engineering
- [ ] Create implementation ticket
- [ ] Update roadmap

---

**Reviewed By**: [COO/Lead]
**Approved**: [Yes/No]
**Build Scheduled**: [Date or Sprint]
