import { useState } from 'react';
import { Quote as QuoteIcon, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useQuotes } from '../../context/QuotesContext.jsx';
import Button from '../../components/ui/Button.jsx';
import AddQuoteModal from '../../components/ui/AddQuoteModal.jsx';
import './Quotes.css';

export default function Quotes() {
  const { quotes, dailyQuote, addQuote, deleteQuote } = useQuotes();
  const [modalOpen, setModalOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);

  return (
    <div className="container quotes-page">
      <header className="quotes-header">
        <div>
          <h1 className="quotes-title">Quotes</h1>
          <p className="quotes-subtitle">Meaningful passages from your reading.</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => setModalOpen(true)}>
          Add Quote
        </Button>
      </header>

      {dailyQuote && (
        <section className="daily-quote">
          <div className="daily-quote__label">Quote of the Day</div>
          <blockquote className="daily-quote__text">
            “{dailyQuote.text}”
          </blockquote>
          <div className="daily-quote__meta">
            {dailyQuote.bookTitle && <span>{dailyQuote.bookTitle}</span>}
            {dailyQuote.author && <span>· {dailyQuote.author}</span>}
          </div>
        </section>
      )}

      <div className="quotes-toggle-wrap">
        <button
          type="button"
          className="quotes-toggle"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? (
            <>
              Hide Saved Quotes <ChevronUp size={16} strokeWidth={2} />
            </>
          ) : (
            <>
              View All {quotes.length} Saved Quotes <ChevronDown size={16} strokeWidth={2} />
            </>
          )}
        </button>
      </div>

      {showAll && (
        <section className="quotes-list">
          {quotes.length === 0 ? (
            <div className="quotes-empty">
              <QuoteIcon size={24} strokeWidth={1.5} />
              <p>No quotes saved yet. Add your first passage above.</p>
            </div>
          ) : (
            <div className="quotes-grid">
              {quotes.map((quote) => (
                <article className="quote-card" key={quote.id}>
                  <blockquote className="quote-card__text">
                    “{quote.text}”
                  </blockquote>
                  <div className="quote-card__meta">
                    {quote.bookTitle && (
                      <span className="quote-card__book">{quote.bookTitle}</span>
                    )}
                    {quote.author && (
                      <span className="quote-card__author">{quote.author}</span>
                    )}
                    {quote.pageNumber > 0 && (
                      <span className="quote-card__page">p. {quote.pageNumber}</span>
                    )}
                  </div>
                  {quote.note && (
                    <p className="quote-card__note">{quote.note}</p>
                  )}
                  <div className="quote-card__footer">
                    <span className="quote-card__date">
                      Saved {new Date(quote.dateSaved).toLocaleDateString()}
                    </span>
                    <button
                      type="button"
                      className="quote-card__delete"
                      onClick={() => deleteQuote(quote.id)}
                      aria-label="Delete quote"
                    >
                      <Trash2 size={14} strokeWidth={2} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      <AddQuoteModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={addQuote}
      />
    </div>
  );
}
