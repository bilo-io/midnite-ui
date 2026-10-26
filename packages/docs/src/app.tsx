import { useEffect, useState, type ReactNode } from 'react';
import { MDXProvider } from '@mdx-js/react';
import { HashRouter, Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import {
  Boxes,
  Brush,
  FileText,
  Globe,
  Home,
  Lock,
  Monitor,
  Palette,
  Rocket,
  Wrench,
} from 'lucide-react';
import {
  GithubIcon,
  MidniteLogo,
  NeuroCloudBackground,
  ReadingLayout,
  ReadingLayoutProvider,
  TableOfContents,
  type ReadingLinkProps,
} from '@bilo-io/ui';
import { AppFrame, type NavConfig, type NavLinkComponent } from '@bilo-io/shell';

import { DocPage } from './components/doc-page';
import { mdxComponents } from './components/mdx-components';
import { ThemeToggle } from './components/theme-toggle';
import { nav, routes } from './content/registry';

// This site IS the shell demo: the layout is @bilo-io/shell's <AppFrame>, wired
// exactly the way a host app wires it — an injected nav config derived from the
// MDX content glob, react-router's <Link> as the injected link component, and
// the current hash-route path as `activePath`. Hash routing keeps every deep
// link servable from index.html on any static host (GitHub Pages included).

/**
 * Adapts react-router's `Link` to the shape the shared prose map expects, so
 * root-relative links inside authored docs (`/ui/theming`) stay inside the hash
 * router instead of asking the static host for a path it can't serve.
 */
function RouterReadingLink({ href, className, children }: ReadingLinkProps) {
  return (
    <Link to={href} className={className}>
      {children}
    </Link>
  );
}

/** The AppFrame link renderer — same adaptation, shell prop shape. */
const RouterNavLink: NavLinkComponent = ({ href, className, children, ...rest }) => (
  <Link to={href} className={className} {...rest}>
    {children}
  </Link>
);

/** Rail icons per route (the collapsed rail and mobile tabs render icon-only). */
const ROUTE_ICONS: Record<string, ReactNode> = {
  '/': <Home />,
  '/getting-started': <Rocket />,
  '/ui/components': <Boxes />,
  '/ui/theming': <Palette />,
  '/shell/app-frame': <Monitor />,
  '/shell/appearance': <Brush />,
  '/shell/lock-screen': <Lock />,
  '/shell/title-bar': <Monitor />,
  '/shell/i18n': <Globe />,
  '/development': <Wrench />,
};

const iconFor = (path: string): ReactNode => ROUTE_ICONS[path] ?? <FileText />;

// The nav config handed to <AppFrame>: the Introduction pages ride as pinned
// items (no section header); every other content section becomes a collapsible
// rail section. Both derive from the same MDX glob as the route table, so
// adding a doc page = adding a file.
const NAV_CONFIG: NavConfig = {
  pinned: nav
    .filter((group) => group.section === 'Introduction')
    .flatMap((group) =>
      group.items.map((item) => ({ href: item.path, label: item.title, icon: iconFor(item.path) })),
    ),
  sections: nav
    .filter((group) => group.section !== 'Introduction')
    .map((group) => ({
      key: group.section,
      title: group.section,
      items: group.items.map((item) => ({
        href: item.path,
        label: item.title,
        icon: iconFor(item.path),
      })),
    })),
  brand: ({ expanded }) => (
    <Link to="/" aria-label="Midnite UI docs" className="flex items-center px-1">
      <MidniteLogo product="UI" size={22} markOnly={!expanded} className="text-sm" />
    </Link>
  ),
  footer: ({ expanded }) => (
    <>
      <a
        href="./storybook/"
        className="flex h-9 items-center gap-3 rounded-md px-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
        aria-label="Storybook"
      >
        <Boxes className="h-4 w-4 shrink-0" />
        {expanded ? <span>Storybook</span> : null}
      </a>
      <a
        href="https://github.com/bilo-io/midnite-ui"
        target="_blank"
        rel="noreferrer noopener"
        className="flex h-9 items-center gap-3 rounded-md px-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
        aria-label="GitHub"
      >
        <GithubIcon className="h-4 w-4 shrink-0" />
        {expanded ? <span>GitHub</span> : null}
      </a>
      <ThemeToggle />
    </>
  ),
};

/** The shell frame around every page — AppFrame rail + reading columns + backdrop. */
function Frame({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();

  // The neuro-cloud starfield backdrop (from @bilo-io/ui). Animate unless the
  // visitor prefers reduced motion — the canvas owns no motion gating of its own.
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setAnimate(!mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return (
    // `relative isolate` + the opaque `bg-background` base lets the fixed
    // starfield pin at `-z-10` behind the AppFrame rail + prose floating over it.
    <div className="relative isolate min-h-screen bg-background text-foreground">
      <NeuroCloudBackground animate={animate} className="fixed inset-0 -z-10" />
      <AppFrame
        nav={NAV_CONFIG}
        activePath={pathname}
        linkComponent={RouterNavLink}
        navMode="expanded"
        navLabel="Documentation"
      >
        <ReadingLayout toc={<TableOfContents />} articleClassName="py-10 pb-16">
          {children}
        </ReadingLayout>
      </AppFrame>
    </div>
  );
}

export function App() {
  return (
    // Both providers wrap the whole router so every MDX page gets the same
    // typography and the same router-aware links.
    <ReadingLayoutProvider linkComponent={RouterReadingLink}>
      <MDXProvider components={mdxComponents}>
        <HashRouter>
          <Frame>
            <Routes>
              {routes.map((route) => (
                <Route key={route.path} path={route.path} element={<DocPage route={route} />} />
              ))}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Frame>
        </HashRouter>
      </MDXProvider>
    </ReadingLayoutProvider>
  );
}
