import { describe, expect, it } from 'vitest';

import { hrefFor, modeOf, parseHash, switchMode, type Mode } from './router';

describe('hash routes', () => {
  it.each([
    ['', { page: 'home' }],
    ['#/', { page: 'home' }],
    ['#/tokens', { page: 'tokens' }],
    ['#/examples', { page: 'examples' }],
    ['#/examples/', { page: 'examples' }],
    ['#/examples/forkful', { page: 'examples', id: 'forkful' }],
    ['#/button', { page: 'component', id: 'button' }],
    ['#/button/sizes', { page: 'component', id: 'button', example: 'sizes' }],
    ['#/mobile', { page: 'home', mode: 'mobile' }],
    ['#/mobile/', { page: 'home', mode: 'mobile' }],
    ['#/mobile/tokens', { page: 'tokens', mode: 'mobile' }],
    ['#/mobile/slider', { page: 'component', id: 'slider', mode: 'mobile' }],
    [
      '#/mobile/slider/steps',
      { page: 'component', id: 'slider', example: 'steps', mode: 'mobile' },
    ],
  ])('parses %s', (hash, route) => {
    expect(parseHash(hash)).toEqual(route);
  });

  it('round-trips through hrefFor', () => {
    for (const hash of [
      '#/',
      '#/tokens',
      '#/examples',
      '#/examples/pulse',
      '#/switch',
      '#/tabs/segmented',
      '#/mobile',
      '#/mobile/tokens',
      '#/mobile/switch',
      '#/mobile/tabs/segmented',
    ]) {
      expect(hrefFor(parseHash(hash))).toBe(hash);
    }
  });

  it('reads the mode off a route', () => {
    expect(modeOf(parseHash('#/button'))).toBe('web');
    expect(modeOf(parseHash('#/mobile/button'))).toBe('mobile');
  });
});

describe('switchMode', () => {
  const native = new Set(['button', 'switch']);
  const existsIn = (id: string, mode: Mode) => mode === 'web' || native.has(id);
  const to = (hash: string, mode: Mode) => hrefFor(switchMode(parseHash(hash), mode, existsIn));

  it('keeps the component when the other platform has it', () => {
    expect(to('#/button/sizes', 'mobile')).toBe('#/mobile/button');
    expect(to('#/mobile/switch', 'web')).toBe('#/switch');
  });

  it("falls back to the other platform's overview", () => {
    expect(to('#/area-chart', 'mobile')).toBe('#/mobile');
  });

  it('sends the web-only examples page to the other overview', () => {
    expect(to('#/examples/pulse', 'mobile')).toBe('#/mobile');
  });

  it('keeps the tokens page and the overview', () => {
    expect(to('#/tokens', 'mobile')).toBe('#/mobile/tokens');
    expect(to('#/mobile', 'web')).toBe('#/');
  });
});
