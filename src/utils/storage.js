/**
 * Centralized localStorage management for The Archive.
 */

export const STORAGE_KEYS = {
  books: 'the-archive:books:v1',
  quotes: 'the-archive:quotes:v1',
  goals: 'the-archive:goals:v1',
  nav: 'the-archive:mobile-nav-dynamic',
  view: 'the-archive:library:view',
  coverCache: 'the-archive:cover-cache:v2',
};

export function exportData() {
  const data = {};
  Object.entries(STORAGE_KEYS).forEach(([key, storageKey]) => {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      try {
        data[key] = JSON.parse(raw);
      } catch {
        data[key] = raw;
      }
    }
  });

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `the-archive-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function importData(jsonString) {
  try {
    const data = JSON.parse(jsonString);

    if (typeof data !== 'object' || data === null) {
      throw new Error('Invalid data format');
    }

    Object.entries(STORAGE_KEYS).forEach(([key, storageKey]) => {
      if (data[key] !== undefined) {
        const value = typeof data[key] === 'string' ? data[key] : JSON.stringify(data[key]);
        localStorage.setItem(storageKey, value);
      }
    });
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export function resetData() {
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
}

/**
 * Parse a CSV string into an array of book objects.
 * Expects columns: Title, Author, Pages, Status, ISBN, Rating, Genre
 */
export function parseCSV(csvText) {
  const lines = csvText.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length < 2) throw new Error('CSV is empty or missing headers');

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

  if (!headers.includes('title') || !headers.includes('author')) {
    throw new Error('CSV must include "Title" and "Author" columns');
  }

  const newBooks = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',');
    const book = {};

    headers.forEach((header, index) => {
      book[header] = cols[index] ? cols[index].trim() : '';
    });

    if (!book.title || !book.author) continue;

    const statusMap = {
      'read': 'finished',
      'currently reading': 'reading',
      'to-read': 'want',
      'want to read': 'want',
      'dropped': 'dropped'
    };

    newBooks.push({
      id: crypto.randomUUID(),
      title: book.title,
      author: book.author,
      pages: Number(book.pages) || 0,
      pagesRead: (book.status?.toLowerCase() === 'read' || book.status?.toLowerCase() === 'finished') ? (Number(book.pages) || 0) : 0,
      status: statusMap[book.status?.toLowerCase()] || 'want',
      rating: Number(book.rating) || 0,
      isbn: book.isbn || '',
      genre: book.genre || 'Unknown',
      description: '',
      notes: '',
      review: '',
      dateAdded: new Date().toISOString().slice(0, 10),
      dateStarted: null,
      dateFinished: null,
      colorA: '#1e3a5f',
      colorB: '#0a1628',
      isFavorite: false,
    });
  }
  return newBooks;
}

export function downloadCSVTemplate() {
  const csvContent = "Title,Author,Pages,Status,ISBN,Rating,Genre\n" +
    "The Hobbit,J.R.R. Tolkien,310,finished,9780547928227,5,Fantasy\n" +
    "Dune,Frank Herbert,617,reading,9780441172719,0,Science Fiction\n" +
    "The Silent Patient,Alex Michaelides,336,want,9781250301697,0,Mystery";

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `the-archive-import-template.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
