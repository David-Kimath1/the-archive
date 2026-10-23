import { Flame } from 'lucide-react';
import StatsOverview from '../../components/dashboard/StatsOverview.jsx';
import CurrentlyReadingSection from '../../components/dashboard/CurrentlyReadingSection.jsx';
import ReadingActivitySection from '../../components/dashboard/ReadingActivitySection.jsx';
import ReadingGoalsSection from '../../components/dashboard/ReadingGoalsSection.jsx';
import FavouriteGenresSection from '../../components/dashboard/FavouriteGenresSection.jsx';
import RecentlyFinishedSection from '../../components/dashboard/RecentlyFinishedSection.jsx';
import RecommendedSection from '../../components/dashboard/RecommendedSection.jsx';
import QuoteWidget from '../../components/dashboard/QuoteWidget.jsx';
import { getGreeting, getFormattedDate } from '../../utils/greeting.js';
import { readingStreak } from '../../data/reading.js';
import { useProfile } from '../../context/ProfileContext.jsx';
import './Dashboard.css';

export default function Dashboard() {
  const { profile } = useProfile();

  return (
    <div className="container dashboard">
      <header className="dashboard__greeting">
        <div>
          <h1 className="dashboard__title">{getGreeting()}, {profile.name}</h1>
          <p className="dashboard__subtitle">{getFormattedDate()}</p>
        </div>
        <span className="dashboard__streak">
          <Flame size={16} strokeWidth={1.75} aria-hidden="true" />
          {readingStreak}-day streak
        </span>
      </header>

      <StatsOverview />

      <QuoteWidget />

      <div className="dashboard__grid dashboard__grid--2-1">
        <CurrentlyReadingSection />
        <ReadingGoalsSection />
      </div>

      <div className="dashboard__grid dashboard__grid--2-1">
        <ReadingActivitySection />
        <FavouriteGenresSection />
      </div>

      <div className="dashboard__grid dashboard__grid--1-1">
        <RecentlyFinishedSection />
        <RecommendedSection />
      </div>
    </div>
  );
}
