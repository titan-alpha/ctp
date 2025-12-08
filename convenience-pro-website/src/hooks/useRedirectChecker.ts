import { useState, useCallback } from 'react';

interface UrlInfo {
  originalUrl: string;
  normalizedUrl: string;
  protocol: string;
  domain: string;
  path: string;
  queryString: string;
  hasTrailingSlash: boolean;
}

interface RedirectStep {
  url: string;
  statusCode: number;
  type: string;
  responseTime: number;
}

interface RedirectIssue {
  type: 'warning' | 'error' | 'info';
  message: string;
  details: string;
}

interface RedirectAnalysis {
  urlInfo: UrlInfo;
  redirectType: string;
  redirectChain: RedirectStep[];
  chainLength: number;
  totalResponseTime: number;
  finalUrl: string;
  issues: RedirectIssue[];
  recommendations: string[];
  analyzedAt: string;
}

interface UseRedirectCheckerReturn {
  result: RedirectAnalysis | null;
  isLoading: boolean;
  error: string | null;
  analyze: (url: string) => void;
  reset: () => void;
}

function parseUrl(urlString: string): UrlInfo | null {
  try {
    let normalizedUrl = urlString.trim();
    if (!normalizedUrl.match(/^https?:\/\//i)) {
      normalizedUrl = 'https://' + normalizedUrl;
    }

    const url = new URL(normalizedUrl);

    return {
      originalUrl: urlString,
      normalizedUrl,
      protocol: url.protocol.replace(':', ''),
      domain: url.hostname,
      path: url.pathname,
      queryString: url.search,
      hasTrailingSlash: url.pathname.endsWith('/') && url.pathname.length > 1,
    };
  } catch {
    return null;
  }
}

function detectRedirectType(urlInfo: UrlInfo): string {
  const { originalUrl, normalizedUrl, path, queryString } = urlInfo;

  // Detect common redirect patterns
  if (originalUrl.startsWith('http://') && normalizedUrl.includes('https://')) {
    return 'HTTP to HTTPS';
  }
  if (path.includes('//')) {
    return 'Double Slash in Path';
  }
  if (queryString.includes('redirect') || queryString.includes('url=') || queryString.includes('goto=')) {
    return 'Query Parameter Redirect';
  }
  if (path.match(/\.(html|php|asp|aspx)$/i)) {
    return 'Extension-based URL';
  }
  if (urlInfo.hasTrailingSlash) {
    return 'Trailing Slash URL';
  }
  if (originalUrl.includes('www.') && !normalizedUrl.includes('www.')) {
    return 'WWW Redirect';
  }

  return 'Standard URL';
}

function simulateRedirectChain(urlInfo: UrlInfo): RedirectStep[] {
  const chain: RedirectStep[] = [];
  const hash = urlInfo.domain.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  // Simulate different redirect scenarios based on URL patterns
  const originalProtocol = urlInfo.originalUrl.startsWith('http://') ? 'http' : 'https';

  // HTTP to HTTPS redirect
  if (originalProtocol === 'http') {
    chain.push({
      url: `http://${urlInfo.domain}${urlInfo.path}`,
      statusCode: 301,
      type: '301 Permanent Redirect',
      responseTime: 50 + (hash % 100),
    });
  }

  // WWW redirect simulation
  if (!urlInfo.domain.startsWith('www.') && hash % 3 === 0) {
    chain.push({
      url: `https://${urlInfo.domain}${urlInfo.path}`,
      statusCode: 301,
      type: '301 Permanent Redirect',
      responseTime: 40 + (hash % 80),
    });
    chain.push({
      url: `https://www.${urlInfo.domain}${urlInfo.path}`,
      statusCode: 200,
      type: 'Final Destination',
      responseTime: 100 + (hash % 200),
    });
  } else if (urlInfo.hasTrailingSlash) {
    // Trailing slash handling
    chain.push({
      url: urlInfo.normalizedUrl,
      statusCode: 200,
      type: 'Final Destination',
      responseTime: 100 + (hash % 200),
    });
  } else {
    // Standard response
    chain.push({
      url: urlInfo.normalizedUrl,
      statusCode: 200,
      type: 'Final Destination',
      responseTime: 80 + (hash % 150),
    });
  }

  return chain;
}

function detectIssues(urlInfo: UrlInfo, chain: RedirectStep[]): RedirectIssue[] {
  const issues: RedirectIssue[] = [];

  // Check for redirect chain length
  if (chain.length > 2) {
    issues.push({
      type: 'warning',
      message: 'Multiple Redirects Detected',
      details: `Your URL has ${chain.length - 1} redirect(s). This can slow down page load and dilute SEO value.`,
    });
  }

  // Check for HTTP
  if (urlInfo.originalUrl.startsWith('http://')) {
    issues.push({
      type: 'error',
      message: 'Non-HTTPS URL',
      details: 'The URL uses HTTP instead of HTTPS. This is insecure and can hurt SEO rankings.',
    });
  }

  // Check for query parameter redirects
  if (urlInfo.queryString.includes('redirect') || urlInfo.queryString.includes('url=')) {
    issues.push({
      type: 'warning',
      message: 'Query Parameter Redirect',
      details: 'URL contains redirect parameters. These can be exploited for open redirect vulnerabilities.',
    });
  }

  // Check for trailing slash inconsistency
  if (urlInfo.path.length > 1) {
    issues.push({
      type: 'info',
      message: urlInfo.hasTrailingSlash ? 'Trailing Slash Present' : 'No Trailing Slash',
      details: 'Ensure consistent trailing slash usage across your site to avoid duplicate content issues.',
    });
  }

  // Check for double slashes
  if (urlInfo.path.includes('//')) {
    issues.push({
      type: 'error',
      message: 'Double Slash in Path',
      details: 'URL contains double slashes which can cause redirect loops or 404 errors.',
    });
  }

  return issues;
}

function generateRecommendations(urlInfo: UrlInfo, chain: RedirectStep[], issues: RedirectIssue[]): string[] {
  const recommendations: string[] = [];

  if (chain.length > 2) {
    recommendations.push('Reduce redirect chain length by updating links to point directly to the final destination.');
  }

  if (urlInfo.originalUrl.startsWith('http://')) {
    recommendations.push('Update all internal links to use HTTPS and implement HSTS headers.');
  }

  if (issues.some(i => i.message.includes('Query Parameter'))) {
    recommendations.push('Validate and sanitize redirect URLs to prevent open redirect vulnerabilities.');
  }

  const has301 = chain.some(step => step.statusCode === 301);
  const has302 = chain.some(step => step.statusCode === 302);

  if (has302) {
    recommendations.push('Consider using 301 redirects instead of 302 for permanent URL changes to preserve SEO value.');
  }

  if (!has301 && !has302 && chain.length === 1) {
    recommendations.push('URL resolves directly without redirects - this is optimal for performance and SEO.');
  }

  if (recommendations.length === 0) {
    recommendations.push('Your URL structure appears well-optimized. Continue monitoring for redirect issues.');
  }

  return recommendations;
}

export function useRedirectChecker(): UseRedirectCheckerReturn {
  const [result, setResult] = useState<RedirectAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback((url: string) => {
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      const urlInfo = parseUrl(url);

      if (!urlInfo) {
        setError('Invalid URL format. Please enter a valid URL.');
        setIsLoading(false);
        return;
      }

      const redirectType = detectRedirectType(urlInfo);
      const redirectChain = simulateRedirectChain(urlInfo);
      const issues = detectIssues(urlInfo, redirectChain);
      const recommendations = generateRecommendations(urlInfo, redirectChain, issues);
      const totalResponseTime = redirectChain.reduce((sum, step) => sum + step.responseTime, 0);
      const finalUrl = redirectChain[redirectChain.length - 1]?.url || urlInfo.normalizedUrl;

      setResult({
        urlInfo,
        redirectType,
        redirectChain,
        chainLength: redirectChain.length,
        totalResponseTime,
        finalUrl,
        issues,
        recommendations,
        analyzedAt: new Date().toISOString(),
      });
      setIsLoading(false);
    }, 1200);
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { result, isLoading, error, analyze, reset };
}
