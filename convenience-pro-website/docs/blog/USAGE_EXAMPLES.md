# Blog Internal Linking - Usage Examples

Quick-start examples for using the internal linking system in your blog posts.

## Table of Contents

- [Basic Blog Post Setup](#basic-blog-post-setup)
- [Post with Prerequisites](#post-with-prerequisites)
- [Post in a Reading Sequence](#post-in-a-reading-sequence)
- [Synthesis Post](#synthesis-post)
- [Landing Page with All Sequences](#landing-page-with-all-sequences)
- [Topic Exploration Page](#topic-exploration-page)
- [Sidebar Navigation](#sidebar-navigation)

---

## Basic Blog Post Setup

Minimal setup with related reading at the end:

```tsx
// content/blog/your-new-post.mdx

import { RelatedReading } from '@/components/blog/RelatedReading';

export const allPosts = await loadAllPosts();

---
title: "Your Blog Post Title"
date: 2025-12-22
tags: ["tag1", "tag2", "tag3"]
excerpt: "Brief description of your post..."
---

# Your Blog Post Title

Your content here...

## Conclusion

Wrapping up the main points...

<RelatedReading
  currentSlug="your-new-post"
  posts={allPosts}
  maxPosts={6}
/>
```

**Result**: Shows related posts automatically based on tags and topics.

---

## Post with Prerequisites

Post that builds upon foundational content:

```tsx
// content/blog/extending-agents-json.mdx

import { BuildsUpon } from '@/components/blog/BuildsUpon';
import { RelatedReading } from '@/components/blog/RelatedReading';

export const allPosts = await loadAllPosts();

<BuildsUpon
  currentSlug="extending-agents-json-privacy-first"
  posts={allPosts}
/>

# Extending agents.json for Privacy-First AI

In our [previous exploration of agents.json](/blog/understanding-agents-json-standard),
we covered the core specification for AI agent discovery. Today, we'll extend
this standard to include privacy-first metadata...

[Your content...]

<RelatedReading
  currentSlug="extending-agents-json-privacy-first"
  posts={allPosts}
/>
```

**Prerequisites Setup** (in `/src/data/blog/post-graph.ts`):

```typescript
const EXPLICIT_BUILDS_UPON: Record<string, string[]> = {
  'extending-agents-json-privacy-first': ['understanding-agents-json-standard'],
};
```

**Result**: Shows blue callout box at top listing prerequisite posts.

---

## Post in a Reading Sequence

Post that's part of a curated learning path:

```tsx
// content/blog/conversation-memory-local-ai.mdx

import { ReadingSequenceTimeline } from '@/components/blog/NarrativeTimeline';
import { RelatedReading } from '@/components/blog/RelatedReading';

export const allPosts = await loadAllPosts();

<ReadingSequenceTimeline
  currentSlug="conversation-memory-local-ai-context"
  posts={allPosts}
/>

# Conversation Memory in Local AI

This post is part of our **Building Browser-Based AI** series. In our
[previous post on WebLLM](/blog/webllm-language-models-in-browser), we covered
how to run LLMs in the browser. Now let's tackle conversation memory...

[Your content...]

## Next Steps

Ready to learn more? Continue with our next post on
[Privacy-First AI at Scale](/blog/privacy-first-ai-running-100-tools-client-side).

<RelatedReading
  currentSlug="conversation-memory-local-ai-context"
  posts={allPosts}
/>
```

**Sequence Setup** (in `/src/data/blog/post-graph.ts`):

```typescript
{
  name: 'Building Browser-Based AI',
  description: 'Complete guide to running AI models in the browser',
  posts: [
    'rise-of-browser-based-ai',
    'webllm-language-models-in-browser',
    'ai-model-selection-local-cloud-tradeoffs',
    'conversation-memory-local-ai-context',  // ← This post
    'privacy-first-ai-running-100-tools-client-side',
  ],
}
```

**Result**: Shows visual timeline with position in sequence, previous/next navigation.

---

## Synthesis Post

Post that combines ideas from multiple other posts:

```tsx
// content/blog/anatomy-privacy-first-tool.mdx

import { BuildsUpon } from '@/components/blog/BuildsUpon';
import { RelatedReading } from '@/components/blog/RelatedReading';

export const allPosts = await loadAllPosts();

<BuildsUpon
  currentSlug="anatomy-privacy-first-tool-walkthrough"
  posts={allPosts}
/>

# Anatomy of a Privacy-First Tool: Complete Walkthrough

This walkthrough synthesizes concepts from three foundational posts:
- [Privacy by Design](/blog/privacy-by-design-our-core-principle) - Core principles
- [Browser APIs](/blog/browser-apis-replace-server-calls) - Technical capabilities
- [File Processing](/blog/file-processing-without-uploads) - Practical implementation

Let's see how these come together in a real tool...

[Your walkthrough content...]

<RelatedReading
  currentSlug="anatomy-privacy-first-tool-walkthrough"
  posts={allPosts}
/>
```

**Synthesis Setup** (in `/src/data/blog/post-graph.ts`):

```typescript
const EXPLICIT_SYNTHESIS: Record<string, string[]> = {
  'anatomy-privacy-first-tool-walkthrough': [
    'privacy-by-design-our-core-principle',
    'browser-apis-replace-server-calls',
    'file-processing-without-uploads'
  ],
};
```

**Result**: BuildsUpon shows all three prerequisite posts.

---

## Landing Page with All Sequences

Create a dedicated "Reading Paths" page:

```tsx
// app/blog/reading-paths/page.tsx

import { AllReadingSequences } from '@/components/blog/NarrativeTimeline';
import { loadAllPosts } from '@/lib/blog-relationships';

export default async function ReadingPathsPage() {
  const posts = await loadAllPosts();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Guided Learning Paths
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Follow these curated reading sequences to build comprehensive understanding
          of key topics. Each path takes you from fundamentals to advanced concepts.
        </p>
      </div>

      <AllReadingSequences posts={posts} />
    </div>
  );
}
```

**Result**: Shows all 6 reading sequences in expandable cards. Readers can browse and choose their path.

---

## Topic Exploration Page

Browse posts by topic cluster:

```tsx
// app/blog/topics/page.tsx

import { TopicClusterView } from '@/components/blog/NarrativeTimeline';
import { loadAllPosts } from '@/lib/blog-relationships';

export default async function TopicsPage() {
  const posts = await loadAllPosts();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Explore by Topic
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Browse our blog content organized by thematic clusters.
          Each cluster highlights foundational "pillar posts" to start with.
        </p>
      </div>

      <TopicClusterView posts={posts} />
    </div>
  );
}
```

**Result**: Tag-based navigation with expandable clusters showing pillar posts first.

---

## Sidebar Navigation

Add compact navigation to blog layout:

```tsx
// components/blog/BlogLayout.tsx

import { RelatedReadingSidebar, BuildsUponCompact } from '@/components/blog';

export function BlogLayout({ post, allPosts, children }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content */}
      <article className="lg:col-span-2">
        {children}
      </article>

      {/* Sidebar */}
      <aside className="space-y-6">
        {/* Prerequisites */}
        <BuildsUponCompact
          currentSlug={post.slug}
          posts={allPosts}
        />

        {/* Related Posts */}
        <RelatedReadingSidebar
          currentSlug={post.slug}
          posts={allPosts}
          maxPosts={5}
        />

        {/* Other sidebar content... */}
      </aside>
    </div>
  );
}
```

**Result**: Compact prerequisite and related post sections in sidebar.

---

## Complete Example: Full-Featured Post

Combining all features:

```tsx
// content/blog/full-featured-example.mdx

import {
  BuildsUpon,
  RelatedReading,
  ReadingSequenceTimeline
} from '@/components/blog';

export const allPosts = await loadAllPosts();

---
title: "Full-Featured Example Post"
date: 2025-12-22
tags: ["webllm", "privacy", "client-side-ai", "browser-technology"]
excerpt: "A complete example showing all internal linking features"
featured: false
---

{/* Prerequisites callout at top */}
<BuildsUpon
  currentSlug="full-featured-example"
  posts={allPosts}
/>

{/* Reading sequence timeline (if part of a sequence) */}
<ReadingSequenceTimeline
  currentSlug="full-featured-example"
  posts={allPosts}
/>

# Full-Featured Example Post

## Introduction

This post builds upon our [previous exploration](/blog/prerequisite-post)
of browser capabilities...

## Section 1

As discussed in [Privacy by Design](/blog/privacy-by-design-our-core-principle),
privacy must be architectural, not policy-based...

## Section 2

We covered the technical details in our
[Browser APIs guide](/blog/browser-apis-replace-server-calls). Let's apply
those concepts here...

## Conclusion

This approach combines:
- [Privacy principles](/blog/privacy-by-design-our-core-principle)
- [Browser capabilities](/blog/browser-apis-replace-server-calls)
- [Practical implementation](/blog/file-processing-without-uploads)

## Further Reading

For more on this topic, see:
- [Advanced WebLLM Techniques](/blog/advanced-webllm)
- [AI Model Selection](/blog/ai-model-selection-right-model-task)

{/* Related posts at end */}
<RelatedReading
  currentSlug="full-featured-example"
  posts={allPosts}
  maxPosts={6}
/>
```

---

## Inline Reference Patterns

### First Mention (Full Context)

```markdown
In our comprehensive guide to [Privacy by Design](/blog/privacy-by-design-our-core-principle),
we established seven foundational principles...
```

### Subsequent Mention (Brief)

```markdown
Following privacy by design principles, we...
```

### Multiple Related Posts

```markdown
The privacy-first architecture combines:
- [Client-side execution](/blog/why-we-chose-client-side-technical)
- [Browser APIs](/blog/browser-apis-replace-server-calls)
- [WebLLM](/blog/webllm-language-models-in-browser)
```

### Section Reference

```markdown
## Related Concepts

This builds on our discussion of [agentic AI infrastructure](/blog/agentic-ai-privacy-first-infrastructure).
```

### Callout Box Reference

```markdown
> **Prerequisites**: This post assumes familiarity with:
> - [Privacy by Design](/blog/privacy-by-design-our-core-principle)
> - [Browser APIs](/blog/browser-apis-replace-server-calls)
```

---

## Adding Your Post to the System

### 1. Create the Post

```markdown
---
title: "Your Title"
date: 2025-12-22
tags: ["tag1", "tag2", "tag3"]  # 3-7 tags
excerpt: "Brief description..."
---
```

### 2. Add Explicit Relationships (if needed)

Edit `/src/data/blog/post-graph.ts`:

```typescript
const EXPLICIT_BUILDS_UPON: Record<string, string[]> = {
  // ... existing entries
  'your-new-post': ['prerequisite-post-slug'],
};
```

### 3. Add to Reading Sequence (if applicable)

```typescript
{
  name: 'Your Sequence Name',
  description: '...',
  posts: [
    'existing-post-1',
    'existing-post-2',
    'your-new-post',  // ← Add here
    'existing-post-4',
  ],
}
```

### 4. Use Components

```tsx
<BuildsUpon currentSlug="your-new-post" posts={allPosts} />
// ... your content ...
<RelatedReading currentSlug="your-new-post" posts={allPosts} />
```

### 5. Test

- Verify components render
- Check links work
- Ensure post appears in related sections of other posts

---

## Tips & Tricks

### Finding Related Posts Programmatically

```typescript
import { findRelatedPosts, loadAllPosts } from '@/lib/blog-relationships';

const posts = await loadAllPosts();
const myPost = posts.find(p => p.slug === 'your-post');
const related = findRelatedPosts(myPost, posts, 10);

console.log('Top related posts:', related);
```

### Checking if Post is Orphaned

```typescript
import { calculateOrphanScore } from '@/lib/blog-relationships';

const orphanScore = calculateOrphanScore(myPost, posts);

if (orphanScore > 0.7) {
  console.log('⚠️ This post needs more connections!');
}
```

### Getting All Posts in Same Cluster

```typescript
import { getClusterPosts } from '@/data/blog/post-graph';

const clusterPosts = getClusterPosts('your-post', 10);
console.log('Same cluster:', clusterPosts);
```

---

## Quick Reference

### Component Imports

```tsx
// Full versions
import { BuildsUpon } from '@/components/blog/BuildsUpon';
import { RelatedReading } from '@/components/blog/RelatedReading';
import {
  ReadingSequenceTimeline,
  AllReadingSequences,
  TopicClusterView
} from '@/components/blog/NarrativeTimeline';

// Compact versions
import { BuildsUponCompact } from '@/components/blog/BuildsUpon';
import { RelatedReadingSidebar } from '@/components/blog/RelatedReading';
```

### Helper Functions

```tsx
import {
  getBuildsUponPosts,
  getPrerequisitePosts,
  getClusterPosts,
  getReadingSequence,
  getSequenceNavigation
} from '@/data/blog/post-graph';
```

---

## Common Patterns

### Pattern 1: Foundational Post

```tsx
<RelatedReading currentSlug="foundational-post" posts={allPosts} />
```

No BuildsUpon needed - this is the foundation others build on.

### Pattern 2: Extension Post

```tsx
<BuildsUpon currentSlug="extension-post" posts={allPosts} />
[Content...]
<RelatedReading currentSlug="extension-post" posts={allPosts} />
```

Shows what it builds upon + what to read next.

### Pattern 3: Sequence Post

```tsx
<ReadingSequenceTimeline currentSlug="sequence-post" posts={allPosts} />
[Content...]
<RelatedReading currentSlug="sequence-post" posts={allPosts} />
```

Shows position in sequence + related topics outside sequence.

### Pattern 4: Synthesis Post

```tsx
<BuildsUpon currentSlug="synthesis-post" posts={allPosts} />
[Content that combines multiple topics...]
<RelatedReading currentSlug="synthesis-post" posts={allPosts} />
```

Shows multiple prerequisites + suggests related advanced topics.

---

*For complete documentation, see [INTERNAL_LINKING.md](./INTERNAL_LINKING.md)*
