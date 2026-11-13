import { Menu, Monitor, Search, Smartphone } from 'lucide-react';

import { GithubIcon, MidniteLogo, ThemeToggle, cn } from '@bilo-io/ui';

import { findComponent } from '../catalog';
import { hrefFor, inMode, type Mode, modeOf, type Route, switchMode } from '../router';

export const REPO_URL = 'https://github.com/bilo-io/midnite-ui';
export const DOCS_URL = '../';
export const STORYBOOK_URL = '../storybook/';

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);

/** The showcase's name per platform: the wordmark's product half. */
export const PRODUCT: Record<Mode, string> = { web: 'UI', mobile: 'Mobile UI' };

const MODES: { mode: Mode; label: string; Icon: typeof Monitor }[] = [
  { mode: 'web', label: 'Web / Desktop', Icon: Monitor },
  { mode: 'mobile', label: 'Mobile', Icon: Smartphone },
];

const existsIn = (id: string, mode: Mode) => !!findComponent(id, mode);

/**
 * The platform switch: two links, because each mode is a URL (`#/…` and
 * `#/mobile/…`). It keeps you on the same component when the other platform
 * has one. Below `md` the labels fold into the icons' accessible names.
 */
export function ModeToggle({ route }: { route: Route }) {
  const current = modeOf(route);
  return (
    <div
      role="group"
      aria-label="Platform"
      className="inline-flex h-9 shrink-0 items-center rounded-full border border-border/60 bg-muted/40 p-0.5"
    >
      {MODES.map(({ mode, label, Icon }) => {
        const active = mode === current;
        return (
          <a
            key={mode}
            href={hrefFor(switchMode(route, mode, existsIn))}
            aria-current={active ? 'page' : undefined}
            aria-label={label}
            title={label}
            className={cn(
              'inline-flex h-8 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium transition-colors md:px-3',
              active
                ? 'bg-background text-foreground shadow-sm ring-1 ring-border/60'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Icon aria-hidden className="h-3.5 w-3.5" />
            <span className="hidden md:inline">{label}</span>
          </a>
        );
      })}
    </div>
  );
}

export function TopBar({
  route,
  onSearch,
  onMenu,
}: {
  route: Route;
  onSearch: () => void;
  onMenu: () => void;
}) {
  const mode = modeOf(route);
  const name = `Midnite ${PRODUCT[mode]}`;
  return (
    <header className="sticky top-0 z-40 overflow-x-clip border-b border-border/70 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-4 px-4 sm:px-6">
        <button
          type="button"
          aria-label="Open navigation"
          onClick={onMenu}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground lg:hidden"
        >
          <Menu className="h-4 w-4" />
        </button>
        <a
          href={hrefFor(inMode({ page: 'home' }, mode))}
          aria-label={`${name} showcase`}
          className="flex min-w-0 shrink items-center gap-3 rounded-md transition hover:opacity-80"
        >
          {/* Below 480px in Mobile mode the crescent stands in for the longer name. */}
          <MidniteLogo
            product={PRODUCT[mode]}
            className={cn(
              'text-[0.95rem] tracking-tight',
              mode === 'mobile' && 'max-[479px]:[&>.mui-wordmark]:hidden',
            )}
          />
          <span className="hidden rounded-full border border-border/60 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground xl:inline">
            showcase
          </span>
        </a>

        <button
          type="button"
          onClick={onSearch}
          className="mx-auto hidden h-9 w-full max-w-sm items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-4 text-sm text-muted-foreground transition-colors hover:border-border hover:text-foreground sm:flex"
        >
          <Search className="h-4 w-4" />
          <span>Search components…</span>
          <kbd className="ml-auto rounded border border-border/60 bg-background px-1.5 py-0.5 font-sans text-[10px]">
            {isMac ? '⌘' : 'Ctrl'} K
          </kbd>
        </button>

        <nav className="ml-auto flex shrink-0 items-center gap-1.5 sm:ml-0 sm:gap-2">
          <ModeToggle route={route} />
          <button
            type="button"
            aria-label="Search components"
            onClick={onSearch}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground sm:hidden"
          >
            <Search className="h-4 w-4" />
          </button>
          <div className="hidden items-center gap-6 px-2 md:flex">
            <a
              href={DOCS_URL}
              className="showcase-nav-tab text-sm text-muted-foreground transition hover:text-foreground"
            >
              Docs
            </a>
            <a
              href={STORYBOOK_URL}
              className="showcase-nav-tab text-sm text-muted-foreground transition hover:text-foreground"
            >
              Storybook
            </a>
          </div>
          <a
            href={REPO_URL}
            aria-label="GitHub repository"
            className="hidden h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground min-[400px]:inline-flex"
          >
            <GithubIcon className="h-4 w-4" />
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
