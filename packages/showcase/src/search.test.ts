import { describe, expect, it } from 'vitest';

import { COMPONENTS, NATIVE_COMPONENTS } from './catalog';
import { searchComponents } from './search';

const names = (q: string) => searchComponents(q, COMPONENTS).map((h) => h.doc.name);

describe('searchComponents', () => {
  it('returns the whole catalog, in order, for an empty query', () => {
    expect(names('  ')).toEqual(COMPONENTS.map((c) => c.name));
  });

  it('ranks a name match above a description mention', () => {
    const hits = names('select');
    expect(hits.slice(0, 2)).toEqual(['Select', 'StyledSelect']);
  });

  it('matches keywords, exports and prop names', () => {
    expect(names('dropdown')).toContain('Select');
    expect(names('CardTitle')).toEqual(['Card']);
    expect(names('onCheckedChange')).toEqual(['Switch']);
  });

  it('requires every term to match', () => {
    expect(names('gauge disk')).toEqual(['RadialGauge']);
    expect(names('gauge zzz')).toEqual([]);
  });

  it('tolerates a skipped letter in a name', () => {
    expect(names('pscode')).toContain('PasscodePad');
  });

  it('is case and punctuation insensitive', () => {
    expect(names('Dark-Mode')).toEqual(['ThemeToggle']);
  });
});

describe('searchComponents over the native catalog', () => {
  const native = (q: string) => searchComponents(q, NATIVE_COMPONENTS).map((h) => h.doc.name);

  it('finds React Native components by name and by platform keyword', () => {
    expect(native('slider')[0]).toBe('Slider');
    expect(native('android')).toHaveLength(NATIVE_COMPONENTS.length);
    expect(native('panresponder')).toEqual(['Slider']);
  });

  it('does not list web-only components', () => {
    expect(native('gauge')).toEqual([]);
  });
});
