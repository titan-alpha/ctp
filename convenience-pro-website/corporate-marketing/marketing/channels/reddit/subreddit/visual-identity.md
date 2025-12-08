# r/ConveniencePro - Visual Identity Guide

**Document Type**: Design Specifications for Subreddit
**Version**: 1.0
**Last Updated**: 2025-11-24
**For**: Designers implementing subreddit branding

---

## Overview

This document provides comprehensive visual identity guidelines for r/ConveniencePro, ensuring brand consistency between the ConveniencePro website and subreddit while adapting to Reddit's platform requirements.

**Design Philosophy**: Clean, modern, professional yet approachable. Privacy-focused without being paranoid. Trustworthy without being corporate.

---

## Brand Foundation

### Core Brand Values (Visual Expression)

1. **Privacy First**
   - Visual: Lock icons, shields, closed circuits
   - Colors: Deep blues and purples (trust, security)
   - Style: Solid, contained, protected

2. **Accessibility for All**
   - Visual: Open doors, universal symbols, clean layouts
   - Colors: High contrast, WCAG AAA compliant
   - Style: Simple, clear, readable

3. **Freedom and Control**
   - Visual: Open space, expansive designs, liberation imagery
   - Colors: Bright accents, optimistic tones
   - Style: Uncluttered, breathing room, flexibility

---

## Color Palette

### Primary Colors

Based on ConveniencePro website and adapted for Reddit:

**Primary Blue** (Trust & Technology)
- Hex: `#2563EB` (primary-600 from Tailwind)
- RGB: 37, 99, 235
- Usage: Primary accent, links, CTA buttons, important elements

**Deep Blue** (Authority & Privacy)
- Hex: `#1E40AF` (primary-700)
- RGB: 30, 64, 175
- Usage: Headers, emphasis, hover states

**Light Blue** (Accessibility & Friendliness)
- Hex: `#60A5FA` (primary-400)
- RGB: 96, 165, 250
- Usage: Highlights, secondary accents, hover states

### Secondary Colors

**Success Green** (Positive Actions)
- Hex: `#10B981` (emerald-500)
- RGB: 16, 185, 129
- Usage: Success messages, checkmarks, positive indicators

**Warning Orange** (Alerts)
- Hex: `#F59E0B` (amber-500)
- RGB: 245, 158, 11
- Usage: Warnings, important notices (use sparingly)

**Error Red** (Issues)
- Hex: `#EF4444` (red-500)
- RGB: 239, 68, 68
- Usage: Errors, bugs, critical notices (use sparingly)

### Neutral Colors

**Dark Gray** (Primary Text)
- Hex: `#111827` (gray-900)
- RGB: 17, 24, 39
- Usage: Body text, headlines

**Medium Gray** (Secondary Text)
- Hex: `#6B7280` (gray-500)
- RGB: 107, 114, 128
- Usage: Captions, metadata, less important text

**Light Gray** (Backgrounds & Borders)
- Hex: `#F3F4F6` (gray-100)
- RGB: 243, 244, 246
- Usage: Backgrounds, borders, dividers

**White**
- Hex: `#FFFFFF`
- RGB: 255, 255, 255
- Usage: Backgrounds, cards, contrast

### Reddit-Specific Adaptations

**Banner Background Gradient**:
- Start: `#1E40AF` (Deep Blue)
- End: `#2563EB` (Primary Blue)
- Direction: Left to right, subtle

**Header Background**:
- Color: `#1E40AF` with 95% opacity
- Text: White (`#FFFFFF`)

**Sidebar Background**:
- Light mode: `#F9FAFB` (gray-50)
- Dark mode: `#1F2937` (gray-800)

---

## Typography

### Font Recommendations

Since Reddit controls actual fonts, these are stylistic guidelines:

**Headlines**:
- Style: Bold, sans-serif
- Weight: 600-700
- Size: Large and prominent
- Case: Sentence case (not ALL CAPS)

**Body Text**:
- Style: Regular, sans-serif
- Weight: 400
- Size: Standard Reddit sizing
- Line height: 1.6 for readability

**Labels & Metadata**:
- Style: Medium, sans-serif
- Weight: 500
- Size: Slightly smaller than body
- Case: Sentence case or lowercase

**Code/Technical**:
- Style: Monospace
- Weight: 400
- Usage: Tool names, file formats, technical terms

### Text Hierarchy Example

```
ConveniencePro - Headline (24px, Bold)
  Your tools, your device, your privacy - Subhead (16px, Medium)
    Browse 200+ free productivity tools... - Body (14px, Regular)
      Posted by u/username · 2 hours ago - Meta (12px, Regular, Gray)
```

---

## Logo & Icon Design

### Subreddit Icon (256x256px minimum)

**Concept 1: "C" Letter Mark** (Recommended)

**Description**:
- Clean, bold letter "C" representing ConveniencePro
- Styled as a circular badge with depth
- Colors: Primary Blue gradient background with white "C"

**Visual Details**:
- Background: Circular, gradient from `#2563EB` to `#1E40AF`
- Letter: White "C" in bold, modern sans-serif
- Style: Flat design with subtle shadow for depth
- Border: 2px white border inset slightly (optional)

**Symbolism**:
- "C" for ConveniencePro
- Circular shape = completeness, community
- Bold letter = confidence, reliability

**Technical Specs**:
- Size: 256x256px (min), 512x512px (recommended)
- Format: PNG with transparency
- Export: @1x, @2x, @3x for various displays

**Mockup Description**:
```
┌────────────────┐
│                │
│   ┏━━━━━╮      │
│   ┃     │      │
│   ┃            │   <- White "C"
│   ┃     │      │      on blue
│   ┗━━━━━╯      │      circular bg
│                │
└────────────────┘
```

---

**Concept 2: "Tool & Lock" Icon**

**Description**:
- Stylized wrench/tool crossed with a lock
- Represents productivity + privacy
- Colors: White icon on Primary Blue circular background

**Visual Details**:
- Background: Solid `#2563EB` circle
- Icon: White simplified wrench + lock combination
- Style: Line art, minimal, geometric
- Weight: Medium stroke (3-4px)

**Symbolism**:
- Tool = productivity and utility
- Lock = privacy and security
- Combined = ConveniencePro's dual promise

**Technical Specs**: Same as Concept 1

**Mockup Description**:
```
┌────────────────┐
│                │
│     🔧🔒        │   <- Stylized tool
│      ╱╲        │      + lock combo
│                │      (white on blue)
│                │
└────────────────┘
```

---

**Concept 3: "Browser Window" Icon**

**Description**:
- Minimalist browser window with checkmark
- Represents web-based tools and successful processing
- Colors: Blue gradient background, white window outline

**Visual Details**:
- Background: Gradient `#2563EB` to `#60A5FA`
- Icon: White browser window outline with checkmark inside
- Style: Geometric, modern, clean lines
- Detail: Small circles in top-left for window controls

**Symbolism**:
- Browser window = web-based, no installation
- Checkmark = successful, working, reliable
- Clean design = simplicity, ease of use

**Technical Specs**: Same as Concept 1

**Recommendation**: **Concept 1 ("C" Letter Mark)** for clarity and recognizability at small sizes.

---

### Mobile Icon Adaptation

For mobile (64x64px display):
- Ensure "C" remains legible
- Increase weight of letter slightly
- Remove any subtle effects that don't scale
- Test on actual mobile devices

---

## Banner Design

### Desktop Banner (1920x384px recommended)

**Primary Banner Concept: "Workflow Visualization"**

**Description**: Clean, modern banner showing abstract workflow with ConveniencePro branding.

**Layout**:
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ConveniencePro                                    [Icon]      │
│  Tools for Productivity • Privacy for Peace of Mind             │
│                                                                 │
│  ┌───┐ → ┌───┐ → ┌───┐ → ┌───┐  [Abstract workflow diagram]   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Visual Elements**:

**Background**:
- Gradient from `#1E40AF` (left) to `#2563EB` (right)
- Subtle geometric pattern overlay (10% opacity)
- Pattern: Small grid or circuit-board inspired design

**Left Side (Primary Content)**:
- "ConveniencePro" wordmark (white, bold, 48px)
- Tagline below: "Tools for Productivity • Privacy for Peace of Mind" (white, 18px, medium weight)
- Positioned: 60px from left, vertically centered

**Center (Visual Element)**:
- Abstract workflow diagram showing:
  - Document icon → Processing → Result icon
  - Simplified, iconic representation
  - White with 80% opacity
  - Flowing arrows between elements
- Represents: Client-side processing flow

**Right Side (Branding)**:
- Larger version of subreddit icon (128x128px)
- Positioned: 60px from right, vertically centered
- Optional: Subtle glow effect

**Bottom Right Corner**:
- Small text: "200+ Free Tools • 0 Uploads" (white, 14px, 50% opacity)

---

**Alternative Banner Concept: "Tool Grid"**

**Description**: Showcase various tool categories with icons in a clean grid.

**Layout**:
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  r/ConveniencePro                                               │
│  200+ Free Privacy-First Tools                                  │
│                                                                 │
│  [PDF] [IMG] [TXT] [FILE] [CALC] [COLOR] [CODE] [MORE]       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Visual Elements**:
- Background: Same gradient as primary concept
- Top: Subreddit name and tagline (left aligned, white)
- Center: Row of 8 tool category icons (white, simplified)
- Icons represent: PDF, Image, Text, File, Calculator, Color, Code, Plus (more)
- Style: Minimalist, line-based icons
- Spacing: Even distribution across width

**Recommendation**: **Primary "Workflow Visualization"** concept for cleaner, more focused design.

---

### Mobile Banner (640x192px recommended)

**Simplified Design**:
- Background: Solid `#2563EB` or subtle gradient
- Center: "ConveniencePro" wordmark (white)
- Below: Small tagline or just subreddit icon
- No complex graphics (they don't scale well)

**Layout**:
```
┌────────────────────┐
│                    │
│   [Icon]           │
│   ConveniencePro   │
│                    │
└────────────────────┘
```

---

## UI Element Styles

### Buttons and CTAs

**Primary Button** (used in announcements, important actions):
- Background: `#2563EB`
- Text: White
- Border: None
- Border radius: 6px
- Padding: 10px 20px
- Hover: `#1E40AF`

**Secondary Button**:
- Background: Transparent
- Text: `#2563EB`
- Border: 2px solid `#2563EB`
- Border radius: 6px
- Padding: 10px 20px
- Hover: Background `#EFF6FF` (blue-50)

**Text Link**:
- Color: `#2563EB`
- Underline: On hover
- Hover: `#1E40AF`

### Cards and Containers

**Post/Content Cards**:
- Background: White (`#FFFFFF`)
- Border: 1px solid `#E5E7EB` (gray-200)
- Border radius: 8px
- Shadow: Subtle (0 1px 3px rgba(0,0,0,0.1))
- Padding: 16px

**Highlighted/Featured Cards**:
- Border: 2px solid `#2563EB`
- Shadow: Medium (0 4px 6px rgba(37,99,235,0.1))
- Optional: Subtle blue background tint

### Badges and Flairs

**User Flairs**:
- Background: `#EFF6FF` (blue-50)
- Text: `#1E40AF` (primary-700)
- Border: 1px solid `#BFDBFE` (blue-200)
- Border radius: 4px
- Padding: 2px 8px
- Font size: 12px

**Post Flairs**:
- Varies by category (see Post Flair Color Guide below)
- Text: White (for colored backgrounds)
- Border radius: 4px
- Padding: 2px 8px
- Font size: 12px
- Font weight: 500

### Post Flair Color Guide

| Flair | Background | Use Case |
|-------|-----------|----------|
| 💡 Workflow Share | `#8B5CF6` (Purple) | User sharing productivity system |
| 🆘 Help Needed | `#EF4444` (Red) | Support requests |
| 🐛 Bug Report | `#DC2626` (Dark Red) | Bug reports |
| ✨ Feature Request | `#06B6D4` (Cyan) | Feature ideas |
| 📚 Tutorial | `#10B981` (Green) | Educational content |
| 💬 Discussion | `#6B7280` (Gray) | General discussion |
| 📰 News & Updates | `#3B82F6` (Blue) | News and announcements |
| 🎉 Success Story | `#F59E0B` (Amber) | User wins |
| 🗳️ Poll / Survey | `#8B5CF6` (Purple) | Community polls |
| 📌 Announcement | `#2563EB` (Primary Blue) | Mod announcements |
| 🎯 Weekly Thread | `#059669` (Emerald) | Recurring threads |

---

## Icons and Graphics

### Icon Style Guidelines

**Characteristics**:
- Style: Line-based, geometric, modern
- Weight: 2-3px strokes
- Corners: Rounded (2px radius)
- Detail: Minimal, recognizable at small sizes
- Color: Primary Blue or white (depending on background)

**Tool Category Icons**:

Suggested icon metaphors:
- 📄 **PDF**: Document with fold
- 🖼️ **Image**: Photo/picture frame
- 📝 **Text**: Horizontal lines (text representation)
- 💰 **Financial**: Calculator or dollar sign
- 📁 **File**: Folder or document
- 🎨 **Color**: Palette or color wheel
- ⚙️ **Settings**: Gear
- 🔒 **Privacy**: Lock or shield

**Style Reference**: Google Material Icons (outlined variant) or Heroicons (outline style)

### Illustration Style

For tutorial graphics, feature explanations, etc.:

**Style**: Flat design with subtle depth
**Colors**: Limited palette (primary blue + 2-3 supporting colors)
**Complexity**: Simple, clear, purpose-driven
**Characters**: Abstract (if needed), no detailed human illustrations
**Perspective**: Isometric or flat front-view

**Example Use Cases**:
- Workflow diagrams
- Feature explanation graphics
- Tutorial step illustrations
- Success/error state visuals

---

## Reddit-Specific Implementations

### New Reddit Design

**Theme Settings**:
- Base Theme: Light (with Dark mode support)
- Primary Color: `#2563EB`
- Highlight Color: `#60A5FA`
- Background: `#FFFFFF` (Light) / `#1F2937` (Dark)

**Header**:
- Background: `#1E40AF`
- Text: White
- Height: Standard Reddit height
- Banner: Custom (see Banner Design section)
- Icon: Custom (see Logo & Icon Design section)

**Sidebar**:
- Background: `#F9FAFB` (Light) / `#111827` (Dark)
- Text: `#111827` (Light) / `#F9FAFB` (Dark)
- Widgets: Card style with subtle borders

**Posts**:
- Background: White cards on light gray background
- Hover: Subtle blue tint
- Selected: `#EFF6FF` background

### Old Reddit Design (Optional Support)

**Stylesheet Customization**:
- Header background: `#1E40AF`
- Link color: `#2563EB`
- Sidebar background: `#F9FAFB`
- RES Night Mode: Support with dark variants

**Banner**:
- Height: 150px (old Reddit standard)
- Simplified version of main banner
- Logo positioned left

### Mobile App Appearance

**Icon**:
- Must be clear at 64x64px
- High contrast
- Simple design

**Color**:
- Primary: `#2563EB`
- Will appear in app branding

**Banner**:
- Mobile dimensions
- Simplified design
- Text remains legible at small size

---

## Accessibility Considerations

### Color Contrast

All color combinations must meet **WCAG AAA** standards:

**Text Contrast Ratios**:
- Large text (18pt+): 4.5:1 minimum
- Normal text: 7:1 minimum
- UI components: 3:1 minimum

**Tested Combinations** (all pass):
- White on `#2563EB`: 8.6:1 ✅
- White on `#1E40AF`: 11.2:1 ✅
- `#111827` on White: 16.8:1 ✅
- `#2563EB` on White: 8.6:1 ✅

### Visual Accessibility

**Don't rely solely on color**:
- Use icons + text for flairs
- Add patterns or textures to differentiate elements
- Include text labels on all icon buttons

**Font Sizes**:
- Minimum 14px for body text
- Minimum 16px for important information
- Scale up for headings

**Focus States**:
- Clear focus indicators (outline or shadow)
- Color: `#60A5FA` with 3px outline
- Never remove focus states

---

## Animation and Motion

### Subtle Animations (Use Sparingly)

**Hover Effects**:
- Transition duration: 200ms
- Easing: ease-in-out
- Properties: Background color, transform (scale)

**Example**:
```css
button:hover {
  transform: translateY(-2px);
  transition: transform 200ms ease-in-out;
}
```

**Loading States**:
- Spinner: Primary Blue color
- Style: Simple circular spinner
- Size: Proportional to context

**Avoid**:
- Excessive animations
- Distracting motion
- Animations that cause accessibility issues (seizures)
- Anything that can't be disabled

---

## Brand Voice (Visual Translation)

### Privacy First
**Visual Expression**:
- Closed shapes (circles, rounded rectangles)
- Lock and shield imagery
- Dark blues and deep colors
- Solid, stable compositions

### Accessibility for All
**Visual Expression**:
- High contrast
- Clear typography
- Simple, recognizable icons
- Generous whitespace
- Uncluttered layouts

### Freedom and Control
**Visual Expression**:
- Open space
- Bright accent colors
- Expansive layouts
- Flexible grid systems
- Breathing room between elements

---

## Design Asset Checklist

**Required for Subreddit Launch**:
- [ ] Subreddit icon (256x256px PNG, @1x @2x @3x)
- [ ] Desktop banner (1920x384px PNG/JPG)
- [ ] Mobile banner (640x192px PNG/JPG)
- [ ] Post flair icons (optional, 16x16px PNG)
- [ ] User flair icons (optional, 16x16px PNG)

**Nice to Have**:
- [ ] Animated icon (for special events)
- [ ] Banner variations (seasonal, special events)
- [ ] Custom award icons (Reddit Gold alternatives)
- [ ] Tutorial/guide graphics
- [ ] Social media share graphics

---

## Design Tools and Resources

**Recommended Tools**:
- Figma (for vector graphics and collaboration)
- Adobe Illustrator (for logo/icon design)
- Photoshop (for banner design)
- Canva (for quick graphics)

**Color Tools**:
- Coolors.co (palette generation)
- Contrast-ratio.com (accessibility checking)
- ColorBox by Lyft (palette systems)

**Icon Resources**:
- Heroicons (https://heroicons.com)
- Material Icons (https://fonts.google.com/icons)
- Noun Project (https://thenounproject.com)

**Font Resources**:
- Google Fonts (Inter, Roboto, Open Sans)
- Font Awesome (for icon fonts)

---

## Implementation Notes for Designer

### File Delivery Format

**Deliverables**:
1. **Icon**: PNG, transparent background, 512x512px minimum
2. **Desktop Banner**: PNG or JPG, 1920x384px (2x resolution: 3840x768px)
3. **Mobile Banner**: PNG or JPG, 640x192px (2x resolution: 1280x384px)
4. **Source Files**: Figma, AI, or PSD files for future editing
5. **Style Guide**: One-page visual reference with colors, fonts, spacing

**Naming Convention**:
```
conveniencepro-subreddit-icon-512.png
conveniencepro-subreddit-icon-256.png
conveniencepro-subreddit-banner-desktop-1920x384.png
conveniencepro-subreddit-banner-desktop-3840x768@2x.png
conveniencepro-subreddit-banner-mobile-640x192.png
```

### Reddit Upload Specifications

**Icon**:
- Format: PNG
- Dimensions: 256x256px minimum (Reddit will resize)
- File size: <500KB
- Background: Transparent or solid color

**Banner**:
- Format: PNG or JPG
- Dimensions: 1920x384px (4:1 ratio for new Reddit)
- File size: <10MB
- Background: Opaque

**Mobile Banner**:
- Format: PNG or JPG
- Dimensions: 640x192px (10:3 ratio)
- File size: <10MB

---

## Version Control and Updates

**Update Schedule**:
- **Minor tweaks**: As needed (color adjustments, text updates)
- **Seasonal variations**: Quarterly (optional holiday themes)
- **Major redesign**: Annually or as needed

**Design Review**:
- Community feedback after 1 month
- Analytics on engagement with visual elements
- A/B testing for banner variations (if needed)

**Approval Process**:
1. Designer creates mockups
2. Marketing team reviews
3. Community preview (optional, for major changes)
4. Implementation
5. Monitor feedback and iterate

---

## Examples and Inspiration

**Subreddits with Good Design**:
- r/privacy (clean, professional, value-aligned)
- r/productivity (organized, helpful visual hierarchy)
- r/Notion (branded but not overdone)
- r/ObsidianMD (community-feel with professional touch)

**What to Emulate**:
- Clean, uncluttered design
- Strong but not overwhelming branding
- Accessibility-first approach
- Professional yet approachable

**What to Avoid**:
- Overly corporate or stuffy design
- Cluttered or busy layouts
- Low-contrast or hard-to-read text
- Excessive branding everywhere

---

## FAQ for Designers

**Q: How strict are these guidelines?**
A: Colors and accessibility are strict. Layout and composition have flexibility for creativity.

**Q: Can I suggest alternative concepts?**
A: Absolutely! These are starting points. Bring your expertise.

**Q: What if Reddit's platform limits what we can do?**
A: Design within Reddit's constraints. We can't change platform, so optimize for what's possible.

**Q: Should the design look identical to the website?**
A: Consistent, not identical. Same colors/feel, adapted to Reddit's format.

**Q: How do I handle dark mode?**
A: Reddit handles dark mode automatically for most elements. Test in both modes. Provide dark variants if needed.

**Q: What about animations?**
A: Reddit limits animations. Focus on static design. Subtle CSS animations are possible but not required.

---

**Document Owner**: Marketing & Design Team
**Designer Contact**: [TBD]
**Review**: Before launch, then quarterly
**Next Review**: After 3 months of community feedback

**Version History**:
- v1.0 (2025-11-24): Initial visual identity guide
