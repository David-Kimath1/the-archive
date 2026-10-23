/**
 * Mock book library — initial data only.
 * Live state lives in BooksContext; this file seeds it.
 */

export const initialBooks = [
  // ... (the existing 12 books remain unchanged)
];

export const getBooksByStatus = (books, status) =>
  books.filter((book) => book.status === status);

export const getCurrentlyReading = (books) =>
  getBooksByStatus(books, 'reading');

export const getRecentlyFinished = (books, limit = 4) =>
  getBooksByStatus(books, 'finished')
    .slice()
    .sort((a, b) => new Date(b.dateFinished) - new Date(a.dateFinished))
    .slice(0, limit);

export const getFinishedThisYear = (books) => {
  const year = new Date().getFullYear();
  return getBooksByStatus(books, 'finished').filter(
    (b) => b.dateFinished && new Date(b.dateFinished).getFullYear() === year
  ).length;
};

export const findBook = (books, id) => books.find((b) => b.id === id);
