import { useState } from 'react';

export interface KeyboardApp {
  name: string;
  vendor: string;
  fullAccess: boolean;
  cloudSync: boolean;
  networkAccess: boolean;
  learnedWords: number;
  dataCollection: string[];
}

export interface PrivacyAnalysis {
  keyboardName: string;
  privacyScore: number;
  riskLevel: 'Critical' | 'High' | 'Medium' | 'Low';
  concerns: string[];
  dataCollected: string[];
  recommendations: string[];
}

export interface AuditResult {
  keyboardsAnalyzed: number;
  averagePrivacyScore: number;
  highRiskCount: number;
  analyses: PrivacyAnalysis[];
  generalRecommendations: string[];
  sensitiveWordsFound: number;
}

const KNOWN_KEYBOARDS = {
  'Gboard': {
    vendor: 'Google',
    typicalDataCollection: ['Search queries', 'Typed text', 'Voice input', 'Location', 'Device info'],
    privacyRisks: ['Cloud synchronization of typing data', 'Google account integration', 'Personalized suggestions based on activity']
  },
  'SwiftKey': {
    vendor: 'Microsoft',
    typicalDataCollection: ['Typed text', 'Language preferences', 'Typing patterns', 'Contact names'],
    privacyRisks: ['Cloud backup of learned words', 'Microsoft account sync', 'Predictive text based on personal data']
  },
  'System Keyboard': {
    vendor: 'Apple/Google',
    typicalDataCollection: ['Minimal local data'],
    privacyRisks: ['Generally more privacy-preserving than third-party options']
  }
};

export function useKeyboardAppPrivacyChecker() {
  const [result, setResult] = useState<AuditResult | null>(null);

  const analyzeKeyboard = (keyboard: KeyboardApp): PrivacyAnalysis => {
    const concerns: string[] = [];
    const dataCollected: string[] = [...keyboard.dataCollection];
    let privacyScore = 0;

    if (keyboard.fullAccess) {
      concerns.push('Has "Full Access" permission - can read all typed content');
      privacyScore += 40;
    }

    if (keyboard.cloudSync) {
      concerns.push('Syncs data to cloud - typing history stored remotely');
      dataCollected.push('Cloud-synced typing history');
      privacyScore += 25;
    }

    if (keyboard.networkAccess) {
      concerns.push('Has network access - can send typed data to servers');
      privacyScore += 20;
    }

    if (keyboard.learnedWords > 1000) {
      concerns.push(`Large learned vocabulary (${keyboard.learnedWords} words) - potential for sensitive data`);
      privacyScore += 10;
    }

    if (keyboard.vendor !== 'Apple' && keyboard.vendor !== 'Google' && keyboard.vendor !== 'System') {
      concerns.push('Third-party keyboard - review privacy policy carefully');
      privacyScore += 5;
    }

    // Determine risk level
    let riskLevel: 'Critical' | 'High' | 'Medium' | 'Low';
    if (privacyScore >= 70) riskLevel = 'Critical';
    else if (privacyScore >= 50) riskLevel = 'High';
    else if (privacyScore >= 30) riskLevel = 'Medium';
    else riskLevel = 'Low';

    // Generate recommendations
    const recommendations: string[] = [];

    if (keyboard.fullAccess) {
      recommendations.push('Disable "Full Access" or switch to system keyboard');
    }

    if (keyboard.cloudSync) {
      recommendations.push('Disable cloud synchronization to keep typing data local');
    }

    if (privacyScore >= 50) {
      recommendations.push('Consider using the built-in system keyboard for better privacy');
    } else {
      recommendations.push('Review keyboard privacy settings regularly');
    }

    if (keyboard.learnedWords > 500) {
      recommendations.push('Clear learned words periodically to remove sensitive data');
    }

    return {
      keyboardName: keyboard.name,
      privacyScore: Math.min(100, privacyScore),
      riskLevel,
      concerns,
      dataCollected,
      recommendations
    };
  };

  const detectSensitiveWords = (learnedWords: string[]): number => {
    const sensitivePatterns = [
      /password/i, /passcode/i, /pin/i, /ssn/i, /social.?security/i,
      /credit.?card/i, /cvv/i, /account.?number/i,
      /secret/i, /private/i, /confidential/i
    ];

    return learnedWords.filter(word =>
      sensitivePatterns.some(pattern => pattern.test(word))
    ).length;
  };

  const auditKeyboards = (keyboards: KeyboardApp[], learnedWords: string[] = []) => {
    const analyses = keyboards.map(kb => analyzeKeyboard(kb));

    const avgScore = analyses.reduce((sum, a) => sum + a.privacyScore, 0) / analyses.length;
    const highRiskCount = analyses.filter(a => a.riskLevel === 'Critical' || a.riskLevel === 'High').length;
    const sensitiveWords = learnedWords.length > 0 ? detectSensitiveWords(learnedWords) : 0;

    const generalRecommendations: string[] = [];

    if (highRiskCount > 0) {
      generalRecommendations.push('Multiple keyboards have high privacy risks. Consider switching to system keyboard.');
    }

    if (avgScore >= 40) {
      generalRecommendations.push('Your keyboard setup poses significant privacy risks. Review permissions and settings.');
    }

    generalRecommendations.push('Use system keyboard for passwords and sensitive information');
    generalRecommendations.push('Disable network access for third-party keyboards when possible');
    generalRecommendations.push('Clear keyboard learned words regularly');
    generalRecommendations.push('Review keyboard privacy policies before installation');

    if (sensitiveWords > 0) {
      generalRecommendations.push(`Found ${sensitiveWords} potentially sensitive learned words - clear dictionary`);
    }

    setResult({
      keyboardsAnalyzed: keyboards.length,
      averagePrivacyScore: Math.round(avgScore),
      highRiskCount,
      analyses: analyses.sort((a, b) => b.privacyScore - a.privacyScore),
      generalRecommendations,
      sensitiveWordsFound: sensitiveWords
    });
  };

  const parseKeyboardData = (fileContent: string, format: 'json' | 'csv'): KeyboardApp[] => {
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
          name: entry.name || entry.keyboardName || 'Unknown',
          vendor: entry.vendor || 'Unknown',
          fullAccess: entry.fullAccess === 'true' || entry.fullAccess === '1',
          cloudSync: entry.cloudSync === 'true' || entry.cloudSync === '1',
          networkAccess: entry.networkAccess === 'true' || entry.networkAccess === '1',
          learnedWords: parseInt(entry.learnedWords || '0'),
          dataCollection: entry.dataCollection ? entry.dataCollection.split(';') : []
        };
      });
    }
  };

  const reset = () => {
    setResult(null);
  };

  return {
    result,
    auditKeyboards,
    parseKeyboardData,
    reset
  };
}
