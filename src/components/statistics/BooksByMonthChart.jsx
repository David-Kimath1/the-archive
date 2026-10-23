import './BooksByMonthChart.css';

export default function BooksByMonthChart({ data }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  const total = data.reduce((s, d) => s + d.count, 0);

  return (
    <div className="bbm-chart">
      <div className="bbm-chart__bars" role="img" aria-label="Books finished per month, last 12 months">
        {data.map((m) => {
          const h = (m.count / max) * 100;
          return (
            <div className="bbm-chart__col" key={m.key}>
              <span className="bbm-chart__value">
                {m.count > 0 ? m.count : ''}
              </span>
              <div className="bbm-chart__track">
                <div
                  className="bbm-chart__bar"
                  style={{ height: `${m.count > 0 ? Math.max(h, 6) : 0}%` }}
                  title={`${m.label}: ${m.count} ${m.count === 1 ? 'book' : 'books'}`}
                />
              </div>
              <span className="bbm-chart__label">{m.label}</span>
            </div>
          );
        })}
      </div>
      <p className="bbm-chart__foot">
        {total} {total === 1 ? 'book' : 'books'} in the last 12 months
      </p>
    </div>
  );
}
