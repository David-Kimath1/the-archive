import SectionHeading from '../ui/SectionHeading.jsx';
import { favouriteGenres } from '../../data/reading.js';
import './FavouriteGenresSection.css';

export default function FavouriteGenresSection() {
  const total = favouriteGenres.reduce((s, g) => s + g.count, 0) || 1;
  const sorted = [...favouriteGenres].sort((a, b) => b.count - a.count);
  const top = sorted.slice(0, 5);

  return (
    <section className="dash-section">
      <SectionHeading title="Favourite Genres" />
      <div className="card genres">
        {top.map((g) => {
          const pct = Math.round((g.count / total) * 100);
          return (
            <div className="genres__row" key={g.name}>
              <div className="genres__head">
                <span className="genres__name">{g.name}</span>
                <span className="genres__pct">{pct}%</span>
              </div>
              <div className="genres__track">
                <div
                  className="genres__fill"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
