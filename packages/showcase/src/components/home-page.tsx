import { useMemo, useState } from 'react';
import { ArrowRight, Search } from 'lucide-react';

import { Button, DynamicBackground, cn } from '@bilo-io/ui';

import { CATEGORIES, COMPONENTS, type Category } from '../catalog';
import { examplesFor } from '../examples';
import { hrefFor } from '../router';
import { searchComponents } from '../search';
import { CopyButton } from './code-block';
import { InlineCode } from './props-table';
import { DOCS_URL } from './top-bar';

const INSTALL = 'pnpm add @bilo-io/ui';

export function HomePage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<Category | 'All'>('All');

  const results = useMemo(
    () =>
      searchComponents(query, COMPONENTS).filter(
        ({ doc }) => category === 'All' || doc.category === category,
      ),
    [query, category],
  );

  return (
    <div className="space-y-14">
      <section className="relative -mx-4 overflow-hidden border-b border-border/60 px-4 pb-14 pt-16 sm:-mx-6 sm:px-6 lg:mx-0 lg:rounded-2xl lg:border lg:px-12">
        <DynamicBackground pattern="aurora" className="opacity-70" />
        <div className="relative max-w-2xl space-y-6">
          <p className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            {COMPONENTS.length} components · React 19 · Tailwind tokens
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            The building blocks of every{' '}
            <span className="bg-gradient-to-r from-[hsl(var(--status-todo))] via-[hsl(var(--kind-feature))] to-[hsl(var(--status-wip))] bg-clip-text text-transparent">
              midnite
            </span>{' '}
            app.
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
              <span className="text-muted-foreground">$</span> {INSTALL}
              <CopyButton text={INSTALL} />
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

      <section id="browse" className="scroll-mt-20 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Components</h2>
            <p className="text-sm text-muted-foreground">
              {results.length === COMPONENTS.length ? 'All' : results.length} of {COMPONENTS.length}
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

        <div className="flex flex-wrap gap-2" role="group" aria-label="Category">
          {(['All', ...CATEGORIES] as const).map((c) => (
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

        {results.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border/60 p-10 text-center text-sm text-muted-foreground">
            Nothing matches “{query}”{category === 'All' ? '' : ` in ${category}`}.
          </p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {results.map(({ doc }) => {
              const first = examplesFor(doc.id)[0];
              const Preview = first?.Component;
              return (
                <li key={doc.id}>
                  <a
                    href={hrefFor({ page: 'component', id: doc.id })}
                    className="group flex h-full flex-col overflow-hidden rounded-xl border border-border/60 bg-card transition hover:-translate-y-0.5 hover:border-border hover:shadow-lg"
                  >
                    {/* `inert`: the preview is a picture of the component, so nothing in it takes focus or clicks. */}
                    <div
                      inert
                      className="showcase-canvas relative flex h-44 items-center justify-center overflow-hidden border-b border-border/60"
                    >
                      {/* Rendered larger than the card and scaled down, so a preview keeps its real proportions. */}
                      <div
                        className={cn(
                          'pointer-events-none flex shrink-0 origin-center items-center justify-center',
                          doc.wide ? 'w-[560px] scale-[0.6]' : 'w-[125%] scale-[0.8]',
                        )}
                      >
                        {Preview ? <Preview /> : null}
                      </div>
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
