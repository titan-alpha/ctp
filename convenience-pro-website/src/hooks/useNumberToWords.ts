import { useState, useCallback } from 'react';

export type CurrencyType = 'USD' | 'EUR' | 'GBP' | 'INR' | 'JPY' | 'CAD' | 'AUD';

interface CurrencyInfo {
  name: string;
  plural: string;
  subunit: string;
  subunitPlural: string;
}

const CURRENCIES: Record<CurrencyType, CurrencyInfo> = {
  USD: { name: 'dollar', plural: 'dollars', subunit: 'cent', subunitPlural: 'cents' },
  EUR: { name: 'euro', plural: 'euros', subunit: 'cent', subunitPlural: 'cents' },
  GBP: { name: 'pound', plural: 'pounds', subunit: 'penny', subunitPlural: 'pence' },
  INR: { name: 'rupee', plural: 'rupees', subunit: 'paisa', subunitPlural: 'paise' },
  JPY: { name: 'yen', plural: 'yen', subunit: 'sen', subunitPlural: 'sen' },
  CAD: { name: 'Canadian dollar', plural: 'Canadian dollars', subunit: 'cent', subunitPlural: 'cents' },
  AUD: { name: 'Australian dollar', plural: 'Australian dollars', subunit: 'cent', subunitPlural: 'cents' },
};

const ONES = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const SCALES = ['', 'thousand', 'million', 'billion', 'trillion', 'quadrillion', 'quintillion'];

interface UseNumberToWordsReturn {
  words: string;
  convert: (value: string, currencyMode: boolean, currency: CurrencyType) => void;
  reset: () => void;
  currencies: { value: CurrencyType; label: string }[];
}

function convertHundreds(num: number): string {
  if (num === 0) return '';
  if (num < 20) return ONES[num];
  if (num < 100) {
    const ten = Math.floor(num / 10);
    const one = num % 10;
    return TENS[ten] + (one ? '-' + ONES[one] : '');
  }
  const hundred = Math.floor(num / 100);
  const remainder = num % 100;
  return ONES[hundred] + ' hundred' + (remainder ? ' ' + convertHundreds(remainder) : '');
}

function convertIntegerPart(numStr: string): string {
  if (numStr === '0' || numStr === '') return 'zero';

  // Remove leading zeros
  numStr = numStr.replace(/^0+/, '') || '0';
  if (numStr === '0') return 'zero';

  const chunks: number[] = [];
  let remaining = numStr;

  while (remaining.length > 0) {
    const chunk = remaining.slice(-3);
    chunks.unshift(parseInt(chunk, 10));
    remaining = remaining.slice(0, -3);
  }

  const words: string[] = [];
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const scaleIndex = chunks.length - 1 - i;
    if (chunk > 0) {
      const chunkWords = convertHundreds(chunk);
      const scale = SCALES[scaleIndex] || '';
      words.push(chunkWords + (scale ? ' ' + scale : ''));
    }
  }

  return words.join(' ') || 'zero';
}

function convertDecimalPart(decStr: string): string {
  if (!decStr) return '';
  // Convert each digit individually for decimals
  const digits = decStr.split('').map(d => ONES[parseInt(d, 10)] || 'zero');
  return 'point ' + digits.join(' ');
}

export function useNumberToWords(): UseNumberToWordsReturn {
  const [words, setWords] = useState<string>('');

  const convert = useCallback((value: string, currencyMode: boolean, currency: CurrencyType) => {
    const trimmed = value.trim();
    if (!trimmed || trimmed === '-' || trimmed === '.') {
      setWords('');
      return;
    }

    const isNegative = trimmed.startsWith('-');
    const absValue = isNegative ? trimmed.slice(1) : trimmed;

    // Validate number format
    if (!/^\d*\.?\d*$/.test(absValue) || absValue === '.') {
      setWords('Invalid number');
      return;
    }

    const [intPart, decPart] = absValue.split('.');
    const intStr = intPart || '0';

    let result = '';

    if (currencyMode) {
      const currencyInfo = CURRENCIES[currency];
      const intWords = convertIntegerPart(intStr);
      const intNum = BigInt(intStr || '0');
      const currencyName = intNum === 1n ? currencyInfo.name : currencyInfo.plural;

      result = intWords + ' ' + currencyName;

      if (decPart) {
        const cents = parseInt(decPart.slice(0, 2).padEnd(2, '0'), 10);
        if (cents > 0) {
          const centsWords = convertIntegerPart(cents.toString());
          const subunitName = cents === 1 ? currencyInfo.subunit : currencyInfo.subunitPlural;
          result += ' and ' + centsWords + ' ' + subunitName;
        }
      }
    } else {
      result = convertIntegerPart(intStr);
      if (decPart) {
        result += ' ' + convertDecimalPart(decPart);
      }
    }

    if (isNegative) {
      result = 'negative ' + result;
    }

    // Capitalize first letter
    result = result.charAt(0).toUpperCase() + result.slice(1);
    setWords(result);
  }, []);

  const reset = useCallback(() => {
    setWords('');
  }, []);

  const currencies = Object.keys(CURRENCIES).map(key => ({
    value: key as CurrencyType,
    label: key,
  }));

  return { words, convert, reset, currencies };
}
