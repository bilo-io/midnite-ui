import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { defineConfig } from 'vite';

const here = fileURLToPath(new URL('.', import.meta.url));
const r = (p: string) => resolve(here, p);

// Same library build as @bilo-io/ui: every dependency and peer (with its
// subpaths, e.g. `@bilo-io/ui/tokens`, `react/jsx-runtime`) stays external, so
// the bundle is this package's code alone and Metro (or Vite, through
// react-native-web) resolves `react-native` in the consuming app.
const pkg = JSON.parse(readFileSync(r('package.json'), 'utf8')) as {
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
};
const external = [
  ...Object.keys(pkg.peerDependencies ?? {}),
  ...Object.keys(pkg.dependencies ?? {}),
].map((name) => new RegExp(`^${name}(?:/.*)?$`));

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['src'],
      exclude: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
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
