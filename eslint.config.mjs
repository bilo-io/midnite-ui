import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import i18next from 'eslint-plugin-i18next';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

// The no-hardcoded-string gate is default-on for every `.tsx` under
// `packages/shell/src` — shell's label-injection API (LockScreenLabels,
// AppMobileNavLabels, …) exists precisely so hosts own all visible copy.
// Test/story fixtures are excluded (they carry deliberate literal strings).
const I18N_GATED = ['packages/shell/src/**/*.tsx'];
const I18N_NON_COPY = ['**/*.test.tsx', '**/*.spec.tsx', '**/*.stories.tsx'];

export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/out/**',
      '**/build/**',
      '**/storybook-static/**',
      '**/coverage/**',
      '**/node_modules/**',
      '**/*.stories.tsx',
      '**/*.stories.ts',
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  // TypeScript/TSX sources — node + browser globals cover configs and components.
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      globals: { ...globals.node, ...globals.browser },
    },
    plugins: { 'react-hooks': reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'no-console': 'error',
      // Allow intentionally-unused args prefixed with _ (common in stubs/handlers).
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      // Best-effort cleanup catches are intentional.
      'no-empty': ['error', { allowEmptyCatch: true }],
    },
  },

  // Dependency-free CJS/MJS build + config scripts: require() + console ok.
  {
    files: ['**/*.cjs', '**/*.mjs'],
    languageOptions: { globals: { ...globals.node } },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      'no-console': 'off',
    },
  },

  // i18n no-hardcoded-string gate — `jsx-text-only` targets visible copy (JSX
  // text) and ignores structural attributes (className, data-*, aria/role).
  {
    files: I18N_GATED,
    ignores: I18N_NON_COPY,
    plugins: { i18next },
    rules: {
      'i18next/no-literal-string': ['error', { mode: 'jsx-text-only' }],
    },
  },

  // Keep ESLint out of Prettier's lane (formatting rules disabled).
  prettier,
);
