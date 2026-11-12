import { describe, expect, it } from 'vitest';
import * as ui from '@bilo-io/ui';
import * as uiNative from '@bilo-io/ui-native';

import {
  CATEGORIES,
  COMPONENTS,
  NATIVE_CATEGORIES,
  NATIVE_COMPONENTS,
  catalogFor,
  findComponent,
} from './catalog';
import { EXAMPLES, NATIVE_EXAMPLES, parseExamplePath, titleFromSlug } from './examples';

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

describe('native catalog', () => {
  it('has unique ids', () => {
    const ids = NATIVE_COMPONENTS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('files every component under the one Mobile category', () => {
    expect(NATIVE_CATEGORIES).toEqual(['Midnite Mobile UI']);
    expect(NATIVE_COMPONENTS.filter((c) => c.category !== 'Midnite Mobile UI')).toEqual([]);
  });

  it('gives every component at least one live example, and no folder goes unlisted', () => {
    const ids = new Set(NATIVE_COMPONENTS.map((c) => c.id));
    expect(NATIVE_COMPONENTS.filter((c) => !NATIVE_EXAMPLES.get(c.id)?.length)).toEqual([]);
    expect([...NATIVE_EXAMPLES.keys()].filter((id) => !ids.has(id))).toEqual([]);
  });

  it('keeps the two platforms apart', () => {
    expect([...EXAMPLES.keys()].filter((id) => id.startsWith('native-'))).toEqual([]);
    for (const list of EXAMPLES.values()) {
      for (const ex of list) expect(ex.source).not.toContain('@bilo-io/ui-native');
    }
  });

  it('names only runtime exports that @bilo-io/ui-native really has', () => {
    const TYPE_ONLY = new Set(['TabOption']);
    const missing = NATIVE_COMPONENTS.flatMap((c) => c.exports)
      .filter((name) => !TYPE_ONLY.has(name))
      .filter((name) => !(name in uiNative));
    expect(missing).toEqual([]);
  });

  it('shows each example its own React Native source', () => {
    for (const list of NATIVE_EXAMPLES.values()) {
      for (const ex of list) {
        expect(ex.source).toContain('export default function');
        expect(ex.source).toContain("from '@bilo-io/ui-native'");
        // Native demos are React Native only: no DOM elements, no web library.
        expect(ex.source).not.toMatch(/<(div|span|p|button|input|label)[\s>]/);
        expect(ex.source).not.toMatch(/from '@bilo-io\/ui'/);
      }
    }
  });

  it('looks components up per platform', () => {
    expect(catalogFor('mobile').components).toBe(NATIVE_COMPONENTS);
    expect(catalogFor('web').categories).toBe(CATEGORIES);
    expect(findComponent('slider', 'mobile')?.exports).toContain('snapValue');
    expect(findComponent('area-chart', 'mobile')).toBeUndefined();
    expect(findComponent('area-chart')?.name).toBe('AreaChart');
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
