import { useBooks } from '../../context/BooksContext.jsx';
import BookCard from './BookCard.jsx';
import './StatusPageLayout.css';

export default function StatusPageLayout({
  title,
  subtitle,
  statusKey,
  emptyTitle,
  emptyDescription,
  icon: Icon,
}) {
  const { books } = useBooks();
  const filtered = books.filter((b) => b.status === statusKey);

  return (
    <div className="container status-page">
      <header className="status-page__head">
        <div>
          <h1 className="status-page__title">{title}</h1>
          <p className="status-page__subtitle">
            {filtered.length === 0
              ? subtitle
              : `${filtered.length} ${filtered.length === 1 ? 'book' : 'books'}`}
          </p>
        </div>
      </header>

      {filtered.length === 0 ? (
        <div className="status-page__empty">
          {Icon && (
            <span className="status-page__empty-icon" aria-hidden="true">
              <Icon size={28} strokeWidth={1.5} />
            </span>
          )}
          <h2 className="status-page__empty-title">{emptyTitle}</h2>
          <p className="status-page__empty-desc">{emptyDescription}</p>
        </div>
      ) : (
        <div className="status-page__grid">
          {filtered.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}
