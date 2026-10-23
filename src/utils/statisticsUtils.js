/**
 * Compute aggregate reading statistics from a book list.
 * Pure function — no React, no side effects.
 */

export function getStatistics(books) {
  const finished = books.filter((b) => b.status === 'finished');
  const dropped = books.filter((b) => b.status === 'dropped');
  const startedAndBeyond = books.filter((b) => b.status !== 'want');

  const totalBooksRead = finished.length;
  const totalPagesRead = books.reduce((sum, b) => sum + (b.pagesRead || 0), 0);

  const ratedBooks = finished.filter((b) => b.rating > 0);
  const averageRating =
    ratedBooks.length > 0
      ? ratedBooks.reduce((sum, b) => sum + b.rating, 0) / ratedBooks.length
      : 0;

  const averagePagesPerBook =
    totalBooksRead > 0
      ? Math.round(finished.reduce((sum, b) => sum + b.pages, 0) / totalBooksRead)
      : 0;

  const completionRate =
    startedAndBeyond.length > 0
      ? Math.round(
          (finished.length / (finished.length + dropped.length)) * 100
        )
      : 0;

  return {
    totalBooksRead,
    totalPagesRead,
    averageRating,
    averagePagesPerBook,
    completionRate,
    monthlyCounts: getBooksByMonth(finished),
    topAuthors: getTopAuthors(finished, 5),
    ratingDistribution: getRatingDistribution(finished),
    history: sortHistory(finished),
  };
}

function getBooksByMonth(finished) {
  const months = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      label: d.toLocaleDateString('en-US', { month: 'short' }),
      count: 0,
    });
  }
  const monthMap = new Map(months.map((m) => [m.key, m]));
  finished.forEach((b) => {
    if (!b.dateFinished) return;
    const d = new Date(b.dateFinished);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const bucket = monthMap.get(key);
    if (bucket) bucket.count += 1;
  });
  return months;
}

function getTopAuthors(finished, limit) {
  const counts = {};
  finished.forEach((b) => {
    counts[b.author] = (counts[b.author] || 0) + 1;
  });
  return Object.entries(counts)
    .map(([author, count]) => ({ author, count }))
    .sort((a, b) => b.count - a.count || a.author.localeCompare(b.author))
    .slice(0, limit);
}

function getRatingDistribution(finished) {
  return [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: finished.filter((b) => b.rating === rating).length,
  }));
}

function sortHistory(finished) {
  return [...finished].sort(
    (a, b) => new Date(b.dateFinished) - new Date(a.dateFinished)
  );
}
