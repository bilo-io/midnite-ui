/**
 * Internationalization contract.
 *
 * The set of languages the shell targets, the persisted `locale` preference
 * value, and the pure locale-resolution helper. Hand-written unions (no zod) —
 * the shell only needs the shapes, never runtime validation.
 */

/** The supported UI locales. en-GB is the canonical/source locale; others fall back to it. */
export type Locale = 'en-GB' | 'de-DE' | 'fr-FR' | 'es-ES';

/** The canonical source locale; the fallback when a locale can't be resolved or a key is missing. */
export const DEFAULT_LOCALE: Locale = 'en-GB';

/** Every supported locale code, in display order (single source of truth for the union members). */
export const SUPPORTED_LOCALE_CODES: readonly Locale[] = ['en-GB', 'de-DE', 'fr-FR', 'es-ES'];

/**
 * Resolve the active locale from the persisted preference and the browser
 * language, in order: **stored pref → nearest browser locale → default**.
 *
 * Deliberately **self-contained** (no module-level references — `codes` and `def`
 * are passed in) so its source can be embedded verbatim in the pre-paint init
 * script (`localeInitScript`) via `.toString()`, giving one implementation shared
 * by the runtime, the init script, and the tests — no drift.
 * A tag matches a code exactly (`de-DE`) or by language prefix (`de`, `de-AT` →
 * `de-DE`); an unmatched tag falls through to the next candidate.
 */
export function resolveLocale(
  stored: string | null | undefined,
  navigatorLanguage: string | null | undefined,
  codes: readonly Locale[],
  def: Locale,
): Locale {
  function nearest(tag: string | null | undefined): Locale | null {
    if (!tag) return null;
    const lower = String(tag).toLowerCase();
    for (let i = 0; i < codes.length; i++) {
      if (codes[i]!.toLowerCase() === lower) return codes[i]!;
    }
    const lang = lower.split('-')[0];
    for (let j = 0; j < codes.length; j++) {
      if (codes[j]!.toLowerCase().split('-')[0] === lang) return codes[j]!;
    }
    return null;
  }
  return nearest(stored) ?? nearest(navigatorLanguage) ?? def;
}
