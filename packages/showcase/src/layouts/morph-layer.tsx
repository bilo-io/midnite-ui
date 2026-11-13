import { useLayoutEffect, useRef } from 'react';

import { GEOMETRY, SLOT_COUNT, clipPath, fill, resolvePair } from './morph-geometry';
import type { Variant } from './index';

// The shapes under a layout. Each slot is a full-frame div that is clipped to
// its rect with `clip-path: inset(... round r)`, so a slot's position, size and
// corner radius all interpolate as paint only: no layout, no scaled content.
// When the layout changes, every slot animates (Web Animations API) from the
// old layout's rect to the new one's, a few ms apart, then the whole layer
// fades away. The old UI cross-fades out over the first ~450ms while the new
// one fades in from ~350ms, so real content is on screen the whole way.

export const MORPH_MS = 900;
export const MORPH_STAGGER_MS = 26;
const TOTAL_MS = 1400;
const EASE = 'cubic-bezier(0.65, 0, 0.35, 1)';

export function MorphLayer({
  id,
  variant,
  trail = 0,
  animate = true,
}: {
  id: string;
  variant: Variant;
  /** Start this long after the swap, so a second frame can trail the first. */
  trail?: number;
  animate?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const slots = useRef<Array<HTMLDivElement | null>>([]);
  const last = useRef<string | null>(null);
  const fade = useRef<Animation | null>(null);

  useLayoutEffect(() => {
    const prevId = last.current;
    last.current = id;
    const layer = root.current;
    if (!layer || prevId === null || prevId === id) return;
    const pairs = resolvePair(GEOMETRY[prevId]![variant], GEOMETRY[id]![variant]);
    pairs.forEach(({ from, to }, i) => {
      const el = slots.current[i];
      if (!el) return;
      el.style.clipPath = clipPath(to);
      el.style.backgroundColor = fill(to);
      el.style.opacity = String(to.opacity);
      if (!animate || typeof el.animate !== 'function') return;
      el.animate(
        [
          { clipPath: clipPath(from), backgroundColor: fill(from), opacity: from.opacity },
          { clipPath: clipPath(to), backgroundColor: fill(to), opacity: to.opacity },
        ],
        { duration: MORPH_MS, delay: trail + i * MORPH_STAGGER_MS, easing: EASE, fill: 'backwards' },
      );
    });
    if (animate && typeof layer.animate === 'function') {
      fade.current?.cancel();
      fade.current = layer.animate(
        [
          { opacity: 0, offset: 0 },
          { opacity: 1, offset: 0.08 },
          { opacity: 1, offset: 0.72 },
          { opacity: 0, offset: 1 },
        ],
        { duration: TOTAL_MS, delay: trail, easing: 'linear', fill: 'both' },
      );
    }
  }, [id, variant, trail, animate]);

  const initial = GEOMETRY[id]![variant];
  return (
    <div ref={root} aria-hidden data-morph className="pointer-events-none absolute inset-0 opacity-0"
      style={{ filter: 'drop-shadow(0 0 1px hsl(var(--foreground) / 0.5)) drop-shadow(0 8px 14px hsl(var(--foreground) / 0.12))' }}>
      {Array.from({ length: SLOT_COUNT }, (_, i) => {
        const slot = initial[i];
        return (
          <div
            key={i}
            ref={(el) => {
              slots.current[i] = el;
            }}
            data-slot={i}
            className="absolute inset-0"
            style={
              slot
                ? { clipPath: clipPath(slot), backgroundColor: fill(slot) }
                : { clipPath: 'inset(50% 50% 50% 50%)', opacity: 0 }
            }
          />
        );
      })}
    </div>
  );
}
