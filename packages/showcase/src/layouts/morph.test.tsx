import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { LAYOUTS } from './index';
import { MorphLayer } from './morph-layer';
import { GEOMETRY, SLOT_COUNT, clipPath, resolvePair } from './morph-geometry';

describe('morph geometry', () => {
  it('describes every layout, desktop and mobile, with in-bounds slots and some structure', () => {
    for (const l of LAYOUTS) {
      for (const v of ['desktop', 'mobile'] as const) {
        const g = GEOMETRY[l.id]?.[v];
        expect(g, `${l.id}/${v}`).toBeDefined();
        expect(g).toHaveLength(SLOT_COUNT);
        const used = g!.filter((s) => s !== null);
        expect(used.length).toBeGreaterThanOrEqual(3);
        for (const s of used) {
          expect(s!.x).toBeGreaterThanOrEqual(0);
          expect(s!.y).toBeGreaterThanOrEqual(0);
          expect(s!.x + s!.w).toBeLessThanOrEqual(100.01);
          expect(s!.y + s!.h).toBeLessThanOrEqual(100.01);
        }
      }
    }
  });

  it('collapses unequal slots onto a neighbour instead of popping them', () => {
    const pairs = resolvePair(GEOMETRY.pulse!.desktop, GEOMETRY.wayfind!.desktop);
    // Pulse slot 8 (a card) has no Wayfind counterpart: it shrinks to nothing, fading out.
    expect(pairs[8]!.from.w).toBeGreaterThan(0);
    expect(pairs[8]!.to.w).toBe(0);
    expect(pairs[8]!.to.h).toBe(0);
    expect(pairs[8]!.to.opacity).toBe(0);
    // Wayfind slot 0 (the canvas) grows out of nothing.
    expect(pairs[0]!.from.w).toBe(0);
    expect(pairs[0]!.to.w).toBe(100);
    for (const { from, to } of pairs) {
      expect(clipPath(from)).toMatch(/^inset\(/);
      expect(clipPath(to)).toMatch(/round \d/);
    }
  });
});

describe('MorphLayer', () => {
  it('renders every slot and moves to the next layout without remounting', () => {
    const { container, rerender } = render(<MorphLayer id="circle" variant="desktop" />);
    expect(container.querySelectorAll('[data-slot]')).toHaveLength(SLOT_COUNT);
    const first = container.querySelector('[data-slot="4"]') as HTMLElement;
    const before = first.style.clipPath;
    rerender(<MorphLayer id="ticker" variant="desktop" />);
    expect(container.querySelector('[data-slot="4"]')).toBe(first);
    expect(first.style.clipPath).not.toBe(before);
  });
});
