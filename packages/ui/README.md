# @bilo-io/ui

The leaf design-system package: generic React primitives + HSL design tokens +
the theme runtime. It depends on **nothing else in this repo** (React is a peer
dependency) — enforced by `src/boundary.test.ts`.

## Exports

| Entry | Contents |
| --- | --- |
| `@bilo-io/ui` | The primitives (`Button`, `Card`, `Input`, `Tabs`, `Select`, `Accordion`, `Collapse`, `AreaChart`, `RadialGauge`, `MetricDial`, `ReadingLayout`, `Prose`, `TableOfContents`, `NeuroCloudBackground`, `PasscodePad`, brand icons, …), `cn`, and the typed token constants |
| `@bilo-io/ui/theme` | `ThemeProvider`, `useTheme`, `themeInitScript`, `THEME_STORAGE_KEY` — light/dark/system/time resolution + the `.dark` toggle on `<html>` |
| `@bilo-io/ui/styles` | `tokens.css` — the HSL custom properties (`:root` + `.dark`), framework-agnostic |
| `@bilo-io/ui/code-highlight.css` | highlight.js token palette matched to the design tokens |

The library ships no compiled utility CSS: consumers run their own Tailwind over
the primitives' class names (add `./node_modules/@bilo-io/ui/dist/**/*.js` to
your `content` globs) with the token→color mapping from the docs.

## Development

```bash
moon run ui:build            # Vite library build (+ vite-plugin-dts types)
moon run ui:test             # unit + jsdom + Storybook browser tests
moon run ui:storybook        # workbench on :6007
moon run ui:build-storybook  # static catalog (deployed under /storybook/ on Pages)
```

Docs: https://bilo-io.github.io/midnite-ui/ · Storybook: https://bilo-io.github.io/midnite-ui/storybook/
