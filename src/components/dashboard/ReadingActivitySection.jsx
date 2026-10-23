import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading.jsx';
import ActivityChart from './ActivityChart.jsx';
import { weeklyActivity } from '../../data/reading.js';
import './ReadingActivitySection.css';

export default function ReadingActivitySection() {
  const [range, setRange] = useState('7d');
  const totalPages = weeklyActivity.reduce((sum, d) => sum + d.pages, 0);
  const percentChange = 12.5;

  return (
    <section className="dash-section">
      <SectionHeading title="Reading Activity" />
      <div className="card activity-card">

        <div className="activity-card__top">
          <div className="activity-toggle">
            {['7d', '12d', '30d'].map(r => (
              <button
                key={r}
                type="button"
                className={`activity-toggle__btn ${range === r ? 'is-active' : ''}`}
                onClick={() => setRange(r)}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="activity-card__stats">
          <span className="activity-card__value">{totalPages.toLocaleString()}</span>
          <span className="activity-card__trend">
            <ArrowUpRight size={14} strokeWidth={2.5} />
            {percentChange}%
          </span>
        </div>
        <p className="activity-card__sub">Pages read {range === '7d' ? 'this week' : 'in the last ' + range}</p>

        <ActivityChart data={weeklyActivity} />

      </div>
    </section>
  );
}
