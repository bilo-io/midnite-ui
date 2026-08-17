# `@bilo-io/shell`

The **wired app shell** both `web` and `admin` mount (Phase 73). Where
[`@bilo-io/ui`](../ui) is a leaf of generic, framework-agnostic visual primitives,
`@bilo-io/shell` is the mid-tier package that assembles them into the real,
data-coupled application chrome — the frame, the lock screen, the appearance
runtime, and the shared provider stack — behind injected configuration so it stays
app-agnostic.

## What's in it

- **`<AppFrame>`** — the injected-nav shell chrome: a fixed desktop rail + a mobile
  bottom-tab nav + a padded main content region. It's router-agnostic — the host
  injects its `nav` config, the active path (`activePath`), and a `linkComponent`
  (e.g. Next's `<Link>`), so the frame renders SPA navigation without importing any
  router. `web` feeds it a FEATURES-derived, collapsible nav; `admin` feeds it a
  fixed operator rail.
- **`<LockScreen>`** — the reusable idle/login lock rendered on the neuro-cloud
  starfield, plus `useIdleTimer` for arming it on inactivity.
- **`<ShellProviders>`** — the app-agnostic frame-level provider stack
  (theme + TanStack Query); the host passes in its own `QueryClient` and wraps its
  own data-coupled providers (auth, etc.) inside.
- **The appearance runtime** — the Phase 39/68 appliers (`applyAccent`,
  `applyMotion`, `applyDensity`, `applyBackground`, `applyEffects`, …), the
  `appearanceInitScript` for first-paint, and the appearance constants, driving the
  CSS shipped at the `@bilo-io/shell/appearance.css` subpath.

## Consuming it from a third app

Mount `<AppFrame>` and inject the three seams — a `NavConfig`, a `linkComponent`,
and the `activePath`:

```tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AppFrame, type NavConfig, type NavLinkComponent } from '@bilo-io/shell';

const NavLink: NavLinkComponent = ({ href, className, children, ...rest }) => (
  <Link href={href} className={className} {...rest}>
    {children}
  </Link>
);

const nav: NavConfig = {
  sections: [{ items: [{ href: '/', label: 'Home', icon: <HomeIcon aria-hidden /> }] }],
  // optional: brand / footer render props
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <AppFrame nav={nav} activePath={pathname} linkComponent={NavLink}>
      {children}
    </AppFrame>
  );
}
```

Wrap the app in `<ShellProviders queryClient={...}>` at the root, and import the
appearance CSS once: `import '@bilo-io/shell/appearance.css'`. See
[`packages/admin/components/app-shell-client.tsx`](../admin/components/app-shell-client.tsx)
for a complete, minimal reference wiring.

## Package boundary

`@bilo-io/shell` is **mid-tier**. It may depend on **`@midnite/shared` +
`@bilo-io/ui` only** (`react` / `react-dom` / `next` / `@tanstack/react-query` are
peer dependencies) — **never** on `web` / `admin` / `gateway` / `cli` / `desktop` /
`site`. The enforced dependency edge is:

```text
ui ◀ shell ◀ { web, admin }
```

`src/boundary.test.ts` pins this in CI (it fails if the source imports anything
outside the allowed set).
