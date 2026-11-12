import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// The components are React Native, rendered in jsdom through react-native-web:
// `react-native` is aliased to it (exact match, so `react-native-web` itself and
// any `react-native/...` subpath are untouched) and Testing Library queries the
// DOM it emits. That checks behaviour and the accessibility mapping, not native
// layout.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: /^react-native$/, replacement: 'react-native-web' }],
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    setupFiles: ['./vitest.setup.ts'],
  },
});
