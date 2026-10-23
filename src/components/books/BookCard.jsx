import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import BookCover from './BookCover.jsx';
import ProgressBar from '../ui/ProgressBar.jsx';
import StatusBadge from '../ui/StatusBadge.jsx';
import { useBooks } from '../../context/BooksContext.jsx';
import './BookCard.css';

function Stars({ value }) {
  if (!value) return null;
  return (
    <span className="rating" aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={11}
          strokeWidth={1.5}
          fill={i < value ? 'currentColor' : 'none'}
        />
      ))}
    </span>
  );
}

export default function BookCard({ book, showStatus = false }) {
  const { toggleFavorite } = useBooks();
  const isReading = book.status === 'reading';
  const pct = book.pages ? Math.round((book.pagesRead / book.pages) * 100) : 0;

  const handleFavoriteClick = (e) => {
    e.preventDefault(); // Prevent navigating to details page
    e.stopPropagation();
    toggleFavorite(book.id);
  };

  return (
    <div className="book-card-wrapper">
      <Link
        to={`/books/${book.id}`}
        className="book-card"
        aria-label={`View ${book.title} by ${book.author}`}
      >
        <div className="book-card__cover">
          <BookCover book={book} size="md" />

          <div className="book-card__badges">
            {showStatus && <StatusBadge status={book.status} />}
          </div>

          <button
            type="button"
            className={`book-card__fav ${book.isFavorite ? 'is-fav' : ''}`}
            onClick={handleFavoriteClick}
            aria-label={book.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star
              size={14}
              strokeWidth={2}
              fill={book.isFavorite ? 'currentColor' : 'none'}
            />
          </button>
        </div>
        <div className="book-card__body">
          <h3 className="book-card__title">{book.title}</h3>
          <p className="book-card__author">{book.author}</p>
          {isReading && (
            <div className="book-card__progress">
              <ProgressBar value={pct} size="sm" label={`${pct}% complete`} />
              <span className="book-card__pct">{pct}%</span>
            </div>
          )}
          {!isReading && book.rating > 0 && <Stars value={book.rating} />}
        </div>
      </Link>
    </div>
  );
}
