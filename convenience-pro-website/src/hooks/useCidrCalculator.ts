import { useState, useCallback } from 'react';

interface CidrResult {
  cidrNotation: string;
  networkAddress: string;
  broadcastAddress: string;
  firstUsable: string;
  lastUsable: string;
  totalHosts: number;
  usableHosts: number;
  subnetMask: string;
  wildcardMask: string;
  prefixLength: number;
  ipClass: string;
  binarySubnetMask: string;
}

interface UseCidrCalculatorReturn {
  result: CidrResult | null;
  error: string | null;
  calculate: (cidr: string) => void;
  calculateFromMask: (ip: string, mask: string) => void;
  reset: () => void;
}

// Convert IP string to 32-bit number
function ipToNumber(ip: string): number {
  const parts = ip.split('.').map(Number);
  return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
}

// Convert 32-bit number to IP string
function numberToIp(num: number): string {
  return [
    (num >>> 24) & 255,
    (num >>> 16) & 255,
    (num >>> 8) & 255,
    num & 255,
  ].join('.');
}

// Convert prefix length to subnet mask number
function prefixToMask(prefix: number): number {
  return prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0;
}

// Convert subnet mask to binary string
function maskToBinary(mask: number): string {
  const parts = [
    (mask >>> 24) & 255,
    (mask >>> 16) & 255,
    (mask >>> 8) & 255,
    mask & 255,
  ];
  return parts.map((p) => p.toString(2).padStart(8, '0')).join('.');
}

// Determine IP class
function getIpClass(ip: number): string {
  const firstOctet = (ip >>> 24) & 255;
  if (firstOctet < 128) return 'Class A';
  if (firstOctet < 192) return 'Class B';
  if (firstOctet < 224) return 'Class C';
  if (firstOctet < 240) return 'Class D (Multicast)';
  return 'Class E (Reserved)';
}

// Validate IP address
function isValidIp(ip: string): boolean {
  const parts = ip.split('.');
  if (parts.length !== 4) return false;
  return parts.every((part) => {
    const num = parseInt(part, 10);
    return !isNaN(num) && num >= 0 && num <= 255 && part === num.toString();
  });
}

// Convert subnet mask string to prefix length
function maskToPrefix(mask: string): number {
  const maskNum = ipToNumber(mask);
  let count = 0;
  let temp = maskNum;
  while (temp & 0x80000000) {
    count++;
    temp <<= 1;
  }
  return count;
}

export function useCidrCalculator(): UseCidrCalculatorReturn {
  const [result, setResult] = useState<CidrResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const performCalculation = useCallback((ip: string, prefix: number) => {
    const ipNum = ipToNumber(ip);
    const maskNum = prefixToMask(prefix);
    const wildcardNum = ~maskNum >>> 0;

    const networkNum = (ipNum & maskNum) >>> 0;
    const broadcastNum = (networkNum | wildcardNum) >>> 0;

    const totalHosts = Math.pow(2, 32 - prefix);
    const usableHosts = prefix >= 31 ? (prefix === 32 ? 1 : 2) : totalHosts - 2;

    const firstUsableNum = prefix >= 31 ? networkNum : networkNum + 1;
    const lastUsableNum = prefix >= 31 ? broadcastNum : broadcastNum - 1;

    setResult({
      cidrNotation: `${numberToIp(networkNum)}/${prefix}`,
      networkAddress: numberToIp(networkNum),
      broadcastAddress: numberToIp(broadcastNum),
      firstUsable: numberToIp(firstUsableNum),
      lastUsable: numberToIp(lastUsableNum),
      totalHosts,
      usableHosts,
      subnetMask: numberToIp(maskNum),
      wildcardMask: numberToIp(wildcardNum),
      prefixLength: prefix,
      ipClass: getIpClass(networkNum),
      binarySubnetMask: maskToBinary(maskNum),
    });
    setError(null);
  }, []);

  const calculate = useCallback(
    (cidr: string) => {
      const trimmed = cidr.trim();
      const match = trimmed.match(/^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\/(\d{1,2})$/);

      if (!match) {
        setError('Invalid CIDR notation. Use format: 192.168.1.0/24');
        setResult(null);
        return;
      }

      const [, ip, prefixStr] = match;
      const prefix = parseInt(prefixStr, 10);

      if (!isValidIp(ip)) {
        setError('Invalid IP address');
        setResult(null);
        return;
      }

      if (prefix < 0 || prefix > 32) {
        setError('Prefix must be between 0 and 32');
        setResult(null);
        return;
      }

      performCalculation(ip, prefix);
    },
    [performCalculation]
  );

  const calculateFromMask = useCallback(
    (ip: string, mask: string) => {
      if (!isValidIp(ip)) {
        setError('Invalid IP address');
        setResult(null);
        return;
      }

      if (!isValidIp(mask)) {
        setError('Invalid subnet mask');
        setResult(null);
        return;
      }

      const prefix = maskToPrefix(mask);
      performCalculation(ip, prefix);
    },
    [performCalculation]
  );

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { result, error, calculate, calculateFromMask, reset };
}
