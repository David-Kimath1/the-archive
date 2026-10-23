import './AuthorRanking.css';

export default function AuthorRanking({ data }) {
  if (data.length === 0) {
    return <p className="author-rank__empty">No finished books yet.</p>;
  }
  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="author-rank">
      {data.map((a) => {
        const pct = (a.count / max) * 100;
        return (
          <div className="author-rank__row" key={a.author}>
            <div className="author-rank__head">
              <span className="author-rank__name">{a.author}</span>
              <span className="author-rank__count">
                {a.count} {a.count === 1 ? 'book' : 'books'}
              </span>
            </div>
            <div className="author-rank__track">
              <div className="author-rank__fill" style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
