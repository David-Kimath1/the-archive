const OPEN_LIBRARY_SEARCH_URL = 'https://openlibrary.org/search.json';
const GOOGLE_BOOKS_SEARCH_URL = 'https://www.googleapis.com/books/v1/volumes';

function normaliseISBN(value = '') {
  return value.replace(/[^0-9X]/gi, '').toUpperCase();
}

function detectGenre(values = []) {
  const subjects = values
    .filter(Boolean)
    .map((value) => value.toLowerCase());
  const has = (pattern) => subjects.some((subject) => pattern.test(subject));

  if (has(/\bfantasy\b/)) return 'Fantasy';
  if (has(/\bscience fiction\b|\bsci-fi\b/)) return 'Science Fiction';
  if (has(/\bmystery\b|\bdetective\b|\bcrime fiction\b|\bthriller\b/)) return 'Mystery';
  if (has(/\bromance\b|\blove stories\b/)) return 'Romance';
  if (has(/\bpoetry\b|\bpoems\b/)) return 'Poetry';
  if (has(/\bbiography\b|\bautobiography\b|\bmemoir\b/)) return 'Biography';
  if (has(/\bhistory\b|\bhistorical\b/)) return 'History';
  if (has(/\bliterary fiction\b|\bclassic fiction\b/)) return 'Literary Fiction';
  if (has(/\bfiction\b|\bnovel\b|\bshort stories\b/)) return 'Literary Fiction';
  if (
    has(/\bnonfiction\b|\bnon-fiction\b|\bbusiness\b|\beconomics\b|\bleadership\b|\bpsychology\b|\bpolitics\b|\bphilosophy\b|\bself-help\b|\beducation\b|\bscience\b|\bhealth\b|\btechnology\b|\bsocial sciences\b|\bsuccess\b|\bpower\b/)
  ) return 'Non-fiction';
  return '';
}

function toBookResult(record) {
  const isbn = record.isbn?.find((value) => value.length === 13)
    ?? record.isbn?.[0]
    ?? '';

  return {
    title: record.title ?? '',
    author: record.author_name?.[0] ?? '',
    isbn,
    pages: record.number_of_pages_median ?? 0,
    publicationDate: record.first_publish_year
      ? `${record.first_publish_year}-01-01`
      : '',
    genre: detectGenre(record.subjects),
    coverUrl: record.cover_i
      ? `https://covers.openlibrary.org/b/id/${record.cover_i}-L.jpg?default=false`
      : '',
    sourceId: record.key ?? `${record.title}-${record.author_name?.[0] ?? ''}`,
  };
}

function toGoogleBooksResult(record) {
  const volume = record.volumeInfo ?? {};
  const isbn = volume.industryIdentifiers?.find((identifier) => identifier.type === 'ISBN_13')
    ?? volume.industryIdentifiers?.[0];
  const coverUrl = volume.imageLinks?.thumbnail ?? volume.imageLinks?.smallThumbnail ?? '';

  return {
    title: volume.title ?? '',
    author: volume.authors?.[0] ?? '',
    isbn: isbn?.identifier ?? '',
    pages: volume.pageCount ?? 0,
    publicationDate: volume.publishedDate?.slice(0, 10) ?? '',
    description: volume.description ?? '',
    genre: detectGenre(volume.categories),
    coverUrl: coverUrl.replace(/^http:\/\//, 'https://'),
    sourceId: `google-books:${record.id}`,
  };
}

async function fetchOpenLibraryResults(params, signal) {
  const response = await fetch(`${OPEN_LIBRARY_SEARCH_URL}?${params}`, {
    headers: { Accept: 'application/json' },
    signal,
  });
  if (!response.ok) {
    throw new Error(`Open Library search failed (${response.status}).`);
  }

  const data = await response.json();
  return (data.docs ?? [])
    .filter((record) => record.title && record.author_name?.[0])
    .map(toBookResult);
}

async function fetchGoogleBooksResults(query, signal) {
  const params = new URLSearchParams({ q: query, maxResults: '12', printType: 'books' });
  const response = await fetch(`${GOOGLE_BOOKS_SEARCH_URL}?${params}`, {
    headers: { Accept: 'application/json' },
    signal,
  });
  if (!response.ok) {
    throw new Error(`Google Books search failed (${response.status}).`);
  }

  const data = await response.json();
  return (data.items ?? [])
    .map(toGoogleBooksResult)
    .filter((record) => record.title && record.author);
}

export async function searchBookCatalog(query, { isbn = false, signal } = {}) {
  const cleanQuery = query.trim();
  if (!cleanQuery) return [];

  const params = new URLSearchParams({
    fields: 'key,title,author_name,first_publish_year,isbn,cover_i,number_of_pages_median,subjects',
    limit: '12',
  });
  if (isbn) {
    params.set('isbn', normaliseISBN(cleanQuery));
  } else {
    params.set('q', cleanQuery);
  }

  let openLibraryError;
  let openLibraryResults = [];
  try {
    openLibraryResults = await fetchOpenLibraryResults(params, signal);
    if (openLibraryResults.length > 0 && openLibraryResults.every((result) => result.genre)) {
      return openLibraryResults;
    }
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    openLibraryError = error;
  }

  try {
    const googleResults = await fetchGoogleBooksResults(
      isbn ? `isbn:${normaliseISBN(cleanQuery)}` : cleanQuery,
      signal,
    );
    const enrichedResults = openLibraryResults.map((result) => {
      const resultTitle = result.title.toLowerCase();
      const resultAuthor = result.author.toLowerCase();
      const match = googleResults.find((googleBook) =>
        googleBook.title.toLowerCase() === resultTitle
        && googleBook.author.toLowerCase() === resultAuthor,
      );
      return match?.genre && !result.genre
        ? { ...result, genre: match.genre }
        : result;
    });
    return enrichedResults.length > 0
      ? enrichedResults
      : googleResults;
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    if (openLibraryResults.length > 0) return openLibraryResults;
    throw new Error(
      openLibraryError
        ? 'Free book catalogs could not be reached. Check your internet connection and try again.'
        : 'No books were found. Try a different title, author, or ISBN.',
    );
  }
}

export function cleanISBN(value) {
  return normaliseISBN(value);
}
