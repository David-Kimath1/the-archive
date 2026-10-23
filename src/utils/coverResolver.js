// src/utils/coverResolver.js
/**
 * Resolve book covers with a focus on reliability.
 * 1. Use ISBN-based cover CDN (no CORS restrictions).
 * 2. Fall back to other providers only if needed.
 */

const CACHE_KEY = 'the-archive:cover-cache:v2'; // Version bumped for new logic

function readCache() {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY)) || {}; }
  catch { return {}; }
}

function writeCache(cache) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(cache)); }
  catch { /* ignore */ }
}

function cacheKey(book) { return book.id || `${book.title}::${book.author}`; }
function normalise(url) { return url ? url.replace(/^http:\/\//, 'https://') : null; }

async function fetchJson(url) {
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/**
 * Primary method: Direct ISBN cover from Open Library CDN.
 * Uses an <img> element to check if the image loads (bypasses CORS).
 */
function checkImageUrl(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(url);
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

async function byIsbn(isbn) {
  if (!isbn) return null;
  const clean = isbn.replace(/-/g, '');
  const url = `https://covers.openlibrary.org/b/isbn/${clean}-M.jpg`;
  return checkImageUrl(url);
}

// Keep the search functions as a secondary fallback.
async function byOpenLibrarySearch(title, author) {
  const q = new URLSearchParams({ title, author, limit: '1', fields: 'cover_i' });
  const data = await fetchJson(`https://openlibrary.org/search.json?${q}`);
  const coverId = data?.docs?.[0]?.cover_i;
  return coverId ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` : null;
}

async function byGoogleBooks(title, author) {
  const q = encodeURIComponent(`intitle:${title} inauthor:${author}`);
  const data = await fetchJson(`https://www.googleapis.com/books/v1/volumes?q=${q}&maxResults=1`);
  const links = data?.items?.[0]?.volumeInfo?.imageLinks;
  return links ? normalise(links.thumbnail || links.smallThumbnail) : null;
}

export async function resolveCoverUrl(book) {
  if (!book) return null;
  if (book.coverUrl) return book.coverUrl;

  const key = cacheKey(book);
  const cache = readCache();
  if (cache[key] !== undefined) return cache[key] || null;

  const { title, author, isbn } = book;

  // Prioritize the direct ISBN CDN.
  const sources = [
    () => byIsbn(isbn),
    () => byOpenLibrarySearch(title, author),
    () => byGoogleBooks(title, author),
  ];

  for (const source of sources) {
    try {
      const url = await source();
      if (url) {
        cache[key] = url;
        writeCache(cache);
        return url;
      }
    } catch { /* try next source */ }
  }

  cache[key] = '';
  writeCache(cache);
  return null;
}
