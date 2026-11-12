import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

import { reactNativeWeb } from './react-native-web.config';

// The showcase is a plain Vite + React SPA — a pure consumer of @bilo-io/ui and
// @bilo-io/ui-native. It is deployed under the Pages site's /showcase/ path,
// next to the docs and Storybook, so the base is relative and navigation is
// hash-routed.
export default defineConfig(({ mode }) => ({
  base: './',
  // Deterministic ports, one past docs' so both can run at once.
  server: { port: 5174, strictPort: true },
  preview: { port: 4174, strictPort: true },
  // The library's agent marks, served at ./agents/ so the published-files example
  // renders in dev as on the deployed site.
  publicDir: '../ui/assets',
  plugins: [react()],
  ...reactNativeWeb(mode),
}));
