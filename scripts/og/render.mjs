// Render scripts/og/og.html to packages/docs/public/og.png (1200×630), the
// Open Graph card the docs and showcase link to. Run after editing og.html:
//   node scripts/og/render.mjs
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const here = (p) => fileURLToPath(new URL(p, import.meta.url));
// playwright is a dev dependency of @bilo-io/ui (via @vitest/browser), not the root.
const require = createRequire(here('../../packages/ui/package.json'));
const { chromium } = require('playwright');

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.goto(`file://${here('./og.html')}`);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: here('../../packages/docs/public/og.png') });
await browser.close();
console.log('wrote packages/docs/public/og.png');
