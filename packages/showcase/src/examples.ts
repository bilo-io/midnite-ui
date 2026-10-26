import type { ComponentType } from 'react';

// Every live demo is a file at ./examples/<component-id>/<NN>-<slug>.tsx whose
// default export renders it. The same file is loaded twice: once as a module (the
// demo) and once `?raw` (the code panel), so the code a reader copies is exactly
// the code that drew the preview.

export type Example = {
  componentId: string;
  /** `<component-id>/<slug>`, unique site-wide; also the DOM anchor. */
  key: string;
  title: string;
  Component: ComponentType;
  source: string;
};

const modules = import.meta.glob<{ default: ComponentType }>('./examples/*/*.tsx', { eager: true });
const sources = import.meta.glob<string>('./examples/*/*.tsx', {
  eager: true,
  query: '?raw',
  import: 'default',
});

/** `./examples/button/02-sizes.tsx` → `{ componentId: 'button', order: 2, slug: 'sizes' }`. */
export function parseExamplePath(
  path: string,
): { componentId: string; order: number; slug: string } | null {
  const match = /\/examples\/([^/]+)\/(\d+)-([^/]+)\.tsx$/.exec(path);
  if (!match) return null;
  const [, componentId, order, slug] = match;
  return { componentId: componentId!, order: Number(order), slug: slug! };
}

/** `dashboard-row` → `Dashboard row`. */
export function titleFromSlug(slug: string): string {
  const words = slug.split('-').join(' ');
  return words.charAt(0).toUpperCase() + words.slice(1);
}

function load(): Map<string, Example[]> {
  const byComponent = new Map<string, (Example & { order: number })[]>();
  for (const [path, mod] of Object.entries(modules)) {
    const parsed = parseExamplePath(path);
    if (!parsed) continue;
    const list = byComponent.get(parsed.componentId) ?? [];
    list.push({
      componentId: parsed.componentId,
      key: `${parsed.componentId}/${parsed.slug}`,
      title: titleFromSlug(parsed.slug),
      Component: mod.default,
      source: (sources[path] ?? '').trimEnd(),
      order: parsed.order,
    });
    byComponent.set(parsed.componentId, list);
  }
  return new Map(
    [...byComponent].map(([id, list]) => [
      id,
      list.sort((a, b) => a.order - b.order).map(({ order: _order, ...e }) => e),
    ]),
  );
}

export const EXAMPLES: ReadonlyMap<string, Example[]> = load();

export function examplesFor(componentId: string): Example[] {
  return EXAMPLES.get(componentId) ?? [];
}
