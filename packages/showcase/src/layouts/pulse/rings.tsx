import { RINGS } from './data';

/** Three concentric activity rings, drawn as SVG arcs. */
export function ActivityRings({ size = 176, className }: { size?: number; className?: string }) {
  const stroke = size * 0.1;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={RINGS.map((r) => `${r.label} ${r.value} of ${r.goal} ${r.unit}`).join(', ')} className={className}>
      {RINGS.map((ring, i) => {
        const r = size / 2 - stroke / 2 - i * (stroke + 3);
        const c = 2 * Math.PI * r;
        return (
          <g key={ring.id} transform={`rotate(-90 ${size / 2} ${size / 2})`} fill="none" strokeWidth={stroke} strokeLinecap="round">
            <circle cx={size / 2} cy={size / 2} r={r} stroke={`hsl(var(${ring.hueVar}) / 0.18)`} />
            <circle cx={size / 2} cy={size / 2} r={r} stroke={`hsl(var(${ring.hueVar}))`} strokeDasharray={c} strokeDashoffset={c * (1 - Math.min(1, ring.value / ring.goal))} />
          </g>
        );
      })}
    </svg>
  );
}
