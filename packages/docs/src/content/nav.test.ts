import { describe, expect, it } from 'vitest';

import { buildNav, pathFromModuleId, toDocRoute, type DocRoute } from './nav';

describe('pathFromModuleId', () => {
  it('maps a nested content key to a route path', () => {
    expect(pathFromModuleId('./ui/theming.mdx')).toBe('/ui/theming');
    expect(pathFromModuleId('./shell/app-frame.mdx')).toBe('/shell/app-frame');
  });

  it('collapses an index file to its parent (root index → /)', () => {
    expect(pathFromModuleId('./index.mdx')).toBe('/');
    expect(pathFromModuleId('./ui/index.mdx')).toBe('/ui');
  });

  it('tolerates an absolute-style key with a content/ segment', () => {
    expect(pathFromModuleId('/abs/src/content/shell/i18n.mdx')).toBe('/shell/i18n');
  });
});

describe('toDocRoute', () => {
  it('reads title / section / order from frontmatter', () => {
    expect(toDocRoute('./ui/theming.mdx', { title: 'Theming', section: 'UI', order: 1 })).toEqual({
      path: '/ui/theming',
      title: 'Theming',
      section: 'UI',
      order: 1,
    });
  });

  it('falls back to the path as title and sensible defaults when frontmatter is missing', () => {
    expect(toDocRoute('./ui/theming.mdx', {})).toEqual({
      path: '/ui/theming',
      title: '/ui/theming',
      section: 'Introduction',
      order: 100,
    });
  });
});

describe('buildNav', () => {
  const routes: DocRoute[] = [
    { path: '/ui/theming', title: 'Theming', section: 'UI', order: 1 },
    { path: '/ui/components', title: 'Components', section: 'UI', order: 0 },
    { path: '/shell/app-frame', title: 'AppFrame', section: 'Shell', order: 0 },
    { path: '/', title: 'Overview', section: 'Introduction', order: 0 },
  ];

  it('orders sections by the canonical SECTION_ORDER', () => {
    expect(buildNav(routes).map((group) => group.section)).toEqual(['Introduction', 'UI', 'Shell']);
  });

  it('orders every canonical section in the sidebar sequence', () => {
    const sections = buildNav([
      { path: '/development', title: 'Contributing', section: 'Development', order: 0 },
      { path: '/ui/theming', title: 'Theming', section: 'UI', order: 1 },
      { path: '/shell/app-frame', title: 'AppFrame', section: 'Shell', order: 0 },
      { path: '/', title: 'Overview', section: 'Introduction', order: 0 },
    ]).map((group) => group.section);
    expect(sections).toEqual(['Introduction', 'UI', 'Shell', 'Development']);
  });

  it('orders items within a section by `order` then title', () => {
    const ui = buildNav(routes).find((group) => group.section === 'UI');
    expect(ui?.items.map((item) => item.title)).toEqual(['Components', 'Theming']);
  });

  it('puts an unknown section after the known ones', () => {
    const withExtra = buildNav([
      ...routes,
      { path: '/tutorials/x', title: 'X', section: 'Tutorials', order: 0 },
    ]);
    expect(withExtra.at(-1)?.section).toBe('Tutorials');
  });
});
