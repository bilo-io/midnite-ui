import { type ComponentType, type LazyExoticComponent, lazy } from 'react';

// The example layouts. Each lives in ./<id>/ as a `desktop.tsx` and a
// `mobile.tsx` (plus any shared helpers beside them). The same file is loaded
// twice, lazily: as a module for the preview and `?raw` for the code panel, so
// the code a reader copies is exactly the code that drew the preview. Nothing
// here is in the main bundle until a page asks for it.

export type Variant = 'desktop' | 'mobile';

export type LayoutDoc = {
  id: string;
  name: string;
  /** What it is, in a line. */
  description: string;
  features: string[];
  /** Words the command palette also matches. */
  keywords: string[];
};

export const LAYOUTS: readonly LayoutDoc[] = [
  {
    id: 'circle',
    name: 'Circle',
    description: 'A social feed: stories, a composer and posts you can like.',
    features: [
      'Three-column shell that collapses to a tab bar',
      'Story strip and composer card',
      'Posts with a like toggle that updates its count',
      'Online contacts with presence dots',
    ],
    keywords: ['social', 'feed', 'posts', 'stories', 'timeline'],
  },
  {
    id: 'snapline',
    name: 'Snapline',
    description: 'A photo feed with story rings and a switchable grid.',
    features: [
      'Story rings drawn with a conic gradient',
      'Feed and Grid views behind one Tabs control',
      'Square photo cards on generated gradient art',
      'Suggested accounts rail on desktop',
    ],
    keywords: ['photo', 'gallery', 'grid', 'stories'],
  },
  {
    id: 'wayfind',
    name: 'Wayfind',
    description: 'A map with search, category chips and a place sheet.',
    features: [
      'Map drawn in SVG from theme tokens: no tiles, no network',
      'Search and chips filter the pins live',
      'Place sheet with Overview and Reviews tabs',
      'Route toggle; a tap-to-expand bottom sheet on mobile',
    ],
    keywords: ['map', 'places', 'search', 'navigation', 'directions'],
  },
  {
    id: 'forkful',
    name: 'Forkful',
    description: 'A restaurant picker with a swipeable card stack.',
    features: [
      'Drag, tap the buttons, or use the arrow keys',
      'Yum and Nope stamps fade in as you drag',
      'Cuisine, distance and open-now filters',
      'Matches list that fills as you like places',
    ],
    keywords: ['swipe', 'cards', 'restaurant', 'picker', 'food'],
  },
  {
    id: 'ticker',
    name: 'Ticker',
    description: 'A trading dashboard: watchlist, live chart and order ticket.',
    features: [
      'Watchlist with sparklines; the chart follows the selection',
      'Live AreaChart with 1D to 1Y ranges',
      'MetricDial indicators and a RadialGauge allocation',
      'Order ticket with buy/sell, limit switch and total',
    ],
    keywords: ['trading', 'finance', 'fintech', 'stocks', 'chart', 'dashboard'],
  },
  {
    id: 'pulse',
    name: 'Pulse',
    description: 'A fitness tracker: activity rings, workouts and a weekly chart.',
    features: [
      'Concentric activity rings in plain SVG',
      'MetricDial vitals and a heart-rate AreaChart',
      'Workout list with ContextRing intensity',
      'Adjustable daily goal via Slider',
    ],
    keywords: ['fitness', 'health', 'activity', 'workout', 'rings'],
  },
];

export const findLayout = (id: string) => LAYOUTS.find((l) => l.id === id);

type Mod = { default: ComponentType };
const loaders = import.meta.glob<Mod>('./*/{desktop,mobile}.tsx');
const raws = import.meta.glob<string>('./*/*.tsx', { query: '?raw', import: 'default' });

const lazies = new Map<string, LazyExoticComponent<ComponentType>>();

/** The lazy component for one variant of one layout. */
export function layoutComponent(id: string, variant: Variant): LazyExoticComponent<ComponentType> {
  const key = `./${id}/${variant}.tsx`;
  let comp = lazies.get(key);
  if (!comp) {
    const load = loaders[key];
    if (!load) throw new Error(`No ${variant} layout for "${id}"`);
    comp = lazy(load);
    lazies.set(key, comp);
  }
  return comp;
}

/** Starts fetching a layout's chunks so it is ready before it is shown. */
export function preloadLayout(id: string): void {
  for (const variant of ['desktop', 'mobile'] as const) void loaders[`./${id}/${variant}.tsx`]?.();
}

/** The files behind one variant: its own, then the helpers shared in its folder. */
export function sourcePaths(id: string, variant: Variant): string[] {
  const own = `./${id}/${variant}.tsx`;
  const other = `./${id}/${variant === 'desktop' ? 'mobile' : 'desktop'}.tsx`;
  const shared = Object.keys(raws)
    .filter((p) => p.startsWith(`./${id}/`) && p !== own && p !== other)
    .sort();
  return raws[own] ? [own, ...shared] : [];
}

/** The code panel's text: the variant's file plus its shared helpers, each under a header. */
export async function loadSource(id: string, variant: Variant): Promise<string> {
  const paths = sourcePaths(id, variant);
  const files = await Promise.all(paths.map(async (p) => (await raws[p]!()).trimEnd()));
  return files
    .map((text, i) => (i === 0 ? text : `// ── ${paths[i]!.replace('./', '')} ──\n${text}`))
    .join('\n\n');
}
