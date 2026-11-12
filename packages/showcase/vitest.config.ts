import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

import { reactNativeWeb } from './react-native-web.config';

// Component + helper tests run in jsdom (RTL). `react-native` resolves to
// react-native-web exactly as in the app, so the native examples render here.
export default defineConfig({
  plugins: [react()],
  ...reactNativeWeb('test'),
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    setupFiles: ['./vitest.setup.ts'],
  },
});
