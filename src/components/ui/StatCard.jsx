import './StatCard.css';

export default function StatCard({ icon: Icon, label, value, hint }) {
  return (
    <div className="stat-card">
      <div className="stat-card__head">
        {Icon && (
          <span className="stat-card__icon" aria-hidden="true">
            <Icon size={16} strokeWidth={1.75} />
          </span>
        )}
        <span className="stat-card__label">{label}</span>
      </div>
      <div className="stat-card__value">{value}</div>
      {hint && <div className="stat-card__hint">{hint}</div>}
    </div>
  );
}
