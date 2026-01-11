# Blog Automation Quick Start Guide

Get started with the blog content scheduling and automation system in 5 minutes.

## What's New

This system adds:

- **90-day editorial calendar** with 50+ pre-planned posts
- **Automated post generation** from templates
- **Schedule health monitoring** with alerts
- **Content gap analysis** for balanced coverage
- **Research queue** for papers and citations
- **Pipeline management** from idea to publication

## Three Essential Commands

### 1. Check Schedule Health

```bash
npm run check-schedule
```

**What it does:**
- Shows posts scheduled for next 7 days
- Identifies posts needing attention
- Calculates health score (0-100)
- Provides recommendations

**When to run:** Daily, or before making schedule changes

### 2. Create New Post

```bash
npm run new-post <slug>
```

**Example:**
```bash
npm run new-post privacy-first-architecture-principles
```

**What it does:**
- Looks up post in editorial calendar
- Generates markdown file with frontmatter
- Creates structured content sections
- Includes research notes and key points

**When to run:** When starting to draft a new post

### 3. Find Content Gaps

```bash
npm run find-gaps
```

**What it does:**
- Analyzes narrative arc distribution
- Identifies underplanned weeks
- Checks dependency issues
- Suggests topics to fill gaps

**When to run:** Weekly, when planning new content

## File Locations

### Editorial Calendar
`src/data/blog/editorial-calendar.ts`

Contains 50+ scheduled posts for next 90 days. Each post includes:
- Planned publication date
- Status (idea, research, drafting, review, scheduled, published)
- Narrative arc (theme)
- Key points to cover
- Research required
- Dependencies (posts it builds upon)

### Research Queue
`src/data/blog/research-queue.ts`

Tracks:
- Research papers to read
- Research topics to explore
- Post ideas in backlog

### Content Pipeline Functions
`src/lib/content-pipeline.ts`

Functions for:
- Validating post readiness
- Getting upcoming posts
- Identifying issues
- Managing dependencies

### Blog Posts
`content/blog/*.md`

Published and draft blog posts

## Daily Workflow

### Morning (10 minutes)

```bash
npm run check-schedule
```

Review:
- Posts scheduled today
- Any high-priority alerts
- Health score

### Midday (2-3 hours)

Pick a post from the calendar and create it:

```bash
npm run new-post <slug>
```

Write 1000-1500 words, following the template structure.

### End of Day (5 minutes)

Update the editorial calendar status:
- Move completed drafts to `review`
- Move approved posts to `scheduled`
- Update any blockers or notes

## Weekly Workflow

### Monday - Plan the Week

```bash
npm run find-gaps
npm run check-schedule
```

- Review upcoming week
- Identify priorities
- Address any gaps

### Friday - Review Progress

```bash
npm run check-schedule
```

- Check velocity
- Move posts through pipeline
- Plan next week

## Understanding the Editorial Calendar

Open `src/data/blog/editorial-calendar.ts` to see scheduled posts.

### Post Structure

```typescript
{
  slug: 'privacy-first-architecture-principles',
  plannedDate: '2025-12-23',
  status: 'idea',
  narrativeArc: 'privacy-first',

  buildsUpon: [
    'building-privacy-first-developer-tools',
    'architecture-of-trust-tools-cant-betray'
  ],
  enablesFuture: [
    'gdpr-compliance-by-design',
    'zero-knowledge-developer-tools'
  ],

  researchRequired: [
    'Privacy by Design principles (Ann Cavoukian)',
    'GDPR technical requirements',
    'Zero-trust architecture patterns'
  ],

  keyPoints: [
    'Seven principles of privacy by design',
    'How architecture enforces privacy',
    'Trade-offs between convenience and privacy'
  ],

  priority: 'high',
  title: 'Privacy-First Architecture: Beyond Compliance'
}
```

### Post Status Flow

```
idea → research → drafting → review → scheduled → published
```

## Using the Automation Scripts

### Generate a New Post

1. Find a post in the editorial calendar with status `idea` or `research`
2. Run: `npm run new-post <slug>`
3. Edit the generated file in `content/blog/<slug>.md`
4. Fill in the content sections (marked with comments)
5. Update status in editorial calendar when done

### Check Schedule Health

Run `npm run check-schedule` to see:

**Publishing Velocity:**
- Posts published last week
- Average posts per week
- Target (14 posts/week = 2/day)

**Upcoming Posts:**
- What's scheduled for next 7 days
- Status of each post
- Any blockers

**Posts Needing Attention:**
- Overdue posts
- Posts scheduled soon but not ready
- Critical priority items

**Weekly Schedule:**
- Next 4 weeks overview
- Posts per week
- On-track / under-planned status

**Health Score:**
- 90-100: Excellent
- 70-89: Good
- 50-69: Needs attention
- <50: Critical

### Find Content Gaps

Run `npm run find-gaps` to analyze:

**Narrative Arc Distribution:**
- How many posts per theme
- Underrepresented themes
- Suggested topics

**Temporal Gaps:**
- Weeks with too few posts
- Scheduling recommendations

**Dependency Issues:**
- Posts referencing unpublished content
- Ordering problems

**Research Coverage:**
- Papers queued vs read
- Research topics in progress
- Post ideas ready to schedule

## Narrative Arcs (Themes)

Posts are organized into 9 themes:

1. **privacy-first** - Privacy-focused development
2. **ai-agents** - Agentic AI and tool execution
3. **open-standards** - MCP, agents.json
4. **dev-tools** - Developer tool architecture
5. **client-side-tech** - Browser APIs, WebAssembly
6. **trust-verification** - Security, auditing
7. **ai-accessibility** - Accessible AI
8. **platform-architecture** - System design
9. **synthesis** - Posts connecting multiple themes

## Quality Standards

Every post should have:

- **2000-3000 words**
- **Clear structure** with sections
- **Code examples** (where applicable)
- **3-5 tags**
- **Internal links** to related posts
- **Citations** for research-backed claims
- **Quiz** (recommended)

## Common Tasks

### Add a New Post to Calendar

Edit `src/data/blog/editorial-calendar.ts`:

```typescript
export const editorialCalendar: ScheduledPost[] = [
  // ... existing posts
  {
    slug: 'your-new-post',
    plannedDate: '2026-01-20',
    status: 'idea',
    narrativeArc: 'privacy-first',
    buildsUpon: [],
    enablesFuture: [],
    researchRequired: [],
    keyPoints: [
      'First key point',
      'Second key point',
    ],
    priority: 'medium',
    title: 'Your New Post Title',
  },
]
```

### Add a Research Paper

Edit `src/data/blog/research-queue.ts`:

```typescript
export const researchQueue: ResearchPaper[] = [
  // ... existing papers
  {
    id: 'unique-id',
    title: 'Paper Title',
    authors: ['Author Name'],
    year: 2024,
    type: 'arxiv',
    arxivId: '2401.12345',
    url: 'https://arxiv.org/abs/2401.12345',
    status: 'queued',
    priority: 'high',
    relevantTo: ['post-slug'],
    addedDate: '2025-12-22',
  },
]
```

### Move Post Through Pipeline

Edit the post's `status` in `editorial-calendar.ts`:

- `idea` → `research` (start researching)
- `research` → `drafting` (start writing)
- `drafting` → `review` (ready for review)
- `review` → `scheduled` (approved)
- `scheduled` → `published` (post is live)

## Troubleshooting

### "Health score is low"

1. Run `npm run check-schedule` to see issues
2. Address high-priority items first
3. Move posts forward in pipeline
4. Schedule more posts if needed

### "Week is underplanned"

1. Run `npm run find-gaps` to see which weeks
2. Add more posts to editorial calendar for those weeks
3. Or move existing posts to fill gaps

### "Post has blockers"

Check the validation output from `check-schedule`:
- Missing dependencies? Publish them first
- Missing research? Read required papers
- Missing content? Complete the draft

## Next Steps

1. **Read the full workflow:** `docs/blog/CONTENT_WORKFLOW.md`
2. **Explore the calendar:** `src/data/blog/editorial-calendar.ts`
3. **Try the scripts:** Run each command to see what they do
4. **Create your first post:** Pick a post and run `npm run new-post <slug>`

## Support

- **Full workflow:** `docs/blog/CONTENT_WORKFLOW.md`
- **Editorial calendar:** `src/data/blog/editorial-calendar.ts`
- **Research queue:** `src/data/blog/research-queue.ts`
- **Example posts:** `content/blog/*.md`

---

**Remember:** The goal is 1-3 posts per day (7-21 per week). Use the automation tools to maintain quality while hitting this target.
