import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import BookCover from '../books/BookCover.jsx';
import SectionHeading from '../ui/SectionHeading.jsx';
import { useBooks } from '../../context/BooksContext.jsx';
import { getRecentlyFinished } from '../../data/books.js';
import './RecentlyFinishedSection.css';

function Stars({ value }) {
  return (
    <span className="rating">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={12} strokeWidth={1.5} fill={i < value ? 'currentColor' : 'none'} />
      ))}
    </span>
  );
}

export default function RecentlyFinishedSection() {
  const { books } = useBooks();
  const finished = getRecentlyFinished(books, 4);

  return (
    <section className="dash-section">
      <SectionHeading title="Recently Finished" action="View all" to="/finished" />
      {finished.length === 0 ? (
        <div className="card dash-empty"><p>No finished books yet.</p></div>
      ) : (
        <div className="recent-grid">
          {finished.map((book) => (
            <Link key={book.id} to={`/books/${book.id}`} className="recent-item">
              <div className="recent-item__cover">
                <BookCover book={book} size="md" />
              </div>
              <div className="recent-item__body">
                <h3 className="recent-item__title">{book.title}</h3>
                <p className="recent-item__author">{book.author}</p>
                {book.rating > 0 && <Stars value={book.rating} />}
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
