# @bilo-io/shell

The wired app shell: the frame a host app mounts around its pages. A mid-tier
package that depends only on `@bilo-io/ui` (React, react-dom,
`@tanstack/react-query`, and `next-intl` are peers) — enforced by
`src/boundary.test.ts`.

## What's inside

| Piece | Purpose |
| --- | --- |
| `AppFrame` | Route-aware desktop nav rail (auto/hover-expand or locked), mobile bottom tabs + `More` sheet, padded content region. Nav config, active path, and link component are all injected — router-agnostic. |
| `LockScreen` + `useIdleTimer` | Full-viewport lock/screensaver on the starfield, optional passcode gate; all copy and slots injected. |
| `TitleBar` | Renderer-drawn chrome for a frameless Electron window, driven by a host-implemented `WindowChromeBridge` (a pure type — shell does no IPC). |
| Appearance runtime | `applyAccent`, `applyBackground`, `applyDensity`, `applyMotion`, `applyUiFont`, `applyEffects`, … + `appearanceInitScript` for pre-paint application. Styles live in `@bilo-io/shell/appearance.css`. |
| `LocaleProvider` + `localeInitScript` + `resolveLocale` | next-intl-based locale runtime; pre-paint `<html lang>` stamping. |
| `ShellProviders` | Convenience wrapper composing `ThemeProvider` + `QueryClientProvider` around a host-supplied `QueryClient` (mount `LocaleProvider` separately if you use it). |

## Design rules

- **No copy**: every visible string arrives via a labels prop (an ESLint i18n
  gate on `src/**/*.tsx` enforces it).
- **No data**: no fetching, no router, no storage ownership beyond the
  appearance/locale localStorage keys it documents.
- `resolveLocale` and the appearance appliers are embedded into init scripts via
  `.toString()` — they must stay self-contained (no module-level references).
- The vendored type contracts (`src/contracts/`) mirror the midnite app's shared
  schemas as plain string unions.

## Usage

See the [AppFrame docs](https://bilo-io.github.io/midnite-ui/#/shell/app-frame) —
and note the docs site itself is mounted inside `AppFrame`
([`packages/docs/src/app.tsx`](../docs/src/app.tsx) is a complete working host).
