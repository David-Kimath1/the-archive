import { useEffect, useRef, useState } from 'react';
import { MoreVertical } from 'lucide-react';
import './CardMenu.css';

export default function CardMenu({ actions = [] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const handleKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  return (
    <div className="card-menu" ref={ref}>
      <button
        type="button"
        className="card-menu__trigger"
        onClick={() => setOpen((v) => !v)}
        aria-label="Book actions"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <MoreVertical size={16} strokeWidth={2} />
      </button>

      {open && (
        <div className="card-menu__dropdown" role="menu">
          {actions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <button
                key={idx}
                type="button"
                role="menuitem"
                className={`card-menu__item${action.danger ? ' is-danger' : ''}`}
                onClick={() => {
                  setOpen(false);
                  action.onClick();
                }}
              >
                {Icon && <Icon size={14} strokeWidth={2} aria-hidden="true" />}
                <span>{action.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
