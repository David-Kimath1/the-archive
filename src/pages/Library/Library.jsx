import { useEffect, useMemo, useState } from 'react';
import { useBooks } from '../../context/BooksContext.jsx';
import {
  filterBooks,
  sortBooks,
  getAllGenres,
} from '../../utils/libraryFilters.js';
import BookCard from '../../components/books/BookCard.jsx';
import BookListItem from '../../components/books/BookListItem.jsx';
import LibraryToolbar from './LibraryToolbar.jsx';
import './Library.css';

const VIEW_KEY = 'the-archive:library:view';

export default function Library() {
  const { books } = useBooks();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [genre, setGenre] = useState('all');
  const [rating, setRating] = useState('all');
  const [sort, setSort] = useState('recent');
  const [view, setView] = useState(() => {
    try {
      return localStorage.getItem(VIEW_KEY) || 'grid';
    } catch {
      return 'grid';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(VIEW_KEY, view);
    } catch {
      /* ignore */
    }
  }, [view]);

  const genres = useMemo(() => getAllGenres(books), [books]);

  const filtered = useMemo(
    () =>
      sortBooks(
        filterBooks(books, { search, status, genre, rating }),
        sort
      ),
    [books, search, status, genre, rating, sort]
  );

  const hasFilters =
    search !== '' || status !== 'all' || genre !== 'all' || rating !== 'all';

  const clearFilters = () => {
    setSearch('');
    setStatus('all');
    setGenre('all');
    setRating('all');
  };

  return (
    <div className="container library">
      <header className="library__head">
        <div>
          <h1 className="library__title">My Library</h1>
          <p className="library__subtitle">
            {filtered.length === books.length
              ? `${books.length} books`
              : `${filtered.length} of ${books.length} books`}
          </p>
        </div>
      </header>

      <LibraryToolbar
        search={search}
        onSearch={setSearch}
        status={status}
        onStatus={setStatus}
        genre={genre}
        onGenre={setGenre}
        rating={rating}
        onRating={setRating}
        sort={sort}
        onSort={setSort}
        view={view}
        onView={setView}
        genres={genres}
        hasFilters={hasFilters}
        onClear={clearFilters}
      />

      {filtered.length === 0 ? (
        <div className="library__empty">
          <p>No books match your filters.</p>
          {hasFilters && (
            <button type="button" className="library__empty-btn" onClick={clearFilters}>
              Clear filters
            </button>
          )}
        </div>
      ) : view === 'grid' ? (
        <div className="library__grid">
          {filtered.map((book) => (
            <BookCard key={book.id} book={book} showStatus />
          ))}
        </div>
      ) : (
        <div className="library__list">
          {filtered.map((book) => (
            <BookListItem key={book.id} book={book} showStatus />
          ))}
        </div>
      )}
    </div>
  );
}
