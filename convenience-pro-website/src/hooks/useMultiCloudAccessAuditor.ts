import { useState } from 'react';

export interface CloudAccessLog {
  timestamp: string;
  provider: 'AWS' | 'Azure' | 'GCP' | 'Oracle' | 'Other';
  user: string;
  ipAddress: string;
  action: string;
  resource: string;
  result: 'Success' | 'Failed' | 'Denied';
  userAgent?: string;
}

export interface AccessAnomaly {
  type: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  description: string;
  logs: CloudAccessLog[];
  recommendation: string;
}

export interface UserAccessPattern {
  user: string;
  totalAccess: number;
  providers: string[];
  unusualIPs: string[];
  failedAttempts: number;
  riskScore: number;
}

export interface AuditResult {
  totalLogs: number;
  providersAnalyzed: string[];
  usersAnalyzed: number;
  anomaliesDetected: AccessAnomaly[];
  userPatterns: UserAccessPattern[];
  timelineData: { date: string; count: number; provider: string }[];
  recommendations: string[];
}

export function useMultiCloudAccessAuditor() {
  const [result, setResult] = useState<AuditResult | null>(null);

  const detectAnomalies = (logs: CloudAccessLog[]): AccessAnomaly[] => {
    const anomalies: AccessAnomaly[] = [];

    // Group by user and IP
    const userIPs = new Map<string, Set<string>>();
    const userHourly = new Map<string, Map<number, number>>();

    logs.forEach(log => {
      if (!userIPs.has(log.user)) {
        userIPs.set(log.user, new Set());
      }
      userIPs.get(log.user)!.add(log.ipAddress);

      const hour = new Date(log.timestamp).getHours();
      if (!userHourly.has(log.user)) {
        userHourly.set(log.user, new Map());
      }
      const hourMap = userHourly.get(log.user)!;
      hourMap.set(hour, (hourMap.get(hour) || 0) + 1);
    });

    // Detect unusual IP addresses (more than 5 different IPs for one user)
    userIPs.forEach((ips, user) => {
      if (ips.size > 5) {
        const userLogs = logs.filter(l => l.user === user);
        anomalies.push({
          type: 'Multiple IP Addresses',
          severity: 'High',
          description: `User "${user}" accessed from ${ips.size} different IP addresses`,
          logs: userLogs.slice(0, 10),
          recommendation: 'Verify user identity and review for account compromise'
        });
      }
    });

    // Detect off-hours access (2am-5am)
    const offHoursLogs = logs.filter(log => {
      const hour = new Date(log.timestamp).getHours();
      return hour >= 2 && hour <= 5;
    });

    if (offHoursLogs.length > 10) {
      anomalies.push({
        type: 'Off-Hours Access',
        severity: 'Medium',
        description: `${offHoursLogs.length} access attempts during unusual hours (2am-5am)`,
        logs: offHoursLogs.slice(0, 10),
        recommendation: 'Review for automated scripts or unauthorized access'
      });
    }

    // Detect failed login attempts
    const failedLogins = logs.filter(log =>
      log.result === 'Failed' || log.result === 'Denied'
    );

    if (failedLogins.length > 20) {
      anomalies.push({
        type: 'Multiple Failed Attempts',
        severity: 'Critical',
        description: `${failedLogins.length} failed access attempts detected`,
        logs: failedLogins.slice(0, 10),
        recommendation: 'Investigate potential brute force attack or credential stuffing'
      });
    }

    // Detect rapid sequential access (possible automated access)
    const sortedLogs = [...logs].sort((a, b) =>
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    let rapidAccessCount = 0;
    for (let i = 1; i < sortedLogs.length; i++) {
      const timeDiff = new Date(sortedLogs[i].timestamp).getTime() -
                      new Date(sortedLogs[i-1].timestamp).getTime();
      if (timeDiff < 1000 && sortedLogs[i].user === sortedLogs[i-1].user) {
        rapidAccessCount++;
      }
    }

    if (rapidAccessCount > 50) {
      anomalies.push({
        type: 'Rapid Sequential Access',
        severity: 'Medium',
        description: `${rapidAccessCount} instances of rapid sequential access detected`,
        logs: sortedLogs.filter((log, i) => i > 0 &&
          new Date(log.timestamp).getTime() - new Date(sortedLogs[i-1].timestamp).getTime() < 1000
        ).slice(0, 10),
        recommendation: 'Review for automated scripts or API abuse'
      });
    }

    return anomalies.sort((a, b) => {
      const order = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
      return order[b.severity] - order[a.severity];
    });
  };

  const analyzeUserPatterns = (logs: CloudAccessLog[]): UserAccessPattern[] => {
    const userStats = new Map<string, {
      count: number;
      providers: Set<string>;
      ips: Set<string>;
      failed: number;
    }>();

    logs.forEach(log => {
      if (!userStats.has(log.user)) {
        userStats.set(log.user, {
          count: 0,
          providers: new Set(),
          ips: new Set(),
          failed: 0
        });
      }

      const stats = userStats.get(log.user)!;
      stats.count++;
      stats.providers.add(log.provider);
      stats.ips.add(log.ipAddress);
      if (log.result === 'Failed' || log.result === 'Denied') {
        stats.failed++;
      }
    });

    return Array.from(userStats.entries()).map(([user, stats]) => {
      const unusualIPs = stats.ips.size > 3 ? Array.from(stats.ips).slice(0, 5) : [];
      const riskScore = Math.min(100,
        (stats.ips.size * 10) +
        (stats.failed * 5) +
        (stats.providers.size * 5)
      );

      return {
        user,
        totalAccess: stats.count,
        providers: Array.from(stats.providers),
        unusualIPs,
        failedAttempts: stats.failed,
        riskScore
      };
    }).sort((a, b) => b.riskScore - a.riskScore);
  };

  const auditLogs = (logs: CloudAccessLog[]) => {
    const providers = [...new Set(logs.map(l => l.provider))];
    const users = [...new Set(logs.map(l => l.user))];

    const anomalies = detectAnomalies(logs);
    const userPatterns = analyzeUserPatterns(logs);

    // Create timeline
    const timelineMap = new Map<string, Map<string, number>>();
    logs.forEach(log => {
      const date = log.timestamp.split('T')[0];
      if (!timelineMap.has(date)) {
        timelineMap.set(date, new Map());
      }
      const providerMap = timelineMap.get(date)!;
      providerMap.set(log.provider, (providerMap.get(log.provider) || 0) + 1);
    });

    const timelineData = Array.from(timelineMap.entries()).flatMap(([date, providerMap]) =>
      Array.from(providerMap.entries()).map(([provider, count]) => ({
        date,
        provider,
        count
      }))
    ).sort((a, b) => a.date.localeCompare(b.date));

    // Generate recommendations
    const recommendations: string[] = [];

    if (anomalies.some(a => a.severity === 'Critical')) {
      recommendations.push('Critical anomalies detected - immediate investigation required');
    }

    if (anomalies.some(a => a.type === 'Multiple IP Addresses')) {
      recommendations.push('Implement IP whitelisting or geo-blocking for sensitive accounts');
    }

    if (logs.filter(l => l.result === 'Failed').length > 50) {
      recommendations.push('Enable MFA for all cloud accounts to prevent unauthorized access');
    }

    recommendations.push('Review and consolidate cloud access across providers');
    recommendations.push('Implement automated alerts for unusual access patterns');
    recommendations.push('Regularly audit and remove unnecessary user permissions');
    recommendations.push('Enable detailed logging for all cloud provider activities');

    setResult({
      totalLogs: logs.length,
      providersAnalyzed: providers,
      usersAnalyzed: users.length,
      anomaliesDetected: anomalies,
      userPatterns: userPatterns.slice(0, 20),
      timelineData,
      recommendations
    });
  };

  const parseCloudLogs = (fileContent: string, format: 'json' | 'csv'): CloudAccessLog[] => {
    if (format === 'json') {
      try {
        const data = JSON.parse(fileContent);
        return Array.isArray(data) ? data : [];
      } catch (e) {
        throw new Error('Invalid JSON format');
      }
    } else {
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
          provider: (entry.provider || 'Other') as any,
          user: entry.user || 'unknown',
          ipAddress: entry.ipAddress || entry.ip || '0.0.0.0',
          action: entry.action || '',
          resource: entry.resource || '',
          result: (entry.result || 'Success') as any,
          userAgent: entry.userAgent
        };
      });
    }
  };

  const reset = () => {
    setResult(null);
  };

  return {
    result,
    auditLogs,
    parseCloudLogs,
    reset
  };
}
