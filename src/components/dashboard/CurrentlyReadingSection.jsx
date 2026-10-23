import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, BookX } from 'lucide-react';
import BookCover from '../books/BookCover.jsx';
import ProgressBar from '../ui/ProgressBar.jsx';
import SectionHeading from '../ui/SectionHeading.jsx';
import CardMenu from '../ui/CardMenu.jsx';
import Modal from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';
import { useBooks } from '../../context/BooksContext.jsx';
import { getCurrentlyReading } from '../../data/books.js';
import './CurrentlyReadingSection.css';

function isoDate() {
  return new Date().toISOString().slice(0, 10);
}

export default function CurrentlyReadingSection() {
  const { books, updateBook } = useBooks();
  const [pendingRemove, setPendingRemove] = useState(null);
  const reading = getCurrentlyReading(books);

  const handleConfirmRemove = () => {
    if (pendingRemove) {
      updateBook(pendingRemove.id, { status: 'dropped' });
    }
    setPendingRemove(null);
  };

  return (
    <section className="dash-section">
      <SectionHeading
        title="Currently Reading"
        action="View all"
        to="/currently-reading"
      />

      {reading.length === 0 ? (
        <div className="card dash-empty">
          <p>No active reads. Time to start something new.</p>
        </div>
      ) : (
        <div className="reading-list">
          {reading.map((book) => {
            const pct = Math.round((book.pagesRead / book.pages) * 100);
            return (
              <article className="reading-card" key={book.id}>
                <div className="reading-card__cover">
                  <BookCover book={book} size="md" />
                </div>

                <div className="reading-card__body">
                  <div className="reading-card__head">
                    <div>
                      <h3 className="reading-card__title">{book.title}</h3>
                      <p className="reading-card__author">{book.author}</p>
                    </div>
                    <CardMenu
                      actions={[
                        {
                          label: 'Mark as Finished',
                          icon: CheckCircle2,
                          onClick: () =>
                            updateBook(book.id, {
                              status: 'finished',
                              dateFinished: isoDate(),
                              pagesRead: book.pages,
                            }),
                        },
                        {
                          label: 'Remove from Currently Reading',
                          icon: BookX,
                          onClick: () => setPendingRemove(book),
                        },
                      ]}
                    />
                  </div>

                  <div className="reading-card__meta">
                    {book.pagesRead} / {book.pages} pages
                  </div>
                  <ProgressBar value={pct} label={`${pct}% complete`} />
                  <div className="reading-card__footer">
                    <span className="reading-card__pct">{pct}%</span>
                    <Link
                      to={`/books/${book.id}`}
                      className="reading-card__continue"
                    >
                      Continue
                      <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <Modal
        open={Boolean(pendingRemove)}
        onClose={() => setPendingRemove(null)}
        title="Remove from Currently Reading?"
        description={
          pendingRemove
            ? `"${pendingRemove.title}" will be moved to Dropped. It will remain in your archive.`
            : undefined
        }
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setPendingRemove(null)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleConfirmRemove}>
              Move to Dropped
            </Button>
          </>
        }
      >
        <p
          style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text-secondary)',
          }}
        >
          You can move it back later from Dropped or Want to Read.
        </p>
      </Modal>
    </section>
  );
}
