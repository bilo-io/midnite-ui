import type { UserConfig } from 'vite';

/**
 * The Mobile mode renders @bilo-io/ui-native's React Native components in the
 * page through react-native-web. Shared by vite.config.ts and vitest.config.ts
 * so the app and its tests resolve `react-native` the same way.
 *
 * - `react-native` → `react-native-web`, as an exact match: RNW's own imports
 *   and any `react-native/...` subpath are left alone.
 * - `.web.*` first: RN libraries ship web forks under that suffix.
 * - `__DEV__`: the RN global some libraries read; RNW itself uses NODE_ENV.
 * - `global`: RNW's Animated calls `global.cancelAnimationFrame` when an
 *   animation stops, which throws in a browser without this.
 * - `dedupe`: one React (and one RNW) for the app and the linked ui-native dist.
 */
export function reactNativeWeb(mode: string): Pick<UserConfig, 'resolve' | 'define'> {
  return {
    resolve: {
      alias: [{ find: /^react-native$/, replacement: 'react-native-web' }],
      extensions: [
        '.web.mjs',
        '.web.js',
        '.web.mts',
        '.web.ts',
        '.web.jsx',
        '.web.tsx',
        '.mjs',
        '.js',
        '.mts',
        '.ts',
        '.jsx',
        '.tsx',
        '.json',
      ],
      dedupe: ['react', 'react-dom', 'react-native-web'],
    },
    define: { __DEV__: JSON.stringify(mode !== 'production'), global: 'globalThis' },
  };
}
