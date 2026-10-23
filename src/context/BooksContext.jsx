import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { initialBooks } from '../data/books.js';

const STORAGE_KEY = 'the-archive:books:v1';
const BooksContext = createContext(null);

function loadInitialBooks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    /* ignore corrupt state */
  }
  return initialBooks;
}

export function BooksProvider({ children }) {
  const [books, setBooks] = useState(loadInitialBooks);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    } catch {
      /* ignore storage quota errors */
    }
  }, [books]);

  const value = useMemo(() => {
    const updateBook = (id, patch) => {
      setBooks((prev) =>
        prev.map((b) =>
          b.id === id ? { ...b, ...(typeof patch === 'function' ? patch(b) : patch) } : b
        )
      );
    };

    const deleteBook = (id) => {
      setBooks((prev) => prev.filter((b) => b.id !== id));
    };

    const addBook = (book) => {
      setBooks((prev) => [book, ...prev]);
    };

    const toggleFavorite = (id) => {
      setBooks((prev) =>
        prev.map((b) => (b.id === id ? { ...b, isFavorite: !b.isFavorite } : b))
      );
    };

    return { books, updateBook, deleteBook, addBook, toggleFavorite };
  }, [books]);

  return <BooksContext.Provider value={value}>{children}</BooksContext.Provider>;
}

export function useBooks() {
  const ctx = useContext(BooksContext);
  if (!ctx) {
    throw new Error('useBooks must be used within <BooksProvider>');
  }
  return ctx;
}
