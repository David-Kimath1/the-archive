import { Search, LayoutGrid, List, X } from 'lucide-react';
import './LibraryToolbar.css';

const STATUS_TABS = [
  { value: 'all', label: 'All' },
  { value: 'want', label: 'Want to Read' },
  { value: 'reading', label: 'Reading' },
  { value: 'finished', label: 'Finished' },
  { value: 'dropped', label: 'Dropped' },
];

export default function LibraryToolbar({
  search, onSearch,
  status, onStatus,
  genre, onGenre,
  rating, onRating,
  sort, onSort,
  view, onView,
  genres,
  hasFilters, onClear,
}) {
  return (
    <div className="lib-toolbar">
      <div className="lib-toolbar__row lib-toolbar__row--top">
        <div className="lib-search">
          <Search size={16} strokeWidth={1.75} aria-hidden="true" />
          <input
            type="search"
            placeholder="Search by title or author"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            aria-label="Search books"
          />
          {search && (
            <button
              type="button"
              className="lib-search__clear"
              onClick={() => onSearch('')}
              aria-label="Clear search"
            >
              <X size={14} strokeWidth={2} />
            </button>
          )}
        </div>

        <div className="lib-view" role="group" aria-label="View mode">
          <button
            type="button"
            className={`lib-view__btn${view === 'grid' ? ' is-active' : ''}`}
            onClick={() => onView('grid')}
            aria-label="Grid view"
            aria-pressed={view === 'grid'}
          >
            <LayoutGrid size={18} strokeWidth={1.75} />
          </button>
          <button
            type="button"
            className={`lib-view__btn${view === 'list' ? ' is-active' : ''}`}
            onClick={() => onView('list')}
            aria-label="List view"
            aria-pressed={view === 'list'}
          >
            <List size={18} strokeWidth={1.75} />
          </button>
        </div>
      </div>

      <div className="lib-toolbar__row lib-toolbar__row--pills">
        <div className="lib-pills">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              className={`lib-pill${status === tab.value ? ' is-active' : ''}`}
              onClick={() => onStatus(tab.value)}
              aria-pressed={status === tab.value}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="lib-toolbar__row lib-toolbar__row--controls">
        <label className="lib-select">
          <span className="sr-only">Filter by genre</span>
          <select value={genre} onChange={(e) => onGenre(e.target.value)}>
            <option value="all">All Genres</option>
            {genres.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </label>

        <label className="lib-select">
          <span className="sr-only">Filter by rating</span>
          <select value={rating} onChange={(e) => onRating(e.target.value)}>
            <option value="all">Any Rating</option>
            <option value="3">3+ Stars</option>
            <option value="4">4+ Stars</option>
            <option value="5">5 Stars</option>
          </select>
        </label>

        <label className="lib-select">
          <span className="sr-only">Sort books</span>
          <select value={sort} onChange={(e) => onSort(e.target.value)}>
            <option value="recent">Recently Added</option>
            <option value="date-finished-desc">Recently Finished</option>
            <option value="title-asc">Title (A–Z)</option>
            <option value="author-asc">Author (A–Z)</option>
            <option value="rating-desc">Highest Rated</option>
            <option value="pages-desc">Longest</option>
          </select>
        </label>

        {hasFilters && (
          <button type="button" className="lib-clear" onClick={onClear}>
            <X size={14} strokeWidth={2} aria-hidden="true" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
