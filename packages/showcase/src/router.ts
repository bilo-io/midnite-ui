import { useEffect, useState } from 'react';

// Hash routing, as the docs site does: the build is served from a sub-path on
// GitHub Pages with no server rewrites, so only the fragment can carry a route.
//
// The platform is part of the route: `#/button` is the web Button, and
// `#/mobile/button` the React Native one, so a Mobile page deep-links and the
// back button walks across mode switches.

export type Mode = 'web' | 'mobile';

type Page =
  { page: 'home' } | { page: 'tokens' } | { page: 'component'; id: string; example?: string };

/** A page, plus `mode: 'mobile'` in the Mobile showcase (web routes carry no mode). */
export type Route = Page & { mode?: 'mobile' };

const MOBILE = 'mobile';

function parsePath(path: string): Page {
  if (path === '' || path === '/') return { page: 'home' };
  if (path === 'tokens') return { page: 'tokens' };
  const [id, example] = path.split('/');
  if (id) return example ? { page: 'component', id, example } : { page: 'component', id };
  return { page: 'home' };
}

export function parseHash(hash: string): Route {
  const path = hash.replace(/^#\/?/, '');
  if (path === MOBILE || path.startsWith(`${MOBILE}/`)) {
    return { ...parsePath(path.slice(MOBILE.length + 1)), mode: 'mobile' };
  }
  return parsePath(path);
}

export function modeOf(route: Route): Mode {
  return route.mode === 'mobile' ? 'mobile' : 'web';
}

export function hrefFor(route: Route): string {
  const base = route.mode === 'mobile' ? `#/${MOBILE}` : '#';
  if (route.page === 'home') return route.mode === 'mobile' ? base : '#/';
  if (route.page === 'tokens') return `${base}/tokens`;
  return route.example ? `${base}/${route.id}/${route.example}` : `${base}/${route.id}`;
}

/** `page` in `mode`: the same page, with the mode set (mobile) or cleared (web). */
export function inMode(page: Page | Route, mode: Mode): Route {
  const { mode: _drop, ...rest } = page as Route;
  // Spreading a union loses its discriminant for TS; the shape is unchanged.
  return (mode === 'mobile' ? { ...rest, mode: 'mobile' } : rest) as Route;
}

/**
 * Where the platform toggle sends you: the same page in the other mode when it
 * exists there (Button ↔ Button), otherwise that mode's overview.
 */
export function switchMode(
  route: Route,
  to: Mode,
  existsIn: (id: string, mode: Mode) => boolean,
): Route {
  if (route.page === 'component') {
    return existsIn(route.id, to)
      ? inMode({ page: 'component', id: route.id }, to)
      : inMode({ page: 'home' }, to);
  }
  return inMode(route.page === 'tokens' ? { page: 'tokens' } : { page: 'home' }, to);
}

export function navigate(route: Route): void {
  window.location.hash = hrefFor(route);
}

export function useRoute(): Route {
  const [route, setRoute] = useState(() => parseHash(window.location.hash));
  useEffect(() => {
    const onChange = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}

// The last mode is remembered so a bare visit to /showcase/ reopens it. The
// URL always wins: any hash at all, including `#/`, is taken as asked.
export const MODE_STORAGE_KEY = 'midnite.showcase.mode';

export function rememberMode(mode: Mode): void {
  try {
    localStorage.setItem(MODE_STORAGE_KEY, mode);
  } catch {}
}

export function restoreMode(): void {
  try {
    if (window.location.hash === '' && localStorage.getItem(MODE_STORAGE_KEY) === 'mobile') {
      window.history.replaceState(null, '', hrefFor({ page: 'home', mode: 'mobile' }));
    }
  } catch {}
}
