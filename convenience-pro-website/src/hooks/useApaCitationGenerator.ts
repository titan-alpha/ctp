import { useState, useCallback } from 'react';

export type SourceType = 'book' | 'journal' | 'website';

export interface BookSource {
  type: 'book';
  authors: string;
  title: string;
  publisher: string;
  year: string;
  edition?: string;
  doi?: string;
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
  publishDate?: string;
  retrievalDate: string;
}

export type Source = BookSource | JournalSource | WebsiteSource;

interface UseApaCitationGeneratorReturn {
  inTextCitation: string;
  referenceCitation: string;
  generateCitation: (source: Source) => void;
}

function formatAuthorsAPA(authors: string): { reference: string; inText: string } {
  const authorList = authors.split(',').map((a) => a.trim()).filter(Boolean);

  if (authorList.length === 0) {
    return { reference: '', inText: '' };
  }

  const formattedAuthors = authorList.map((author) => {
    const parts = author.split(' ').filter(Boolean);
    if (parts.length === 0) return '';
    const lastName = parts.pop() || '';
    const initials = parts.map((p) => p.charAt(0).toUpperCase() + '.').join(' ');
    return initials ? `${lastName}, ${initials}` : lastName;
  });

  // In-text citation format
  let inText: string;
  if (authorList.length === 1) {
    const lastName = authorList[0].split(' ').pop() || '';
    inText = lastName;
  } else if (authorList.length === 2) {
    const lastName1 = authorList[0].split(' ').pop() || '';
    const lastName2 = authorList[1].split(' ').pop() || '';
    inText = `${lastName1} & ${lastName2}`;
  } else {
    const lastName = authorList[0].split(' ').pop() || '';
    inText = `${lastName} et al.`;
  }

  // Reference list format
  let reference: string;
  if (formattedAuthors.length === 1) {
    reference = formattedAuthors[0];
  } else if (formattedAuthors.length === 2) {
    reference = `${formattedAuthors[0]}, & ${formattedAuthors[1]}`;
  } else if (formattedAuthors.length <= 20) {
    const allButLast = formattedAuthors.slice(0, -1).join(', ');
    reference = `${allButLast}, & ${formattedAuthors[formattedAuthors.length - 1]}`;
  } else {
    const first19 = formattedAuthors.slice(0, 19).join(', ');
    reference = `${first19}, ... ${formattedAuthors[formattedAuthors.length - 1]}`;
  }

  return { reference, inText };
}

function generateBookCitation(source: BookSource): { reference: string; inText: string } {
  const { authors, title, publisher, year, edition, doi } = source;
  const { reference: authorRef, inText } = formatAuthorsAPA(authors);

  let reference = `${authorRef} (${year}). *${title}*`;
  if (edition) {
    reference += ` (${edition} ed.)`;
  }
  reference += `. ${publisher}.`;
  if (doi) {
    reference += ` https://doi.org/${doi}`;
  }

  return {
    reference,
    inText: `(${inText}, ${year})`,
  };
}

function generateJournalCitation(source: JournalSource): { reference: string; inText: string } {
  const { authors, title, journalName, year, volume, issue, pages, doi } = source;
  const { reference: authorRef, inText } = formatAuthorsAPA(authors);

  let reference = `${authorRef} (${year}). ${title}. *${journalName}*, *${volume}*`;
  if (issue) {
    reference += `(${issue})`;
  }
  reference += `, ${pages}.`;
  if (doi) {
    reference += ` https://doi.org/${doi}`;
  }

  return {
    reference,
    inText: `(${inText}, ${year})`,
  };
}

function generateWebsiteCitation(source: WebsiteSource): { reference: string; inText: string } {
  const { authors, title, siteName, url, publishDate, retrievalDate } = source;

  let authorRef: string;
  let inText: string;
  const displayYear = publishDate || 'n.d.';

  if (authors) {
    const formatted = formatAuthorsAPA(authors);
    authorRef = formatted.reference;
    inText = formatted.inText;
  } else {
    authorRef = siteName;
    inText = siteName;
  }

  let reference = `${authorRef} (${displayYear}). *${title}*. ${siteName}. Retrieved ${retrievalDate}, from ${url}`;

  return {
    reference,
    inText: `(${inText}, ${displayYear})`,
  };
}

export function useApaCitationGenerator(): UseApaCitationGeneratorReturn {
  const [inTextCitation, setInTextCitation] = useState('');
  const [referenceCitation, setReferenceCitation] = useState('');

  const generateCitation = useCallback((source: Source) => {
    let result: { reference: string; inText: string };

    switch (source.type) {
      case 'book':
        result = generateBookCitation(source);
        break;
      case 'journal':
        result = generateJournalCitation(source);
        break;
      case 'website':
        result = generateWebsiteCitation(source);
        break;
    }

    setInTextCitation(result.inText);
    setReferenceCitation(result.reference);
  }, []);

  return {
    inTextCitation,
    referenceCitation,
    generateCitation,
  };
}
