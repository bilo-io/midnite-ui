import { describe, expect, it } from 'vitest';

import { COMPONENTS } from './catalog';
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
