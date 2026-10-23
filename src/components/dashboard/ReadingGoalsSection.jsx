import { useState } from 'react';
import { Target, CalendarDays, Pencil } from 'lucide-react';
import { useGoals } from '../../context/GoalsContext.jsx';
import SectionHeading from '../ui/SectionHeading.jsx';
import ProgressBar from '../ui/ProgressBar.jsx';
import EditGoalsModal from '../ui/EditGoalsModal.jsx';
import './ReadingGoalsSection.css';

function GoalRow({ label, current, target, icon: Icon }) {
  const pct = target > 0 ? Math.round((current / target) * 100) : 0;
  return (
    <div className="goals__row">
      <div className="goals__head">
        <span className="goals__icon">
          <Icon size={16} strokeWidth={1.75} aria-hidden="true" />
        </span>
        <div>
          <span className="goals__label">{label}</span>
          <span className="goals__count">
            {current} of {target} {label.includes('Pages') ? 'pages' : 'books'}
          </span>
        </div>
      </div>
      <ProgressBar value={current} max={target} size="lg" label={`${pct}% complete`} />
    </div>
  );
}

export default function ReadingGoalsSection() {
  const { targets, progress, updateGoals } = useGoals();
  const [editOpen, setEditOpen] = useState(false);

  return (
    <section className="dash-section">
      <div className="goals-header">
        <SectionHeading title="Reading Goals" />
        <button
          type="button"
          className="goals-edit-btn"
          onClick={() => setEditOpen(true)}
          aria-label="Edit goals"
        >
          <Pencil size={14} strokeWidth={2} />
        </button>
      </div>

      <div className="card goals">
        <GoalRow
          label="Annual Books"
          current={progress.annualBooks}
          target={targets.annualBooks}
          icon={Target}
        />
        <GoalRow
          label="Monthly Books"
          current={progress.monthlyBooks}
          target={targets.monthlyBooks}
          icon={CalendarDays}
        />
        {/* Optional: You can add Pages rows here if you want them on the dashboard too */}
      </div>

      <EditGoalsModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        currentGoals={targets}
        onSave={updateGoals}
      />
    </section>
  );
}
