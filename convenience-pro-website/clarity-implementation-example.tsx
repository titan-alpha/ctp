/**
 * Microsoft Clarity Implementation Examples for Next.js App Router
 *
 * Copy and use these code examples to implement Clarity in your ConveniencePro Next.js app
 */

// ============================================================================
// EXAMPLE 1: BASIC CLARITY SCRIPT COMPONENT
// ============================================================================
// File: app/components/ClarityScript.tsx
// Usage: Import and add to your root layout

'use client';

import Script from 'next/script';

export default function ClarityScript() {
  const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

  if (!projectId) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ Microsoft Clarity Project ID is not configured');
      console.warn('Add NEXT_PUBLIC_CLARITY_PROJECT_ID to .env.local');
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

// ============================================================================
// EXAMPLE 2: ROOT LAYOUT WITH CLARITY
// ============================================================================
// File: app/layout.tsx
// Add ClarityScript to your root layout

import type { Metadata } from 'next';
import ClarityScript from './components/ClarityScript';

export const metadata: Metadata = {
  title: 'ConveniencePro - Your Online Store',
  description: 'Premium convenience products delivered',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Other head content */}
      </head>
      <body>
        {children}
        <ClarityScript />
      </body>
    </html>
  );
}

// ============================================================================
// EXAMPLE 3: CLARITY WITH GDPR CONSENT BANNER
// ============================================================================
// File: app/components/ClarityWithConsent.tsx
// Use this for GDPR compliance

'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

export default function ClarityWithConsent() {
  const [consentGiven, setConsentGiven] = useState<boolean | null>(null);
  const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

  useEffect(() => {
    // Check if user is in EU/UK (GDPR required)
    const isEU = localStorage.getItem('user-region') === 'eu';

    // Check if consent was previously given
    const storedConsent = localStorage.getItem('clarity-consent');

    if (storedConsent !== null) {
      setConsentGiven(storedConsent === 'true');
    } else if (isEU) {
      // Show consent banner for EU users
      setConsentGiven(false);
    } else {
      // Auto-consent for non-EU users
      setConsentGiven(true);
    }
  }, []);

  const handleConsentAccept = () => {
    localStorage.setItem('clarity-consent', 'true');
    setConsentGiven(true);

    // Enable Clarity tracking if available
    if ((window as any).clarity) {
      (window as any).clarity('consent');
    }
  };

  const handleConsentReject = () => {
    localStorage.setItem('clarity-consent', 'false');
    setConsentGiven(false);
  };

  if (!projectId) return null;

  return (
    <>
      {/* Clarity Script - conditionally loads based on consent */}
      {consentGiven !== false && (
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
      )}

      {/* Consent Banner - shows only if user hasn't consented yet */}
      {consentGiven === false && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 text-white p-4">
          <div className="max-w-4xl mx-auto flex justify-between items-center gap-4">
            <p className="text-sm flex-1">
              We use Microsoft Clarity to understand how you use our site and improve your experience.
              No video is recorded—only your interactions with the page are captured for analysis.
            </p>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={handleConsentReject}
                className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 text-white text-sm"
              >
                Decline
              </button>
              <button
                onClick={handleConsentAccept}
                className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500 text-white text-sm"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ============================================================================
// EXAMPLE 4: ADVANCED CLARITY WITH DATA MASKING
// ============================================================================
// File: app/components/ClarityAdvanced.tsx
// Use for sensitive data protection

'use client';

import Script from 'next/script';

export default function ClarityAdvanced() {
  const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

  if (!projectId) return null;

  return (
    <>
      {/* Configuration Script - must run before Clarity loads */}
      <Script
        id="clarity-config"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.clarity = window.clarity || function(){(clarity.q=clarity.q||[]).push(arguments)};
            clarity("set", {
              // Mask all text in input fields
              maskAllInputs: true,

              // Mask specific CSS classes (comma-separated)
              maskCssClassNames: "credit-card, ssn, password-field, api-key, auth-token",

              // Mask specific element IDs
              maskCssIds: "card-number, security-code, password",

              // Don't mask these classes (whitelist)
              unmaskCssClassNames: "public-comment, user-bio",

              // Mask URLs containing sensitive paths
              maskUrlQueryStringLetters: true,

              // Track navigation
              trackShortcutKeys: true,
            });
          `,
        }}
      />

      {/* Main Clarity Script */}
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

// ============================================================================
// EXAMPLE 5: CUSTOM EVENT TRACKING
// ============================================================================
// File: app/hooks/useClarityEvent.ts
// Use in your components to track custom events

'use client';

import { useCallback } from 'react';

export function useClarityEvent() {
  const trackEvent = useCallback((eventName: string, data?: Record<string, any>) => {
    if (typeof window !== 'undefined' && (window as any).clarity) {
      try {
        (window as any).clarity('event', eventName, data);
      } catch (error) {
        console.error('Error tracking Clarity event:', error);
      }
    }
  }, []);

  return { trackEvent };
}

// ============================================================================
// EXAMPLE 6: PRODUCT PAGE WITH CLARITY TRACKING
// ============================================================================
// File: app/products/[id]/page.tsx
// Example of tracking events on a product page

'use client';

import { useClarityEvent } from '@/app/hooks/useClarityEvent';
import { useState } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
}

export default function ProductPage({ product }: { product: Product }) {
  const { trackEvent } = useClarityEvent();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    // Track event in Clarity
    trackEvent('Product Added to Cart', {
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity: quantity,
    });

    // Your add to cart logic
    console.log(`Added ${quantity} of ${product.name} to cart`);
  };

  const handleViewDetails = () => {
    trackEvent('Product Details Viewed', {
      productId: product.id,
      productName: product.name,
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

      <div className="grid grid-cols-2 gap-8">
        <div className="bg-gray-100 h-96 rounded" />

        <div>
          <p className="text-2xl font-bold text-blue-600 mb-4">${product.price}</p>

          <p
            className="text-gray-600 mb-6"
            onClick={handleViewDetails}
          >
            {product.description}
          </p>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Quantity</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="border rounded px-4 py-2 w-24"
            />
          </div>

          <button
            onClick={handleAddToCart}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 w-full"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE 7: CHECKOUT WITH CLARITY TRACKING
// ============================================================================
// File: app/checkout/page.tsx
// Track checkout progress for Clarity analysis

'use client';

import { useClarityEvent } from '@/app/hooks/useClarityEvent';
import { useState } from 'react';

type CheckoutStep = 'cart' | 'shipping' | 'payment' | 'confirmation';

export default function CheckoutPage() {
  const { trackEvent } = useClarityEvent();
  const [step, setStep] = useState<CheckoutStep>('cart');

  const handleStepChange = (newStep: CheckoutStep) => {
    trackEvent('Checkout Step Changed', {
      fromStep: step,
      toStep: newStep,
      timestamp: new Date().toISOString(),
    });
    setStep(newStep);
  };

  const handleCheckoutAbandon = () => {
    trackEvent('Checkout Abandoned', {
      currentStep: step,
      cartValue: 99.99, // Get from your cart context
    });
  };

  const handleCheckoutComplete = () => {
    trackEvent('Checkout Completed', {
      orderId: 'ORD123456',
      total: 99.99,
      itemCount: 3,
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      {/* Step Indicator */}
      <div className="flex justify-between mb-8">
        {(['cart', 'shipping', 'payment', 'confirmation'] as CheckoutStep[]).map((s) => (
          <div
            key={s}
            className={`flex-1 text-center pb-2 ${
              step === s ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-400'
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </div>
        ))}
      </div>

      {/* Current Step Content */}
      {step === 'cart' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Review Your Cart</h2>
          <button
            onClick={() => handleStepChange('shipping')}
            className="bg-blue-600 text-white px-6 py-2 rounded"
          >
            Continue to Shipping
          </button>
        </div>
      )}

      {step === 'shipping' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
          <button
            onClick={() => handleStepChange('payment')}
            className="bg-blue-600 text-white px-6 py-2 rounded"
          >
            Continue to Payment
          </button>
        </div>
      )}

      {step === 'payment' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
          <button
            onClick={handleCheckoutComplete}
            className="bg-green-600 text-white px-6 py-2 rounded"
          >
            Complete Order
          </button>
        </div>
      )}

      {/* Exit handlers */}
      <button
        onClick={handleCheckoutAbandon}
        className="text-gray-500 mt-8 underline"
      >
        Continue Shopping
      </button>
    </div>
  );
}

// ============================================================================
// EXAMPLE 8: ENVIRONMENT VARIABLE CONFIGURATION
// ============================================================================
// File: .env.local
// Add this to your project root

NEXT_PUBLIC_CLARITY_PROJECT_ID=your_project_id_here

// Optional: Enable/disable Clarity per environment
NEXT_PUBLIC_CLARITY_ENABLED=true

// ============================================================================
// EXAMPLE 9: UTILITY TO CHECK IF CLARITY IS AVAILABLE
// ============================================================================
// File: app/utils/clarity.ts
// Helper functions to safely interact with Clarity

export function isClarityAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  return !!(window as any).clarity;
}

export function getClarityProjectId(): string | undefined {
  return process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
}

export function trackClarityEvent(
  eventName: string,
  data?: Record<string, any>
): boolean {
  try {
    if (!isClarityAvailable()) {
      console.warn('Clarity not available');
      return false;
    }

    (window as any).clarity('event', eventName, data);
    return true;
  } catch (error) {
    console.error('Error tracking Clarity event:', error);
    return false;
  }
}

// ============================================================================
// EXAMPLE 10: TYPE-SAFE CLARITY EVENTS
// ============================================================================
// File: app/types/clarity.ts
// Define custom event types

export type ClarityEventName =
  | 'Product Added to Cart'
  | 'Product Removed from Cart'
  | 'Checkout Started'
  | 'Checkout Step Changed'
  | 'Checkout Completed'
  | 'Checkout Abandoned'
  | 'Search Performed'
  | 'Filter Applied'
  | 'Review Left'
  | 'Account Created'
  | 'Account Login'
  | 'Error Occurred';

export interface ClarityEvent {
  name: ClarityEventName;
  data?: Record<string, any>;
}

export function trackEvent(event: ClarityEvent): void {
  if ((window as any).clarity) {
    (window as any).clarity('event', event.name, event.data);
  }
}

// ============================================================================
// SUMMARY
// ============================================================================
/*
 * IMPLEMENTATION STEPS:
 *
 * 1. Get Project ID from https://clarity.microsoft.com
 *
 * 2. Add to .env.local:
 *    NEXT_PUBLIC_CLARITY_PROJECT_ID=your_id
 *
 * 3. Create ClarityScript component (Example 1)
 *
 * 4. Add to root layout (Example 2)
 *
 * 5. Optional: Add consent banner (Example 3) for GDPR
 *
 * 6. Optional: Add data masking (Example 4) for sensitive data
 *
 * 7. Optional: Track custom events (Examples 5-10) for insights
 *
 * 8. Verify:
 *    - Open DevTools (F12)
 *    - Network tab
 *    - Filter "clarity"
 *    - Should see POST to clarity.ms/collect
 *
 * 9. Check dashboard in 10-15 minutes at https://clarity.microsoft.com
 *
 * BEST PRACTICES:
 * - Use consent for GDPR regions
 * - Mask sensitive data
 * - Track key user flows
 * - Review sessions weekly
 * - Compare with GA4 data
 * - A/B test improvements
 * - Monitor for issues (rage clicks, dead clicks)
 *
 * SUPPORT:
 * - Docs: https://learn.microsoft.com/en-us/clarity/
 * - Blog: https://clarity.microsoft.com/blog/
 * - FAQ: https://learn.microsoft.com/en-us/clarity/faq
 */
