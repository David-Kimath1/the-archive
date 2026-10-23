import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import BookCover from './BookCover.jsx';
import ProgressBar from '../ui/ProgressBar.jsx';
import StatusBadge from '../ui/StatusBadge.jsx';
import './BookListItem.css';

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

export default function BookListItem({ book, showStatus = false }) {
  const isReading = book.status === 'reading';
  const pct = book.pages ? Math.round((book.pagesRead / book.pages) * 100) : 0;

  return (
    <Link
      to={`/books/${book.id}`}
      className="book-list-item"
      aria-label={`View ${book.title} by ${book.author}`}
    >
      <div className="book-list-item__cover">
        <BookCover book={book} size="sm" />
      </div>

      <div className="book-list-item__body">
        <h3 className="book-list-item__title">{book.title}</h3>
        <p className="book-list-item__author">{book.author}</p>
        <div className="book-list-item__meta">
          <span>{book.genre}</span>
          <span aria-hidden="true">·</span>
          <span>{book.pages} pages</span>
          {isReading && (
            <>
              <span aria-hidden="true">·</span>
              <span className="book-list-item__pct">{pct}%</span>
            </>
          )}
        </div>
        {isReading && (
          <div className="book-list-item__progress">
            <ProgressBar value={pct} size="sm" label={`${pct}% complete`} />
          </div>
        )}
      </div>

      <div className="book-list-item__aside">
        {showStatus && <StatusBadge status={book.status} />}
        <Stars value={book.rating} />
      </div>
    </Link>
  );
}
