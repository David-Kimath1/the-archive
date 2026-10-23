import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Star, Quote as QuoteIcon } from 'lucide-react';
import { useBooks } from '../../context/BooksContext.jsx';
import BookCover from '../../components/books/BookCover.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import ProgressBar from '../../components/ui/ProgressBar.jsx';
import BookActions from '../../components/books/BookActions.jsx';
import BookDetailMeta from '../../components/books/BookDetailMeta.jsx';
import EditableTextSection from '../../components/books/EditableTextSection.jsx';
import EditBookModal from '../../components/books/EditBookModal.jsx';
import DeleteConfirm from '../../components/books/DeleteConfirm.jsx';
import './BookDetails.css';

function Stars({ value, size = 14 }) {
  return (
    <span className="rating" aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          strokeWidth={1.5}
          fill={i < value ? 'currentColor' : 'none'}
        />
      ))}
    </span>
  );
}

export default function BookDetails() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { books, updateBook, deleteBook } = useBooks();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const book = books.find((b) => b.id === bookId);

  if (!book) {
    return (
      <div className="container book-details book-details--empty">
        <h1>Book not found</h1>
        <p>This book is no longer in The Archive.</p>
        <Link to="/library" className="book-details__back-link">
          <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" />
          Back to Library
        </Link>
      </div>
    );
  }

  const isReading = book.status === 'reading';
  const pct = book.pages ? Math.round((book.pagesRead / book.pages) * 100) : 0;

  const handleSaveEdit = (patch) => {
    updateBook(book.id, patch);
    setEditOpen(false);
  };

  const handleConfirmDelete = () => {
    deleteBook(book.id);
    setDeleteOpen(false);
    navigate('/library');
  };

  return (
    <div className="container book-details">
      <Link to="/library" className="book-details__back-link">
        <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" />
        Back to Library
      </Link>

      <section className="book-details__hero">
        <div className="book-details__cover">
          <BookCover book={book} size="md" />
        </div>

        <div className="book-details__info">
          <div className="book-details__eyebrow">
            <StatusBadge status={book.status} />
            <span className="book-details__genre">{book.genre}</span>
          </div>
          <h1 className="book-details__title">{book.title}</h1>
          <p className="book-details__author">{book.author}</p>

          {book.rating > 0 && (
            <div className="book-details__rating">
              <Stars value={book.rating} />
              <span>{book.rating} of 5</span>
            </div>
          )}

          {isReading && (
            <div className="book-details__progress">
              <div className="book-details__progress-head">
                <span>Reading progress</span>
                <span className="book-details__progress-count">
                  {book.pagesRead} / {book.pages} pages · {pct}%
                </span>
              </div>
              <ProgressBar value={pct} size="lg" label={`${pct}% complete`} />
            </div>
          )}

          {book.description && (
            <p className="book-details__desc">{book.description}</p>
          )}

          <BookActions
            book={book}
            onUpdate={updateBook}
            onEdit={() => setEditOpen(true)}
            onDelete={() => setDeleteOpen(true)}
          />
        </div>
      </section>

      <BookDetailMeta book={book} />

      <div className="book-details__text">
        <EditableTextSection
          title="Personal Review"
          subtitle="Only you can see this."
          value={book.review}
          placeholder="What did you think of this book?"
          rows={5}
          onSave={(text) => updateBook(book.id, { review: text })}
        />

        <EditableTextSection
          title="Notes"
          subtitle="General notes about this book."
          value={book.notes}
          placeholder="Anything you want to remember about this book…"
          rows={4}
          onSave={(text) => updateBook(book.id, { notes: text })}
        />
      </div>

      <section className="book-details__quotes">
        <header className="book-details__quotes-head">
          <h3 className="book-details__quotes-title">Quotes</h3>
          <Link to="/quotes" className="book-details__quotes-link">
            View all quotes
          </Link>
        </header>
        <div className="book-details__quotes-empty">
          <QuoteIcon size={16} strokeWidth={1.75} aria-hidden="true" />
          <span>No quotes saved from this book yet.</span>
        </div>
      </section>

      <EditBookModal
        open={editOpen}
        book={book}
        onClose={() => setEditOpen(false)}
        onSave={handleSaveEdit}
      />
      <DeleteConfirm
        open={deleteOpen}
        book={book}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
