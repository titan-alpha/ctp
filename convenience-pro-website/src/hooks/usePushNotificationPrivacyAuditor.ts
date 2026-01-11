import { useState } from 'react';

export interface NotificationEntry {
  timestamp: string;
  appName: string;
  title: string;
  content: string;
  hasImage: boolean;
  actionButtons?: string[];
}

export interface PIIDetection {
  type: string;
  value: string;
  location: string;
  severity: 'high' | 'medium' | 'low';
}

export interface AppPrivacyScore {
  appName: string;
  totalNotifications: number;
  piiDetections: number;
  sensitiveCount: number;
  score: number;
  riskLevel: 'High' | 'Medium' | 'Low';
}

export interface AuditResult {
  totalNotifications: number;
  appsAnalyzed: number;
  piiDetected: PIIDetection[];
  appScores: AppPrivacyScore[];
  recommendations: string[];
  timeline: { date: string; count: number }[];
}

export function usePushNotificationPrivacyAuditor() {
  const [result, setResult] = useState<AuditResult | null>(null);

  const detectPII = (text: string, location: string): PIIDetection[] => {
    const detections: PIIDetection[] = [];

    // Phone numbers
    const phoneRegex = /(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
    const phones = text.match(phoneRegex);
    if (phones) {
      phones.forEach(phone => {
        detections.push({
          type: 'Phone Number',
          value: phone,
          location,
          severity: 'high'
        });
      });
    }

    // Email addresses
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const emails = text.match(emailRegex);
    if (emails) {
      emails.forEach(email => {
        detections.push({
          type: 'Email Address',
          value: email,
          location,
          severity: 'high'
        });
      });
    }

    // Credit card numbers (basic pattern)
    const ccRegex = /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g;
    const cards = text.match(ccRegex);
    if (cards) {
      cards.forEach(card => {
        detections.push({
          type: 'Credit Card',
          value: card,
          location,
          severity: 'high'
        });
      });
    }

    // Addresses with numbers and street names
    const addressRegex = /\b\d+\s+[A-Z][a-z]+\s+(Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr|Court|Ct)\b/gi;
    const addresses = text.match(addressRegex);
    if (addresses) {
      addresses.forEach(address => {
        detections.push({
          type: 'Physical Address',
          value: address,
          location,
          severity: 'medium'
        });
      });
    }

    // Dollar amounts
    const moneyRegex = /\$[\d,]+\.?\d{0,2}/g;
    const amounts = text.match(moneyRegex);
    if (amounts) {
      amounts.forEach(amount => {
        detections.push({
          type: 'Financial Amount',
          value: amount,
          location,
          severity: 'medium'
        });
      });
    }

    // Names (simple pattern - capitalized words)
    const namePattern = /\b[A-Z][a-z]+ [A-Z][a-z]+\b/g;
    const names = text.match(namePattern);
    if (names && names.length > 0 && names.length < 5) { // Avoid false positives
      names.forEach(name => {
        detections.push({
          type: 'Personal Name',
          value: name,
          location,
          severity: 'low'
        });
      });
    }

    return detections;
  };

  const isSensitive = (notification: NotificationEntry): boolean => {
    const sensitiveKeywords = [
      'password', 'verification', 'code', 'otp', 'security',
      'payment', 'bank', 'account', 'login', 'authenticate',
      'medical', 'health', 'prescription', 'doctor',
      'private', 'confidential', 'secret'
    ];

    const text = `${notification.title} ${notification.content}`.toLowerCase();
    return sensitiveKeywords.some(keyword => text.includes(keyword));
  };

  const auditNotifications = (notifications: NotificationEntry[]) => {
    const piiDetected: PIIDetection[] = [];
    const appStats = new Map<string, {
      count: number;
      pii: number;
      sensitive: number;
    }>();

    // Analyze each notification
    notifications.forEach((notif, index) => {
      const location = `${notif.appName} - Notification ${index + 1}`;

      // Detect PII in title and content
      const titlePII = detectPII(notif.title, `${location} (Title)`);
      const contentPII = detectPII(notif.content, `${location} (Content)`);
      piiDetected.push(...titlePII, ...contentPII);

      // Update app stats
      if (!appStats.has(notif.appName)) {
        appStats.set(notif.appName, { count: 0, pii: 0, sensitive: 0 });
      }
      const stats = appStats.get(notif.appName)!;
      stats.count++;
      if (titlePII.length > 0 || contentPII.length > 0) {
        stats.pii++;
      }
      if (isSensitive(notif)) {
        stats.sensitive++;
      }
    });

    // Calculate app privacy scores
    const appScores: AppPrivacyScore[] = Array.from(appStats.entries()).map(([appName, stats]) => {
      const piiRate = stats.pii / stats.count;
      const sensitiveRate = stats.sensitive / stats.count;

      // Score calculation (0-100, higher is worse)
      let score = Math.round((piiRate * 60 + sensitiveRate * 40) * 100);

      let riskLevel: 'High' | 'Medium' | 'Low';
      if (score >= 60) riskLevel = 'High';
      else if (score >= 30) riskLevel = 'Medium';
      else riskLevel = 'Low';

      return {
        appName,
        totalNotifications: stats.count,
        piiDetections: stats.pii,
        sensitiveCount: stats.sensitive,
        score,
        riskLevel
      };
    }).sort((a, b) => b.score - a.score);

    // Create timeline
    const timelineCounts = new Map<string, number>();
    notifications.forEach(notif => {
      const date = notif.timestamp.split('T')[0];
      timelineCounts.set(date, (timelineCounts.get(date) || 0) + 1);
    });
    const timeline = Array.from(timelineCounts.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Generate recommendations
    const recommendations: string[] = [];

    if (piiDetected.length > 0) {
      recommendations.push('Configure apps to hide sensitive content in lock screen notifications');
    }

    const highRiskApps = appScores.filter(app => app.riskLevel === 'High');
    if (highRiskApps.length > 0) {
      recommendations.push(`Disable lock screen previews for: ${highRiskApps.map(a => a.appName).join(', ')}`);
    }

    if (piiDetected.some(p => p.type === 'Phone Number' || p.type === 'Email Address')) {
      recommendations.push('Review notification privacy settings for apps exposing contact information');
    }

    if (piiDetected.some(p => p.type === 'Financial Amount' || p.type === 'Credit Card')) {
      recommendations.push('Consider disabling notifications for financial apps or use generic alerts');
    }

    recommendations.push('Enable notification summaries to reduce lock screen exposure');
    recommendations.push('Use Focus modes to temporarily disable sensitive notifications');

    setResult({
      totalNotifications: notifications.length,
      appsAnalyzed: appStats.size,
      piiDetected,
      appScores,
      recommendations,
      timeline
    });
  };

  const parseNotificationData = (fileContent: string, format: 'json' | 'csv'): NotificationEntry[] => {
    if (format === 'json') {
      try {
        const data = JSON.parse(fileContent);
        // Assume array of notification objects
        return Array.isArray(data) ? data : [];
      } catch (e) {
        throw new Error('Invalid JSON format');
      }
    } else {
      // Parse CSV
      const lines = fileContent.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim());

      return lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const entry: any = {};
        headers.forEach((header, i) => {
          entry[header] = values[i] || '';
        });

        return {
          timestamp: entry.timestamp || entry.date || new Date().toISOString(),
          appName: entry.appName || entry.app || 'Unknown',
          title: entry.title || '',
          content: entry.content || entry.message || '',
          hasImage: entry.hasImage === 'true' || false,
          actionButtons: entry.actionButtons ? entry.actionButtons.split(';') : []
        };
      });
    }
  };

  const reset = () => {
    setResult(null);
  };

  return {
    result,
    auditNotifications,
    parseNotificationData,
    reset
  };
}
