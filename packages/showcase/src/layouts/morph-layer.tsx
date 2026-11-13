import { useLayoutEffect, useRef } from 'react';

import { GEOMETRY, SLOT_COUNT, TONES, clipPath, resolvePair } from './morph-geometry';
import type { Variant } from './index';

// The shapes under a layout. Each slot is a full-frame div that is clipped to
// its rect with `clip-path: inset(... round r)`, so a slot's position, size and
// corner radius all interpolate as paint only: no layout, no scaled content.
// When the layout changes, every slot animates (Web Animations API) from the
// old layout's rect to the new one's, a few ms apart, then the whole layer
// fades away as the real UI grows in over it.

export const MORPH_MS = 900;
export const MORPH_STAGGER_MS = 26;
const TOTAL_MS = 1500;
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
      el.style.backgroundColor = TONES[to.tone];
      el.style.opacity = String(to.opacity);
      if (!animate || typeof el.animate !== 'function') return;
      el.animate(
        [
          { clipPath: clipPath(from), backgroundColor: TONES[from.tone], opacity: from.opacity },
          { clipPath: clipPath(to), backgroundColor: TONES[to.tone], opacity: to.opacity },
        ],
        { duration: MORPH_MS, delay: trail + i * MORPH_STAGGER_MS, easing: EASE, fill: 'backwards' },
      );
    });
    if (animate && typeof layer.animate === 'function') {
      layer.animate(
        [
          { opacity: 0, offset: 0 },
          { opacity: 1, offset: 0.08 },
          { opacity: 1, offset: 0.7 },
          { opacity: 0, offset: 1 },
        ],
        { duration: TOTAL_MS, delay: trail, easing: 'linear', fill: 'both' },
      );
    }
  }, [id, variant, trail, animate]);

  const initial = GEOMETRY[id]![variant];
  return (
    <div ref={root} aria-hidden data-morph className="pointer-events-none absolute inset-0 opacity-0">
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
                ? { clipPath: clipPath(slot), backgroundColor: TONES[slot.tone] }
                : { clipPath: 'inset(50% 50% 50% 50%)', opacity: 0 }
            }
          />
        );
      })}
    </div>
  );
}
