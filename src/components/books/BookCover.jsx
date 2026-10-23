import { useEffect, useState } from 'react';
import { resolveCoverUrl } from '../../utils/coverResolver.js';
import './BookCover.css';

export default function BookCover({ book, size = 'md' }) {
  const {
    title,
    author,
    colorA = '#1e3a5f',
    colorB = '#0a1628',
    coverUrl,
  } = book;

  const [resolved, setResolved] = useState(coverUrl || null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setFailed(false);

    // If the book already has a coverUrl, use it immediately.
    if (coverUrl) {
      setResolved(coverUrl);
      return undefined;
    }

    setResolved(null);

    resolveCoverUrl(book).then((url) => {
      if (!cancelled) setResolved(url);
    });

    return () => {
      cancelled = true;
    };
  }, [book.id, book.isbn, book.title, book.author, coverUrl]);

  const showImage = resolved && !failed;

  return (
    <div
      className={`book-cover book-cover--${size}`}
      style={{
        background: `linear-gradient(155deg, ${colorA} 0%, ${colorB} 100%)`,
      }}
      aria-hidden="true"
    >
      <span className="book-cover__spine" />

      {showImage ? (
        <img
          className="book-cover__image"
          src={resolved}
          alt=""
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="book-cover__content">
          <span className="book-cover__title">{title}</span>
          <span className="book-cover__author">{author}</span>
        </div>
      )}
    </div>
  );
}
