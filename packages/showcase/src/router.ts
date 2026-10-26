import { useEffect, useState } from 'react';

// Hash routing, as the docs site does: the build is served from a sub-path on
// GitHub Pages with no server rewrites, so only the fragment can carry a route.

export type Route =
  { page: 'home' } | { page: 'tokens' } | { page: 'component'; id: string; example?: string };

export function parseHash(hash: string): Route {
  const path = hash.replace(/^#\/?/, '');
  if (path === '' || path === '/') return { page: 'home' };
  if (path === 'tokens') return { page: 'tokens' };
  const [id, example] = path.split('/');
  if (id) return example ? { page: 'component', id, example } : { page: 'component', id };
  return { page: 'home' };
}

export function hrefFor(route: Route): string {
  if (route.page === 'home') return '#/';
  if (route.page === 'tokens') return '#/tokens';
  return route.example ? `#/${route.id}/${route.example}` : `#/${route.id}`;
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
