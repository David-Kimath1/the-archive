import { useState } from 'react';
import {
  BookOpen,
  BookMarked,
  Star,
  TrendingUp,
  Award,
  Target,
  CalendarDays,
  Pencil,
} from 'lucide-react';
import { useBooks } from '../../context/BooksContext.jsx';
import { useGoals } from '../../context/GoalsContext.jsx';
import { getStatistics } from '../../utils/statisticsUtils.js';
import StatCard from '../../components/ui/StatCard.jsx';
import ProgressBar from '../../components/ui/ProgressBar.jsx';
import BooksByMonthChart from '../../components/statistics/BooksByMonthChart.jsx';
import AuthorRanking from '../../components/statistics/AuthorRanking.jsx';
import EditGoalsModal from '../../components/ui/EditGoalsModal.jsx';
import './Statistics.css';

function GoalRow({ label, current, target, icon: Icon }) {
  const pct = target > 0 ? Math.round((current / target) * 100) : 0;
  return (
    <div className="stats-goal">
      <div className="stats-goal__head">
        <span className="stats-goal__icon">
          <Icon size={14} strokeWidth={1.75} aria-hidden="true" />
        </span>
        <div className="stats-goal__text">
          <span className="stats-goal__label">{label}</span>
          <span className="stats-goal__count">
            {current} of {target} {label.includes('Pages') ? 'pages' : 'books'}
          </span>
        </div>
        <span className="stats-goal__pct">{pct}%</span>
      </div>
      <ProgressBar value={current} max={target} size="lg" />
    </div>
  );
}

export default function Statistics() {
  const { books } = useBooks();
  const { targets, progress, updateGoals } = useGoals();
  const [editGoalsOpen, setEditGoalsOpen] = useState(false);

  const stats = getStatistics(books);

  const maxRatingCount = Math.max(
    ...stats.ratingDistribution.map((r) => r.count),
    1
  );

  return (
    <div className="container stats-page">
      <header className="stats-page__head">
        <h1 className="stats-page__title">Statistics</h1>
        <p className="stats-page__subtitle">Your reading life, at a glance.</p>
      </header>

      <div className="stats-page__hero">
        <StatCard icon={BookOpen} label="Books Read" value={stats.totalBooksRead} hint="All time" />
        <StatCard icon={BookMarked} label="Pages Read" value={stats.totalPagesRead.toLocaleString()} hint="All time" />
        <StatCard icon={Star} label="Average Rating" value={stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '\u2014'} hint={stats.averageRating > 0 ? 'of 5 stars' : 'No ratings yet'} />
        <StatCard icon={TrendingUp} label="Avg Pages" value={stats.averagePagesPerBook} hint="Per finished book" />
        <StatCard icon={Award} label="Completion Rate" value={`${stats.completionRate}%`} hint="Started vs finished" />
      </div>

      <div className="stats-page__grid">
        <section className="stats-section">
          <h2 className="stats-section__title">Books by Month</h2>
          <div className="card">
            <BooksByMonthChart data={stats.monthlyCounts} />
          </div>
        </section>

        <section className="stats-section">
          <h2 className="stats-section__title">Favourite Authors</h2>
          <div className="card">
            <AuthorRanking data={stats.topAuthors} />
          </div>
        </section>
      </div>

      <div className="stats-page__grid">
        <section className="stats-section">
          <div className="stats-section__head">
            <h2 className="stats-section__title">Reading Goals</h2>
            <button type="button" className="stats-edit-btn" onClick={() => setEditGoalsOpen(true)}>
              <Pencil size={14} strokeWidth={2} /> Edit
            </button>
          </div>
          <div className="card stats-goals">
            <GoalRow label="Annual Books" current={progress.annualBooks} target={targets.annualBooks} icon={Target} />
            <GoalRow label="Monthly Books" current={progress.monthlyBooks} target={targets.monthlyBooks} icon={CalendarDays} />
            <GoalRow label="Annual Pages" current={progress.annualPages} target={targets.annualPages} icon={Target} />
            <GoalRow label="Monthly Pages" current={progress.monthlyPages} target={targets.monthlyPages} icon={CalendarDays} />
          </div>
        </section>

        <section className="stats-section">
          <h2 className="stats-section__title">Rating Distribution</h2>
          <div className="card stats-ratings">
            {stats.ratingDistribution.map((r) => {
              const pct = (r.count / maxRatingCount) * 100;
              return (
                <div className="stats-ratings__row" key={r.rating}>
                  <span className="stats-ratings__label">{r.rating} star{r.rating !== 1 ? 's' : ''}</span>
                  <div className="stats-ratings__track">
                    <div className="stats-ratings__fill" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="stats-ratings__count">{r.count}</span>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <section className="stats-section">
        <h2 className="stats-section__title">Reading History</h2>
        <div className="card stats-history">
          {stats.history.length === 0 ? (
            <p className="stats-history__empty">No finished books yet.</p>
          ) : (
            stats.history.map((book) => (
              <div className="stats-history__row" key={book.id}>
                <span className="stats-history__date">
                  {book.dateFinished ? new Date(book.dateFinished).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '\u2014'}
                </span>
                <div className="stats-history__info">
                  <span className="stats-history__title">{book.title}</span>
                  <span className="stats-history__author">{book.author}</span>
                </div>
                <div className="stats-history__meta">
                  {book.rating > 0 && <span className="stats-history__rating">{book.rating}&#9733;</span>}
                  <span className="stats-history__pages">{book.pages} pages</span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <EditGoalsModal
        open={editGoalsOpen}
        onClose={() => setEditGoalsOpen(false)}
        currentGoals={targets}
        onSave={updateGoals}
      />
    </div>
  );
}
