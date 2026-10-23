import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useBooks } from './BooksContext.jsx';

const STORAGE_KEY = 'the-archive:goals:v1';
const GoalsContext = createContext(null);

const DEFAULT_GOALS = {
  annualBooks: 24,
  monthlyBooks: 2,
  annualPages: 10000,
  monthlyPages: 800,
};

function loadGoals() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_GOALS, ...parsed };
    }
  } catch {
    /* ignore */
  }
  return DEFAULT_GOALS;
}

export function GoalsProvider({ children }) {
  const { books } = useBooks();
  const [targets, setTargets] = useState(loadGoals);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(targets));
    } catch {
      /* ignore */
    }
  }, [targets]);

  const value = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-11

    const finishedBooks = books.filter((b) => b.status === 'finished' && b.dateFinished);

    // Books
    const finishedThisYear = finishedBooks.filter(
      (b) => new Date(b.dateFinished).getFullYear() === currentYear
    );
    const finishedThisMonth = finishedThisYear.filter(
      (b) => new Date(b.dateFinished).getMonth() === currentMonth
    );

    // Pages
    // Note: Using pagesRead of finished books for total pages.
    // If a book was finished this year, we count its pages.
    const pagesThisYear = finishedThisYear.reduce((sum, b) => sum + (b.pages || 0), 0);
    const pagesThisMonth = finishedThisMonth.reduce((sum, b) => sum + (b.pages || 0), 0);

    const updateGoals = (newTargets) => {
      setTargets((prev) => ({ ...prev, ...newTargets }));
    };

    return {
      targets,
      updateGoals,
      progress: {
        annualBooks: finishedThisYear.length,
        monthlyBooks: finishedThisMonth.length,
        annualPages: pagesThisYear,
        monthlyPages: pagesThisMonth,
      },
    };
  }, [books, targets]);

  return <GoalsContext.Provider value={value}>{children}</GoalsContext.Provider>;
}

export function useGoals() {
  const ctx = useContext(GoalsContext);
  if (!ctx) {
    throw new Error('useGoals must be used within <GoalsProvider>');
  }
  return ctx;
}
