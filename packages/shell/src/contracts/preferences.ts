/**
 * Appearance/preference value contracts consumed by the shell's appearance
 * runtime. Hand-written string unions (no zod) — the shell only applies these
 * values to the DOM; parsing/validation is the host app's concern.
 */

/** Collapse/expand/lock behaviour of the side navigation. */
export type NavMode = 'auto' | 'expanded' | 'collapsed';

/**
 * Decorative backdrop pattern. `none` — a subtle theme-matching gradient wash
 * rather than a literal absence — is the quiet default; `starfield` (the
 * neuro-cloud galaxy) is the signature look.
 */
export type BackgroundPattern =
  | 'none'
  | 'starfield'
  | 'grid'
  | 'gradient'
  | 'dots'
  | 'topographic'
  | 'aurora'
  | 'plus-cross'
  | 'waves'
  | 'grain'
  | 'blueprint'
  | 'mesh-gradient';

/** The default backdrop for fresh installs (single source of truth). */
export const BACKGROUND_PATTERN_DEFAULT: BackgroundPattern = 'none';

/** Visibility level of the animated-gradient backdrop. */
export type BgIntensity = 'subtle' | 'balanced' | 'bold';

/** A single accent palette swatch — a hue+saturation slot (`default` = no override). */
export type AccentId =
  | 'default'
  | 'blue'
  | 'violet'
  | 'emerald'
  | 'amber'
  | 'rose'
  | 'cyan'
  | 'orange';

/**
 * Geometry of a gradient accent. `linear` sweeps along `angle`; `conic` sweeps
 * around the centre starting at `angle`.
 */
export type GradientType = 'linear' | 'conic';

/** The solid arm of {@link AccentValue}. */
export type AccentSolid = { kind: 'solid'; swatch: AccentId };

/**
 * The gradient arm of {@link AccentValue}. Named so a value that is *always* a
 * gradient can say so: annotating one with the whole union loses that, and
 * spreading it (`{ ...BRAND_ACCENT, animate: false }`) then fails excess-property
 * checking against the solid arm, which has no `animate`.
 */
export type AccentGradient = {
  kind: 'gradient';
  /** `'brand'` renders the signature conic rainbow; `'custom'` is user-built; other ids mark curated presets. */
  preset: string;
  type: GradientType;
  /** 1–3 palette swatches; a single stop renders as a mono-shade tonal sweep. */
  stops: AccentId[];
  /** 0–360 degrees. */
  angle: number;
  animate: boolean;
};

/** The accent value: a solid swatch or a gradient built from palette swatches. */
export type AccentValue = AccentSolid | AccentGradient;

/**
 * The default accent: the signature brand gradient — a Dusk-like linear sweep
 * (blue → violet → rose) that holds extra blue on the purple side (special-cased
 * in the applier/CSS).
 */
export const BRAND_ACCENT: AccentGradient = {
  kind: 'gradient',
  preset: 'brand',
  type: 'linear',
  stops: ['blue', 'violet', 'rose'],
  angle: 135,
  animate: true,
};

/** How much motion the app shows (honour OS / force off / force on). */
export type Motion = 'system' | 'reduced' | 'full';

/** UI density — `comfortable` (default) or `compact`. */
export type Density = 'comfortable' | 'compact';

/** Interface font for body text (`system` default; others are system-font stacks). */
export type UiFont = 'system' | 'grotesk' | 'humanist' | 'serif' | 'mono';

/** Per-effect visual toggles (page reveal, typewriter, frosted glass). */
export type VisualEffects = {
  pageReveal: boolean;
  typewriter: boolean;
  glass: boolean;
};

/**
 * Direction the status-pill shimmer cascades across a row: `ltr` (default) leads
 * with the left element and sweeps rightward; `rtl` leads with the right.
 */
export type ShimmerDirection = 'ltr' | 'rtl';
