import { useState, useCallback } from 'react';

interface CanonicalOptions {
  removeParams: boolean;
  lowercase: boolean;
  removeTrailingSlash: boolean;
}

interface CanonicalResult {
  originalUrl: string;
  cleanedUrl: string;
  canonicalTag: string;
}

interface UseCanonicalUrlGeneratorReturn {
  result: CanonicalResult | null;
  generate: (url: string, options: CanonicalOptions) => void;
  reset: () => void;
}

function cleanUrl(url: string, options: CanonicalOptions): string {
  try {
    let cleanedUrl = url.trim();

    // Ensure URL has protocol
    if (!cleanedUrl.match(/^https?:\/\//i)) {
      cleanedUrl = 'https://' + cleanedUrl;
    }

    const urlObj = new URL(cleanedUrl);

    // Remove query parameters if option is enabled
    if (options.removeParams) {
      urlObj.search = '';
    }

    // Remove hash fragment
    urlObj.hash = '';

    let result = urlObj.toString();

    // Convert to lowercase if option is enabled
    if (options.lowercase) {
      result = result.toLowerCase();
    }

    // Handle trailing slash
    if (options.removeTrailingSlash && result.endsWith('/') && urlObj.pathname !== '/') {
      result = result.slice(0, -1);
    }

    return result;
  } catch {
    return url;
  }
}

function generateCanonicalTag(url: string): string {
  return `<link rel="canonical" href="${url}" />`;
}

export function useCanonicalUrlGenerator(): UseCanonicalUrlGeneratorReturn {
  const [result, setResult] = useState<CanonicalResult | null>(null);

  const generate = useCallback((url: string, options: CanonicalOptions) => {
    if (!url.trim()) return;

    const cleanedUrl = cleanUrl(url, options);
    const canonicalTag = generateCanonicalTag(cleanedUrl);

    setResult({
      originalUrl: url,
      cleanedUrl,
      canonicalTag,
    });
  }, []);

  const reset = useCallback(() => {
    setResult(null);
  }, []);

  return { result, generate, reset };
}
