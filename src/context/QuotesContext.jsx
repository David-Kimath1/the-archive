import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { initialQuotes } from '../data/quotes.js';

const STORAGE_KEY = 'the-archive:quotes:v1';
const QuotesContext = createContext(null);

function loadInitialQuotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    /* ignore corrupt state */
  }
  return initialQuotes;
}

export function QuotesProvider({ children }) {
  const [quotes, setQuotes] = useState(loadInitialQuotes);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
    } catch {
      /* ignore quota errors */
    }
  }, [quotes]);

  const value = useMemo(() => {
    const addQuote = (quote) => {
      setQuotes((prev) => [{ ...quote, id: crypto.randomUUID() }, ...prev]);
    };

    const deleteQuote = (id) => {
      setQuotes((prev) => prev.filter((q) => q.id !== id));
    };

    // Deterministic Daily Quote: changes every 24 hours
    const dailyQuote = quotes.length > 0
      ? quotes[Math.floor(Date.now() / 86400000) % quotes.length]
      : null;

    return { quotes, addQuote, deleteQuote, dailyQuote };
  }, [quotes]);

  return <QuotesContext.Provider value={value}>{children}</QuotesContext.Provider>;
}

export function useQuotes() {
  const ctx = useContext(QuotesContext);
  if (!ctx) {
    throw new Error('useQuotes must be used within <QuotesProvider>');
  }
  return ctx;
}
