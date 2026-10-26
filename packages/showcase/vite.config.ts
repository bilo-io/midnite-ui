import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// The showcase is a plain Vite + React SPA — a pure consumer of @bilo-io/ui. It
// is deployed under the Pages site's /showcase/ path, next to the docs and
// Storybook, so the base is relative and navigation is hash-routed.
export default defineConfig({
  base: './',
  // Deterministic ports, one past docs' so both can run at once.
  server: { port: 5174, strictPort: true },
  preview: { port: 4174, strictPort: true },
  plugins: [react()],
});
