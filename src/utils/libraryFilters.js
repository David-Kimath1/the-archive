export function getAllGenres(books) {
  return Array.from(new Set(books.map((b) => b.genre))).sort();
}

export function filterBooks(books, { search, status, genre, rating }) {
  return books.filter((book) => {
    if (search) {
      const q = search.toLowerCase();
      const hitTitle = book.title.toLowerCase().includes(q);
      const hitAuthor = book.author.toLowerCase().includes(q);
      if (!hitTitle && !hitAuthor) return false;
    }
    if (status !== 'all' && book.status !== status) return false;
    if (genre !== 'all' && book.genre !== genre) return false;
    if (rating !== 'all') {
      const min = Number(rating);
      if (!book.rating || book.rating < min) return false;
    }
    return true;
  });
}

export function sortBooks(books, sort) {
  const arr = [...books];
  switch (sort) {
    case 'title-asc':
      return arr.sort((a, b) => a.title.localeCompare(b.title));
    case 'author-asc':
      return arr.sort((a, b) => a.author.localeCompare(b.author));
    case 'rating-desc':
      return arr.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    case 'pages-desc':
      return arr.sort((a, b) => b.pages - a.pages);
    case 'date-finished-desc':
      return arr.sort((a, b) => {
        if (!a.dateFinished && !b.dateFinished) return 0;
        if (!a.dateFinished) return 1;
        if (!b.dateFinished) return -1;
        return new Date(b.dateFinished) - new Date(a.dateFinished);
      });
    case 'recent':
    default:
      return arr.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
  }
}
