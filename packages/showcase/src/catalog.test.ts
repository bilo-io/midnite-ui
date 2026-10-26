import { describe, expect, it } from 'vitest';
import * as ui from '@bilo-io/ui';

import { CATEGORIES, COMPONENTS } from './catalog';
import { EXAMPLES, parseExamplePath, titleFromSlug } from './examples';

describe('catalog', () => {
  it('has unique ids', () => {
    const ids = COMPONENTS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('gives every component at least one live example', () => {
    const missing = COMPONENTS.filter((c) => (EXAMPLES.get(c.id) ?? []).length === 0).map(
      (c) => c.id,
    );
    expect(missing).toEqual([]);
  });

  it('has no example folder without a catalog entry', () => {
    const ids = new Set(COMPONENTS.map((c) => c.id));
    expect([...EXAMPLES.keys()].filter((id) => !ids.has(id))).toEqual([]);
  });

  it('only lists categories it declares', () => {
    expect(COMPONENTS.filter((c) => !CATEGORIES.includes(c.category))).toEqual([]);
  });

  it('names only runtime exports that @bilo-io/ui really has', () => {
    // Type-only exports (SelectOption, RailConfig, …) vanish at runtime; skip them.
    const TYPE_ONLY = new Set([
      'SelectOption',
      'TabOption',
      'ChartSeries',
      'BackgroundPattern',
      'RailConfig',
    ]);
    const missing = COMPONENTS.flatMap((c) => c.exports)
      .filter((name) => !TYPE_ONLY.has(name))
      .filter((name) => !(name in ui));
    expect(missing).toEqual([]);
  });

  it('shows each example its own source', () => {
    for (const list of EXAMPLES.values()) {
      for (const ex of list) {
        expect(ex.source).toContain('export default function');
        expect(ex.source).toContain("from '@bilo-io/ui'");
      }
    }
  });
});

describe('example paths', () => {
  it('parses folder, order and slug', () => {
    expect(parseExamplePath('./examples/metric-dial/01-dashboard-row.tsx')).toEqual({
      componentId: 'metric-dial',
      order: 1,
      slug: 'dashboard-row',
    });
    expect(parseExamplePath('./examples/button/notes.tsx')).toBeNull();
  });

  it('turns a slug into a sentence-case title', () => {
    expect(titleFromSlug('dashboard-row')).toBe('Dashboard row');
  });
});
