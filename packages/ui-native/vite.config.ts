import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { defineConfig } from 'vite';

const here = fileURLToPath(new URL('.', import.meta.url));
const r = (p: string) => resolve(here, p);

// The peers (with their subpaths, e.g. `react/jsx-runtime`) stay external, so
// Metro (or Vite, through react-native-web) resolves `react` and `react-native`
// in the consuming app. `@bilo-io/ui` is a devDependency and is NOT external:
// the token values are read from `@bilo-io/ui/tokens` at build time and inlined
// into dist, so the published package has no runtime dependency on the web
// library (and an RN app never installs its DOM-only dependencies).
const pkg = JSON.parse(readFileSync(r('package.json'), 'utf8')) as {
  peerDependencies?: Record<string, string>;
};
const external = Object.keys(pkg.peerDependencies ?? {}).map(
  (name) => new RegExp(`^${name}(?:/.*)?$`),
);

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['src'],
      exclude: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
      // One dist/index.d.ts, with the token types it names (`Hsl`, `ColorScale`)
      // copied in from @bilo-io/ui, so the types need no @bilo-io/ui either.
      rollupTypes: true,
      bundledPackages: ['@bilo-io/ui'],
    }),
  ],
  build: {
    lib: {
      entry: { index: r('src/index.ts') },
      formats: ['es'],
    },
    // The crescent PNGs are imported `?inline`, so they ship as data URIs inside
    // dist/index.js: an `Image` takes `{ uri }` on every platform, and no asset
    // pipeline (Metro's or a web bundler's) has to find a file next to the JS.
    rollupOptions: { external },
  },
});
