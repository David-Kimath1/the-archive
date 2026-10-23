import {
  CheckCircle2,
  BookOpen,
  Bookmark,
  BookX,
  BookMarked,
  Flame,
} from 'lucide-react';
import StatCard from '../ui/StatCard.jsx';
import { useBooks } from '../../context/BooksContext.jsx';
import { getDashboardStats } from '../../utils/stats.js';
import './StatsOverview.css';

export default function StatsOverview() {
  const { books } = useBooks();
  const stats = getDashboardStats(books);

  return (
    <div className="stats-overview">
      <StatCard icon={CheckCircle2} label="Finished" value={stats.finished} hint="All time" />
      <StatCard icon={BookOpen} label="Currently Reading" value={stats.reading} hint="In progress" />
      <StatCard icon={Bookmark} label="Want to Read" value={stats.want} hint="Up next" />
      <StatCard icon={BookX} label="Dropped" value={stats.dropped} hint="Not for me" />
      <StatCard
        icon={BookMarked}
        label="Pages Read"
        value={stats.pagesRead.toLocaleString()}
        hint={`${stats.weeklyPages} this week`}
      />
      <StatCard icon={Flame} label="Reading Streak" value={`${stats.streak} days`} hint="Keep it going" />
    </div>
  );
}
