import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './SectionHeading.css';

export default function SectionHeading({ title, subtitle, action, to }) {
  return (
    <header className="section-heading">
      <div className="section-heading__text">
        <h2 className="section-heading__title">{title}</h2>
        {subtitle && (
          <p className="section-heading__subtitle">{subtitle}</p>
        )}
      </div>
      {action && to && (
        <Link to={to} className="section-heading__action">
          {action}
          <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
        </Link>
      )}
    </header>
  );
}
