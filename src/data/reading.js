/**
 * Per-user reading data: weekly activity, favourite genres,
 * and book recommendations. Kept separate from book records.
 */

export const weeklyActivity = [
  { day: 'Mon', pages: 24 },
  { day: 'Tue', pages: 41 },
  { day: 'Wed', pages: 12 },
  { day: 'Thu', pages: 58 },
  { day: 'Fri', pages: 0 },
  { day: 'Sat', pages: 67 },
  { day: 'Sun', pages: 33, today: true },
];

export const favouriteGenres = [
  { name: 'Fantasy', count: 4 },
  { name: 'Literary Fiction', count: 1 },
  { name: 'Science Fiction', count: 2 },
  { name: 'Non-fiction', count: 1 },
  { name: 'Memoir', count: 1 },
  { name: 'Mystery', count: 0 },
];

export const readingStreak = 12;

export const recommendedBooks = [
  {
    id: 'babel',
    title: 'Babel',
    author: 'R.F. Kuang',
    genre: 'Fantasy',
    pages: 560,
    colorA: '#203a52',
    colorB: '#0b1c2c',
    coverUrl: 'https://covers3.booksamillion.com/covers/bam/6/26/315/339/6263153393_b.jpg',
  },
  {
    id: 'tomorrow-x3',
    title: 'Tomorrow, and Tomorrow, and Tomorrow',
    author: 'Gabrielle Zevin',
    genre: 'Literary Fiction',
    pages: 416,
    colorA: '#1d3549',
    colorB: '#0a1a28',
    coverUrl: 'https://img1.od-cdn.com/ImageType-400/0111-1/{17FF1132-F408-4ADE-AF88-910809DA47EE}IMG400.JPG',
  },
  {
    id: 'three-body',
    title: 'The Three-Body Problem',
    author: 'Cixin Liu',
    genre: 'Science Fiction',
    pages: 400,
    colorA: '#254458',
    colorB: '#0d1e2e',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780765377067-L.jpg',
  },
];
