import { useState, useCallback } from 'react';

interface MetaTag {
  name: string;
  content: string | null;
  status: 'present' | 'missing' | 'warning';
  message: string;
  recommendation?: string;
}

interface LengthValidation {
  current: number;
  min: number;
  max: number;
  status: 'good' | 'short' | 'long';
}

interface AnalysisResult {
  title: MetaTag & { length?: LengthValidation };
  description: MetaTag & { length?: LengthValidation };
  canonical: MetaTag;
  robots: MetaTag;
  viewport: MetaTag;
  charset: MetaTag;
  ogTitle: MetaTag;
  ogDescription: MetaTag;
  ogImage: MetaTag;
  ogUrl: MetaTag;
  ogType: MetaTag;
  twitterCard: MetaTag;
  twitterTitle: MetaTag;
  twitterDescription: MetaTag;
  twitterImage: MetaTag;
  overallScore: number;
  grade: string;
}

interface UseMetaTagsAnalyzerReturn {
  result: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;
  analyzeHtml: (html: string) => void;
  analyzeUrl: (url: string) => Promise<void>;
  reset: () => void;
}

function getGrade(score: number): string {
  if (score >= 90) return 'A+';
  if (score >= 80) return 'A';
  if (score >= 70) return 'B';
  if (score >= 60) return 'C';
  if (score >= 50) return 'D';
  return 'F';
}

function extractMetaContent(html: string, name: string, attribute: string = 'name'): string | null {
  const regex = new RegExp(`<meta\\s+(?:[^>]*?)?${attribute}=["']${name}["'][^>]*?content=["']([^"']*)["']`, 'i');
  const regex2 = new RegExp(`<meta\\s+(?:[^>]*?)?content=["']([^"']*)["'][^>]*?${attribute}=["']${name}["']`, 'i');
  const match = html.match(regex) || html.match(regex2);
  return match ? match[1] : null;
}

function extractTitle(html: string): string | null {
  const match = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  return match ? match[1].trim() : null;
}

function extractCanonical(html: string): string | null {
  const match = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i);
  const match2 = html.match(/<link[^>]*href=["']([^"']*)["'][^>]*rel=["']canonical["']/i);
  return (match && match[1]) || (match2 && match2[1]) || null;
}

function extractCharset(html: string): string | null {
  const match = html.match(/<meta[^>]*charset=["']?([^"'\s>]+)["']?/i);
  return match ? match[1] : null;
}

function analyzeHtmlContent(html: string): AnalysisResult {
  let score = 0;
  const maxScore = 100;

  // Title analysis (15 points)
  const title = extractTitle(html);
  const titleLength: LengthValidation | undefined = title ? {
    current: title.length,
    min: 30,
    max: 60,
    status: title.length < 30 ? 'short' : title.length > 60 ? 'long' : 'good'
  } : undefined;

  const titleTag: MetaTag & { length?: LengthValidation } = {
    name: 'Title',
    content: title,
    status: title ? (titleLength?.status === 'good' ? 'present' : 'warning') : 'missing',
    message: title
      ? (titleLength?.status === 'good' ? 'Title tag is present and optimal length' : `Title is ${titleLength?.status} (${title.length} chars)`)
      : 'Title tag is missing',
    recommendation: !title ? 'Add a title tag between 30-60 characters' : titleLength?.status !== 'good' ? 'Adjust title to 30-60 characters' : undefined,
    length: titleLength
  };
  if (title) score += titleLength?.status === 'good' ? 15 : 10;

  // Description analysis (15 points)
  const description = extractMetaContent(html, 'description');
  const descLength: LengthValidation | undefined = description ? {
    current: description.length,
    min: 120,
    max: 160,
    status: description.length < 120 ? 'short' : description.length > 160 ? 'long' : 'good'
  } : undefined;

  const descriptionTag: MetaTag & { length?: LengthValidation } = {
    name: 'Meta Description',
    content: description,
    status: description ? (descLength?.status === 'good' ? 'present' : 'warning') : 'missing',
    message: description
      ? (descLength?.status === 'good' ? 'Description is optimal length' : `Description is ${descLength?.status} (${description.length} chars)`)
      : 'Meta description is missing',
    recommendation: !description ? 'Add a meta description between 120-160 characters' : descLength?.status !== 'good' ? 'Adjust description to 120-160 characters' : undefined,
    length: descLength
  };
  if (description) score += descLength?.status === 'good' ? 15 : 10;

  // Canonical (5 points)
  const canonical = extractCanonical(html);
  const canonicalTag: MetaTag = {
    name: 'Canonical URL',
    content: canonical,
    status: canonical ? 'present' : 'missing',
    message: canonical ? 'Canonical URL is set' : 'Canonical URL is missing',
    recommendation: !canonical ? 'Add a canonical URL to prevent duplicate content issues' : undefined
  };
  if (canonical) score += 5;

  // Robots (5 points)
  const robots = extractMetaContent(html, 'robots');
  const robotsTag: MetaTag = {
    name: 'Robots',
    content: robots,
    status: robots ? 'present' : 'warning',
    message: robots ? `Robots directive: ${robots}` : 'No robots meta tag (defaults to index, follow)',
    recommendation: !robots ? 'Consider adding robots meta tag for explicit control' : undefined
  };
  if (robots) score += 5;

  // Viewport (5 points)
  const viewport = extractMetaContent(html, 'viewport');
  const viewportTag: MetaTag = {
    name: 'Viewport',
    content: viewport,
    status: viewport ? 'present' : 'missing',
    message: viewport ? 'Viewport is configured for mobile' : 'Viewport meta tag is missing',
    recommendation: !viewport ? 'Add viewport meta tag for mobile responsiveness' : undefined
  };
  if (viewport) score += 5;

  // Charset (5 points)
  const charset = extractCharset(html);
  const charsetTag: MetaTag = {
    name: 'Charset',
    content: charset,
    status: charset ? 'present' : 'missing',
    message: charset ? `Character encoding: ${charset}` : 'Charset is not specified',
    recommendation: !charset ? 'Add charset meta tag (recommended: UTF-8)' : undefined
  };
  if (charset) score += 5;

  // Open Graph tags (25 points total)
  const ogTitle = extractMetaContent(html, 'og:title', 'property');
  const ogDescription = extractMetaContent(html, 'og:description', 'property');
  const ogImage = extractMetaContent(html, 'og:image', 'property');
  const ogUrl = extractMetaContent(html, 'og:url', 'property');
  const ogType = extractMetaContent(html, 'og:type', 'property');

  const ogTitleTag: MetaTag = {
    name: 'OG Title',
    content: ogTitle,
    status: ogTitle ? 'present' : 'missing',
    message: ogTitle ? 'Open Graph title is set' : 'OG title is missing',
    recommendation: !ogTitle ? 'Add og:title for better social sharing' : undefined
  };
  if (ogTitle) score += 5;

  const ogDescriptionTag: MetaTag = {
    name: 'OG Description',
    content: ogDescription,
    status: ogDescription ? 'present' : 'missing',
    message: ogDescription ? 'Open Graph description is set' : 'OG description is missing',
    recommendation: !ogDescription ? 'Add og:description for better social sharing' : undefined
  };
  if (ogDescription) score += 5;

  const ogImageTag: MetaTag = {
    name: 'OG Image',
    content: ogImage,
    status: ogImage ? 'present' : 'missing',
    message: ogImage ? 'Open Graph image is set' : 'OG image is missing',
    recommendation: !ogImage ? 'Add og:image (recommended: 1200x630px)' : undefined
  };
  if (ogImage) score += 5;

  const ogUrlTag: MetaTag = {
    name: 'OG URL',
    content: ogUrl,
    status: ogUrl ? 'present' : 'missing',
    message: ogUrl ? 'Open Graph URL is set' : 'OG URL is missing',
    recommendation: !ogUrl ? 'Add og:url for canonical social sharing' : undefined
  };
  if (ogUrl) score += 5;

  const ogTypeTag: MetaTag = {
    name: 'OG Type',
    content: ogType,
    status: ogType ? 'present' : 'missing',
    message: ogType ? `Open Graph type: ${ogType}` : 'OG type is missing',
    recommendation: !ogType ? 'Add og:type (e.g., website, article)' : undefined
  };
  if (ogType) score += 5;

  // Twitter tags (25 points total)
  const twitterCard = extractMetaContent(html, 'twitter:card');
  const twitterTitle = extractMetaContent(html, 'twitter:title');
  const twitterDescription = extractMetaContent(html, 'twitter:description');
  const twitterImage = extractMetaContent(html, 'twitter:image');

  const twitterCardTag: MetaTag = {
    name: 'Twitter Card',
    content: twitterCard,
    status: twitterCard ? 'present' : 'missing',
    message: twitterCard ? `Twitter card type: ${twitterCard}` : 'Twitter card is missing',
    recommendation: !twitterCard ? 'Add twitter:card (summary_large_image recommended)' : undefined
  };
  if (twitterCard) score += 7;

  const twitterTitleTag: MetaTag = {
    name: 'Twitter Title',
    content: twitterTitle,
    status: twitterTitle ? 'present' : 'missing',
    message: twitterTitle ? 'Twitter title is set' : 'Twitter title is missing',
    recommendation: !twitterTitle ? 'Add twitter:title for Twitter sharing' : undefined
  };
  if (twitterTitle) score += 6;

  const twitterDescriptionTag: MetaTag = {
    name: 'Twitter Description',
    content: twitterDescription,
    status: twitterDescription ? 'present' : 'missing',
    message: twitterDescription ? 'Twitter description is set' : 'Twitter description is missing',
    recommendation: !twitterDescription ? 'Add twitter:description for Twitter sharing' : undefined
  };
  if (twitterDescription) score += 6;

  const twitterImageTag: MetaTag = {
    name: 'Twitter Image',
    content: twitterImage,
    status: twitterImage ? 'present' : 'missing',
    message: twitterImage ? 'Twitter image is set' : 'Twitter image is missing',
    recommendation: !twitterImage ? 'Add twitter:image for Twitter sharing' : undefined
  };
  if (twitterImage) score += 6;

  return {
    title: titleTag,
    description: descriptionTag,
    canonical: canonicalTag,
    robots: robotsTag,
    viewport: viewportTag,
    charset: charsetTag,
    ogTitle: ogTitleTag,
    ogDescription: ogDescriptionTag,
    ogImage: ogImageTag,
    ogUrl: ogUrlTag,
    ogType: ogTypeTag,
    twitterCard: twitterCardTag,
    twitterTitle: twitterTitleTag,
    twitterDescription: twitterDescriptionTag,
    twitterImage: twitterImageTag,
    overallScore: Math.min(score, maxScore),
    grade: getGrade(Math.min(score, maxScore))
  };
}

export function useMetaTagsAnalyzer(): UseMetaTagsAnalyzerReturn {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeHtml = useCallback((html: string) => {
    if (!html.trim()) {
      setError('Please provide HTML content');
      return;
    }
    setError(null);
    const analysis = analyzeHtmlContent(html);
    setResult(analysis);
  }, []);

  const analyzeUrl = useCallback(async (url: string) => {
    if (!url.trim()) {
      setError('Please provide a URL');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Note: Due to CORS, this would need a backend proxy in production
      const response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch URL');
      }
      const html = await response.text();
      const analysis = analyzeHtmlContent(html);
      setResult(analysis);
    } catch (err) {
      setError('Failed to fetch URL. Try pasting the HTML directly instead.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { result, isLoading, error, analyzeHtml, analyzeUrl, reset };
}
