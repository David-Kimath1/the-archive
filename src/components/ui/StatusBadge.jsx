import './StatusBadge.css';

const LABELS = {
  want: 'Want to Read',
  reading: 'Reading',
  finished: 'Finished',
  dropped: 'Dropped',
};

export default function StatusBadge({ status }) {
  return (
    <span className={`status-badge status-badge--${status}`}>
      <span className="status-badge__dot" aria-hidden="true" />
      {LABELS[status] ?? status}
    </span>
  );
}
