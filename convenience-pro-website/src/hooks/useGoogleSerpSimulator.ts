import { useState, useCallback, useMemo } from 'react';

interface SerpPreview {
  title: string;
  truncatedTitle: string;
  isTitleTruncated: boolean;
  titlePixelWidth: number;
  titleCharCount: number;
  url: string;
  displayUrl: string;
  description: string;
  truncatedDescription: string;
  isDescriptionTruncated: boolean;
  descriptionPixelWidth: number;
  descriptionCharCount: number;
}

interface SerpLimits {
  titleMaxPixels: number;
  titleMaxChars: number;
  descriptionMaxPixels: number;
  descriptionMaxChars: number;
}

interface UseGoogleSerpSimulatorReturn {
  preview: SerpPreview;
  limits: SerpLimits;
  isMobile: boolean;
  setTitle: (title: string) => void;
  setUrl: (url: string) => void;
  setDescription: (description: string) => void;
  setIsMobile: (isMobile: boolean) => void;
  reset: () => void;
}

// Average character widths in pixels (approximation for Arial/Roboto at typical SERP sizes)
const CHAR_WIDTH_TITLE = 8.5; // ~20px font
const CHAR_WIDTH_DESC = 6.5; // ~14px font

// Google SERP limits
const DESKTOP_LIMITS: SerpLimits = {
  titleMaxPixels: 600,
  titleMaxChars: 60,
  descriptionMaxPixels: 920,
  descriptionMaxChars: 160,
};

const MOBILE_LIMITS: SerpLimits = {
  titleMaxPixels: 480,
  titleMaxChars: 55,
  descriptionMaxPixels: 680,
  descriptionMaxChars: 120,
};

function calculatePixelWidth(text: string, charWidth: number): number {
  // Simplified calculation - actual Google uses variable-width fonts
  let width = 0;
  for (const char of text) {
    if (char.match(/[A-Z]/)) {
      width += charWidth * 1.2;
    } else if (char.match(/[mwMW]/)) {
      width += charWidth * 1.5;
    } else if (char.match(/[ilIj!|'.,:;]/)) {
      width += charWidth * 0.4;
    } else if (char.match(/[a-z0-9]/)) {
      width += charWidth;
    } else {
      width += charWidth * 0.8;
    }
  }
  return Math.round(width);
}

function truncateByPixels(text: string, maxPixels: number, charWidth: number): { truncated: string; isTruncated: boolean } {
  const fullWidth = calculatePixelWidth(text, charWidth);
  if (fullWidth <= maxPixels) {
    return { truncated: text, isTruncated: false };
  }

  // Binary search for the truncation point
  let low = 0;
  let high = text.length;

  while (low < high) {
    const mid = Math.floor((low + high + 1) / 2);
    const testText = text.slice(0, mid);
    const testWidth = calculatePixelWidth(testText + '...', charWidth);

    if (testWidth <= maxPixels) {
      low = mid;
    } else {
      high = mid - 1;
    }
  }

  return { truncated: text.slice(0, low) + '...', isTruncated: true };
}

function formatDisplayUrl(url: string): string {
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    const path = parsed.pathname === '/' ? '' : parsed.pathname;
    const displayPath = path.length > 30 ? path.slice(0, 30) + '...' : path;
    return `${parsed.hostname}${displayPath}`;
  } catch {
    return url.length > 50 ? url.slice(0, 50) + '...' : url;
  }
}

export function useGoogleSerpSimulator(): UseGoogleSerpSimulatorReturn {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  const limits = isMobile ? MOBILE_LIMITS : DESKTOP_LIMITS;

  const preview = useMemo((): SerpPreview => {
    const titlePixelWidth = calculatePixelWidth(title, CHAR_WIDTH_TITLE);
    const { truncated: truncatedTitle, isTruncated: isTitleTruncated } = truncateByPixels(
      title,
      limits.titleMaxPixels,
      CHAR_WIDTH_TITLE
    );

    const descriptionPixelWidth = calculatePixelWidth(description, CHAR_WIDTH_DESC);
    const { truncated: truncatedDescription, isTruncated: isDescriptionTruncated } = truncateByPixels(
      description,
      limits.descriptionMaxPixels,
      CHAR_WIDTH_DESC
    );

    return {
      title,
      truncatedTitle: title ? truncatedTitle : 'Page Title',
      isTitleTruncated,
      titlePixelWidth,
      titleCharCount: title.length,
      url,
      displayUrl: url ? formatDisplayUrl(url) : 'example.com',
      description,
      truncatedDescription: description ? truncatedDescription : 'Page description will appear here. Add a compelling meta description to improve click-through rates.',
      isDescriptionTruncated,
      descriptionPixelWidth,
      descriptionCharCount: description.length,
    };
  }, [title, url, description, limits]);

  const reset = useCallback(() => {
    setTitle('');
    setUrl('');
    setDescription('');
  }, []);

  return {
    preview,
    limits,
    isMobile,
    setTitle,
    setUrl,
    setDescription,
    setIsMobile,
    reset,
  };
}
