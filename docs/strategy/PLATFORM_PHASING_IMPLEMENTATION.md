# Platform Phasing Implementation Plan

**Date:** December 7, 2025
**Status:** Ready for Implementation
**Purpose:** Control visibility of all platform sections across phased rollout

---

## Executive Summary

**Objective:** Deploy ConveniencePro incrementally, revealing platform sections week-by-week to:
- Maintain continuous marketing momentum through regular feature launches
- Stay ahead of copycat competition by not showing full capabilities upfront
- Validate each section before expanding
- Optimize bundle sizes by excluding unreleased code

**Launch Configuration (Phase 1):**
- ✅ **Tools** - LIMITED to 15-25 high-traffic tools only
- ✅ **Blog** - Full access for content marketing
- ❌ **API section** - Hidden until Phase 2
- ❌ **AI section** - Hidden until Phase 5
- ❌ **AI Chatbot** - Hidden until Phase 5
- ❌ **AI Settings** - Hidden until Phase 5
- ❌ **Editors** - Hidden until Phase 6
- ❌ 360+ additional tools - Revealed progressively Phases 2-6

**Global Modular Architecture:**

This implementation provides a **single source of truth** for ALL feature visibility across the entire platform:

✅ **Sections** (Tools, Blog, API, AI, Editors)
✅ **Pages** (API Docs, Settings, About, Contact)
✅ **Features** (Chatbot, AI Settings, Favorites, Social Sharing, Embed Generator)
✅ **Individual Tools** (385 tools with phase assignments)

**One simple function controls everything:**
```typescript
isFeatureEnabled('chatbot')      // false in Phase 1-4, true in Phase 5+
isFeatureEnabled('api')          // false in Phase 1, true in Phase 2+
isFeatureEnabled('editors')      // false in Phase 1-5, true in Phase 6+
```

**Implementation Strategy:**
1. **Global Feature Registry** - Every feature in one place with phase assignment
2. **Tool-level filtering** - Individual tools assigned to phases
3. **Component-level control** - Any UI element can be phase-gated
4. **Environment-driven** - Single variable controls entire platform visibility

---

## Architecture Overview

### Two-Tier Filtering System

```
Platform
├── Section Visibility (Tier 1)
│   ├── Tools Section ──────────> Visible Phase 1+
│   ├── Blog Section ───────────> Visible Phase 1+
│   ├── API Section ────────────> Hidden until Phase 2-3
│   ├── AI Section ─────────────> Hidden until Phase 5
│   └── Editors Section ────────> Hidden until Phase 6
│
└── Tool Registry Filtering (Tier 2)
    └── Within Tools Section:
        ├── Phase 1 Tools (15-25) ──> Visible immediately
        ├── Phase 2 Tools (50+) ────> Revealed Month 1
        ├── Phase 3 Tools (75+) ────> Revealed Month 2
        ├── Phase 4 Tools (75+) ────> Revealed Month 3
        ├── Phase 5 Tools (75+) ────> Revealed Month 4
        └── Phase 6 Tools (85+) ────> Revealed Month 5
```

### Environment-Driven Configuration

**Development:**
```bash
NEXT_PUBLIC_CURRENT_PHASE=99  # Show everything
```

**Production (Launch):**
```bash
NEXT_PUBLIC_CURRENT_PHASE=1  # Only Phase 1 content
```

**Production (Month 2):**
```bash
NEXT_PUBLIC_CURRENT_PHASE=2  # Phase 1 + Phase 2 content
```

---

## Implementation Details

### 1. Phase Configuration Module

**File:** `src/config/phases.ts`

```typescript
/**
 * Platform Phase Configuration
 * Controls visibility of platform sections and tools across rollout phases
 */

// Phase environment variable
export const PHASE_CONFIG = {
  current: parseInt(process.env.NEXT_PUBLIC_CURRENT_PHASE || '1'),
  isDevelopment: process.env.NODE_ENV === 'development',
  showAll: process.env.NODE_ENV === 'development', // Dev mode shows everything

  launchDates: {
    1: '2025-12-15', // Launch: Tools (limited) + Blog
    2: '2026-01-15', // Month 1: API section reveal
    3: '2026-02-15', // Month 2: More tools
    4: '2026-03-15', // Month 3: More tools
    5: '2026-04-15', // Month 4: AI Tools section
    6: '2026-05-15', // Month 5: Editors section
  },
} as const

/**
 * Global Feature Registry
 * Every feature, section, component, and capability across the platform
 * All features are OFF by default and assigned to specific phases
 */
export const FEATURE_REGISTRY = {
  // ========================================
  // PHASE 1: LAUNCH (Tools + Blog Only)
  // ========================================

  // Core sections - visible at launch
  tools: {
    minPhase: 1,
    enabled: true,
    type: 'section',
    label: 'Tools',
    description: 'Browser-native utility tools',
  },
  blog: {
    minPhase: 1,
    enabled: true,
    type: 'section',
    label: 'Blog',
    description: 'Articles and guides',
  },

  // ========================================
  // PHASE 2: API LAUNCH (Month 1)
  // ========================================

  api: {
    minPhase: 2,
    enabled: false,
    type: 'section',
    label: 'API',
    description: 'HTTP API for tool integration',
  },
  apiDocs: {
    minPhase: 2,
    enabled: false,
    type: 'page',
    label: 'API Documentation',
    description: 'API reference and guides',
  },
  apiKeyManagement: {
    minPhase: 2,
    enabled: false,
    type: 'feature',
    label: 'API Key Management',
    description: 'User API key generation and management',
  },

  // ========================================
  // PHASE 3: EMBED & EXPANSION (Month 2)
  // ========================================

  embed: {
    minPhase: 3,
    enabled: false,
    type: 'section',
    label: 'Embed',
    description: 'Embeddable tool widgets',
  },
  ctpSpec: {
    minPhase: 3,
    enabled: false,
    type: 'page',
    label: 'CTP Specification',
    description: 'Open tool specification',
  },
  embedGenerator: {
    minPhase: 3,
    enabled: false,
    type: 'feature',
    label: 'Embed Code Generator',
    description: 'Generate embed codes for tools',
  },

  // ========================================
  // PHASE 4: ADVANCED FEATURES (Month 3)
  // ========================================

  userAccounts: {
    minPhase: 4,
    enabled: false,
    type: 'feature',
    label: 'User Accounts',
    description: 'User registration and profiles',
  },
  favorites: {
    minPhase: 4,
    enabled: false,
    type: 'feature',
    label: 'Favorites',
    description: 'Save favorite tools',
  },
  toolHistory: {
    minPhase: 4,
    enabled: false,
    type: 'feature',
    label: 'Tool History',
    description: 'Recent tools history',
  },
  darkModeToggle: {
    minPhase: 1,
    enabled: true,
    type: 'feature',
    label: 'Dark Mode',
    description: 'Theme switching',
  },

  // ========================================
  // PHASE 5: AI CAPABILITIES (Month 4)
  // ========================================

  ai: {
    minPhase: 5,
    enabled: false,
    type: 'section',
    label: 'AI Tools',
    description: 'AI-powered intelligent tools',
  },
  aiIntegration: {
    minPhase: 5,
    enabled: false,
    type: 'page',
    label: 'AI Integration',
    description: 'MCP and AI tool connectivity',
  },
  chatbot: {
    minPhase: 5,
    enabled: false,
    type: 'feature',
    label: 'AI Chatbot',
    description: 'AI assistant for tool recommendations',
  },
  aiSettings: {
    minPhase: 5,
    enabled: false,
    type: 'feature',
    label: 'AI Settings',
    description: 'Configure AI preferences and API keys',
  },
  aiToolRecommendations: {
    minPhase: 5,
    enabled: false,
    type: 'feature',
    label: 'AI Tool Recommendations',
    description: 'Smart tool suggestions based on usage',
  },
  mcpIntegration: {
    minPhase: 5,
    enabled: false,
    type: 'feature',
    label: 'MCP Integration',
    description: 'Model Context Protocol for AI tools',
  },

  // ========================================
  // PHASE 6: COMPLETE PLATFORM (Month 5)
  // ========================================

  editors: {
    minPhase: 6,
    enabled: false,
    type: 'section',
    label: 'Editors',
    description: 'IDE-level browser applications',
  },
  codeEditor: {
    minPhase: 6,
    enabled: false,
    type: 'feature',
    label: 'Code Editor',
    description: 'Full-featured code editing',
  },
  imageEditor: {
    minPhase: 6,
    enabled: false,
    type: 'feature',
    label: 'Image Editor',
    description: 'Advanced image editing',
  },
  videoEditor: {
    minPhase: 6,
    enabled: false,
    type: 'feature',
    label: 'Video Editor',
    description: 'Browser-based video editing',
  },
  pdfEditor: {
    minPhase: 6,
    enabled: false,
    type: 'feature',
    label: 'PDF Editor',
    description: 'PDF editing and manipulation',
  },

  // ========================================
  // SUPPORTING FEATURES
  // ========================================

  // Settings sections
  settings: {
    minPhase: 1,
    enabled: true,
    type: 'page',
    label: 'Settings',
    description: 'Application settings',
  },
  generalSettings: {
    minPhase: 1,
    enabled: true,
    type: 'feature',
    label: 'General Settings',
    description: 'Basic preferences',
  },
  privacySettings: {
    minPhase: 1,
    enabled: true,
    type: 'feature',
    label: 'Privacy Settings',
    description: 'Privacy preferences',
  },
  accountSettings: {
    minPhase: 4,
    enabled: false,
    type: 'feature',
    label: 'Account Settings',
    description: 'User account configuration',
  },

  // Footer links
  aboutPage: {
    minPhase: 1,
    enabled: true,
    type: 'page',
    label: 'About',
    description: 'About ConveniencePro',
  },
  privacyPolicy: {
    minPhase: 1,
    enabled: true,
    type: 'page',
    label: 'Privacy Policy',
    description: 'Privacy policy',
  },
  termsOfService: {
    minPhase: 1,
    enabled: true,
    type: 'page',
    label: 'Terms of Service',
    description: 'Terms and conditions',
  },
  contactPage: {
    minPhase: 1,
    enabled: true,
    type: 'page',
    label: 'Contact',
    description: 'Contact information',
  },

  // Social/Community features
  socialSharing: {
    minPhase: 2,
    enabled: false,
    type: 'feature',
    label: 'Social Sharing',
    description: 'Share tools on social media',
  },
  communityForum: {
    minPhase: 4,
    enabled: false,
    type: 'section',
    label: 'Community',
    description: 'User community and discussions',
  },

  // Analytics/Tracking (always enabled for internal use)
  analytics: {
    minPhase: 1,
    enabled: true,
    type: 'feature',
    label: 'Analytics',
    description: 'Usage analytics',
    internal: true, // Not user-facing
  },
  errorTracking: {
    minPhase: 1,
    enabled: true,
    type: 'feature',
    label: 'Error Tracking',
    description: 'Error monitoring',
    internal: true,
  },
} as const

export type PlatformFeature = keyof typeof FEATURE_REGISTRY
export type FeatureType = 'section' | 'page' | 'feature'

/**
 * Check if a feature is visible/enabled in current phase
 * This is the SINGLE source of truth for all feature visibility
 */
export const isFeatureEnabled = (feature: PlatformFeature): boolean => {
  const config = FEATURE_REGISTRY[feature]

  // Development mode: show all enabled features
  if (PHASE_CONFIG.showAll) {
    return config.enabled
  }

  // Production: check phase requirement
  return config.enabled && PHASE_CONFIG.current >= config.minPhase
}

/**
 * Get all enabled features for current phase
 */
export const getEnabledFeatures = (): PlatformFeature[] => {
  return (Object.keys(FEATURE_REGISTRY) as PlatformFeature[]).filter(
    feature => isFeatureEnabled(feature)
  )
}

/**
 * Get features by type (section, page, feature)
 */
export const getFeaturesByType = (type: FeatureType): PlatformFeature[] => {
  return (Object.keys(FEATURE_REGISTRY) as PlatformFeature[]).filter(
    feature => FEATURE_REGISTRY[feature].type === type && isFeatureEnabled(feature)
  )
}

/**
 * Get phase number when feature becomes available
 */
export const getFeatureLaunchPhase = (feature: PlatformFeature): number => {
  return FEATURE_REGISTRY[feature].minPhase
}

/**
 * Get upcoming features (next phase)
 */
export const getUpcomingFeatures = (): PlatformFeature[] => {
  const nextPhase = PHASE_CONFIG.current + 1
  return (Object.keys(FEATURE_REGISTRY) as PlatformFeature[]).filter(
    feature => FEATURE_REGISTRY[feature].minPhase === nextPhase
  )
}

/**
 * Get features by phase
 */
export const getFeaturesByPhase = (phase: number): PlatformFeature[] => {
  return (Object.keys(FEATURE_REGISTRY) as PlatformFeature[]).filter(
    feature => FEATURE_REGISTRY[feature].minPhase === phase
  )
}

/**
 * Convenience aliases for common checks
 */
export const isSectionVisible = isFeatureEnabled
export const getVisibleSections = () => getFeaturesByType('section')
export const getSectionLaunchPhase = getFeatureLaunchPhase
export const getUpcomingSections = () =>
  getUpcomingFeatures().filter(f => FEATURE_REGISTRY[f].type === 'section')
```

---

### 2. Tool Registry Extension

**File:** `src/data/tools-registry-ctp.ts`

```typescript
import { LocalToolDefinition } from '@/types/tools'

/**
 * Extended tool definition with phase assignment
 */
export interface ExtendedToolDefinition extends LocalToolDefinition {
  // Existing CTP fields
  hasApi?: boolean
  isEmbeddable?: boolean
  hasAiSupport?: boolean

  // NEW: Phase assignment
  phase?: number  // 1-6 for rollout phases, undefined = not yet launched
  launchDate?: string  // ISO date string when tool went live
  searchVolume?: number  // Monthly Google searches (from keyword research)
  tier?: 'S' | 'A' | 'B' | 'C'  // Strategic tier classification
}

/**
 * Tools Registry with Phase Assignments
 * Note: Phase assignments pending search volume research
 */
export const TOOLS_REGISTRY: ExtendedToolDefinition[] = [
  // PHASE 1: Strategic Anchor Tools (15-25 tools)
  // Final selection pending Google Keyword Planner data
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Format and validate JSON with syntax highlighting',
    category: 'Developer',
    slug: 'json-formatter',
    path: '/tools/developer/json-formatter',
    phase: 1,  // Launch immediately
    tier: 'S',  // Expected >100K monthly searches
    searchVolume: undefined,  // TODO: Get from Keyword Planner
  },
  {
    id: 'base64-encoder',
    name: 'Base64 Encoder',
    description: 'Encode and decode Base64 strings',
    category: 'Developer',
    slug: 'base64-encoder',
    path: '/tools/developer/base64-encoder',
    phase: 1,
    tier: 'A',  // Expected 10K-100K searches
    searchVolume: undefined,
  },
  // ... more Phase 1 tools

  // PHASE 2: Expansion (50+ additional tools)
  {
    id: 'yaml-validator',
    name: 'YAML Validator',
    description: 'Validate and format YAML files',
    category: 'Developer',
    slug: 'yaml-validator',
    path: '/tools/developer/yaml-validator',
    phase: 2,  // Reveal Month 1
    tier: 'B',
    searchVolume: undefined,
  },
  // ... more Phase 2 tools

  // PHASE 3-6: Progressive rollout
  // ... remaining 300+ tools
]

/**
 * Get tools visible in current phase
 */
export const getActiveTools = (): ExtendedToolDefinition[] => {
  if (PHASE_CONFIG.showAll) {
    return TOOLS_REGISTRY  // Development: show all
  }

  return TOOLS_REGISTRY.filter(tool =>
    tool.phase !== undefined && tool.phase <= PHASE_CONFIG.current
  )
}

/**
 * Get tools by specific phase
 */
export const getToolsByPhase = (phase: number): ExtendedToolDefinition[] => {
  return TOOLS_REGISTRY.filter(tool => tool.phase === phase)
}

/**
 * Get tools by tier (S/A/B/C)
 */
export const getToolsByTier = (tier: ExtendedToolDefinition['tier']): ExtendedToolDefinition[] => {
  return TOOLS_REGISTRY.filter(tool => tool.tier === tier)
}

/**
 * Get total counts by phase
 */
export const getPhaseStats = () => {
  const stats = {
    total: TOOLS_REGISTRY.length,
    byPhase: {} as Record<number, number>,
    active: getActiveTools().length,
  }

  TOOLS_REGISTRY.forEach(tool => {
    if (tool.phase) {
      stats.byPhase[tool.phase] = (stats.byPhase[tool.phase] || 0) + 1
    }
  })

  return stats
}
```

---

### 3. Component Integration Examples

**File:** `src/components/layout/Navigation.tsx`

```typescript
import { isFeatureEnabled, FEATURE_REGISTRY } from '@/config/phases'

export const Navigation = () => {
  return (
    <nav>
      {/* Tools - always visible from Phase 1 */}
      {isFeatureEnabled('tools') && (
        <NavLink href="/tools">
          {FEATURE_REGISTRY.tools.label}
        </NavLink>
      )}

      {/* Blog - always visible from Phase 1 */}
      {isFeatureEnabled('blog') && (
        <NavLink href="/blog">
          {FEATURE_REGISTRY.blog.label}
        </NavLink>
      )}

      {/* API - hidden until Phase 2 */}
      {isFeatureEnabled('api') && (
        <NavLink href="/api">
          {FEATURE_REGISTRY.api.label}
          <Badge>New</Badge>
        </NavLink>
      )}

      {/* AI - hidden until Phase 5 */}
      {isFeatureEnabled('ai') && (
        <NavLink href="/ai-tools">
          {FEATURE_REGISTRY.ai.label}
          <Badge>New</Badge>
        </NavLink>
      )}

      {/* Editors - hidden until Phase 6 */}
      {isFeatureEnabled('editors') && (
        <NavLink href="/editors">
          {FEATURE_REGISTRY.editors.label}
          <Badge>New</Badge>
        </NavLink>
      )}
    </nav>
  )
}
```

**File:** `src/components/layout/Sidebar.tsx` (Chatbot Integration)

```typescript
import { isFeatureEnabled } from '@/config/phases'
import { AIChatbot } from '@/components/ai/Chatbot'

export const Sidebar = () => {
  return (
    <aside>
      {/* Other sidebar content */}

      {/* AI Chatbot - hidden until Phase 5 */}
      {isFeatureEnabled('chatbot') && (
        <div className="chatbot-container">
          <AIChatbot />
        </div>
      )}
    </aside>
  )
}
```

**File:** `src/app/settings/page.tsx` (Settings Page)

```typescript
import { isFeatureEnabled } from '@/config/phases'

export default function SettingsPage() {
  return (
    <div className="settings-page">
      <h1>Settings</h1>

      {/* General Settings - always visible */}
      {isFeatureEnabled('generalSettings') && (
        <SettingsSection title="General">
          <ThemeSelector />
          <LanguageSelector />
        </SettingsSection>
      )}

      {/* Privacy Settings - always visible */}
      {isFeatureEnabled('privacySettings') && (
        <SettingsSection title="Privacy">
          <CookiePreferences />
          <DataRetention />
        </SettingsSection>
      )}

      {/* Account Settings - hidden until Phase 4 */}
      {isFeatureEnabled('accountSettings') && (
        <SettingsSection title="Account">
          <ProfileSettings />
          <EmailPreferences />
        </SettingsSection>
      )}

      {/* AI Settings - hidden until Phase 5 */}
      {isFeatureEnabled('aiSettings') && (
        <SettingsSection title="AI">
          <AIModelSelector />
          <AIAPIKeyInput />
          <AIPreferences />
        </SettingsSection>
      )}
    </div>
  )
}
```

**File:** `src/components/tools/ToolCard.tsx` (Individual Tool Features)

```typescript
import { isFeatureEnabled } from '@/config/phases'

export const ToolCard = ({ tool }) => {
  return (
    <div className="tool-card">
      <h3>{tool.name}</h3>
      <p>{tool.description}</p>

      <div className="tool-actions">
        {/* Always visible */}
        <button>Use Tool</button>

        {/* Favorites - hidden until Phase 4 */}
        {isFeatureEnabled('favorites') && (
          <button onClick={() => addToFavorites(tool)}>
            ⭐ Favorite
          </button>
        )}

        {/* Social Sharing - hidden until Phase 2 */}
        {isFeatureEnabled('socialSharing') && (
          <ShareButton tool={tool} />
        )}

        {/* Embed Code - hidden until Phase 3 */}
        {isFeatureEnabled('embedGenerator') && (
          <button onClick={() => generateEmbed(tool)}>
            {'</>'} Embed
          </button>
        )}
      </div>
    </div>
  )
}
```

**File:** `src/app/layout.tsx` (Root Layout with Feature Checks)

```typescript
import { isFeatureEnabled } from '@/config/phases'
import { AIChatbot } from '@/components/ai/Chatbot'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Navigation />

        <main>{children}</main>

        {/* Chatbot Widget - hidden until Phase 5 */}
        {isFeatureEnabled('chatbot') && (
          <div className="floating-chatbot">
            <AIChatbot />
          </div>
        )}

        <Footer />

        {/* Analytics - always enabled (internal) */}
        {isFeatureEnabled('analytics') && <Analytics />}
        {isFeatureEnabled('errorTracking') && <ErrorBoundary />}
      </body>
    </html>
  )
}
```

---

### 4. Route Protection Middleware

**File:** `src/middleware.ts`

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isSectionVisible } from '@/config/phases'

// Section-to-path mapping
const SECTION_PATHS: Record<string, string[]> = {
  api: ['/api', '/api-docs', '/api-reference'],
  ai: ['/ai-tools', '/ai-integration', '/mcp'],
  editors: ['/editors'],
  embed: ['/embed'],
  ctpSpec: ['/ctp-spec', '/specification'],
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Check if path belongs to a hidden section
  for (const [section, paths] of Object.entries(SECTION_PATHS)) {
    const isProtectedPath = paths.some(path => pathname.startsWith(path))

    if (isProtectedPath && !isSectionVisible(section as any)) {
      // Section not yet released - redirect to coming soon
      return NextResponse.redirect(new URL('/coming-soon', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/:path*',
    '/ai-tools/:path*',
    '/editors/:path*',
    '/embed/:path*',
    '/ctp-spec/:path*',
  ],
}
```

---

### 5. Coming Soon Page

**File:** `src/app/coming-soon/page.tsx`

```typescript
import { getUpcomingSections, getFeatureLaunchPhase, FEATURE_REGISTRY } from '@/config/phases'

export default function ComingSoonPage() {
  const upcoming = getUpcomingSections()

  return (
    <div className="container py-20">
      <h1>Coming Soon</h1>
      <p>This section is not yet available. We're launching features progressively!</p>

      <div className="mt-8">
        <h2>Upcoming Features</h2>
        <ul>
          {upcoming.map(section => (
            <li key={section}>
              <strong>{FEATURE_REGISTRY[section].label}</strong>
              <p>{FEATURE_REGISTRY[section].description}</p>
              <span>Launching in Phase {getFeatureLaunchPhase(section)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8">
        <a href="/">Return Home</a>
      </div>
    </div>
  )
}
```

---

### 6. Adding New Features to the System

**Process for adding ANY new feature to the phased rollout:**

**Step 1: Add to FEATURE_REGISTRY**

```typescript
// src/config/phases.ts

export const FEATURE_REGISTRY = {
  // ... existing features

  // Add your new feature
  myNewFeature: {
    minPhase: 3,           // Which phase to reveal in
    enabled: false,        // false = not yet launched
    type: 'feature',       // 'section' | 'page' | 'feature'
    label: 'My Feature',   // Display name
    description: 'What this feature does',
  },
}
```

**Step 2: Use in Components**

```typescript
import { isFeatureEnabled } from '@/config/phases'

export const MyComponent = () => {
  return (
    <div>
      {isFeatureEnabled('myNewFeature') && (
        <div>
          {/* Feature content here */}
        </div>
      )}
    </div>
  )
}
```

**Step 3: That's it!**

The feature will automatically:
- ✅ Be hidden in production until Phase 3
- ✅ Be visible in development mode
- ✅ Show up in "Coming Soon" pages
- ✅ Be tracked in phase analytics
- ✅ Tree-shake from bundles in earlier phases

**Examples of Features to Add:**

```typescript
// Email notifications
emailNotifications: {
  minPhase: 4,
  enabled: false,
  type: 'feature',
  label: 'Email Notifications',
  description: 'Get notified about updates',
},

// Custom themes
customThemes: {
  minPhase: 5,
  enabled: false,
  type: 'feature',
  label: 'Custom Themes',
  description: 'Create your own color themes',
},

// Tool collaboration
toolCollaboration: {
  minPhase: 6,
  enabled: false,
  type: 'feature',
  label: 'Collaboration',
  description: 'Share tools with team members',
},
```

---

### 6. Build Optimization

**File:** `next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable tree-shaking and dead code elimination
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Optimize bundle size by phase
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Production client build only
      config.optimization = {
        ...config.optimization,
        usedExports: true,
        sideEffects: false,
      }
    }
    return config
  },

  // Environment variables exposed to client
  env: {
    NEXT_PUBLIC_CURRENT_PHASE: process.env.NEXT_PUBLIC_CURRENT_PHASE || '1',
  },
}

module.exports = nextConfig
```

---

## Phase Rollout Schedule

### Phase 1: Launch (Week 0)

**Visible:**
- ✅ Tools section (15-25 tools only)
- ✅ Blog section (content marketing)
- ✅ Homepage
- ✅ About/Privacy pages

**Hidden:**
- ❌ API section
- ❌ AI section
- ❌ Editors section
- ❌ 360+ additional tools

**Marketing Focus:**
- "The privacy-first tool suite for developers and creators"
- Highlight: JSON Formatter, Base64 Encoder, QR Generator, Calculator, etc.
- Blog content: "Why privacy matters for utility tools"

**Environment:**
```bash
NEXT_PUBLIC_CURRENT_PHASE=1
```

---

### Phase 2: API Launch (Month 1)

**New Sections:**
- ✅ API section
- ✅ API documentation
- ✅ 50+ additional tools

**Marketing Focus:**
- "Now with HTTP API - integrate tools into your workflows"
- Developer-focused content
- API tutorials and examples

**Environment:**
```bash
NEXT_PUBLIC_CURRENT_PHASE=2
```

---

### Phase 3: Embed & Expansion (Month 2)

**New Sections:**
- ✅ Embeddable widgets
- ✅ CTP specification
- ✅ 75+ additional tools

**Marketing Focus:**
- "Embed privacy-first tools on your website"
- CTP as open standard
- Developer ecosystem building

**Environment:**
```bash
NEXT_PUBLIC_CURRENT_PHASE=3
```

---

### Phase 4-5: Continued Expansion (Months 3-4)

**New Content:**
- ✅ 75+ tools per phase
- ✅ Category completion
- ✅ Advanced features

**Marketing Focus:**
- Regular weekly announcements
- Tool showcase content
- Category-specific marketing

**Environment:**
```bash
NEXT_PUBLIC_CURRENT_PHASE=4  # Month 3
NEXT_PUBLIC_CURRENT_PHASE=5  # Month 4
```

---

### Phase 6: Complete Platform (Month 5)

**New Sections:**
- ✅ AI Tools section (AI-powered utilities)
- ✅ Editors section (72+ IDE-level apps)
- ✅ Full 385+ tool catalog
- ✅ Complete ecosystem

**Marketing Focus:**
- "The most comprehensive tool platform"
- AI capabilities reveal
- Professional-grade editors
- Complete ecosystem story

**Environment:**
```bash
NEXT_PUBLIC_CURRENT_PHASE=6
```

---

## Implementation Timeline

### Day 1-2: Configuration Setup (4 hours)
- [ ] Create `src/config/phases.ts`
- [ ] Define section visibility map
- [ ] Set up environment variables
- [ ] Test phase switching logic

### Day 3-4: Registry Enhancement (8 hours)
- [ ] Add phase fields to tool definitions
- [ ] Implement filtering functions
- [ ] Assign Phase 1 tools (pending search data)
- [ ] Create tier classifications
- [ ] Test tool visibility switching

### Day 5-6: Navigation & Routing (6 hours)
- [ ] Update Navigation component
- [ ] Create route protection middleware
- [ ] Build Coming Soon page
- [ ] Test navigation hiding/showing
- [ ] Verify redirects work

### Day 7-8: Build Optimization (4 hours)
- [ ] Configure Next.js tree-shaking
- [ ] Test bundle sizes per phase
- [ ] Verify dead code elimination
- [ ] Performance benchmarking

### Day 9-10: Testing & Deployment (6 hours)
- [ ] Deploy staging with PHASE=1
- [ ] Verify only Phase 1 content visible
- [ ] Test phase transitions (1→2→3)
- [ ] Validate bundle optimization
- [ ] Document deployment process

**Total Estimated Time: 28 hours over 10 days**

---

## Testing Checklist

### Phase 1 Configuration Testing

**Development Mode (PHASE=99):**
- [ ] All sections visible in navigation
- [ ] All 385 tools accessible
- [ ] API docs accessible
- [ ] AI section accessible
- [ ] Editors accessible

**Production Phase 1 (PHASE=1):**
- [ ] Only Tools + Blog visible in navigation
- [ ] API nav item hidden
- [ ] AI nav item hidden
- [ ] Editors nav item hidden
- [ ] Only 15-25 tools visible in tools list
- [ ] Navigating to `/api` redirects to coming soon
- [ ] Navigating to `/ai-tools` redirects to coming soon
- [ ] Navigating to `/editors` redirects to coming soon

**Production Phase 2 (PHASE=2):**
- [ ] API section now visible
- [ ] API docs accessible
- [ ] Phase 1 + Phase 2 tools visible (65-75 total)
- [ ] AI still hidden
- [ ] Editors still hidden

### Bundle Size Verification

**Expected Results:**
- Phase 1 bundle: 60-70% smaller than full platform
- Phase 2 bundle: 40-50% smaller than full platform
- Phase 6 bundle: Full platform size

**Test Commands:**
```bash
# Build Phase 1
NEXT_PUBLIC_CURRENT_PHASE=1 npm run build
npm run analyze  # Check bundle size

# Build Phase 6 (full)
NEXT_PUBLIC_CURRENT_PHASE=6 npm run build
npm run analyze  # Compare bundle size
```

---

## Deployment Process

### Initial Launch (Phase 1)

**1. Set Production Environment:**
```bash
# Vercel / Netlify / Railway
NEXT_PUBLIC_CURRENT_PHASE=1
```

**2. Deploy to Production:**
```bash
git checkout main
git push origin main
# CI/CD deploys automatically
```

**3. Verify Launch Configuration:**
- Only Tools (limited) + Blog visible
- API/AI/Editors completely hidden
- Bundle optimized for Phase 1 content

---

### Phase Transitions (Monthly)

**Month 1: Phase 1 → Phase 2**

**1. Update Environment Variable:**
```bash
NEXT_PUBLIC_CURRENT_PHASE=2
```

**2. Trigger Rebuild:**
```bash
# Vercel: Auto-redeploy on env change
# Or manual trigger:
vercel --prod
```

**3. Announcement:**
- Blog post: "Introducing the ConveniencePro API"
- Social media: API launch announcement
- Email newsletter: New capabilities
- Product Hunt: "We shipped: HTTP API"

**Repeat for Phases 3-6 monthly**

---

## Strategic Benefits

### 1. Continuous Marketing Momentum

**Every month becomes a launch event:**
- Month 1: Tools launch (Product Hunt, social, ads)
- Month 2: API launch (developer communities, tech blogs)
- Month 3: Embed launch (webmaster communities)
- Month 4: Expansion milestone (general tech press)
- Month 5: AI launch (AI communities, AI newsletters)
- Month 6: Editors launch (major milestone, press coverage)

**Content calendar:**
- 6 major announcements vs. 1 single launch
- Weekly "Tool of the Week" reveals
- Monthly "State of ConveniencePro" updates
- Sustained media attention for 6 months

---

### 2. Competitive Moat

**Anti-Copycat Strategy:**

**Traditional approach (show everything):**
- Competitor sees full platform
- Copies all 385 tools
- Launches 2 weeks later with 80% feature parity

**Phased approach (hide capabilities):**
- Competitor sees 20 tools at launch
- Copies those 20 tools
- We reveal API → they scramble to add API
- We reveal AI → they scramble to add AI
- We reveal Editors → they realize scope is 10x bigger
- **We stay 4-6 months ahead perpetually**

**Additional advantages:**
- Privacy architecture can't be copied (requires full rebuild)
- Brand loyalty builds over 6 months vs. 1 week
- Community forms before competition catches up

---

### 3. Validation Before Investment

**Launch with minimal exposure:**
- Test market fit with 20 tools before revealing 385
- Validate ad revenue model before scaling
- Test UX/UI with real users before expanding
- Gather feedback to improve remaining phases

**Pivot opportunities:**
- If API doesn't resonate → delay AI/Editors
- If certain tool categories perform well → accelerate those
- If ad revenue underperforms → test API tiers earlier

**Risk mitigation:**
- Don't commit full infrastructure on Day 1
- Test scaling gradually
- Identify issues with 5K users before hitting 500K users

---

### 4. Bundle Optimization

**Phase 1 Bundle (estimated):**
- 20 tools × ~15KB average = 300KB
- Core framework: 200KB
- **Total: ~500KB (vs 2MB+ full platform)**

**Benefits:**
- Faster page loads → better SEO
- Lower bounce rates → higher conversions
- Better Core Web Vitals scores
- Mobile-friendly (critical for utility tools)

**Progressive growth:**
- Phase 1: 500KB
- Phase 3: 1MB
- Phase 6: 2MB
- Users who joined Phase 1 get progressive enhancement
- New users in Phase 6 get full platform (cached over time)

---

## Success Metrics

### Phase 1 Launch (Week 0-4)

**Traffic Goals:**
- 5,000-10,000 visitors Week 1
- 5,000 MAU Month 1
- 500+ waitlist → product conversions

**Engagement Goals:**
- 3-5 tools used per session
- 60%+ bounce rate (single-task utility, this is good)
- 20+ top keyword ranking positions

**Revenue Goals:**
- $200-500 ad revenue Month 1 (validation)
- $0.10-0.20 RPM (revenue per thousand visitors)

---

### Phase 2 API Launch (Month 1)

**Adoption Goals:**
- 100+ API signups
- 1,000+ API calls/day
- 5+ integration showcases

**Traffic Goals:**
- 15,000-25,000 MAU
- Developer community traction (Reddit, HN, Twitter)

---

### Phase 6 Complete Platform (Month 5)

**Platform Goals:**
- 100,000+ MAU
- 50+ keywords ranking top 10
- Category leadership established

**Revenue Goals:**
- $5,000+ monthly ad revenue
- Profitability achieved
- Sustainable business validated

---

## Risk Mitigation

### Risk: Low Phase 1 Traffic

**Mitigation:**
- Accelerate Phase 2 (reveal API early)
- Increase paid ads budget
- Emergency: Skip to Phase 3-4 faster

### Risk: Competitors Copy Phase 1

**Mitigation:**
- Accelerate remaining phases (monthly → biweekly)
- Emphasize privacy moat (can't be copied)
- Build community loyalty faster

### Risk: Technical Issues at Scale

**Mitigation:**
- Phase 1 tests infrastructure with low traffic
- Identify issues before revealing full platform
- Gradual scaling = easier debugging

### Risk: Ad Revenue Underperforms

**Mitigation:**
- Phase 2 API provides backup monetization
- Test premium tiers early
- Adjust Phase 3+ based on data

---

## Next Steps

### Immediate Actions (This Week)

1. **[ ] Finalize Phase 1 tool selection**
   - Get search volume data from Google Keyword Planner
   - Select 15-25 highest-traffic tools
   - Assign tier classifications

2. **[ ] Create phase configuration**
   - Implement `src/config/phases.ts`
   - Set up environment variables
   - Test phase switching

3. **[ ] Begin registry phase assignments**
   - Add phase field to tool definitions
   - Mark Phase 1 tools
   - Implement filtering functions

### Week 2-3: Implementation

4. **[ ] Update navigation and routing**
5. **[ ] Create route protection middleware**
6. **[ ] Build Coming Soon page**
7. **[ ] Configure bundle optimization**
8. **[ ] Deploy staging environment**

### Week 4: Launch Preparation

9. **[ ] Test Phase 1 configuration thoroughly**
10. **[ ] Verify bundle sizes optimized**
11. **[ ] Document deployment process**
12. **[ ] Set production environment variables**

---

## Conclusion

**The phased rollout strategy provides:**

✅ **Marketing:** 6 months of continuous launch events vs. 1 week of attention
✅ **Competition:** Stay 4-6 months ahead of copycats through staged reveals
✅ **Validation:** Test market fit before committing full platform
✅ **Performance:** Optimized bundles for faster loads and better SEO
✅ **Flexibility:** Pivot opportunities based on real user data

**Implementation is straightforward:**
- 28 hours over 10 days
- Two-tier filtering (sections + tools)
- Environment variable control
- Zero breaking changes to existing code

**Launch Readiness:**
- Phase 1 environment: `NEXT_PUBLIC_CURRENT_PHASE=1`
- Only Tools (limited) + Blog visible
- API, AI, Editors completely hidden
- Bundle optimized for fast loading
- Ready for Product Hunt, Reddit, Google Ads blitz

**The platform is built. The strategy is defined. The implementation is clear.**

**Time to execute.** 🚀

---

**Document Status:** ✅ COMPLETE & READY FOR IMPLEMENTATION

**Created:** December 7, 2025
**Next Review:** After Phase 1 implementation complete
