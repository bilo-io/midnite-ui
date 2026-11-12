import { brand, color } from '@bilo-io/ui/tokens';
import { describe, expect, it } from 'vitest';

import { createTheme, hsl, rampAt, toDp } from './palette';

describe('hsl', () => {
  it('turns a token triplet into the comma form RN parses', () => {
    expect(hsl('240 10% 3.9%')).toBe('hsl(240, 10%, 3.9%)');
    expect(hsl('0 0% 98%', 0.9)).toBe('hsla(0, 0%, 98%, 0.9)');
  });
});

describe('toDp', () => {
  it('reads rem, px and calc() token lengths at a 16px rem', () => {
    expect(toDp('0.5rem')).toBe(8);
    expect(toDp('4px')).toBe(4);
    expect(toDp('calc(0.5rem - 2px)')).toBe(6);
    expect(toDp('calc(0.5rem - 4px)')).toBe(4);
  });

  it('refuses a length it cannot read', () => {
    expect(() => toDp('2vh')).toThrow(/cannot read/);
  });
});

describe('createTheme', () => {
  it('fills every colour from @bilo-io/ui tokens, per scheme', () => {
    for (const scheme of ['light', 'dark'] as const) {
      const theme = createTheme(scheme);
      expect(Object.keys(theme.colors).sort()).toEqual(Object.keys(color[scheme]).sort());
      expect(theme.colors.background).toBe(hsl(color[scheme].background));
      expect(theme.alpha('primary', 0.5)).toBe(hsl(color[scheme].primary, 0.5));
      expect(theme.brand.ramp).toEqual(brand[scheme].ramp);
    }
  });

  it('turns the radius scale into dp', () => {
    expect(createTheme('light').radius).toEqual({ sm: 4, md: 6, lg: 8 });
  });
});

describe('rampAt', () => {
  const stops = ['200 50% 40%', '300 70% 60%'];

  it('lands on the stops at the ends and interpolates between', () => {
    expect(rampAt(stops, 0)).toBe('hsl(200, 50%, 40%)');
    expect(rampAt(stops, 1)).toBe('hsl(300, 70%, 60%)');
    expect(rampAt(stops, 0.5)).toBe('hsl(250, 60%, 50%)');
  });

  it('clamps out-of-range positions', () => {
    expect(rampAt(stops, -1)).toBe(rampAt(stops, 0));
    expect(rampAt(stops, 2)).toBe(rampAt(stops, 1));
  });
});
