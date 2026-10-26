import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// Component + helper tests run in jsdom (RTL).
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    setupFiles: ['./vitest.setup.ts'],
  },
});
