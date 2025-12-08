import { useState, useCallback } from 'react';

export type SourceType = 'book' | 'journal' | 'website' | 'video';
export type CitationFormat = 'apa' | 'mla' | 'chicago';

export interface BookSource {
  type: 'book';
  authors: string;
  title: string;
  publisher: string;
  year: string;
  city?: string;
  edition?: string;
}

export interface JournalSource {
  type: 'journal';
  authors: string;
  title: string;
  journalName: string;
  year: string;
  volume: string;
  issue?: string;
  pages: string;
  doi?: string;
}

export interface WebsiteSource {
  type: 'website';
  authors?: string;
  title: string;
  siteName: string;
  url: string;
  accessDate: string;
  publishDate?: string;
}

export interface VideoSource {
  type: 'video';
  authors: string;
  title: string;
  platform: string;
  url: string;
  uploadDate: string;
}

export type Source = BookSource | JournalSource | WebsiteSource | VideoSource;

interface Citation {
  id: string;
  source: Source;
  format: CitationFormat;
  citation: string;
}

interface UseBibliographyGeneratorReturn {
  citation: string;
  citations: Citation[];
  generateCitation: (source: Source, format: CitationFormat) => string;
  addToList: (source: Source, format: CitationFormat) => void;
  removeFromList: (id: string) => void;
  clearList: () => void;
}

function formatAuthorsAPA(authors: string): string {
  const authorList = authors.split(',').map((a) => a.trim());
  if (authorList.length === 1) {
    const parts = authorList[0].split(' ');
    const lastName = parts.pop() || '';
    const initials = parts.map((p) => p.charAt(0).toUpperCase() + '.').join(' ');
    return `${lastName}, ${initials}`;
  }
  return authorList
    .map((author) => {
      const parts = author.split(' ');
      const lastName = parts.pop() || '';
      const initials = parts.map((p) => p.charAt(0).toUpperCase() + '.').join(' ');
      return `${lastName}, ${initials}`;
    })
    .join(', & ');
}

function formatAuthorsMLA(authors: string): string {
  const authorList = authors.split(',').map((a) => a.trim());
  if (authorList.length === 1) {
    const parts = authorList[0].split(' ');
    const lastName = parts.pop() || '';
    const firstName = parts.join(' ');
    return `${lastName}, ${firstName}`;
  }
  return authorList
    .map((author, i) => {
      const parts = author.split(' ');
      const lastName = parts.pop() || '';
      const firstName = parts.join(' ');
      if (i === 0) return `${lastName}, ${firstName}`;
      return `${firstName} ${lastName}`;
    })
    .join(', and ');
}

function formatAuthorsChicago(authors: string): string {
  const authorList = authors.split(',').map((a) => a.trim());
  if (authorList.length === 1) {
    const parts = authorList[0].split(' ');
    const lastName = parts.pop() || '';
    const firstName = parts.join(' ');
    return `${lastName}, ${firstName}`;
  }
  return authorList
    .map((author, i) => {
      const parts = author.split(' ');
      const lastName = parts.pop() || '';
      const firstName = parts.join(' ');
      if (i === 0) return `${lastName}, ${firstName}`;
      if (i === authorList.length - 1) return `and ${firstName} ${lastName}`;
      return `${firstName} ${lastName}`;
    })
    .join(', ');
}

function generateBookCitation(source: BookSource, format: CitationFormat): string {
  const { authors, title, publisher, year, city, edition } = source;

  switch (format) {
    case 'apa':
      const apaEdition = edition ? ` (${edition} ed.)` : '';
      return `${formatAuthorsAPA(authors)} (${year}). *${title}*${apaEdition}. ${publisher}.`;

    case 'mla':
      const mlaEdition = edition ? `, ${edition} ed.` : '';
      return `${formatAuthorsMLA(authors)}. *${title}*${mlaEdition}. ${publisher}, ${year}.`;

    case 'chicago':
      const chicagoCity = city ? `${city}: ` : '';
      const chicagoEdition = edition ? ` ${edition} ed.` : '';
      return `${formatAuthorsChicago(authors)}. *${title}*.${chicagoEdition} ${chicagoCity}${publisher}, ${year}.`;
  }
}

function generateJournalCitation(source: JournalSource, format: CitationFormat): string {
  const { authors, title, journalName, year, volume, issue, pages, doi } = source;

  switch (format) {
    case 'apa':
      const apaIssue = issue ? `(${issue})` : '';
      const apaDoi = doi ? ` https://doi.org/${doi}` : '';
      return `${formatAuthorsAPA(authors)} (${year}). ${title}. *${journalName}*, *${volume}*${apaIssue}, ${pages}.${apaDoi}`;

    case 'mla':
      const mlaIssue = issue ? `, no. ${issue}` : '';
      return `${formatAuthorsMLA(authors)}. "${title}." *${journalName}*, vol. ${volume}${mlaIssue}, ${year}, pp. ${pages}.`;

    case 'chicago':
      const chicagoIssue = issue ? `, no. ${issue}` : '';
      const chicagoDoi = doi ? ` https://doi.org/${doi}.` : '';
      return `${formatAuthorsChicago(authors)}. "${title}." *${journalName}* ${volume}${chicagoIssue} (${year}): ${pages}.${chicagoDoi}`;
  }
}

function generateWebsiteCitation(source: WebsiteSource, format: CitationFormat): string {
  const { authors, title, siteName, url, accessDate, publishDate } = source;

  switch (format) {
    case 'apa':
      const apaAuthor = authors ? formatAuthorsAPA(authors) : siteName;
      const apaDate = publishDate || 'n.d.';
      return `${apaAuthor} (${apaDate}). *${title}*. ${siteName}. Retrieved ${accessDate}, from ${url}`;

    case 'mla':
      const mlaAuthor = authors ? `${formatAuthorsMLA(authors)}. ` : '';
      return `${mlaAuthor}"${title}." *${siteName}*, ${publishDate || 'n.d.'}, ${url}. Accessed ${accessDate}.`;

    case 'chicago':
      const chicagoAuthor = authors ? `${formatAuthorsChicago(authors)}. ` : '';
      const chicagoDate = publishDate ? ` ${publishDate}.` : '';
      return `${chicagoAuthor}"${title}." *${siteName}*.${chicagoDate} Accessed ${accessDate}. ${url}.`;
  }
}

function generateVideoCitation(source: VideoSource, format: CitationFormat): string {
  const { authors, title, platform, url, uploadDate } = source;

  switch (format) {
    case 'apa':
      return `${formatAuthorsAPA(authors)} (${uploadDate}). *${title}* [Video]. ${platform}. ${url}`;

    case 'mla':
      return `${formatAuthorsMLA(authors)}. "${title}." *${platform}*, ${uploadDate}, ${url}.`;

    case 'chicago':
      return `${formatAuthorsChicago(authors)}. "${title}." ${platform} video, ${uploadDate}. ${url}.`;
  }
}

export function useBibliographyGenerator(): UseBibliographyGeneratorReturn {
  const [citation, setCitation] = useState('');
  const [citations, setCitations] = useState<Citation[]>([]);

  const generateCitation = useCallback((source: Source, format: CitationFormat): string => {
    let result = '';

    switch (source.type) {
      case 'book':
        result = generateBookCitation(source, format);
        break;
      case 'journal':
        result = generateJournalCitation(source, format);
        break;
      case 'website':
        result = generateWebsiteCitation(source, format);
        break;
      case 'video':
        result = generateVideoCitation(source, format);
        break;
    }

    setCitation(result);
    return result;
  }, []);

  const addToList = useCallback((source: Source, format: CitationFormat) => {
    let citationText = '';
    switch (source.type) {
      case 'book':
        citationText = generateBookCitation(source, format);
        break;
      case 'journal':
        citationText = generateJournalCitation(source, format);
        break;
      case 'website':
        citationText = generateWebsiteCitation(source, format);
        break;
      case 'video':
        citationText = generateVideoCitation(source, format);
        break;
    }

    setCitations((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        source,
        format,
        citation: citationText,
      },
    ]);
  }, []);

  const removeFromList = useCallback((id: string) => {
    setCitations((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const clearList = useCallback(() => {
    setCitations([]);
  }, []);

  return {
    citation,
    citations,
    generateCitation,
    addToList,
    removeFromList,
    clearList,
  };
}
