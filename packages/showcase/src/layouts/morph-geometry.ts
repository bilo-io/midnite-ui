// The skeleton of every example layout, as a handful of rectangles.
//
// The hero morphs one layout into the next by animating these shapes, so each
// layout (per variant) is described the same way: up to SLOT_COUNT keyed slots,
// each a rect in percent of the frame's content area, plus a corner radius (px,
// in the frame's own un-scaled pixels) and a surface tone. A slot a layout does
// not use is left out; the morph collapses it to nothing against its nearest
// neighbour instead of popping it.
//
// Slot roles are loose and shared across layouts, so a slot that is the left
// sidebar in one layout becomes whatever sits nearest it in the next:
//   0 canvas · 1 top bar · 2 side · 3-5 main cards · 6 right rail ·
//   7 bottom bar · 8-11 extra cards

export type Tone = 'wash' | 'surface' | 'accent' | 'hero';

export type Slot = {
  x: number;
  y: number;
  w: number;
  h: number;
  /** Corner radius in px. */
  r: number;
  tone: Tone;
};

export type Geometry = ReadonlyArray<Slot | null>;

export const SLOT_COUNT = 12;

export const TONES: Record<Tone, string> = {
  wash: 'hsl(var(--foreground) / 0.045)',
  surface: 'hsl(var(--foreground) / 0.085)',
  accent: 'hsl(var(--primary) / 0.2)',
  hero: 'hsl(var(--primary) / 0.14)',
};

const s = (x: number, y: number, w: number, h: number, tone: Tone = 'surface', r = 14): Slot => ({
  x,
  y,
  w,
  h,
  r,
  tone,
});

const build = (slots: Record<number, Slot>): Geometry =>
  Array.from({ length: SLOT_COUNT }, (_, i) => slots[i] ?? null);

export const GEOMETRY: Record<string, Record<'desktop' | 'mobile', Geometry>> = {
  circle: {
    desktop: build({
      1: s(0, 0, 100, 8, 'surface', 0),
      2: s(2, 13, 17, 50, 'wash'),
      3: s(22, 13, 52, 10),
      4: s(22, 26, 52, 34),
      5: s(22, 63, 52, 34),
      6: s(76, 13, 22, 40),
    }),
    mobile: build({
      1: s(0, 0, 100, 8, 'surface', 0),
      3: s(3, 11, 94, 10),
      4: s(3, 24, 94, 34),
      5: s(3, 61, 94, 30),
      7: s(0, 92, 100, 8, 'surface', 0),
    }),
  },
  snapline: {
    desktop: build({
      2: s(0, 0, 19, 100, 'surface', 0),
      3: s(24, 5, 48, 12, 'wash'),
      4: s(24, 20, 48, 38),
      5: s(24, 61, 48, 38),
      6: s(75, 0, 25, 100, 'surface', 0),
    }),
    mobile: build({
      1: s(0, 0, 100, 7, 'wash', 0),
      3: s(3, 9, 94, 10, 'wash'),
      4: s(3, 21, 94, 50),
      5: s(3, 73, 94, 17),
      7: s(0, 92, 100, 8, 'surface', 0),
    }),
  },
  wayfind: {
    desktop: build({
      0: s(0, 0, 100, 100, 'hero', 0),
      3: s(1.4, 2.3, 28.5, 12, 'surface', 16),
      4: s(1.4, 16, 28.5, 50, 'surface', 16),
      6: s(70.1, 2.3, 28.5, 52, 'surface', 16),
    }),
    mobile: build({
      0: s(0, 0, 100, 100, 'hero', 0),
      1: s(3, 2, 94, 14, 'surface', 18),
      7: s(0, 68, 100, 32, 'surface', 28),
    }),
  },
  forkful: {
    desktop: build({
      2: s(0, 0, 23, 100, 'surface', 0),
      4: s(29, 10, 42, 78, 'accent', 24),
      6: s(75, 0, 25, 100, 'surface', 0),
    }),
    mobile: build({
      1: s(0, 0, 100, 9, 'surface', 0),
      4: s(8, 14, 84, 60, 'accent', 28),
      5: s(4, 80, 92, 12),
    }),
  },
  ticker: {
    desktop: build({
      1: s(1.4, 2.3, 97, 6, 'wash'),
      2: s(1.4, 12, 22, 85),
      3: s(25, 12, 50, 22),
      4: s(25, 37, 50, 12, 'wash'),
      5: s(25, 52, 50, 45),
      6: s(77, 12, 21.6, 85),
    }),
    mobile: build({
      1: s(3, 1.5, 94, 6, 'wash'),
      3: s(3, 10, 94, 16),
      4: s(3, 28, 94, 6, 'wash'),
      5: s(3, 36, 94, 26),
      8: s(3, 65, 94, 10),
      9: s(3, 87, 46, 11),
      10: s(51, 87, 46, 11),
    }),
  },
  pulse: {
    desktop: build({
      1: s(20.5, 4, 77, 8, 'wash'),
      2: s(0, 0, 18, 100, 'surface', 0),
      3: s(20.5, 16, 26.8, 19),
      4: s(49, 16, 24, 19),
      5: s(75, 16, 22.5, 19),
      8: s(20.5, 38, 37.5, 34),
      9: s(60, 38, 37.5, 34),
      10: s(20.5, 75, 77, 15, 'accent'),
    }),
    mobile: build({
      1: s(0, 0, 100, 9, 'wash', 0),
      3: s(4, 12, 92, 15),
      4: s(4, 29, 92, 12, 'wash'),
      5: s(4, 43, 92, 22),
      8: s(4, 67, 92, 10),
      9: s(4, 79, 92, 10),
      7: s(0, 92, 100, 8, 'surface', 0),
    }),
  },
};

export type ResolvedSlot = Slot & { opacity: number };

const centre = (a: Slot) => ({ x: a.x + a.w / 2, y: a.y + a.h / 2 });

/** A zero-size slot parked on the point of `host` nearest to `from`: where a slot splits from or merges into. */
function collapsed(from: Slot, host: Slot | undefined, ref: Slot): ResolvedSlot {
  const c = centre(from);
  const h = host ?? ref;
  const x = Math.min(h.x + h.w, Math.max(h.x, c.x));
  const y = Math.min(h.y + h.h, Math.max(h.y, c.y));
  return { x, y, w: 0, h: 0, r: Math.min(from.r, 4), tone: from.tone, opacity: 0 };
}

const nearest = (g: Geometry, p: { x: number; y: number }): Slot | undefined => {
  let best: Slot | undefined;
  let bd = Infinity;
  for (const slot of g) {
    if (!slot || slot.w === 0) continue;
    const c = centre(slot);
    const d = Math.hypot(c.x - p.x, c.y - p.y);
    if (d < bd) {
      bd = d;
      best = slot;
    }
  }
  return best;
};

/**
 * The two ends of a morph, slot by slot. A slot only one side has grows out of
 * (or shrinks into) the nearest slot of the other side; a slot neither has
 * stays hidden.
 */
export function resolvePair(a: Geometry, b: Geometry): Array<{ from: ResolvedSlot; to: ResolvedSlot }> {
  const full = (x: Slot): ResolvedSlot => ({ ...x, opacity: 1 });
  return Array.from({ length: SLOT_COUNT }, (_, i) => {
    const sa = a[i] ?? null;
    const sb = b[i] ?? null;
    if (sa && sb) return { from: full(sa), to: full(sb) };
    if (sa) return { from: full(sa), to: collapsed(sa, nearest(b, centre(sa)), sa) };
    if (sb) return { from: collapsed(sb, nearest(a, centre(sb)), sb), to: full(sb) };
    const dead: ResolvedSlot = { x: 50, y: 50, w: 0, h: 0, r: 0, tone: 'wash', opacity: 0 };
    return { from: dead, to: dead };
  });
}

export const clipPath = (s: Slot): string =>
  `inset(${s.y}% ${Math.max(0, 100 - s.x - s.w)}% ${Math.max(0, 100 - s.y - s.h)}% ${s.x}% round ${s.r}px)`;
