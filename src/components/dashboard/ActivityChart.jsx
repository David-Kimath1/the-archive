import { useId, useState } from 'react';
import './ActivityChart.css';

export default function ActivityChart({ data }) {
  const gradientId = useId();
  const [activeIndex, setActiveIndex] = useState(null);
  const width = 400;
  const height = 140;
  const padding = 12;
  const maxPages = Math.max(...data.map((entry) => entry.pages), 1);
  const points = data.map((item, index) => {
    const x = data.length === 1 ? width / 2 : (index / (data.length - 1)) * width;
    const y = height - padding - (item.pages / maxPages) * (height - padding * 2);
    return { x, y, ...item };
  });

  const generatePath = () => {
    if (points.length === 0) return '';
    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];
      const cp1x = curr.x + (next.x - curr.x) / 2;
      const cp1y = curr.y;
      const cp2x = curr.x + (next.x - curr.x) / 2;
      const cp2y = next.y;

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
    }
    return path;
  };

  const linePath = generatePath();
  const fillPath = `${linePath} L ${width} ${height} L 0 ${height} Z`;
  const highestIndex = points.reduce(
    (highest, point, index) => point.pages > points[highest].pages ? index : highest,
    0,
  );
  const focusedPoint = points[activeIndex ?? highestIndex];
  const tooltipX = Math.max(36, Math.min(width - 36, focusedPoint?.x ?? 0));
  const tooltipY = Math.max(18, (focusedPoint?.y ?? 0) - 20);

  const handlePointerMove = (event) => {
    if (points.length === 0) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const chartX = ((event.clientX - bounds.left) / bounds.width) * width;
    const nearestIndex = points.reduce((nearest, point, index) =>
      Math.abs(point.x - chartX) < Math.abs(points[nearest].x - chartX) ? index : nearest, 0);
    setActiveIndex(nearestIndex);
  };

  return (
    <div className="area-chart">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="area-chart__svg"
        role="img"
        tabIndex={points.length > 0 ? 0 : -1}
        aria-label={
          focusedPoint
            ? `Reading activity chart. ${focusedPoint.day}: ${focusedPoint.pages} pages. Use the left and right arrow keys to inspect other days.`
            : 'Reading activity chart. No reading activity to show.'
        }
        onPointerMove={handlePointerMove}
        onPointerLeave={() => setActiveIndex(null)}
        onFocus={() => setActiveIndex(highestIndex)}
        onBlur={() => setActiveIndex(null)}
        onKeyDown={(event) => {
          if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
          event.preventDefault();
          setActiveIndex((current) => {
            const index = current ?? highestIndex;
            const direction = event.key === 'ArrowRight' ? 1 : -1;
            return Math.max(0, Math.min(points.length - 1, index + direction));
          });
        }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.92" />
            <stop offset="55%" stopColor="var(--color-accent-mid)" stopOpacity="0.82" />
            <stop offset="100%" stopColor="var(--color-accent-secondary)" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id={`${gradientId}-fill`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.26" />
            <stop offset="100%" stopColor="var(--color-accent-secondary)" stopOpacity="0" />
          </linearGradient>
        </defs>

        <path d={fillPath} fill={`url(#${gradientId}-fill)`} />
        <path
          d={linePath}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="2.5"
          strokeLinecap="round"
          className="area-chart__line"
        />
        {activeIndex !== null && focusedPoint && (
          <>
            <line
              x1={focusedPoint.x}
              x2={focusedPoint.x}
              y1={padding}
              y2={height}
              className="area-chart__crosshair"
            />
            <circle cx={focusedPoint.x} cy={focusedPoint.y} r="9" className="area-chart__halo" />
            <circle cx={focusedPoint.x} cy={focusedPoint.y} r="4" className="area-chart__active-point" />
            <g className="area-chart__tooltip" transform={`translate(${tooltipX}, ${tooltipY})`}>
              <rect x="-36" y="-15" width="72" height="27" rx="7" />
              <text x="0" y="-3" textAnchor="middle">{focusedPoint.pages} pages</text>
              <text x="0" y="7" textAnchor="middle" className="area-chart__tooltip-day">{focusedPoint.day}</text>
            </g>
          </>
        )}
      </svg>

      <div className="area-chart__labels">
        {data.map((d, i) => (
          <span key={i} className="area-chart__label">{d.day}</span>
        ))}
      </div>
    </div>
  );
}
