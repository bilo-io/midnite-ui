import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { accentHues, brand, color, motion, overlay, radius, shadow, spacing, tokens, typography, zIndex } from './index';

describe('color tokens', () => {
  it('exposes the same semantic keys for light and dark (theming is complete)', () => {
    expect(Object.keys(color.dark).sort()).toEqual(Object.keys(color.light).sort());
  });

  it('mirrors the canonical HSL triplets from tokens.css', () => {
    expect(color.light.background).toBe('0 0% 100%');
    expect(color.dark.background).toBe('240 10% 3.9%');
    expect(color.light.foreground).toBe('240 10% 3.9%');
    expect(color.dark.foreground).toBe('0 0% 98%');
  });
});

describe('brand ramp', () => {
  // brand.css is the source of truth; read its two blocks and compare stop by stop.
  const css = readFileSync(new URL('../styles/brand.css', import.meta.url), 'utf8');
  const block = (selector: string) =>
    [...css.matchAll(/^(:root|\.dark) \{([^}]*)\}/gm)].find(
      ([, sel, body]) => sel === selector && body!.includes('--brand-rainbow-0'),
    )?.[2] ?? '';
  const read = (body: string, name: string) =>
    new RegExp(`--${name}: hsl\\(([^)]+)\\);`).exec(body)?.[1];

  it.each(['light', 'dark'] as const)('mirrors brand.css in the %s theme', (theme) => {
    const body = block(theme === 'light' ? ':root' : '.dark');
    expect(brand[theme].ramp).toEqual(
      [0, 1, 2, 3, 4, 5].map((i) => read(body, `brand-rainbow-${i}`)),
    );
    expect(brand[theme].glow).toBe(read(body, 'brand-glow'));
  });
});

describe('accent hues', () => {
  it('cover status, kind and node groups in both themes with matching keys', () => {
    for (const group of ['status', 'kind', 'node'] as const) {
      expect(Object.keys(accentHues[group].dark).sort()).toEqual(
        Object.keys(accentHues[group].light).sort(),
      );
    }
  });
});

describe('DS taxonomy', () => {
  it('fills radius with real values', () => {
    expect(radius.base).toBe('0.5rem');
    expect(radius.lg).toBe('0.5rem');
  });

  it('aggregates the full taxonomy in `tokens`', () => {
    expect(Object.keys(tokens).sort()).toEqual(
      [
        'accentHues',
        'brand',
        'color',
        'motion',
        'overlay',
        'radius',
        'shadow',
        'spacing',
        'typography',
        'zIndex',
      ].sort(),
    );
  });

  it('leaves no placeholder on the four formalized scales', () => {
    for (const scale of [tokens.spacing, tokens.typography, tokens.shadow, tokens.motion]) {
      expect(scale).not.toHaveProperty('placeholder');
    }
  });

  it('adds the mobile radius, stacking and overlay tokens', () => {
    expect(radius.full).toBe('9999px');
    expect([zIndex.fab, zIndex.scrim, zIndex.sheet]).toEqual([40, 45, 50]);
    expect(overlay.scrim).toEqual({ hsl: '0 0% 0%', alpha: 0.5 });
  });
});

describe('formalized scales', () => {
  // Same grammar as ui-native's `toDp`: rem or px, or a bare 0.
  const toPx = (length: string) => {
    const m = /^(-?[\d.]+)(rem|px)?$/.exec(length);
    if (!m) throw new Error(`unreadable length ${length}`);
    return Number(m[1]) * (m[2] === 'rem' ? 16 : 1);
  };

  it('spacing parses and matches the Tailwind steps in dp', () => {
    const steps = ['0', '0.5', '1', '2', '3', '4', '5', '6', '8', '10', '12'] as const;
    expect(Object.keys(spacing).sort()).toEqual([...steps].sort());
    expect(steps.map((k) => toPx(spacing[k]))).toEqual([0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48]);
  });

  it('type sizes parse and match the scale', () => {
    const pairs = Object.entries(typography.fontSize).map(
      ([k, v]) => [k, toPx(v.fontSize), toPx(v.lineHeight)] as const,
    );
    expect(pairs).toEqual([
      ['xs', 12, 16],
      ['sm', 14, 20],
      ['base', 16, 24],
      ['lg', 18, 28],
      ['xl', 20, 28],
      ['2xl', 24, 32],
    ]);
    expect(typography.fontWeight).toEqual({ regular: 400, medium: 500, semibold: 600 });
  });

  it('elevation, motion match the spec', () => {
    expect(Object.values(shadow).map((s) => [toPx(s.offsetY), toPx(s.blur), s.opacity, s.elevation])).toEqual([
      [0, 0, 0, 0],
      [1, 2, 0.05, 1],
      [2, 6, 0.1, 3],
      [6, 12, 0.15, 6],
    ]);
    expect(motion.duration).toEqual({ fast: 120, base: 200, slow: 320 });
    expect(motion.easing.standard).toEqual([0.2, 0, 0, 1]);
  });
});
