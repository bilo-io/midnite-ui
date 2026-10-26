import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

import { findComponent } from './catalog';
import { CommandPalette } from './components/command-palette';
import { ComponentPage } from './components/component-page';
import { HomePage } from './components/home-page';
import { Sidebar } from './components/sidebar';
import { TokensPage } from './components/tokens-page';
import { TopBar } from './components/top-bar';
import { useRoute } from './router';

export function App() {
  const route = useRoute();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // ⌘K / Ctrl+K anywhere, and "/" when not typing, open the search palette.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing =
        !!target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => setMenuOpen(false), [route]);

  const doc = route.page === 'component' ? findComponent(route.id) : undefined;

  let page;
  if (route.page === 'tokens') page = <TokensPage />;
  else if (route.page === 'component' && doc)
    page = <ComponentPage doc={doc} example={route.example} />;
  else if (route.page === 'component')
    page = (
      <div className="py-24 text-center">
        <h1 className="text-2xl font-semibold">No component called “{route.id}”</h1>
        <a href="#/" className="mt-4 inline-block text-sm text-muted-foreground underline">
          Back to the overview
        </a>
      </div>
    );
  else page = <HomePage />;

  return (
    <div className="min-h-screen">
      <TopBar onSearch={() => setPaletteOpen(true)} onMenu={() => setMenuOpen(true)} />

      <div className="mx-auto flex max-w-[1400px] gap-10 px-4 sm:px-6">
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-56 shrink-0 overflow-y-auto py-8 lg:block">
          <Sidebar route={route} />
        </aside>
        <main className="min-w-0 flex-1 py-8 lg:py-10">{page}</main>
      </div>

      {menuOpen ? (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
        >
          <div
            className="absolute inset-0 bg-background/60 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 overflow-y-auto border-r border-border/60 bg-background p-4">
            <div className="mb-4 flex justify-end">
              <button
                type="button"
                aria-label="Close navigation"
                onClick={() => setMenuOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <Sidebar route={route} onNavigate={() => setMenuOpen(false)} />
          </div>
        </div>
      ) : null}

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
}
