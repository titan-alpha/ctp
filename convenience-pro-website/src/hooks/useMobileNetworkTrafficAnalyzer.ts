import { useState } from 'react';

export interface TrafficEntry {
  timestamp: string;
  appName: string;
  domain: string;
  protocol: 'HTTP' | 'HTTPS' | 'DNS' | 'OTHER';
  bytesTransferred: number;
  requestType?: string;
  endpoint?: string;
}

export interface DomainAnalysis {
  domain: string;
  category: string;
  isTracker: boolean;
  isThirdParty: boolean;
  requests: number;
  bytes: number;
  apps: string[];
}

export interface AppNetworkProfile {
  appName: string;
  totalRequests: number;
  totalBytes: number;
  unencryptedRequests: number;
  trackerDomains: number;
  thirdPartyDomains: number;
  privacyScore: number;
  riskLevel: 'High' | 'Medium' | 'Low';
}

export interface AnalysisResult {
  totalRequests: number;
  totalBytes: number;
  unencryptedPercentage: number;
  trackerPercentage: number;
  appsAnalyzed: number;
  domains: DomainAnalysis[];
  appProfiles: AppNetworkProfile[];
  recommendations: string[];
}

export function useMobileNetworkTrafficAnalyzer() {
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const knownTrackers = [
    'doubleclick.net', 'google-analytics.com', 'googletagmanager.com',
    'facebook.com', 'facebook.net', 'connect.facebook.net',
    'amplitude.com', 'mixpanel.com', 'segment.com', 'segment.io',
    'appsflyer.com', 'adjust.com', 'branch.io',
    'crashlytics.com', 'firebase.google.com',
    'mopub.com', 'admob.com', 'adsense.google.com',
    'chartbeat.com', 'hotjar.com', 'fullstory.com'
  ];

  const categorizeDomain = (domain: string): string => {
    const lower = domain.toLowerCase();

    if (knownTrackers.some(tracker => lower.includes(tracker))) {
      return 'Analytics/Tracking';
    }
    if (lower.includes('ad') || lower.includes('ads') || lower.includes('doubleclick')) {
      return 'Advertising';
    }
    if (lower.includes('cdn') || lower.includes('cloudfront') || lower.includes('akamai')) {
      return 'CDN';
    }
    if (lower.includes('api')) {
      return 'API';
    }
    if (lower.includes('auth') || lower.includes('login') || lower.includes('oauth')) {
      return 'Authentication';
    }
    if (lower.includes('s3.amazonaws') || lower.includes('storage') || lower.includes('blob')) {
      return 'Storage';
    }

    return 'General';
  };

  const isTracker = (domain: string): boolean => {
    const lower = domain.toLowerCase();
    return knownTrackers.some(tracker => lower.includes(tracker)) ||
           lower.includes('analytics') ||
           lower.includes('tracking') ||
           lower.includes('telemetry');
  };

  const isThirdParty = (domain: string, appName: string): boolean => {
    // Simple heuristic: if domain doesn't contain app name, it's likely third-party
    const appWords = appName.toLowerCase().split(/\s+/);
    const domainLower = domain.toLowerCase();

    return !appWords.some(word => word.length > 3 && domainLower.includes(word));
  };

  const analyzeTraffic = (entries: TrafficEntry[]) => {
    const domainMap = new Map<string, {
      requests: number;
      bytes: number;
      apps: Set<string>;
      category: string;
      isTracker: boolean;
    }>();

    const appStats = new Map<string, {
      requests: number;
      bytes: number;
      unencrypted: number;
      trackers: Set<string>;
      thirdParty: Set<string>;
    }>();

    let totalUnencrypted = 0;
    let totalTracker = 0;

    // Analyze each entry
    entries.forEach(entry => {
      // Update domain stats
      if (!domainMap.has(entry.domain)) {
        domainMap.set(entry.domain, {
          requests: 0,
          bytes: 0,
          apps: new Set(),
          category: categorizeDomain(entry.domain),
          isTracker: isTracker(entry.domain)
        });
      }
      const domainStats = domainMap.get(entry.domain)!;
      domainStats.requests++;
      domainStats.bytes += entry.bytesTransferred;
      domainStats.apps.add(entry.appName);

      // Update app stats
      if (!appStats.has(entry.appName)) {
        appStats.set(entry.appName, {
          requests: 0,
          bytes: 0,
          unencrypted: 0,
          trackers: new Set(),
          thirdParty: new Set()
        });
      }
      const appStat = appStats.get(entry.appName)!;
      appStat.requests++;
      appStat.bytes += entry.bytesTransferred;

      if (entry.protocol === 'HTTP') {
        appStat.unencrypted++;
        totalUnencrypted++;
      }

      if (isTracker(entry.domain)) {
        appStat.trackers.add(entry.domain);
        totalTracker++;
      }

      if (isThirdParty(entry.domain, entry.appName)) {
        appStat.thirdParty.add(entry.domain);
      }
    });

    // Create domain analysis
    const domains: DomainAnalysis[] = Array.from(domainMap.entries()).map(([domain, stats]) => ({
      domain,
      category: stats.category,
      isTracker: stats.isTracker,
      isThirdParty: true, // Simplified
      requests: stats.requests,
      bytes: stats.bytes,
      apps: Array.from(stats.apps)
    })).sort((a, b) => b.requests - a.requests);

    // Create app profiles
    const appProfiles: AppNetworkProfile[] = Array.from(appStats.entries()).map(([appName, stats]) => {
      const unencryptedRate = stats.unencrypted / stats.requests;
      const trackerRate = stats.trackers.size / stats.requests;
      const thirdPartyRate = stats.thirdParty.size / stats.requests;

      // Calculate privacy score (0-100, higher is worse)
      const score = Math.round(
        (unencryptedRate * 40 + trackerRate * 35 + thirdPartyRate * 25) * 100
      );

      let riskLevel: 'High' | 'Medium' | 'Low';
      if (score >= 60) riskLevel = 'High';
      else if (score >= 30) riskLevel = 'Medium';
      else riskLevel = 'Low';

      return {
        appName,
        totalRequests: stats.requests,
        totalBytes: stats.bytes,
        unencryptedRequests: stats.unencrypted,
        trackerDomains: stats.trackers.size,
        thirdPartyDomains: stats.thirdParty.size,
        privacyScore: score,
        riskLevel
      };
    }).sort((a, b) => b.privacyScore - a.privacyScore);

    // Calculate percentages
    const unencryptedPercentage = (totalUnencrypted / entries.length) * 100;
    const trackerPercentage = (totalTracker / entries.length) * 100;

    // Generate recommendations
    const recommendations: string[] = [];

    if (unencryptedPercentage > 10) {
      recommendations.push('High percentage of unencrypted (HTTP) traffic detected. Use VPN or avoid apps with unencrypted connections.');
    }

    if (trackerPercentage > 20) {
      recommendations.push('Significant tracking activity detected. Consider using tracker-blocking VPN or DNS.');
    }

    const highRiskApps = appProfiles.filter(app => app.riskLevel === 'High');
    if (highRiskApps.length > 0) {
      recommendations.push(`Review privacy settings or consider alternatives for: ${highRiskApps.slice(0, 3).map(a => a.appName).join(', ')}`);
    }

    const trackerDomains = domains.filter(d => d.isTracker);
    if (trackerDomains.length > 0) {
      recommendations.push('Configure DNS-based blocking for common trackers (e.g., NextDNS, Pi-hole)');
    }

    recommendations.push('Use a privacy-focused VPN to encrypt all mobile traffic');
    recommendations.push('Review app permissions and disable background data for high-risk apps');

    setResult({
      totalRequests: entries.length,
      totalBytes: entries.reduce((sum, e) => sum + e.bytesTransferred, 0),
      unencryptedPercentage: Math.round(unencryptedPercentage * 10) / 10,
      trackerPercentage: Math.round(trackerPercentage * 10) / 10,
      appsAnalyzed: appStats.size,
      domains: domains.slice(0, 50), // Top 50 domains
      appProfiles,
      recommendations
    });
  };

  const parseTrafficData = (fileContent: string, format: 'json' | 'csv' | 'pcap'): TrafficEntry[] => {
    if (format === 'json') {
      try {
        const data = JSON.parse(fileContent);
        return Array.isArray(data) ? data : [];
      } catch (e) {
        throw new Error('Invalid JSON format');
      }
    } else if (format === 'csv') {
      const lines = fileContent.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim());

      return lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const entry: any = {};
        headers.forEach((header, i) => {
          entry[header] = values[i] || '';
        });

        return {
          timestamp: entry.timestamp || new Date().toISOString(),
          appName: entry.appName || entry.app || 'Unknown',
          domain: entry.domain || entry.host || 'unknown',
          protocol: (entry.protocol?.toUpperCase() || 'OTHER') as any,
          bytesTransferred: parseInt(entry.bytesTransferred || entry.bytes || '0'),
          requestType: entry.requestType || entry.method,
          endpoint: entry.endpoint || entry.path
        };
      });
    } else {
      // PCAP format would require more complex parsing
      throw new Error('PCAP format not yet supported. Please use JSON or CSV.');
    }
  };

  const reset = () => {
    setResult(null);
  };

  return {
    result,
    analyzeTraffic,
    parseTrafficData,
    reset
  };
}
