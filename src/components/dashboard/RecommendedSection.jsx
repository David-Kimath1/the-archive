import BookCover from '../books/BookCover.jsx';
import SectionHeading from '../ui/SectionHeading.jsx';
import { recommendedBooks } from '../../data/reading.js';
import './RecommendedSection.css';

export default function RecommendedSection() {
  return (
    <section className="dash-section">
      <SectionHeading title="Recommended for You" />
      <div className="recommended">
        {recommendedBooks.map((book) => (
          <article key={book.id} className="recommended__item">
            <div className="recommended__cover">
              <BookCover book={book} size="md" />
            </div>
            <div className="recommended__body">
              <h3 className="recommended__title">{book.title}</h3>
              <p className="recommended__author">{book.author}</p>
              <span className="recommended__genre">{book.genre}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
