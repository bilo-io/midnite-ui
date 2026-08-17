import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// Component + helper tests run in jsdom (RTL). The MDX rollup pipeline is not
// wired here — tests never import the compiled MDX content glob, so the runner
// needs only the React plugin, not the MDX transform.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    setupFiles: ['./vitest.setup.ts'],
  },
});
