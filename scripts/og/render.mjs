// Render scripts/og/og.html to packages/docs/public/og.jpg (1200×630), the
// Open Graph card the docs and showcase link to. Run after editing og.html:
//   pnpm --filter @bilo-io/ui exec playwright install chromium   # first run only
//   node scripts/og/render.mjs
// Then bump `?v=N` on the og:image URLs: scrapers cache the card by URL.
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const here = (p) => fileURLToPath(new URL(p, import.meta.url));
// playwright is a direct devDependency of @bilo-io/ui, not of the root.
const require = createRequire(here('../../packages/ui/package.json'));
const { chromium } = require('playwright');

// Every face the card draws, at the size it draws it.
const FONTS = ['500 112px Inter', '400 30px Inter', '168px Damion'];

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page.goto(new URL('./og.html', import.meta.url).href);
  await page.evaluate(() => globalThis.document.fonts.ready.then(() => {}));
  const missing = await page.evaluate(
    (fonts) => fonts.filter((f) => !globalThis.document.fonts.check(f)),
    FONTS,
  );
  if (missing.length > 0) {
    console.error(`fonts not loaded: ${missing.join(', ')}`);
    process.exitCode = 1;
  } else {
    await page.screenshot({
      path: here('../../packages/docs/public/og.jpg'),
      type: 'jpeg',
      quality: 85,
    });
    console.log('wrote packages/docs/public/og.jpg');
  }
} finally {
  await browser.close();
}
