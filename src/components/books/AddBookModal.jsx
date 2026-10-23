import { useEffect, useRef, useState } from 'react';
import { Camera, Search, ScanLine } from 'lucide-react';
import Modal from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';
import { cleanISBN, searchBookCatalog } from '../../utils/bookCatalog.js';
import './AddBookModal.css';

const EMPTY_FORM = {
  title: '',
  author: '',
  isbn: '',
  pages: '',
  genre: '',
};

function createBookId() {
  return globalThis.crypto?.randomUUID?.()
    ?? `book-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function toLibraryBook(book) {
  return {
    id: createBookId(),
    title: book.title.trim(),
    author: book.author.trim(),
    isbn: book.isbn ?? '',
    pages: Number(book.pages) || 0,
    pagesRead: 0,
    genre: book.genre ?? '',
    status: 'want',
    rating: 0,
    publisher: '',
    publicationDate: book.publicationDate ?? '',
    description: book.description ?? '',
    coverUrl: book.coverUrl ?? '',
    dateAdded: new Date().toISOString(),
    dateFinished: '',
    isFavorite: false,
    review: '',
    notes: '',
  };
}

export default function AddBookModal({
  open,
  initialMode = 'search',
  onClose,
  onAddBook,
  books,
}) {
  const [mode, setMode] = useState(initialMode);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [notice, setNotice] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scannerError, setScannerError] = useState('');
  const [genreLookup, setGenreLookup] = useState('idle');
  const [genreLookupRequest, setGenreLookupRequest] = useState(0);
  const videoRef = useRef(null);
  const searchAbortRef = useRef(null);
  const requestIdRef = useRef(0);
  const genreAbortRef = useRef(null);
  const genreRequestIdRef = useRef(0);
  const genreTouchedRef = useRef(false);

  useEffect(() => {
    if (!open) {
      searchAbortRef.current?.abort();
      genreAbortRef.current?.abort();
      setScanning(false);
      return;
    }
    setMode(initialMode);
    setQuery('');
    setResults([]);
    setSearching(false);
    setSearchError('');
    setForm(EMPTY_FORM);
    setFormError('');
    setNotice('');
    setScanning(false);
    setScannerError('');
    setGenreLookup('idle');
    genreTouchedRef.current = false;
  }, [open, initialMode]);

  useEffect(() => () => searchAbortRef.current?.abort(), []);

  useEffect(() => {
    if (!open || mode !== 'manual' || genreTouchedRef.current) return undefined;

    const isbn = cleanISBN(form.isbn);
    const validISBN = /^(97[89]\d{10}|\d{9}[\dX])$/.test(isbn);
    const query = validISBN
      ? isbn
      : `${form.title.trim()} ${form.author.trim()}`.trim();
    if (!validISBN && (!form.title.trim() || !form.author.trim())) {
      setGenreLookup('idle');
      return undefined;
    }

    const controller = new AbortController();
    genreAbortRef.current?.abort();
    genreAbortRef.current = controller;
    const requestId = ++genreRequestIdRef.current;
    const timeout = window.setTimeout(async () => {
      setGenreLookup('loading');
      try {
        const matches = await searchBookCatalog(query, {
          isbn: validISBN,
          signal: controller.signal,
        });
        if (requestId !== genreRequestIdRef.current) return;

        const normalizedTitle = form.title.trim().toLowerCase();
        const normalizedAuthor = form.author.trim().toLowerCase();
        const bestMatch = validISBN
          ? matches[0]
          : matches.find((match) =>
            match.title.toLowerCase() === normalizedTitle
            && match.author.toLowerCase() === normalizedAuthor,
          ) ?? matches[0];

        if (bestMatch?.genre) {
          setForm((current) => ({ ...current, genre: bestMatch.genre }));
          setGenreLookup('found');
        } else {
          setGenreLookup('unavailable');
        }
      } catch (error) {
        if (error.name !== 'AbortError' && requestId === genreRequestIdRef.current) {
          setGenreLookup('unavailable');
        }
      }
    }, genreLookupRequest > 0 ? 0 : 650);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [open, mode, form.title, form.author, form.isbn, genreLookupRequest]);

  useEffect(() => {
    if (!open || !scanning || !videoRef.current) return undefined;
    let cancelled = false;
    let detected = false;
    let controls;

    const startCamera = async () => {
      try {
        const { BrowserMultiFormatReader } = await import('@zxing/browser');
        if (cancelled) return;
        const reader = new BrowserMultiFormatReader();
        controls = await reader.decodeFromVideoDevice(
          undefined,
          videoRef.current,
          (result) => {
            if (result && !cancelled && !detected) {
              const isbn = cleanISBN(result.getText());
              if (/^(97[89]\d{10}|\d{9}[\dX])$/.test(isbn)) {
                detected = true;
                setScanning(false);
                setQuery(isbn);
                setScannerError('');
                void runSearch(isbn, true);
              } else {
                setScannerError('That barcode is not an ISBN. Keep the ISBN barcode in view.');
              }
            }
          },
        );
        if (cancelled) controls.stop();
      } catch (error) {
        if (!cancelled) {
          setScannerError(
            error.name === 'NotAllowedError'
              ? 'Camera access was blocked. Allow camera access or enter the ISBN manually.'
              : 'The camera could not start. Enter the ISBN manually instead.',
          );
        }
      }
    };

    void startCamera();
    return () => {
      cancelled = true;
      controls?.stop();
    };
  }, [open, scanning]);

  const runSearch = async (searchTerm = query, byISBN = false) => {
    const term = searchTerm.trim();
    if (!term) {
      setSearchError(byISBN ? 'Enter an ISBN to search.' : 'Enter a title or author to search.');
      return;
    }

    searchAbortRef.current?.abort();
    const controller = new AbortController();
    searchAbortRef.current = controller;
    const requestId = ++requestIdRef.current;
    setSearching(true);
    setSearchError('');
    setNotice('');
    setScannerError('');

    const normalized = cleanISBN(term);
    const isISBNQuery = byISBN
      || /^(97[89]\d{10}|\d{9}[\dX])$/.test(normalized);

    try {
      const matches = await searchBookCatalog(term, { isbn: isISBNQuery, signal: controller.signal });
      if (requestId !== requestIdRef.current) return;
      setResults(matches);
      if (matches.length === 0) setNotice('No matching books found. You can add the details manually.');
    } catch (error) {
      if (error.name !== 'AbortError' && requestId === requestIdRef.current) {
        setSearchError(
          error instanceof TypeError
            ? 'Free book catalogs could not be reached. Check your internet connection and try again.'
            : error.message || 'Book search failed. Check your connection and try again.',
        );
      }
    } finally {
      if (requestId === requestIdRef.current) setSearching(false);
    }
  };

  const addBook = (book) => {
    const title = book.title?.trim();
    const author = book.author?.trim();
    if (!title || !author) {
      setFormError('A title and author are required.');
      return;
    }

    const isbn = cleanISBN(book.isbn ?? '');
    const duplicate = books.find((existing) =>
      (isbn && cleanISBN(existing.isbn ?? '') === isbn)
      || (
        existing.title.trim().toLowerCase() === title.toLowerCase()
        && existing.author.trim().toLowerCase() === author.toLowerCase()
      ),
    );
    if (duplicate) {
      setNotice(`“${title}” is already in your library.`);
      return;
    }

    onAddBook(toLibraryBook({ ...book, title, author, isbn }));
    onClose();
  };

  const updateForm = (event) => {
    const { name, value } = event.target;
    if (name === 'genre') {
      genreTouchedRef.current = true;
      setGenreLookup('custom');
    }
    setForm((current) => ({ ...current, [name]: value }));
  };

  const detectGenre = () => {
    genreTouchedRef.current = false;
    setGenreLookup('idle');
    setGenreLookupRequest((current) => current + 1);
  };

  const submitManualBook = (event) => {
    event.preventDefault();
    setFormError('');
    addBook(form);
  };

  const useCameraScan = () => {
    setScannerError('');
    setScanning(true);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === 'manual' ? 'Add a Book' : 'Find a Book'}
      description="Search a free book catalog, scan an ISBN, or enter details yourself."
      size="lg"
    >
      <div className="add-book">
        <div className="add-book__tabs" role="tablist" aria-label="Book entry method">
          <button
            type="button"
            id="book-search-tab"
            role="tab"
            aria-selected={mode === 'search'}
            aria-controls="book-search-panel"
            className={`add-book__tab${mode === 'search' ? ' is-active' : ''}`}
            onClick={() => { setMode('search'); setFormError(''); }}
          >
            Find a Book
          </button>
          <button
            type="button"
            id="book-manual-tab"
            role="tab"
            aria-selected={mode === 'manual'}
            aria-controls="book-manual-panel"
            className={`add-book__tab${mode === 'manual' ? ' is-active' : ''}`}
            onClick={() => { setMode('manual'); setFormError(''); }}
          >
            Add manually
          </button>
        </div>

        {mode === 'search' ? (
          <section
            id="book-search-panel"
            role="tabpanel"
            aria-labelledby="book-search-tab"
            className="add-book__panel"
          >
            <form
              className="add-book__search"
              onSubmit={(event) => { event.preventDefault(); void runSearch(); }}
            >
              <label className="sr-only" htmlFor="catalog-query">Search books by title, author, or ISBN</label>
              <input
                id="catalog-query"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by title, author, or ISBN"
                autoComplete="off"
              />
              <Button type="submit" icon={Search} disabled={searching}>
                {searching ? 'Searching…' : 'Search'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                icon={ScanLine}
                onClick={useCameraScan}
                aria-pressed={scanning}
              >
                Scan ISBN
              </Button>
            </form>

            {scanning && (
              <div className="add-book__scanner">
                <video ref={videoRef} muted playsInline aria-label="Camera view for scanning an ISBN barcode" />
                <p>Point your camera at the ISBN barcode on the back of the book.</p>
                <Button variant="ghost" onClick={() => setScanning(false)}>Stop camera</Button>
              </div>
            )}

            {scannerError && <p className="add-book__message add-book__message--error" role="alert">{scannerError}</p>}
            {searchError && <p className="add-book__message add-book__message--error" role="alert">{searchError}</p>}
            {notice && <p className="add-book__message" role="status">{notice}</p>}

            <div className="add-book__results" aria-live="polite" aria-busy={searching}>
              {results.map((result) => (
                <article className="add-book__result" key={result.sourceId}>
                  {result.coverUrl ? (
                    <img
                      className="add-book__cover"
                      src={result.coverUrl}
                      alt={`Cover of ${result.title}`}
                      loading="lazy"
                    />
                  ) : (
                    <div className="add-book__cover add-book__cover--empty" aria-hidden="true">
                      <Camera size={22} />
                    </div>
                  )}
                  <div className="add-book__result-info">
                    <h3>{result.title}</h3>
                    <p>{result.author}</p>
                    <span>
                      {[result.publicationDate?.slice(0, 4), result.pages ? `${result.pages} pages` : '']
                        .filter(Boolean)
                        .join(' · ') || 'Book details'}
                      {result.genre ? ` · ${result.genre}` : ''}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => addBook(result)}
                    aria-label={`Add ${result.title} by ${result.author} to library`}
                  >
                    Add
                  </Button>
                </article>
              ))}
            </div>
            <p className="add-book__attribution">
              Book details and cover images use free Open Library and Google Books catalog services. Search does not provide ebook downloads.
            </p>
          </section>
        ) : (
          <section
            id="book-manual-panel"
            role="tabpanel"
            aria-labelledby="book-manual-tab"
            className="add-book__panel"
          >
            <form className="add-book__manual" onSubmit={submitManualBook}>
              <label>
                <span>Title <b>Required</b></span>
                <input name="title" value={form.title} onChange={updateForm} required maxLength={200} />
              </label>
              <label>
                <span>Author <b>Required</b></span>
                <input name="author" value={form.author} onChange={updateForm} required maxLength={160} />
              </label>
              <label>
                <span>ISBN <small>Optional</small></span>
                <input name="isbn" value={form.isbn} onChange={updateForm} inputMode="numeric" />
              </label>
              <label>
                <span>Pages <small>Optional</small></span>
                <input name="pages" type="number" min="1" value={form.pages} onChange={updateForm} />
              </label>
              <label>
                <span>Genre <small>Optional</small></span>
                <input name="genre" value={form.genre} onChange={updateForm} maxLength={60} />
                <button
                  className="add-book__genre-detect"
                  type="button"
                  onClick={detectGenre}
                  disabled={genreLookup === 'loading'}
                >
                  {genreLookup === 'loading' ? 'Detecting…' : 'Detect automatically'}
                </button>
              </label>
              <p
                className={`add-book__genre-status add-book__genre-status--${genreLookup}`}
                role="status"
                aria-live="polite"
              >
                {genreLookup === 'loading' && 'Checking free book catalogs for a genre…'}
                {genreLookup === 'found' && 'Genre detected from book catalog details. You can change it.'}
                {genreLookup === 'unavailable' && 'No catalog genre found. Enter one or try detecting again.'}
                {genreLookup === 'custom' && 'Using your genre selection.'}
              </p>
              <div className="add-book__form-error" role="alert">{formError}</div>
              <div className="add-book__form-actions">
                <Button type="submit">Add to Library</Button>
              </div>
            </form>
            <p className="add-book__attribution">
              Covers can be found by searching the catalog with the book title and author.
            </p>
          </section>
        )}
      </div>
    </Modal>
  );
}
