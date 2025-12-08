# Microsoft Clarity - Quick Start for ConveniencePro

**Time to implement**: 5 minutes

## Step-by-Step Implementation

### 1. Add Environment Variable

Create/update `.env.local`:

```env
NEXT_PUBLIC_CLARITY_PROJECT_ID=your_project_id_here
```

Get your Project ID from: https://clarity.microsoft.com → Dashboard → Copy Project ID

### 2. Copy Ready-to-Use Component

Create: `app/components/ClarityScript.tsx`

```typescript
'use client';

import Script from 'next/script';

export default function ClarityScript() {
  const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

  if (!projectId) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ Microsoft Clarity Project ID not configured');
    }
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

### 3. Add to Root Layout

Update your `app/layout.tsx`:

```typescript
import ClarityScript from './components/ClarityScript';

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

### 4. Verify It's Working

1. Open your site in browser
2. Press F12 (or Cmd+Option+I on Mac)
3. Go to **Network** tab
4. Filter for `clarity`
5. You should see POST requests to `clarity.ms/collect`

Done! Sessions are now being recorded.

---

## Optional: Add Consent Banner (GDPR)

Create: `app/components/ConsentBanner.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';

export default function ConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const hasConsent = localStorage.getItem('clarity-consent');
    if (!hasConsent) {
      setShowBanner(true);
    } else if (hasConsent === 'true' && (window as any).clarity) {
      (window as any).clarity('consent');
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('clarity-consent', 'true');
    if ((window as any).clarity) {
      (window as any).clarity('consent');
    }
    setShowBanner(false);
  };

  const handleReject = () => {
    localStorage.setItem('clarity-consent', 'false');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 flex justify-between items-center">
      <p className="text-sm">
        We use Microsoft Clarity to record sessions and improve your experience.
        No video is captured—only your interactions with the site.
      </p>
      <div className="flex gap-2">
        <button
          onClick={handleReject}
          className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
        >
          Reject
        </button>
        <button
          onClick={handleAccept}
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
```

Add to layout:

```typescript
import ConsentBanner from './components/ConsentBanner';

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
        <ConsentBanner />
      </body>
    </html>
  );
}
```

---

## Optional: Track Custom Events

In any client component:

```typescript
'use client';

export function CheckoutButton() {
  const handleClick = () => {
    // Track event in Clarity
    if ((window as any).clarity) {
      (window as any).clarity('event', 'Checkout Initiated', {
        userId: 'user123',
        cartValue: 99.99,
      });
    }

    // Your checkout logic
  };

  return <button onClick={handleClick}>Go to Checkout</button>;
}
```

---

## Data You Can See

### In Clarity Dashboard

- **Session Recordings**: Watch actual user sessions
- **Heatmaps**: See where users click/scroll
- **Rage Clicks**: Where users click repeatedly (frustration)
- **Dead Clicks**: Clicks on non-interactive elements
- **Scroll Depth**: How far down pages users scroll
- **AI Insights**: Key findings summarized

### Pricing

✅ **100% Free Forever**
- No limits on traffic
- No upgrade required
- All features included
- Data retained 30 days (favorites 13 months)

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| No POST requests to clarity.ms | Restart dev server, check `.env.local`, verify Project ID |
| Sessions not appearing | Wait 5-10 minutes, check live counter on dashboard |
| Data looks incomplete | Ad blockers may interfere, check privacy settings |
| Sensitive data visible | Update CSS masking configuration |

---

## Key Benefits for ConveniencePro

1. **Identify Checkout Friction**: Watch users abandon carts
2. **Mobile Issues**: See if touch targets are too small
3. **Navigation Problems**: Find confusing menu/layout
4. **Form Issues**: See where users get stuck
5. **Content Engagement**: Check if descriptions are read
6. **Feature Discovery**: See if users find key features

---

That's it! You now have professional session recording and UX analytics.

Check your Clarity dashboard in 10-15 minutes at: https://clarity.microsoft.com
