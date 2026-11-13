import type { Place } from './data';

// A drawn city: no tiles, no network. The fills are theme tokens, so the map
// follows light and dark with the rest of the page.
export function MapCanvas({
  places,
  selected,
  onSelect,
  route,
  className,
}: {
  places: Place[];
  selected: string | null;
  onSelect: (id: string) => void;
  route?: boolean;
  className?: string;
}) {
  const target = places.find((p) => p.id === selected);
  return (
    <svg viewBox="0 0 800 560" preserveAspectRatio="xMidYMid slice" role="group" aria-label="Map" className={className}>
      <rect width="800" height="560" className="fill-muted" />
      <path d="M0 470 C 140 420, 230 520, 380 470 S 640 380, 800 430 V560 H0Z" fill="hsl(var(--primary) / 0.22)" />
      <ellipse cx="660" cy="90" rx="90" ry="46" fill="hsl(var(--primary) / 0.22)" />
      {[[120, 360, 150, 110], [430, 60, 120, 80], [560, 280, 110, 100]].map(([x, y, w, h]) => (
        <rect key={`${x}${y}`} x={x} y={y} width={w} height={h} rx="22" fill="hsl(var(--success) / 0.22)" />
      ))}
      <g className="stroke-background" fill="none" strokeLinecap="round">
        {[80, 190, 300, 410].map((y) => <path key={y} d={`M0 ${y} H800`} strokeWidth="5" />)}
        {[110, 260, 420, 580, 720].map((x) => <path key={x} d={`M${x} 0 V470`} strokeWidth="5" />)}
        <path d="M0 140 L800 330" strokeWidth="12" />
        <path d="M250 0 L420 560" strokeWidth="9" />
      </g>
      {route && target ? (
        <path
          d={`M285 205 L${target.x} ${target.y}`}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="1 11"
        />
      ) : null}
      <circle cx="285" cy="205" r="9" fill="hsl(var(--primary))" stroke="hsl(var(--background))" strokeWidth="4" />
      {places.map((p) => {
        const on = p.id === selected;
        return (
          <g
            key={p.id}
            role="button"
            tabIndex={0}
            aria-label={`${p.name}, ${p.kind}`}
            aria-pressed={on}
            onClick={() => onSelect(p.id)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(p.id)}
            className="cursor-pointer outline-none [&:focus-visible>circle]:stroke-ring"
            transform={`translate(${p.x} ${p.y}) scale(${on ? 1.3 : 1})`}
          >
            <circle r="17" fill={on ? 'hsl(var(--destructive))' : 'hsl(var(--card))'} stroke="hsl(var(--border))" strokeWidth="3" />
            <text textAnchor="middle" dy="5" fontSize="15" fontWeight="700" fill={on ? 'hsl(var(--destructive-foreground))' : 'hsl(var(--foreground))'}>{p.kind[0]}</text>
          </g>
        );
      })}
    </svg>
  );
}
