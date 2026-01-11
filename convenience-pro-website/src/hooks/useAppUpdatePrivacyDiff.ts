import { useState } from 'react';

export interface AppVersion {
  version: string;
  releaseDate: string;
  permissions: string[];
  privacyPolicy?: string;
  thirdPartySDKs?: string[];
  dataCollection?: string[];
}

export interface PermissionChange {
  permission: string;
  changeType: 'added' | 'removed' | 'unchanged';
  severity: 'high' | 'medium' | 'low';
  description: string;
}

export interface SDKChange {
  sdkName: string;
  changeType: 'added' | 'removed' | 'updated';
  privacyImpact: string;
}

export interface DataCollectionChange {
  dataType: string;
  changeType: 'added' | 'removed';
  impact: string;
}

export interface DiffResult {
  oldVersion: string;
  newVersion: string;
  overallRiskChange: 'Increased' | 'Decreased' | 'Unchanged';
  permissionChanges: PermissionChange[];
  sdkChanges: SDKChange[];
  dataCollectionChanges: DataCollectionChange[];
  policyChanges: string[];
  recommendations: string[];
  shouldUpdate: boolean;
}

export function useAppUpdatePrivacyDiff() {
  const [result, setResult] = useState<DiffResult | null>(null);

  const PERMISSION_SEVERITY: Record<string, 'high' | 'medium' | 'low'> = {
    'CAMERA': 'high',
    'MICROPHONE': 'high',
    'LOCATION': 'high',
    'CONTACTS': 'high',
    'SMS': 'high',
    'PHONE': 'high',
    'STORAGE': 'medium',
    'CALENDAR': 'medium',
    'PHOTOS': 'medium',
    'BLUETOOTH': 'low',
    'NETWORK': 'low'
  };

  const getPermissionDescription = (permission: string): string => {
    const descriptions: Record<string, string> = {
      'CAMERA': 'Access to device camera for photos and videos',
      'MICROPHONE': 'Access to microphone for audio recording',
      'LOCATION': 'Access to device location (GPS/network)',
      'CONTACTS': 'Access to phone contacts and address book',
      'SMS': 'Ability to read and send text messages',
      'PHONE': 'Access to phone state and make calls',
      'STORAGE': 'Access to device storage and files',
      'CALENDAR': 'Access to calendar events',
      'PHOTOS': 'Access to photo library',
      'BLUETOOTH': 'Access to Bluetooth connections',
      'NETWORK': 'Access to network state and connectivity'
    };
    return descriptions[permission] || `Access to ${permission.toLowerCase()}`;
  };

  const analyzePermissionChanges = (oldPerms: string[], newPerms: string[]): PermissionChange[] => {
    const changes: PermissionChange[] = [];

    // Find added permissions
    newPerms.forEach(perm => {
      if (!oldPerms.includes(perm)) {
        changes.push({
          permission: perm,
          changeType: 'added',
          severity: PERMISSION_SEVERITY[perm] || 'medium',
          description: getPermissionDescription(perm)
        });
      }
    });

    // Find removed permissions
    oldPerms.forEach(perm => {
      if (!newPerms.includes(perm)) {
        changes.push({
          permission: perm,
          changeType: 'removed',
          severity: PERMISSION_SEVERITY[perm] || 'medium',
          description: getPermissionDescription(perm)
        });
      }
    });

    return changes.sort((a, b) => {
      const severityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    });
  };

  const analyzeSDKChanges = (oldSDKs: string[], newSDKs: string[]): SDKChange[] => {
    const changes: SDKChange[] = [];

    const privacyImpactMap: Record<string, string> = {
      'Facebook SDK': 'Extensive user tracking and data sharing with Facebook',
      'Google Analytics': 'Usage tracking and behavior analysis',
      'AdMob': 'Advertising tracking and personalization',
      'Firebase': 'Analytics and crash reporting',
      'Amplitude': 'Product analytics and user behavior tracking',
      'Mixpanel': 'User analytics and engagement tracking'
    };

    newSDKs.forEach(sdk => {
      if (!oldSDKs.includes(sdk)) {
        changes.push({
          sdkName: sdk,
          changeType: 'added',
          privacyImpact: privacyImpactMap[sdk] || 'Third-party data collection and processing'
        });
      }
    });

    oldSDKs.forEach(sdk => {
      if (!newSDKs.includes(sdk)) {
        changes.push({
          sdkName: sdk,
          changeType: 'removed',
          privacyImpact: 'Privacy improvement - removed tracking SDK'
        });
      }
    });

    return changes;
  };

  const analyzeDataCollection = (oldData: string[], newData: string[]): DataCollectionChange[] => {
    const changes: DataCollectionChange[] = [];

    newData.forEach(data => {
      if (!oldData.includes(data)) {
        changes.push({
          dataType: data,
          changeType: 'added',
          impact: `App now collects ${data.toLowerCase()}`
        });
      }
    });

    oldData.forEach(data => {
      if (!newData.includes(data)) {
        changes.push({
          dataType: data,
          changeType: 'removed',
          impact: `App no longer collects ${data.toLowerCase()}`
        });
      }
    });

    return changes;
  };

  const compareVersions = (oldVersion: AppVersion, newVersion: AppVersion) => {
    const permissionChanges = analyzePermissionChanges(
      oldVersion.permissions,
      newVersion.permissions
    );

    const sdkChanges = analyzeSDKChanges(
      oldVersion.thirdPartySDKs || [],
      newVersion.thirdPartySDKs || []
    );

    const dataCollectionChanges = analyzeDataCollection(
      oldVersion.dataCollection || [],
      newVersion.dataCollection || []
    );

    // Determine overall risk change
    const addedHighRiskPerms = permissionChanges.filter(
      p => p.changeType === 'added' && p.severity === 'high'
    ).length;

    const addedSDKs = sdkChanges.filter(s => s.changeType === 'added').length;
    const addedDataTypes = dataCollectionChanges.filter(d => d.changeType === 'added').length;

    const removedHighRiskPerms = permissionChanges.filter(
      p => p.changeType === 'removed' && p.severity === 'high'
    ).length;

    let overallRiskChange: 'Increased' | 'Decreased' | 'Unchanged';
    const riskScore = (addedHighRiskPerms * 3 + addedSDKs * 2 + addedDataTypes) -
                     (removedHighRiskPerms * 3);

    if (riskScore > 2) overallRiskChange = 'Increased';
    else if (riskScore < -2) overallRiskChange = 'Decreased';
    else overallRiskChange = 'Unchanged';

    // Generate policy changes summary
    const policyChanges: string[] = [];
    if (oldVersion.privacyPolicy && newVersion.privacyPolicy &&
        oldVersion.privacyPolicy !== newVersion.privacyPolicy) {
      policyChanges.push('Privacy policy has been updated - review changes carefully');
    }

    // Generate recommendations
    const recommendations: string[] = [];
    const shouldUpdate = overallRiskChange !== 'Increased' ||
                        (addedHighRiskPerms === 0 && addedSDKs <= 1);

    if (addedHighRiskPerms > 0) {
      recommendations.push(`New version requests ${addedHighRiskPerms} sensitive permission(s) - review necessity`);
    }

    if (addedSDKs > 0) {
      recommendations.push(`${addedSDKs} new tracking SDK(s) added - increased data collection`);
    }

    if (overallRiskChange === 'Increased') {
      recommendations.push('Privacy risk has increased with this update - consider delaying update');
      recommendations.push('Review new permissions and decline unnecessary ones');
    } else if (overallRiskChange === 'Decreased') {
      recommendations.push('Privacy improvements detected - update recommended');
    }

    if (permissionChanges.length === 0 && sdkChanges.length === 0) {
      recommendations.push('No privacy-related changes detected in this update');
    }

    recommendations.push('Always review app update notes before installing');

    setResult({
      oldVersion: oldVersion.version,
      newVersion: newVersion.version,
      overallRiskChange,
      permissionChanges,
      sdkChanges,
      dataCollectionChanges,
      policyChanges,
      recommendations,
      shouldUpdate
    });
  };

  const parseVersionData = (fileContent: string, format: 'json'): AppVersion[] => {
    if (format === 'json') {
      try {
        const data = JSON.parse(fileContent);
        return Array.isArray(data) ? data : [data];
      } catch (e) {
        throw new Error('Invalid JSON format');
      }
    }
    return [];
  };

  const reset = () => {
    setResult(null);
  };

  return {
    result,
    compareVersions,
    parseVersionData,
    reset
  };
}
