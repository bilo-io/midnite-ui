# midnite ui

The design system extracted from [midnite](https://github.com/bilo-io/midnite-app):
React primitives + design tokens, and a wired app shell — as installable packages.

**Docs:** https://bilo-io.github.io/midnite-ui/ · **Storybook:** https://bilo-io.github.io/midnite-ui/storybook/

| Package | What it is |
| --- | --- |
| [`@bilo-io/ui`](packages/ui) | Leaf design system: ~25 generic React primitives (buttons, cards, inputs, tabs, gauges, charts, reading typography, the neuro-cloud starfield) + HSL design tokens + a light/dark/system/time theme runtime. Depends on nothing but React. |
| [`@bilo-io/shell`](packages/shell) | The wired app shell: `AppFrame` (route-aware nav rail + mobile tabs + content region), `LockScreen`, `TitleBar` (frameless desktop chrome), an appearance runtime (accent gradients, density, motion, backgrounds), and a locale provider. Depends only on `@bilo-io/ui`. |
| [`packages/docs`](packages/docs) | The documentation site — a Vite + MDX SPA **mounted inside the shell's `AppFrame`**, deployed to GitHub Pages. |

## Install

The packages are published to **GitHub Packages** under the `@bilo-io` scope.
GitHub's npm registry requires auth even for public packages, so create a
personal access token with the `read:packages` scope, then add to your `.npmrc`:

```ini
@bilo-io:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

```bash
pnpm add @bilo-io/ui @bilo-io/shell
```

`react` / `react-dom` v19 are peer dependencies. `@bilo-io/shell` additionally
peers on `@tanstack/react-query` (for `ShellProviders`) and `next-intl` (for
`LocaleProvider`) — only needed if you use those pieces.

## Usage

### Theme + tokens (`@bilo-io/ui`)

```tsx
import { ThemeProvider } from '@bilo-io/ui/theme';
import { Button, Card } from '@bilo-io/ui';
import '@bilo-io/ui/styles'; // HSL token custom properties + .dark block

createRoot(container).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>,
);
```

The library ships **no compiled utility CSS** — your Tailwind build generates the
classes. Map the tokens to Tailwind colors and scan the libraries' shipped code:

```ts
// tailwind.config.ts
content: [
  './src/**/*.{ts,tsx}',
  './node_modules/@bilo-io/ui/dist/**/*.js',
  './node_modules/@bilo-io/shell/dist/**/*.js',
],
```

See [Theming & tokens](https://bilo-io.github.io/midnite-ui/#/ui/theming) for the
full token→color mapping.

### App shell (`@bilo-io/shell`)

```tsx
import { AppFrame } from '@bilo-io/shell';
import '@bilo-io/shell/appearance.css';

<AppFrame
  nav={{
    pinned: [{ href: '/', label: 'Home', icon: <Home /> }],
    sections: [{ title: 'App', items: [{ href: '/tasks', label: 'Tasks' }] }],
  }}
  activePath={pathname}
  linkComponent={Link} // next/link, react-router Link, or omit for plain <a>
>
  {children}
</AppFrame>;
```

The shell is router-agnostic and data-free: the active path, link component, nav
config, and all visible copy arrive as props. The [docs site](https://bilo-io.github.io/midnite-ui/)
is itself mounted inside `AppFrame` — read its source in [`packages/docs`](packages/docs)
for a complete, working wiring.

## Development

This is a [moon](https://moonrepo.dev) + [proto](https://moonrepo.dev/proto) + pnpm monorepo.

```bash
proto install            # pinned node / pnpm / moon
pnpm install

moon run :build          # build everything (ui → shell → docs)
moon run :test           # all suites (unit + jsdom + Storybook browser tests)
moon run :typecheck
moon run :lint

moon run docs:dev        # docs site on :5173
moon run ui:storybook    # component workbench on :6007
```

The dependency graph is strict and one-way — `ui ← shell ← docs` — enforced in CI
by a `boundary.test.ts` in each package.

## Releasing

- **CI** (`.github/workflows/ci.yml`) runs `moon ci` on every PR and push to main.
- **Pages** (`pages.yml`) deploys the docs site + Storybook on every push to main.
- **Publish** (`publish.yml`) publishes both libraries to GitHub Packages when a
  GitHub Release is published (or via manual dispatch).

## License

[MIT](LICENSE)
