// Typed design tokens — the TS mirror of `styles/tokens.css` for JS consumers.
//
// The CSS custom properties in `styles/tokens.css` are the canonical RUNTIME
// source of truth (they cascade + flip with `.dark`); this map exposes the same
// values to TypeScript (charts, canvas, inline styles, docs specimens). Keep the
// two in sync — the CSS leads, this follows.
//
// The DS taxonomy below is filled end-to-end: `spacing`/`typography`/`shadow`/
// `motion` carry Tailwind's default values (what web already uses), so React
// Native consumers can read them without a second source.

/** A bare HSL triplet (`H S% L%`), consumed as `hsl(var(--token))` / `hsl(${value})`. */
export type Hsl = string;

/** Semantic color tokens for one theme — mirrors the `:root` / `.dark` blocks. */
export type ColorScale = {
  background: Hsl;
  foreground: Hsl;
  card: Hsl;
  cardForeground: Hsl;
  primary: Hsl;
  primaryForeground: Hsl;
  secondary: Hsl;
  secondaryForeground: Hsl;
  muted: Hsl;
  mutedForeground: Hsl;
  accent: Hsl;
  accentForeground: Hsl;
  destructive: Hsl;
  destructiveForeground: Hsl;
  success: Hsl;
  successForeground: Hsl;
  popover: Hsl;
  popoverForeground: Hsl;
  border: Hsl;
  input: Hsl;
  ring: Hsl;
};

export const color: { light: ColorScale; dark: ColorScale } = {
  light: {
    background: '0 0% 100%',
    foreground: '240 10% 3.9%',
    card: '0 0% 100%',
    cardForeground: '240 10% 3.9%',
    primary: '240 5.9% 10%',
    primaryForeground: '0 0% 98%',
    secondary: '240 4.8% 95.9%',
    secondaryForeground: '240 5.9% 10%',
    muted: '240 4.8% 95.9%',
    mutedForeground: '240 3.8% 46.1%',
    accent: '240 4.8% 95.9%',
    accentForeground: '240 5.9% 10%',
    destructive: '0 84.2% 60.2%',
    destructiveForeground: '0 0% 98%',
    success: '142 71% 36%',
    successForeground: '0 0% 98%',
    popover: '0 0% 100%',
    popoverForeground: '240 10% 3.9%',
    border: '240 5.9% 90%',
    input: '240 5.9% 90%',
    ring: '240 5.9% 10%',
  },
  dark: {
    background: '240 10% 3.9%',
    foreground: '0 0% 98%',
    card: '240 10% 5.5%',
    cardForeground: '0 0% 98%',
    primary: '0 0% 98%',
    primaryForeground: '240 5.9% 10%',
    secondary: '240 3.7% 15.9%',
    secondaryForeground: '0 0% 98%',
    muted: '240 3.7% 15.9%',
    mutedForeground: '240 5% 64.9%',
    accent: '240 3.7% 15.9%',
    accentForeground: '0 0% 98%',
    destructive: '0 62.8% 30.6%',
    destructiveForeground: '0 0% 98%',
    success: '142 65% 48%',
    successForeground: '0 0% 98%',
    popover: '240 10% 7%',
    popoverForeground: '0 0% 98%',
    border: '240 3.7% 15.9%',
    input: '240 3.7% 15.9%',
    ring: '240 4.9% 83.9%',
  },
};

/** Domain accent hues (task status, item kind, workflow-node category). */
export const accentHues = {
  status: {
    light: {
      backlog: '240 4% 50%',
      todo: '217 91% 60%',
      wip: '38 92% 50%',
      waiting: '280 65% 60%',
      done: '142 71% 45%',
      abandoned: '0 0% 60%',
    },
    dark: {
      backlog: '240 5% 65%',
      todo: '217 91% 68%',
      wip: '38 92% 60%',
      waiting: '280 65% 70%',
      done: '142 71% 55%',
      abandoned: '0 0% 50%',
    },
  },
  kind: {
    light: {
      bug: '0 84% 60%',
      feature: '262 83% 58%',
      question: '217 91% 60%',
      chore: '240 4% 46%',
      unknown: '240 4% 60%',
    },
    dark: {
      bug: '0 84% 65%',
      feature: '262 83% 68%',
      question: '217 91% 68%',
      chore: '240 5% 60%',
      unknown: '240 5% 55%',
    },
  },
  node: {
    light: {
      trigger: '217 91% 60%',
      action: '262 83% 58%',
      logic: '38 92% 50%',
      data: '173 80% 40%',
      storage: '333 80% 52%',
    },
    dark: {
      trigger: '217 91% 68%',
      action: '262 83% 68%',
      logic: '38 92% 60%',
      data: '173 70% 50%',
      storage: '333 75% 62%',
    },
  },
} as const;

/** One theme's brand ramp: six stops, left to right, and the glow behind the letterforms. */
export type BrandScale = {
  ramp: readonly [Hsl, Hsl, Hsl, Hsl, Hsl, Hsl];
  glow: Hsl;
};

/**
 * The wordmark's rainbow ramp + glow — the TS mirror of `--brand-rainbow-0…5`
 * and `--brand-glow` in `styles/brand.css` (the CSS leads). The light ramp is
 * the darker re-cut that holds 4.5:1 on a light background.
 */
export const brand: { light: BrandScale; dark: BrandScale } = {
  light: {
    ramp: [
      '217 84% 43%',
      '235 58% 50%',
      '258 62% 48%',
      '271 65% 46%',
      '285 56% 40%',
      '308 58% 42%',
    ],
    glow: '258 62% 52%',
  },
  dark: {
    ramp: [
      '217 95% 58%',
      '235 88% 68%',
      '258 90% 66%',
      '271 91% 65%',
      '285 80% 60%',
      '308 78% 58%',
    ],
    glow: '258 82% 62%',
  },
};

/** Border-radius scale — derived from `--radius` (0.5rem), shadcn convention. */
export const radius = {
  sm: 'calc(0.5rem - 4px)',
  md: 'calc(0.5rem - 2px)',
  lg: '0.5rem',
  base: '0.5rem',
  full: '9999px',
} as const;

// ── Scales ──────────────────────────────────────────────────────────────────
// The values equal Tailwind's defaults, which web already uses, so no web
// consumer changes. Lengths are rem (or px) strings so React Native's `toDp`
// reads them.

/** Spacing scale — Tailwind's default steps, in rem. Keys are the Tailwind step names. */
export const spacing = {
  '0': '0',
  '0.5': '0.125rem',
  '1': '0.25rem',
  '2': '0.5rem',
  '3': '0.75rem',
  '4': '1rem',
  '5': '1.25rem',
  '6': '1.5rem',
  '8': '2rem',
  '10': '2.5rem',
  '12': '3rem',
} as const;

/** Typography scale — sizes with their line heights, weights and families. */
export const typography = {
  fontSize: {
    xs: { fontSize: '0.75rem', lineHeight: '1rem' },
    sm: { fontSize: '0.875rem', lineHeight: '1.25rem' },
    base: { fontSize: '1rem', lineHeight: '1.5rem' },
    lg: { fontSize: '1.125rem', lineHeight: '1.75rem' },
    xl: { fontSize: '1.25rem', lineHeight: '1.75rem' },
    '2xl': { fontSize: '1.5rem', lineHeight: '2rem' },
  },
  fontWeight: { regular: 400, medium: 500, semibold: 600 },
  fontFamily: {
    sans: 'system-ui, sans-serif',
    mono: 'ui-monospace, Menlo, monospace',
  },
} as const;

/**
 * Elevation scale. `offsetY` and `blur` are CSS-shadow lengths (the shadow's
 * colour is always black); `elevation` is the Android elevation for the same step.
 */
export const shadow = {
  '0': { offsetY: '0', blur: '0', opacity: 0, elevation: 0 },
  '1': { offsetY: '1px', blur: '2px', opacity: 0.05, elevation: 1 },
  '2': { offsetY: '2px', blur: '6px', opacity: 0.1, elevation: 3 },
  '3': { offsetY: '6px', blur: '12px', opacity: 0.15, elevation: 6 },
} as const;

/** z-index scale — the stacking levels the UI relies on. */
export const zIndex = {
  dropdown: 50,
  tooltip: 50,
  fab: 40,
  scrim: 45,
  sheet: 50,
  placeholder: true,
} as const;

/** Motion tokens — durations in ms and the standard easing as cubic-bezier control points. */
export const motion = {
  duration: { fast: 120, base: 200, slow: 320 },
  easing: { standard: [0.2, 0, 0, 1] },
} as const;

/** Overlay tokens — the scrim behind a sheet or speed dial: black at 0.5, in both schemes. */
export const overlay = {
  scrim: { hsl: '0 0% 0%', alpha: 0.5 },
} as const;

/** The full design-system token map. every scale filled. */
export const tokens = {
  color,
  accentHues,
  brand,
  radius,
  spacing,
  typography,
  shadow,
  zIndex,
  motion,
  overlay,
} as const;
