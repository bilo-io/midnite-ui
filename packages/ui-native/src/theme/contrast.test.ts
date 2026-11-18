import { describe, expect, it } from 'vitest';

import {
  contrastOverTint,
  contrastRatio,
  isLowContrastAccent,
  LOW_CONTRAST_ACCENTS,
  NON_TEXT_CONTRAST,
  parseColor,
} from './contrast';
import { createTheme } from './palette';

describe('contrastRatio', () => {
  it('matches the WCAG reference points', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 5);
    expect(contrastRatio('#ffffff', '#ffffff')).toBeCloseTo(1, 5);
    expect(contrastRatio('hsl(0, 0%, 0%)', 'hsl(0, 0%, 100%)')).toBeCloseTo(21, 5);
  });

  it('composites a translucent colour over the background', () => {
    expect(contrastRatio('hsla(0, 0%, 0%, 0)', '#ffffff')).toBeCloseTo(1, 5);
  });

  it('refuses a colour it cannot read', () => {
    expect(() => parseColor('rebeccapurple')).toThrow(/cannot read/);
  });
});

describe.each(['light', 'dark'] as const)('the %s scheme', (scheme) => {
  const t = createTheme(scheme);
  const { background: bg, foreground: fg } = t.colors;

  it('holds AAA body text and AA muted text', () => {
    expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(7);
    expect(contrastRatio(t.colors.mutedForeground, bg)).toBeGreaterThanOrEqual(4.5);
  });

  it.each([
    ['primary', t.colors.primary],
    ['success', t.colors.success],
    ['warning', t.accents.status.wip],
    ['danger', t.accents.kind.bug],
    ['info', t.accents.status.todo],
  ])('reads foreground over the %s Badge tint (0.15)', (_tone, hue) => {
    expect(contrastOverTint(fg, hue, 0.15, bg)).toBeGreaterThanOrEqual(4.5);
  });

  it.each([0.14, 0.32])('reads foreground over the diff tints at %s', (alpha) => {
    expect(contrastOverTint(fg, t.colors.success, alpha, bg)).toBeGreaterThanOrEqual(4.5);
    expect(contrastOverTint(fg, t.accents.kind.bug, alpha, bg)).toBeGreaterThanOrEqual(4.5);
  });

  it('lists exactly the accents under 3:1 as LOW_CONTRAST_ACCENTS', () => {
    for (const group of ['status', 'kind'] as const) {
      for (const [name, value] of Object.entries(t.accents[group])) {
        const low = contrastRatio(value, bg) < NON_TEXT_CONTRAST;
        expect(isLowContrastAccent(scheme, group, name), `${group}.${name}`).toBe(low);
      }
    }
  });
});

describe('LOW_CONTRAST_ACCENTS', () => {
  it('is pinned: a token change that moves an accent across 3:1 shows up here', () => {
    expect(LOW_CONTRAST_ACCENTS.map(({ scheme, group, name }) => `${scheme}:${group}.${name}`)).toEqual([
      'light:status.wip',
      'light:status.done',
      'light:status.abandoned',
      'light:kind.unknown',
    ]);
  });
});
