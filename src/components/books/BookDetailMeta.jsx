import './BookDetailMeta.css';

function fmtDate(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function BookDetailMeta({ book }) {
  const rows = [
    { label: 'Publisher', value: book.publisher || '—' },
    { label: 'Published', value: fmtDate(book.publicationDate) || '—' },
    { label: 'Pages', value: book.pages ? book.pages.toLocaleString() : '—' },
    { label: 'ISBN', value: book.isbn || '—' },
    { label: 'Added', value: fmtDate(book.dateAdded) || '—' },
    { label: 'Started', value: fmtDate(book.dateStarted) || '—' },
    { label: 'Finished', value: fmtDate(book.dateFinished) || '—' },
  ];

  return (
    <dl className="book-meta">
      {rows.map((row) => (
        <div className="book-meta__row" key={row.label}>
          <dt className="book-meta__label">{row.label}</dt>
          <dd className="book-meta__value">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
