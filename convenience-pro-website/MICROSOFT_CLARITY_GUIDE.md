# Microsoft Clarity Implementation Guide for Next.js

## Table of Contents
1. [What is Microsoft Clarity?](#what-is-microsoft-clarity)
2. [Why Use Clarity for ConveniencePro?](#why-use-clarity-for-conveniencepro)
3. [Key Features Explained](#key-features-explained)
4. [Implementation Guide](#implementation-guide)
5. [Privacy & Compliance](#privacy--compliance)
6. [Pricing & Limits](#pricing--limits)
7. [Monitoring & Best Practices](#monitoring--best-practices)

---

## What is Microsoft Clarity?

Microsoft Clarity is a **free, user behavior analytics platform** that helps you understand how real users interact with your website. Unlike traditional analytics tools that focus on metrics and aggregated data, Clarity provides:

- **Session Recordings**: Animated replays of individual user sessions showing every click, scroll, tap, and mouse movement
- **Heatmaps**: Visual representations of where users click, hover, and scroll on your pages
- **Machine Learning Insights**: Automatic detection of frustration signals and user behavior patterns

### How It Works

Clarity records the **DOM content** (page structure) and user actions rather than video. It then reconstructs an animation showing exactly what the user did, across all devices (desktop, mobile, tablet). This creates detailed session replays without the privacy concerns of traditional video recording.

**Key difference from video recording**: Clarity doesn't capture screenshots or video footage. It records:
- All HTML/DOM changes
- User interactions (clicks, scrolls, typing)
- Mouse movements
- Form interactions
- Viewport changes
- Page transitions

---

## Why Use Clarity for ConveniencePro?

While Google Analytics 4 provides excellent **traffic and conversion metrics**, Clarity fills a critical gap for **UX optimization**:

### Clarity Advantages Over GA4

| Feature | Microsoft Clarity | Google Analytics 4 |
|---------|------------------|-------------------|
| **Session Recordings** | ✓ Full video-like replays | ✗ Not available |
| **Heatmaps** | ✓ Click & scroll maps | ✗ Not available natively |
| **Rage Click Detection** | ✓ Detects user frustration | ✗ Not available |
| **Dead Click Detection** | ✓ Finds non-functional elements | ✗ Not available |
| **Complete Scroll Tracking** | ✓ All scroll depth recorded | Partial (90% threshold) |
| **Cost** | ✓ 100% Free forever | Free (in beta) |
| **Traffic Analysis** | Basic | ✓ Excellent |
| **Conversion Tracking** | Basic | ✓ Excellent |

### Use Cases for ConveniencePro

1. **Discover Checkout Friction**: Watch users abandon carts to identify confusing steps
2. **Identify Form Issues**: See exactly where users struggle with sign-up or profile forms
3. **Find Navigation Problems**: Watch users click on non-functional elements (dead clicks)
4. **Spot Search Problems**: Understand if product search meets user expectations
5. **Detect Rage Clicks**: Identify frustration points where users repeatedly click buttons
6. **Optimize Mobile Experience**: Record mobile sessions to improve touch interactions

**Bottom line**: Clarity answers "WHY users leave" while GA4 tells you "THAT users left."

---

## Key Features Explained

### 1. Session Recordings

**What it does**: Records and replays individual user sessions, showing every interaction in chronological order.

**For ConveniencePro**:
- Watch how users navigate the store interface
- See if order tracking is intuitive
- Identify where users spend most time
- Understand mobile app navigation issues

**Privacy**: No actual video or screenshots are captured. Clarity records page structure and interactions.

### 2. Heatmaps

**What it does**: Aggregates user interaction data to show where users click, hover, and scroll.

**Types**:
- **Click Maps**: Shows clickable elements and their frequency
- **Scroll Maps**: Shows how far down the page users scroll (color-coded by depth)

**For ConveniencePro**:
- Compare click patterns across desktop vs. mobile
- Identify unclicked CTAs or important information
- Understand content engagement (is your marketing copy being read?)
- A/B test different layouts with heatmap comparison

### 3. Rage Clicks

**What it does**: Detects when users repeatedly click the same element in quick succession (sign of frustration).

**Example**:
- User clicks "Add to Cart" button 5 times rapidly
- Could indicate: button unresponsive, unclear feedback, or unexpected loading

**For ConveniencePro**:
- Identify broken checkout steps
- Find unresponsive buttons or links
- Discover unclear payment flow

### 4. Dead Clicks

**What it does**: Detects clicks on non-interactive elements (text, images, blank space).

**Example**:
- User clicks on what appears to be a button but isn't
- User clicks on text expecting it to be a link

**For ConveniencePro**:
- Find UI elements users expect to be clickable but aren't
- Identify confusing interfaces
- Improve UX by either making elements interactive or making them clearly non-interactive

### 5. Scroll Depth

**What it does**: Tracks how far users scroll down pages (percentage-based or pixel-based).

**For ConveniencePro**:
- Find the optimal length for product descriptions
- Determine if CTAs are positioned correctly
- Identify content that's below the fold but never reached

### 6. AI Insights (Copilot)

**What it does**: Microsoft's generative AI analyzes your session data and automatically highlights key findings.

**Example insights**:
- "Users are experiencing friction at checkout step 3"
- "30% increase in scroll depth after removing hero image"
- "Mobile users are 2x more likely to experience rage clicks"

---

## Implementation Guide

### Step 1: Create Microsoft Clarity Account

1. Go to [https://clarity.microsoft.com](https://clarity.microsoft.com)
2. Sign in with your Microsoft account (create one if needed)
3. Click "Start Free"
4. Enter your website URL
5. Copy your **Project ID** (looks like: `xxxxxxx`)

### Step 2: Store Project ID as Environment Variable

Create `.env.local` file in your Next.js project root:

```bash
NEXT_PUBLIC_CLARITY_PROJECT_ID=your_project_id_here
```

**Important**: The `NEXT_PUBLIC_` prefix makes this accessible in the browser. Clarity tracking must run client-side.

### Step 3: Create Clarity Component

Create a new file: `app/components/ClarityScript.tsx`

```typescript
'use client';

import Script from 'next/script';

export default function ClarityScript() {
  const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

  if (!projectId) {
    console.warn('Microsoft Clarity Project ID is not configured');
    return null;
  }

  return (
    <Script
      id="clarity-script"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${projectId}");
        `,
      }}
    />
  );
}
```

### Step 4: Add to Root Layout

Update `app/layout.tsx`:

```typescript
import type { Metadata } from 'next';
import ClarityScript from './components/ClarityScript';

export const metadata: Metadata = {
  title: 'ConveniencePro',
  description: 'Your convenient online store',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <ClarityScript />
      </body>
    </html>
  );
}
```

### Step 5: Verify Installation

1. Open your website in a browser
2. Open DevTools (F12 / Cmd+Option+I)
3. Go to Network tab
4. Filter for requests to `clarity.ms`
5. You should see POST requests to `https://www.clarity.ms/collect`

If you don't see requests:
- Check that your Project ID is correct
- Verify `.env.local` is loaded (restart dev server)
- Check browser console for errors
- Ensure you're not in an incognito/private window (may have stricter tracking restrictions)

### Step 6: Configure Data Masking (Optional but Recommended)

For sensitive data (passwords, credit cards, personal info), Clarity auto-masks by default. You can customize:

```typescript
'use client';

import Script from 'next/script';

export default function ClarityScript() {
  const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

  if (!projectId) {
    console.warn('Microsoft Clarity Project ID is not configured');
    return null;
  }

  return (
    <>
      <Script
        id="clarity-config"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.clarity = window.clarity || function(){(clarity.q=clarity.q||[]).push(arguments)};
            clarity("set", {
              // Mask all input fields
              maskAllInputs: true,
              // Mask all text in specific classes
              maskCssClassNames: "sensitive-data, credit-card, ssn",
              // Mask all IDs
              maskCssIds: "password-field, api-key",
              // Capture sensitive URLs (optional - default is masked)
              unmaskCssClassNames: "public-comment",
            });
          `,
        }}
      />
      <Script
        id="clarity-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${projectId}");
          `,
        }}
      />
    </>
  );
}
```

### Step 7: Using Clarity Events (Optional)

Track custom events beyond automatic session recording:

```typescript
// In any client component
'use client';

export function MyComponent() {
  const handleCheckout = () => {
    // Log a custom event to Clarity
    if (typeof window !== 'undefined' && (window as any).clarity) {
      (window as any).clarity("event", "Checkout Started", {
        cart_value: 99.99,
        item_count: 3,
      });
    }

    // Your checkout logic here
  };

  return (
    <button onClick={handleCheckout}>
      Proceed to Checkout
    </button>
  );
}
```

---

## Privacy & Compliance

### GDPR Compliance

**Status**: Microsoft Clarity is **GDPR compliant** ✓

**Important Requirements**:

1. **User Consent Required** for EEA, UK, and Switzerland users
   - Session recordings require explicit opt-in consent
   - Basic analytics collection requires consent in some jurisdictions
   - Implement a cookie consent banner

2. **Recommended Approach for ConveniencePro**:

```typescript
'use client';

import { useEffect } from 'react';

export function ClarityConsent() {
  useEffect(() => {
    // Check if user has consented to analytics
    const hasConsent = localStorage.getItem('analytics-consent') === 'true';

    if (hasConsent && typeof window !== 'undefined' && (window as any).clarity) {
      // Enable full Clarity tracking
      (window as any).clarity("consent");
    }
  }, []);

  return null;
}
```

3. **Cookie Banner Text Example**:
```
"We use Microsoft Clarity for session recording and analytics to improve your experience.
This helps us identify navigation issues and UX problems. Session recordings do not capture
video or screenshots but record your interactions with the site."
```

### Data Privacy Features

**Clarity's Built-in Protections**:

1. **Automatic Masking**:
   - Password fields (masked by default)
   - Credit card numbers (masked by default)
   - Email addresses (can be configured)
   - Custom sensitive data (configurable)

2. **IP Anonymization**: Partial IP masking for privacy

3. **Global Privacy Control**: Respects browser-level privacy signals

4. **No Third-Party Sharing**: Microsoft doesn't sell or share your data

### CCPA Compliance

**Status**: Clarity is **CCPA compliant** ✓

**For California Users**:
- Include Clarity in your privacy policy
- Provide opt-out mechanism via privacy controls
- Document data retention (30 days default)

---

## Pricing & Limits

### Cost: 100% FREE ✓

**Clarity Pricing Model**:
- **Completely free forever** - no hidden costs
- **No upgrade required** - all features included at no cost
- **No credit card needed** to sign up
- **No traffic limits** - no sampling, full data collection
- Processes 1+ petabyte of data from 100M+ users monthly

### Data Retention

| Data Type | Retention Period |
|-----------|------------------|
| Session Recordings | 30 days |
| Heatmaps | 30 days |
| Custom Events | 30 days |
| Favorites/Bookmarks | Up to 13 months |
| Sample sessions | Up to 13 months |

**Note**: After retention period, data is deleted from Clarity servers and cannot be recovered.

### Limitations to Know

1. **Not recommended for under-18 audience**: Due to privacy regulations

2. **No real-time streaming**: Sessions appear after a few minutes delay

3. **Data stored in US**: May have implications for some international regulations

4. **Recording limits**: While there are no hard limits, very high-traffic sites may see sampling

---

## Monitoring & Best Practices

### Weekly Review Process

1. **Check for Rage Clicks**
   - Filter sessions with rage clicks
   - Identify affected UI elements
   - Prioritize fix for high-frequency rage click areas

2. **Review Dead Clicks**
   - Find elements users expect to be clickable
   - Update UI or add functionality

3. **Analyze Drop-off Points**
   - Watch sessions that end at checkout
   - Identify specific friction points
   - Test improvements with Clarity's A/B testing

### Monthly Analysis

1. **Compare Heatmaps Across Pages**
   - Are CTAs getting clicked?
   - Is content being scrolled to?

2. **Identify Patterns**
   - Use AI Copilot insights
   - Cross-reference with GA4 data
   - Plan improvements

3. **Mobile vs Desktop**
   - Separate heatmaps by device
   - Mobile interactions patterns different?
   - Adjust touch targets if needed

### Integration with GA4

1. **Segment GA4 data by Clarity findings**
   - GA4: "Users from Chrome lost 50% revenue"
   - Clarity: "Check if Chrome mobile has UX issues"

2. **Use together for complete picture**
   - Clarity: WHY users leave
   - GA4: THAT users leave (metrics)
   - Both: Drive data-informed UX improvements

### A/B Testing with Clarity

1. Run design experiment (change checkout button color)
2. View heatmaps for both versions
3. Check rage clicks and dead clicks in each
4. Combine with GA4 conversion data
5. Make data-informed decision

---

## Troubleshooting

### Clarity Script Not Loading

**Symptoms**: No POST requests to clarity.ms in Network tab

**Solutions**:
```typescript
// 1. Check if Project ID exists
console.log(process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID);

// 2. Verify script is in DOM
console.log(document.getElementById('clarity-script'));

// 3. Check for browser errors
// Look in console for any JavaScript errors

// 4. Restart dev server
// Env variables need restart to load
```

### Missing Sessions or Heatmaps

**Possible causes**:
- Data takes 5-10 minutes to appear in dashboard
- Very low traffic sessions might not be recorded
- User has tracking disabled in browser
- Ad blocker might be blocking clarity.ms

### Privacy Concerns

**If sensitive data appears in recordings**:

1. Update masking configuration
2. Add CSS classes to sensitive fields: `class="sensitive-data"`
3. Use custom masking rules in ClarityScript
4. Refresh recording settings

---

## Next Steps

1. **Sign up**: [https://clarity.microsoft.com](https://clarity.microsoft.com)
2. **Get Project ID**: Copy from dashboard
3. **Implement**: Add to your Next.js app following guide above
4. **Verify**: Check Network tab for clarity.ms requests
5. **Review data**: Check dashboard after 10-15 minutes
6. **Iterate**: Use findings to improve UX

---

## Useful Resources

- [Microsoft Clarity Official Site](https://clarity.microsoft.com)
- [Microsoft Clarity Documentation](https://learn.microsoft.com/en-us/clarity/)
- [Microsoft Clarity Blog](https://clarity.microsoft.com/blog/)
- [Next.js Script Component](https://nextjs.org/docs/app/api-reference/components/script)

---

**Created**: 2025-11-22
**For**: ConveniencePro
**Status**: Implementation Ready
