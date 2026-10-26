import { describe, expect, it } from 'vitest';

import { hrefFor, parseHash } from './router';

describe('hash routes', () => {
  it.each([
    ['', { page: 'home' }],
    ['#/', { page: 'home' }],
    ['#/tokens', { page: 'tokens' }],
    ['#/button', { page: 'component', id: 'button' }],
    ['#/button/sizes', { page: 'component', id: 'button', example: 'sizes' }],
  ])('parses %s', (hash, route) => {
    expect(parseHash(hash)).toEqual(route);
  });

  it('round-trips through hrefFor', () => {
    for (const hash of ['#/', '#/tokens', '#/switch', '#/tabs/segmented']) {
      expect(hrefFor(parseHash(hash))).toBe(hash);
    }
  });
});
