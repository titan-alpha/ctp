import { useState } from 'react';

export interface AppPermission {
  appName: string;
  locationPermission: 'Always' | 'While Using' | 'Never' | 'Ask Each Time';
  preciseLocation: boolean;
  backgroundUsage: boolean;
  lastAccessed?: string;
  frequency?: string;
}

export interface LocationRisk {
  appName: string;
  riskLevel: 'Critical' | 'High' | 'Medium' | 'Low';
  reasons: string[];
  recommendation: string;
}

export interface AuditResult {
  totalApps: number;
  alwaysAllowedApps: number;
  backgroundApps: number;
  preciseLocationApps: number;
  permissions: AppPermission[];
  risks: LocationRisk[];
  recommendations: string[];
}

export function useGeolocationPermissionAuditor() {
  const [result, setResult] = useState<AuditResult | null>(null);

  const calculateRisk = (permission: AppPermission): LocationRisk => {
    const reasons: string[] = [];
    let riskScore = 0;

    if (permission.locationPermission === 'Always') {
      reasons.push('Has "Always" location access');
      riskScore += 40;
    }

    if (permission.backgroundUsage) {
      reasons.push('Accesses location in background');
      riskScore += 30;
    }

    if (permission.preciseLocation) {
      reasons.push('Has precise location access');
      riskScore += 20;
    }

    if (permission.frequency === 'High') {
      reasons.push('High frequency of location access');
      riskScore += 10;
    }

    // Determine risk level
    let riskLevel: 'Critical' | 'High' | 'Medium' | 'Low';
    let recommendation: string;

    if (riskScore >= 70) {
      riskLevel = 'Critical';
      recommendation = 'Change to "While Using App" or disable location entirely';
    } else if (riskScore >= 50) {
      riskLevel = 'High';
      recommendation = 'Disable background location and consider approximate location';
    } else if (riskScore >= 30) {
      riskLevel = 'Medium';
      recommendation = 'Review if precise location is necessary for app functionality';
    } else {
      riskLevel = 'Low';
      recommendation = 'Current settings are relatively privacy-preserving';
    }

    return {
      appName: permission.appName,
      riskLevel,
      reasons,
      recommendation
    };
  };

  const auditPermissions = (permissions: AppPermission[]) => {
    const alwaysAllowed = permissions.filter(p => p.locationPermission === 'Always').length;
    const backgroundApps = permissions.filter(p => p.backgroundUsage).length;
    const preciseLocationApps = permissions.filter(p => p.preciseLocation).length;

    const risks = permissions
      .map(p => calculateRisk(p))
      .sort((a, b) => {
        const order = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
        return order[b.riskLevel] - order[a.riskLevel];
      });

    const recommendations: string[] = [];

    if (alwaysAllowed > 0) {
      recommendations.push(`${alwaysAllowed} apps have "Always" location access. Review if this is necessary.`);
    }

    if (backgroundApps > 3) {
      recommendations.push('Many apps access location in background. Disable for apps that don\'t need it.');
    }

    if (preciseLocationApps > 5) {
      recommendations.push('Consider using "Approximate Location" for apps that don\'t need exact coordinates.');
    }

    recommendations.push('Regularly review location permissions in your device settings');
    recommendations.push('Use "While Using App" instead of "Always" when possible');
    recommendations.push('Disable location for apps that don\'t need it for core functionality');
    recommendations.push('Check location access logs periodically for unexpected usage');

    setResult({
      totalApps: permissions.length,
      alwaysAllowedApps: alwaysAllowed,
      backgroundApps,
      preciseLocationApps,
      permissions: permissions.sort((a, b) => a.appName.localeCompare(b.appName)),
      risks,
      recommendations
    });
  };

  const parsePermissionData = (fileContent: string, format: 'json' | 'csv'): AppPermission[] => {
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
          appName: entry.appName || entry.app || 'Unknown',
          locationPermission: (entry.locationPermission || entry.permission || 'Never') as any,
          preciseLocation: entry.preciseLocation === 'true' || entry.preciseLocation === '1',
          backgroundUsage: entry.backgroundUsage === 'true' || entry.backgroundUsage === '1',
          lastAccessed: entry.lastAccessed,
          frequency: entry.frequency
        };
      });
    }
  };

  const reset = () => {
    setResult(null);
  };

  return {
    result,
    auditPermissions,
    parsePermissionData,
    reset
  };
}
