import { useState, useCallback } from 'react';

interface DomainInfo {
  fullUrl: string;
  domain: string;
  subdomain: string | null;
  tld: string;
  protocol: string;
  path: string;
  isSecure: boolean;
}

interface SimulatedMetrics {
  domainAuthority: number;
  pageAuthority: number;
  estimatedBacklinks: number;
  referringDomains: number;
  spamScore: number;
  trustFlow: number;
  citationFlow: number;
}

interface LinkStructure {
  internalLinks: number;
  externalLinks: number;
  nofollowPercentage: number;
  anchorTextDiversity: string;
}

interface BacklinkAnalysis {
  domainInfo: DomainInfo;
  metrics: SimulatedMetrics;
  linkStructure: LinkStructure;
  recommendations: string[];
  analyzedAt: string;
}

interface UseBacklinkCheckerReturn {
  result: BacklinkAnalysis | null;
  isLoading: boolean;
  error: string | null;
  analyze: (url: string) => void;
  reset: () => void;
}

function extractDomainInfo(urlString: string): DomainInfo | null {
  try {
    let normalizedUrl = urlString.trim();
    if (!normalizedUrl.match(/^https?:\/\//i)) {
      normalizedUrl = 'https://' + normalizedUrl;
    }

    const url = new URL(normalizedUrl);
    const hostParts = url.hostname.split('.');

    let domain = url.hostname;
    let subdomain: string | null = null;
    let tld = '';

    if (hostParts.length >= 2) {
      tld = hostParts[hostParts.length - 1];
      if (hostParts.length > 2) {
        subdomain = hostParts.slice(0, -2).join('.');
        domain = hostParts.slice(-2).join('.');
      }
    }

    return {
      fullUrl: normalizedUrl,
      domain,
      subdomain,
      tld,
      protocol: url.protocol.replace(':', ''),
      path: url.pathname,
      isSecure: url.protocol === 'https:',
    };
  } catch {
    return null;
  }
}

function generateSimulatedMetrics(domain: string): SimulatedMetrics {
  // Generate deterministic but varied metrics based on domain hash
  const hash = domain.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  const domainAuthority = 10 + (hash % 70);
  const pageAuthority = Math.max(5, domainAuthority - 5 + (hash % 15));

  return {
    domainAuthority,
    pageAuthority,
    estimatedBacklinks: Math.floor((hash * 17) % 50000) + 100,
    referringDomains: Math.floor((hash * 7) % 5000) + 10,
    spamScore: hash % 30,
    trustFlow: 15 + (hash % 50),
    citationFlow: 20 + (hash % 55),
  };
}

function generateLinkStructure(domain: string): LinkStructure {
  const hash = domain.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  const diversityOptions = ['High', 'Medium', 'Low'];

  return {
    internalLinks: 50 + (hash % 200),
    externalLinks: 10 + (hash % 50),
    nofollowPercentage: 5 + (hash % 40),
    anchorTextDiversity: diversityOptions[hash % 3],
  };
}

function generateRecommendations(metrics: SimulatedMetrics, domainInfo: DomainInfo): string[] {
  const recommendations: string[] = [];

  if (!domainInfo.isSecure) {
    recommendations.push('Switch to HTTPS to improve trust signals and SEO rankings.');
  }

  if (metrics.domainAuthority < 30) {
    recommendations.push('Focus on building quality backlinks from authoritative sites to improve domain authority.');
  }

  if (metrics.spamScore > 20) {
    recommendations.push('Review and disavow low-quality or spammy backlinks to reduce spam score.');
  }

  if (metrics.trustFlow < 30) {
    recommendations.push('Acquire links from trusted, relevant industry websites to boost trust flow.');
  }

  if (metrics.referringDomains < 100) {
    recommendations.push('Diversify your backlink profile by getting links from more unique domains.');
  }

  if (recommendations.length === 0) {
    recommendations.push('Your backlink profile appears healthy. Continue building quality links.');
  }

  return recommendations;
}

export function useBacklinkChecker(): UseBacklinkCheckerReturn {
  const [result, setResult] = useState<BacklinkAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback((url: string) => {
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    setIsLoading(true);
    setError(null);

    // Simulate API delay
    setTimeout(() => {
      const domainInfo = extractDomainInfo(url);

      if (!domainInfo) {
        setError('Invalid URL format. Please enter a valid URL.');
        setIsLoading(false);
        return;
      }

      const metrics = generateSimulatedMetrics(domainInfo.domain);
      const linkStructure = generateLinkStructure(domainInfo.domain);
      const recommendations = generateRecommendations(metrics, domainInfo);

      setResult({
        domainInfo,
        metrics,
        linkStructure,
        recommendations,
        analyzedAt: new Date().toISOString(),
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { result, isLoading, error, analyze, reset };
}
