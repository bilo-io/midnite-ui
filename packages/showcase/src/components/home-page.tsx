import { Suspense, useMemo, useState } from 'react';
import { ArrowRight, Search } from 'lucide-react';

import { Button, CopyButton, DynamicBackground, Wordmark, cn } from '@bilo-io/ui';

import { catalogFor, type Category, COMPONENTS } from '../catalog';
import { examplesFor } from '../examples';
import { NativeCardPreview } from '../mobile/lazy';
import { hrefFor, inMode, type Mode } from '../router';
import { searchComponents } from '../search';
import { InlineCode } from './props-table';
import { DOCS_URL } from './top-bar';

const INSTALL: Record<Mode, string> = {
  web: 'pnpm add @bilo-io/ui',
  mobile: 'pnpm add @bilo-io/ui-native',
};

export function HomePage({ mode = 'web' }: { mode?: Mode }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<Category | 'All'>('All');
  const { components, categories } = catalogFor(mode);

  const results = useMemo(
    () =>
      searchComponents(query, components).filter(
        ({ doc }) => category === 'All' || doc.category === category,
      ),
    [query, category, components],
  );

  return (
    <div className="space-y-14">
      {mode === 'mobile' ? <MobileHero /> : <WebHero />}

      <section id="browse" className="scroll-mt-20 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Components</h2>
            <p className="text-sm text-muted-foreground">
              {results.length === components.length ? 'All' : results.length} of {components.length}
            </p>
          </div>
          <label className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter by name, prop or keyword"
              aria-label="Filter components"
              className="h-10 w-full rounded-lg border border-border/60 bg-background pl-9 pr-3 text-sm outline-none ring-ring/30 transition focus:border-border focus:ring-2"
            />
          </label>
        </div>

        {/* One heading needs no filter: the Mobile catalog is a single category. */}
        {categories.length > 1 ? (
          <div className="flex flex-wrap gap-2" role="group" aria-label="Category">
            {(['All', ...categories] as const).map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={category === c}
                onClick={() => setCategory(c)}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs transition-colors',
                  category === c
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border/60 text-muted-foreground hover:border-border hover:text-foreground',
                )}
              >
                {c}
              </button>
            ))}
          </div>
        ) : null}

        {results.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border/60 p-10 text-center text-sm text-muted-foreground">
            Nothing matches “{query}”{category === 'All' ? '' : ` in ${category}`}.
          </p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {results.map(({ doc }) => {
              const Preview = mode === 'web' ? examplesFor(doc.id)[0]?.Component : undefined;
              return (
                <li key={doc.id}>
                  <a
                    href={hrefFor(inMode({ page: 'component', id: doc.id }, mode))}
                    className="group flex h-full flex-col overflow-hidden rounded-xl border border-border/60 bg-card transition hover:-translate-y-0.5 hover:border-border hover:shadow-lg"
                  >
                    {/* `inert`: the preview is a picture of the component, so nothing in it takes focus or clicks. */}
                    <div
                      inert
                      className="showcase-canvas relative flex h-44 items-center justify-center overflow-hidden border-b border-border/60"
                    >
                      {mode === 'mobile' ? (
                        // No fallback: the card's canvas stays empty for the moment the chunk takes.
                        <Suspense fallback={null}>
                          <NativeCardPreview doc={doc} />
                        </Suspense>
                      ) : (
                        /* Rendered larger than the card and scaled down, so a preview keeps its real proportions. */
                        <div
                          className={cn(
                            'pointer-events-none flex shrink-0 origin-center items-center justify-center',
                            doc.wide ? 'w-[560px] scale-[0.6]' : 'w-[125%] scale-[0.8]',
                          )}
                        >
                          {Preview ? <Preview /> : null}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col gap-1.5 p-4">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-medium">{doc.name}</h3>
                        <span className="text-[11px] text-muted-foreground">{doc.category}</span>
                      </div>
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        <InlineCode text={doc.description} />
                      </p>
                    </div>
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

/** The Web / Desktop overview's hero. */
function WebHero() {
  return (
    <section className="relative -mx-4 overflow-hidden border-b border-border/60 px-4 pb-14 pt-16 sm:-mx-6 sm:px-6 lg:mx-0 lg:rounded-2xl lg:border lg:px-12">
      <DynamicBackground pattern="aurora" className="opacity-70" />
      <div className="relative max-w-2xl space-y-6">
        <p className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          {COMPONENTS.length} components · React 19 · Tailwind tokens
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          The building blocks of every <Wordmark className="leading-tight" /> app.
        </h1>
        <p className="text-base text-muted-foreground sm:text-lg">
          Accessible primitives, data displays and animated backdrops on one set of HSL design
          tokens. Every example below is live: the code you copy is the code that renders it.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          {/* A scroll, not `href="#browse"`: the hash is the router's, and would read as a component id. */}
          <Button
            size="lg"
            onClick={() =>
              document.getElementById('browse')?.scrollIntoView({ behavior: 'smooth' })
            }
          >
            Browse components <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
          <a href={DOCS_URL}>
            <Button size="lg" variant="outline">
              Read the docs
            </Button>
          </a>
          <div className="flex h-11 items-center gap-3 rounded-md border border-border/60 bg-background/70 pl-4 pr-2 font-mono text-sm backdrop-blur">
            <span className="text-muted-foreground">$</span> {INSTALL.web}
            <CopyButton text={INSTALL.web} />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Published to GitHub Packages, which needs a{' '}
          <code className="font-mono">read:packages</code> token even for public packages.{' '}
          <a
            href={`${DOCS_URL}#/getting-started`}
            className="underline underline-offset-2 hover:text-foreground"
          >
            Set up the registry
          </a>
          .
        </p>
      </div>
    </section>
  );
}

/** The Mobile overview's hero: the product name as the headline, the RN pitch below. */
function MobileHero() {
  return (
    <section className="relative -mx-4 overflow-hidden border-b border-border/60 px-4 pb-14 pt-16 sm:-mx-6 sm:px-6 lg:mx-0 lg:rounded-2xl lg:border lg:px-12">
      <DynamicBackground pattern="aurora" className="opacity-70" />
      <div className="relative max-w-2xl space-y-6">
        <p className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          {catalogFor('mobile').components.length} components · React Native · same tokens
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          <Wordmark product="Mobile UI" className="leading-tight" />
        </h1>
        <p className="text-base text-muted-foreground sm:text-lg">
          The midnite primitives for iOS and Android: View, Text, Pressable and TextInput styled
          with plain StyleSheet from the same token values as the web library. Every example below
          runs through react-native-web in a phone frame, and the code you copy is the code that
          runs on a device.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            size="lg"
            onClick={() =>
              document.getElementById('browse')?.scrollIntoView({ behavior: 'smooth' })
            }
          >
            Browse components <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
          <a href={hrefFor({ page: 'home' })}>
            <Button size="lg" variant="outline">
              Web / Desktop components
            </Button>
          </a>
          <div className="flex h-11 items-center gap-3 rounded-md border border-border/60 bg-background/70 pl-4 pr-2 font-mono text-sm backdrop-blur">
            <span className="text-muted-foreground">$</span> {INSTALL.mobile}
            <CopyButton text={INSTALL.mobile} />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Peers on <code className="font-mono">react</code> 19 and{' '}
          <code className="font-mono">react-native</code> 0.79 or later; no native modules.
        </p>
      </div>
    </section>
  );
}
