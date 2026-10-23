import './ProgressBar.css';

export default function ProgressBar({
  value,
  max = 100,
  size = 'md',
  variant = 'accent',
  label,
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div
      className={`progress progress--${size} progress--${variant}`}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div className="progress__fill" style={{ width: `${pct}%` }} />
    </div>
  );
}
