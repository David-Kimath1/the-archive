import { weeklyActivity, readingStreak } from '../data/reading.js';

export function getDashboardStats(books) {
  const finished = books.filter((b) => b.status === 'finished').length;
  const reading = books.filter((b) => b.status === 'reading').length;
  const want = books.filter((b) => b.status === 'want').length;
  const dropped = books.filter((b) => b.status === 'dropped').length;

  const pagesRead = books.reduce((sum, b) => sum + b.pagesRead, 0);
  const weeklyPages = weeklyActivity.reduce((sum, d) => sum + d.pages, 0);

  return {
    finished,
    reading,
    want,
    dropped,
    pagesRead,
    weeklyPages,
    streak: readingStreak,
  };
}
