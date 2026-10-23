import { Quote as QuoteIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuotes } from '../../context/QuotesContext.jsx';
import './QuoteWidget.css';

export default function QuoteWidget() {
  const { dailyQuote } = useQuotes();

  if (!dailyQuote) return null;

  return (
    <section className="dash-section">
      <div className="widget-head">
        <h2 className="widget-title">Quote of the Day</h2>
        <Link to="/quotes" className="widget-link">
          View all
        </Link>
      </div>
      <div className="quote-widget card">
        <QuoteIcon size={20} strokeWidth={1.5} className="quote-widget__icon" />
        <blockquote className="quote-widget__text">
          “{dailyQuote.text}”
        </blockquote>
        <div className="quote-widget__meta">
          {dailyQuote.bookTitle && <span>{dailyQuote.bookTitle}</span>}
          {dailyQuote.author && <span>· {dailyQuote.author}</span>}
        </div>
      </div>
    </section>
  );
}
