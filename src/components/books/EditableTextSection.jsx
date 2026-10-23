import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import './EditableTextSection.css';

export default function EditableTextSection({
  title,
  subtitle,
  value,
  placeholder,
  onSave,
  rows = 4,
}) {
  const [draft, setDraft] = useState(value ?? '');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setDraft(value ?? '');
  }, [value]);

  const handleBlur = () => {
    if (draft === (value ?? '')) return;
    onSave(draft);
    setSaved(true);
    const t = setTimeout(() => setSaved(false), 1800);
    return () => clearTimeout(t);
  };

  return (
    <section className="ets">
      <header className="ets__head">
        <div>
          <h3 className="ets__title">{title}</h3>
          {subtitle && <p className="ets__subtitle">{subtitle}</p>}
        </div>
        {saved && (
          <span className="ets__saved">
            <Check size={14} strokeWidth={2} aria-hidden="true" />
            Saved
          </span>
        )}
      </header>
      <textarea
        className="ets__textarea"
        rows={rows}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={handleBlur}
        placeholder={placeholder}
        aria-label={title}
      />
    </section>
  );
}
