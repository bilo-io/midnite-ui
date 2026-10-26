import { Menu, Search } from 'lucide-react';

import { GithubIcon, MidniteLogo, ThemeToggle } from '@bilo-io/ui';

import { hrefFor } from '../router';

export const REPO_URL = 'https://github.com/bilo-io/midnite-ui';
export const DOCS_URL = '../';
export const STORYBOOK_URL = '../storybook/';

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);

export function TopBar({ onSearch, onMenu }: { onSearch: () => void; onMenu: () => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-md">
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
          href={hrefFor({ page: 'home' })}
          aria-label="Midnite UI showcase"
          className="flex shrink-0 items-center gap-3 rounded-md transition hover:opacity-80"
        >
          <MidniteLogo product="UI" className="text-[0.95rem] tracking-tight" />
          <span className="hidden rounded-full border border-border/60 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground min-[420px]:inline">
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

        <nav className="ml-auto flex items-center gap-2 sm:ml-0">
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
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <GithubIcon className="h-4 w-4" />
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
