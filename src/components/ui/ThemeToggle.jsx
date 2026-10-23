import { useId } from 'react';
import './ThemeToggle.css';

export default function ThemeToggle({ theme, onChange }) {
  const id = useId().replaceAll(':', '');
  const isLight = theme === 'light';

  return (
    <div className="archive-theme-toggle">
      <input
        className="archive-theme-toggle__input"
        type="checkbox"
        role="switch"
        checked={isLight}
        onChange={(event) => onChange(event.target.checked ? 'light' : 'dark')}
        aria-label="Switch between light and dark mode"
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 292 142"
        className="archive-theme-toggle__graphic"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`${id}-active`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--color-accent)" />
            <stop offset="52%" stopColor="var(--color-accent-mid)" />
            <stop offset="100%" stopColor="var(--color-accent-secondary)" />
          </linearGradient>
          <filter id={`${id}-goo`}>
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 18 -7"
              result="goo"
            />
          </filter>
        </defs>
        <path
          d="M71 142C31.7878 142 0 110.212 0 71C0 31.7878 31.7878 0 71 0C110.212 0 119 30 146 30C173 30 182 0 221 0C260 0 292 31.7878 292 71C292 110.212 260.212 142 221 142C181.788 142 173 112 146 112C119 112 110.212 142 71 142Z"
          className="archive-theme-toggle__background"
          style={{ '--active-fill': `url(#${id}-active)` }}
        />
        <rect
          rx="6"
          height="64"
          width="12"
          y="39"
          x="64"
          className="archive-theme-toggle__icon archive-theme-toggle__icon--on"
        />
        <path
          d="M221 91C232.046 91 241 82.0457 241 71C241 59.9543 232.046 51 221 51C209.954 51 201 59.9543 201 71C201 82.0457 209.954 91 221 91ZM221 103C238.673 103 253 88.6731 253 71C253 53.3269 238.673 39 221 39C203.327 39 189 53.3269 189 71C189 88.6731 203.327 103 221 103Z"
          fillRule="evenodd"
          className="archive-theme-toggle__icon archive-theme-toggle__icon--off"
        />
        <g filter={`url(#${id}-goo)`}>
          <rect
            fill="var(--color-text-primary)"
            rx="29"
            height="58"
            width="116"
            y="42"
            x="13"
            className="archive-theme-toggle__center"
          />
          <rect
            fill="var(--color-text-primary)"
            rx="58"
            height="114"
            width="114"
            y="14"
            x="14"
            className="archive-theme-toggle__circle archive-theme-toggle__circle--left"
          />
          <rect
            fill="var(--color-text-primary)"
            rx="58"
            height="114"
            width="114"
            y="14"
            x="164"
            className="archive-theme-toggle__circle archive-theme-toggle__circle--right"
          />
        </g>
      </svg>
    </div>
  );
}
