import type { ComponentType } from 'react';

// Every live demo is a file at ./examples/<component-id>/<NN>-<slug>.tsx whose
// default export renders it. The same file is loaded twice: once as a module (the
// demo) and once `?raw` (the code panel), so the code a reader copies is exactly
// the code that drew the preview. The Mobile showcase's React Native demos sit
// beside them as ./examples/native-<component-id>/…; the two sets never mix, and
// the native ones are loaded by ./mobile (a lazy chunk), not here.

export type Example = {
  componentId: string;
  /** `<component-id>/<slug>`, unique within its mode; also the DOM anchor. */
  key: string;
  title: string;
  Component: ComponentType;
  source: string;
};

export type ExampleModule = { default: ComponentType };

const webModules = import.meta.glob<ExampleModule>(
  ['./examples/*/*.tsx', '!./examples/native-*/*.tsx'],
  {
    eager: true,
  },
);
const webSources = import.meta.glob<string>(['./examples/*/*.tsx', '!./examples/native-*/*.tsx'], {
  eager: true,
  query: '?raw',
  import: 'default',
});

/** The folder prefix that marks a React Native demo. */
export const NATIVE_PREFIX = 'native-';

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

/** The DOM id of an example's section: `button/sizes` → `example-sizes`. */
export const anchorFor = (key: string) => `example-${key.split('/')[1]}`;

/** Groups glob results by component id, each list in file order. */
export function load(
  modules: Record<string, ExampleModule>,
  sources: Record<string, string>,
  idOf: (folder: string) => string,
): Map<string, Example[]> {
  const byComponent = new Map<string, (Example & { order: number })[]>();
  for (const [path, mod] of Object.entries(modules)) {
    const parsed = parseExamplePath(path);
    if (!parsed) continue;
    const componentId = idOf(parsed.componentId);
    const list = byComponent.get(componentId) ?? [];
    list.push({
      componentId,
      key: `${componentId}/${parsed.slug}`,
      title: titleFromSlug(parsed.slug),
      Component: mod.default,
      source: (sources[path] ?? '').trimEnd(),
      order: parsed.order,
    });
    byComponent.set(componentId, list);
  }
  return new Map(
    [...byComponent].map(([id, list]) => [
      id,
      list.sort((a, b) => a.order - b.order).map(({ order: _order, ...e }) => e),
    ]),
  );
}

/** The web demos, keyed by component id. */
export const EXAMPLES: ReadonlyMap<string, Example[]> = load(webModules, webSources, (f) => f);

export function examplesFor(componentId: string): Example[] {
  return EXAMPLES.get(componentId) ?? [];
}
