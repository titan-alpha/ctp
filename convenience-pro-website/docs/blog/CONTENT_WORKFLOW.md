# Blog Content Workflow

This document describes the content workflow for maintaining 1-3 blog posts per day on ConveniencePro.

## Overview

The blog operates on a structured pipeline from idea to publication, with automated tools to support high-volume publishing while maintaining quality.

**Target Publishing Rate:** 1-3 posts per day (7-21 posts per week)

**Content Focus Areas:**
- Privacy-first development
- Agentic AI and tool execution
- Open standards (MCP, agents.json)
- Developer tool architecture
- Client-side technologies
- Trust and verification
- AI accessibility
- Platform architecture
- Synthesis posts (connecting themes)

## Content Pipeline Stages

### 1. Idea Stage

**Goal:** Capture and refine post concepts

**Actions:**
- Add post to editorial calendar (`src/data/blog/editorial-calendar.ts`)
- Define working title and key points
- Identify narrative arc and dependencies
- List required research

**Tools:**
- Editorial calendar for tracking
- Research queue for papers and topics

**Quality Gate:**
- Working title defined
- At least 3 key points outlined
- Research needs identified
- Narrative arc assigned

**Move to Research when:**
- Research sources are identified
- Post has clear value proposition

---

### 2. Research Stage

**Goal:** Gather sources and validate concepts

**Actions:**
- Read papers and documentation (see `src/data/blog/research-queue.ts`)
- Take notes on key findings
- Validate technical claims
- Identify related posts and citations

**Tools:**
- Research queue for paper tracking
- Citation management in frontmatter

**Quality Gate:**
- All critical papers read
- Key findings documented
- Technical details verified
- Citations prepared

**Move to Drafting when:**
- Research is complete
- You have enough material for 2000+ words

---

### 3. Drafting Stage

**Goal:** Write the post

**Actions:**
- Generate post file: `npm run new-post <slug>`
- Write content following the template
- Add code examples and diagrams
- Include citations and references
- Add quiz (optional but recommended)

**Tools:**
- `scripts/blog/new-post.ts` - Generate post from template
- Blog post template with pre-filled sections

**Quality Gate:**
- Post is 2000-3000 words (target)
- All key points covered
- Code examples tested
- Citations properly formatted
- Frontmatter complete (title, excerpt, tags, date)

**Move to Review when:**
- Draft is complete
- Self-review done
- All sections filled in

---

### 4. Review Stage

**Goal:** Ensure quality and accuracy

**Actions:**
- Technical review
- Editorial review (tone, clarity, flow)
- Fact-check citations
- Verify code examples
- Check for SEO optimization

**Checklist:**
- [ ] Title is compelling and SEO-friendly
- [ ] Excerpt accurately summarizes the post
- [ ] Tags are relevant and consistent
- [ ] All links work
- [ ] Code examples are tested
- [ ] Citations are properly formatted
- [ ] Quiz is relevant (if included)
- [ ] No typos or grammatical errors
- [ ] Narrative flow is clear

**Move to Scheduled when:**
- All review items pass
- Post meets quality standards

---

### 5. Scheduled Stage

**Goal:** Queue for publication

**Actions:**
- Set `status: 'scheduled'` in editorial calendar
- Verify publication date is correct
- Ensure dependencies are published first
- Prepare social media posts (if applicable)

**Quality Gate:**
- Post is complete and approved
- Publication date is set
- No blockers or dependencies

**Move to Published when:**
- Publication date arrives
- Post is live on the blog

---

### 6. Published Stage

**Goal:** Post is live

**Actions:**
- Update status to `published` in editorial calendar
- Monitor analytics
- Respond to comments/feedback
- Identify follow-up topics

**Post-Publication:**
- Track engagement metrics
- Note lessons learned
- Update related posts with links
- Add to relevant collections

---

## Daily Workflow

### Morning (30 minutes)

1. **Check schedule**: `npm run check-schedule`
   - Review posts scheduled for today
   - Identify any blockers or issues
   - Prioritize urgent tasks

2. **Review attention items**
   - Address high-priority issues
   - Update post statuses

3. **Plan the day**
   - Decide which posts to work on
   - Allocate time for research, drafting, or review

### Midday (2-3 hours)

**Focus Time for Writing**

- Work on drafting new posts
- If drafting: Aim for 1000-1500 words per session
- If researching: Read 1-2 papers
- If reviewing: Review 2-3 posts

### Afternoon (1 hour)

1. **Move posts forward**
   - Move completed drafts to review
   - Move approved posts to scheduled
   - Update editorial calendar

2. **Research queue maintenance**
   - Add new papers to queue
   - Update research notes
   - Identify new post ideas

### End of Day (15 minutes)

1. **Quick status check**: `npm run check-schedule`
2. **Update tomorrow's plan**
3. **Note any blockers or needs**

---

## Weekly Workflow

### Monday: Planning

- Run `npm run find-gaps` to identify content gaps
- Review next 2 weeks of schedule
- Prioritize posts based on deadlines and dependencies
- Assign posts to authors (if applicable)

### Wednesday: Mid-Week Check

- Run `npm run check-schedule`
- Address any high-priority attention items
- Review progress against weekly targets
- Adjust priorities if needed

### Friday: Review and Prep

- Review completed work for the week
- Move posts through pipeline
- Prep next week's posts
- Schedule posts for upcoming week
- Research queue cleanup

### Monthly: Strategy Review

- Analyze posting velocity and quality metrics
- Review narrative arc distribution
- Assess content gaps
- Update editorial calendar for next 90 days
- Research topic planning

---

## Automation Scripts

### Generate New Post

```bash
npm run new-post <slug>
```

Creates a new blog post file from template with:
- Pre-filled frontmatter from editorial calendar
- Structured content sections
- Research notes and dependencies
- Key points as section headers

**Example:**
```bash
npm run new-post privacy-first-architecture-principles
```

### Check Schedule

```bash
npm run check-schedule
```

Provides comprehensive schedule overview:
- Publishing velocity
- Upcoming posts (7 days)
- Posts needing attention
- Weekly schedule overview
- Pipeline status distribution
- Health score

**Run:** Daily or when making schedule changes

### Find Gaps

```bash
npm run find-gaps
```

Identifies content gaps:
- Narrative arc distribution
- Temporal gaps (underplanned weeks)
- Dependency issues
- Research coverage
- Topic diversity
- Recommendations

**Run:** Weekly or when planning new content

---

## Quality Gates

### Before Publishing

Every post must meet these criteria:

1. **Content Quality**
   - 2000-3000 words (target)
   - Clear narrative flow
   - Well-structured sections
   - Compelling introduction and conclusion

2. **Technical Accuracy**
   - Code examples tested
   - Citations verified
   - Technical claims fact-checked
   - Links working

3. **SEO Optimization**
   - Keyword-rich title
   - Meta description (excerpt)
   - Relevant tags (3-5)
   - Internal links to related posts

4. **Completeness**
   - All frontmatter fields filled
   - Images optimized (if used)
   - Quiz included (recommended)
   - Related posts linked

---

## Research Process

### Adding Research Papers

Add to `src/data/blog/research-queue.ts`:

```typescript
{
  id: 'unique-id',
  title: 'Paper Title',
  authors: ['Author Names'],
  year: 2024,
  type: 'arxiv',
  arxivId: '2401.12345',
  url: 'https://arxiv.org/abs/2401.12345',
  status: 'queued',
  priority: 'high',
  relevantTo: ['post-slug-1', 'post-slug-2'],
  addedDate: '2025-12-22',
}
```

### Research Workflow

1. **Queue papers** relevant to upcoming posts
2. **Read and annotate** with key findings
3. **Update status** to 'read' when complete
4. **Reference in posts** and mark as 'cited'

---

## Narrative Arc Strategy

### Core Narrative Arcs

1. **Privacy-First** (~15% of content)
   - Privacy by design
   - Data minimization
   - Compliance and regulation

2. **AI Agents** (~20% of content)
   - Agentic AI architecture
   - Tool execution
   - Agent reasoning and planning

3. **Open Standards** (~15% of content)
   - MCP protocol
   - agents.json
   - Vendor extensions

4. **Dev Tools** (~15% of content)
   - Tool architecture
   - API design
   - Developer experience

5. **Client-Side Tech** (~15% of content)
   - Browser APIs
   - WebAssembly
   - Performance

6. **Trust & Verification** (~10% of content)
   - Security
   - Auditing
   - Transparency

7. **AI Accessibility** (~5% of content)
   - Inclusive design
   - WCAG compliance
   - Internationalization

8. **Platform Architecture** (~5% of content)
   - Scalability
   - System design
   - Performance optimization

9. **Synthesis** (~10% of content)
   - Posts connecting multiple themes
   - Big picture perspectives
   - Future-looking analysis

### Balancing Content

- Use `npm run find-gaps` to identify underrepresented arcs
- Plan synthesis posts quarterly to connect themes
- Build narrative progressions (posts that build on each other)

---

## Managing Dependencies

### Post Dependencies

Posts often build on previous content. Track dependencies in editorial calendar:

```typescript
{
  slug: 'advanced-topic',
  buildsUpon: ['foundational-topic-1', 'foundational-topic-2'],
  enablesFuture: ['future-topic-1', 'future-topic-2'],
  // ...
}
```

### Dependency Rules

1. **Schedule dependencies first** - Foundational posts before advanced topics
2. **Link to dependencies** - Include "Building on Previous Work" section
3. **Verify dependencies** - Run `npm run find-gaps` to check for issues
4. **Plan progressions** - Create series of related posts

---

## Scaling to 1-3 Posts Per Day

### Strategies

1. **Batch Research**
   - Read multiple papers at once
   - Take comprehensive notes
   - Extract insights for multiple posts

2. **Template-Driven Writing**
   - Use `new-post` script for consistency
   - Follow established structures
   - Reuse successful patterns

3. **Pipeline Management**
   - Always have 10+ posts in drafting
   - Keep 5+ posts in review
   - Schedule 2 weeks ahead

4. **Time Blocking**
   - Research: Morning
   - Writing: Midday
   - Editing: Afternoon

5. **Automation**
   - Use scripts for routine tasks
   - Automated quality checks
   - Template-based generation

### Avoiding Burnout

- **Rotate topics** - Don't write same arc twice in a row
- **Vary depth** - Mix deep dives with lighter content
- **Batch similar tasks** - Group research, writing, editing
- **Build buffer** - Stay 1-2 weeks ahead of schedule
- **Quality over quantity** - Better to miss a day than publish poor content

---

## Metrics and KPIs

### Track These Metrics

1. **Publishing Velocity**
   - Posts per week
   - Posts per narrative arc
   - Time from idea to published

2. **Quality Indicators**
   - Average word count
   - Citation rate
   - Internal linking
   - Quiz inclusion rate

3. **Pipeline Health**
   - Posts at each stage
   - Bottlenecks
   - Average time per stage

4. **Content Balance**
   - Distribution by narrative arc
   - Synthesis post ratio
   - Research-backed vs practical

### Monthly Review

Use `npm run check-schedule` and `npm run find-gaps` to generate:

- Publishing velocity report
- Content distribution analysis
- Pipeline bottleneck identification
- Recommendations for next month

---

## Troubleshooting

### "Not Enough Posts Scheduled"

**Solution:**
1. Run `npm run find-gaps` to identify underplanned weeks
2. Move posts from idea/research to drafting
3. Generate post ideas from research queue
4. Reduce scope of some posts to speed completion

### "Too Many Posts in Review"

**Solution:**
1. Prioritize by publication date
2. Batch review similar posts
3. Create review checklist for faster processing
4. Consider reducing review depth for timely content

### "Research Bottleneck"

**Solution:**
1. Batch research sessions
2. Use research queue to parallelize
3. Create posts that require less research
4. Build on existing research

### "Running Out of Ideas"

**Solution:**
1. Check research queue for post ideas
2. Review content gaps analysis
3. Build on recent posts (sequels/deep dives)
4. Respond to community questions
5. Review industry news and trends

---

## Best Practices

### Writing

1. **Lead with value** - Tell readers why this matters upfront
2. **Use concrete examples** - Code snippets, diagrams, real scenarios
3. **Build progressively** - Start simple, add complexity
4. **Link internally** - Connect to related posts
5. **Include quiz** - Reinforce key concepts

### Research

1. **Start broad** - Survey field before deep dive
2. **Take notes immediately** - Capture insights when reading
3. **Track sources** - Add to research queue as you find them
4. **Verify claims** - Don't trust single sources
5. **Note gaps** - Identify topics needing more research

### Scheduling

1. **Build buffer** - Stay 2+ weeks ahead
2. **Balance arcs** - Don't cluster same topics
3. **Plan progressions** - Series of related posts
4. **Respect dependencies** - Publish foundations first
5. **Monitor velocity** - Adjust if falling behind

---

## Tools Reference

### Files

- `src/data/blog/editorial-calendar.ts` - 90-day content calendar
- `src/lib/content-pipeline.ts` - Pipeline management functions
- `src/data/blog/research-queue.ts` - Research papers and topics
- `content/blog/*.md` - Published blog posts

### Scripts

- `scripts/blog/new-post.ts` - Generate new post
- `scripts/blog/check-schedule.ts` - Schedule health check
- `scripts/blog/find-gaps.ts` - Content gap analysis

### NPM Commands

```bash
npm run new-post <slug>      # Create new post
npm run check-schedule        # Check schedule health
npm run find-gaps            # Analyze content gaps
```

---

## Getting Started

### First Time Setup

1. Review editorial calendar (`src/data/blog/editorial-calendar.ts`)
2. Run `npm run check-schedule` to see current status
3. Run `npm run find-gaps` to identify priorities
4. Pick highest priority post and run `npm run new-post <slug>`
5. Start writing!

### Daily Routine

1. Morning: `npm run check-schedule`
2. Work session: Write/research/review
3. End of day: Update statuses, plan tomorrow

### Weekly Routine

1. Monday: `npm run find-gaps` + plan week
2. Wednesday: `npm run check-schedule` + adjust
3. Friday: Review progress + prep next week

---

## Support

For questions or issues with the content workflow:

1. Check this documentation
2. Run automation scripts for diagnostics
3. Review example posts in `content/blog/`
4. Consult editorial calendar for structure

---

**Remember:** Consistency is key. It's better to publish 1-2 solid posts per day consistently than to batch publish 10 posts irregularly. Use the tools, follow the process, and maintain quality standards.
