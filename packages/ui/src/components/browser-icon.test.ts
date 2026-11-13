import { readFileSync, readdirSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

// @ts-expect-error — a plain .mjs build script, no declarations.
import { ASSETS_DIR, OUT_FILE, buildBrowserIconModule } from '../../scripts/browser-icons.mjs';
import {
  BROWSER_IDS,
  BrowserIcon,
  browserColor,
  browserDownloadUrl,
  browserName,
} from './browser-icon';

describe('BrowserIcon', () => {
  it('generated data is in step with assets/browsers/', () => {
    expect(readFileSync(OUT_FILE as string, 'utf8')).toBe(buildBrowserIconModule());
  });

  it('covers every file in assets/browsers/', () => {
    const files = readdirSync(ASSETS_DIR as string)
      .filter((f) => f.endsWith('.svg'))
      .map((f) => f.slice(0, -4))
      .sort();
    expect([...BROWSER_IDS].sort()).toEqual(files);
    expect(files).toHaveLength(9);
  });

  it('exposes names, colours and download pages', () => {
    expect(browserName('samsung')).toBe('Samsung Internet');
    expect(browserColor('chrome')).toMatch(/^#[0-9A-F]{6}$/);
    for (const id of BROWSER_IDS) expect(browserDownloadUrl(id)).toMatch(/^https:\/\//);
  });

  it("uses each logo's own viewBox and leaves no placeholder behind", () => {
    const html = (b: (typeof BROWSER_IDS)[number]) =>
      renderToStaticMarkup(createElement(BrowserIcon, { browser: b }));
    expect(html('chrome')).toContain('viewBox="-10 -10 276 276"');
    for (const id of BROWSER_IDS) {
      expect(html(id)).not.toContain('__UID__');
      expect(html(id)).not.toContain('<style');
      expect(html(id)).not.toContain('xlink');
    }
  });

  it('scopes every id and reference per instance', () => {
    for (const id of BROWSER_IDS) {
      const html = renderToStaticMarkup(
        createElement('div', null, [
          createElement(BrowserIcon, { browser: id, key: 'a' }),
          createElement(BrowserIcon, { browser: id, key: 'b' }),
        ]),
      );
      const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
      expect(new Set(ids).size).toBe(ids.length);
      for (const ref of html.matchAll(/url\(#([^)]+)\)|href="#([^"]+)"/g)) {
        expect(ids).toContain(ref[1] ?? ref[2]);
      }
    }
    const safari = renderToStaticMarkup(createElement(BrowserIcon, { browser: 'safari' }));
    expect(safari).toMatch(/id="safari-a-[A-Za-z0-9]+"/);
    expect(safari).toContain('color-interpolation-filters="srgb"');
  });

  it('is decorative without a title and labelled with one', () => {
    const plain = renderToStaticMarkup(createElement(BrowserIcon, { browser: 'firefox' }));
    const named = renderToStaticMarkup(
      createElement(BrowserIcon, { browser: 'firefox', title: 'Firefox' }),
    );
    expect(plain).toContain('aria-hidden="true"');
    expect(plain).toContain('class="h-4 w-4 shrink-0"');
    expect(named).toContain('role="img"');
    expect(named).toContain('aria-label="Firefox"');
  });
});
