import { Suspense, useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import { CodeDemo, Tabs } from '@bilo-io/ui';

import { DesktopFrame, PhoneFrame } from '../layouts/frames';
import { LAYOUTS, type LayoutDoc, type Variant, findLayout, layoutComponent, loadSource } from '../layouts';
import { Mark } from '../layouts/kit';
import { hrefFor } from '../router';

const HUES: Record<string, number> = { circle: 265, snapline: 330, wayfind: 160, forkful: 20, ticker: 150, pulse: 350 };

function Features({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1 text-sm text-muted-foreground">
      {items.map((f) => (
        <li key={f} className="flex gap-2">
          <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/60" />
          {f}
        </li>
      ))}
    </ul>
  );
}

/** `#/examples`: the six layouts as cards. */
function Overview() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Examples</h1>
        <p className="max-w-2xl text-muted-foreground">
          Whole app screens built only from the library's primitives and tokens, each as a desktop
          layout and a phone layout. Open one for the live preview and its source.
        </p>
      </div>
      <ul className="grid gap-4 sm:grid-cols-2">
        {LAYOUTS.map((l) => (
          <li key={l.id}>
            <a
              href={hrefFor({ page: 'examples', id: l.id })}
              className="group flex h-full flex-col gap-3 rounded-xl border border-border/60 bg-card p-5 transition hover:-translate-y-0.5 hover:border-border hover:shadow-lg"
            >
              <div className="flex items-center gap-3">
                <Mark letter={l.name[0]!} hue={HUES[l.id] ?? 200} size={32} />
                <h2 className="font-medium">{l.name}</h2>
                <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5" />
              </div>
              <p className="text-sm">{l.description}</p>
              <Features items={l.features.slice(0, 3)} />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function useSource(id: string, variant: Variant): string | null {
  const [source, setSource] = useState<string | null>(null);
  useEffect(() => {
    let live = true;
    setSource(null);
    loadSource(id, variant).then((s) => live && setSource(s));
    return () => {
      live = false;
    };
  }, [id, variant]);
  return source;
}

function Detail({ layout }: { layout: LayoutDoc }) {
  const [variant, setVariant] = useState<Variant>('desktop');
  const source = useSource(layout.id, variant);
  const View = layoutComponent(layout.id, variant);
  const i = LAYOUTS.findIndex((l) => l.id === layout.id);
  const prev = LAYOUTS[(i + LAYOUTS.length - 1) % LAYOUTS.length]!;
  const next = LAYOUTS[(i + 1) % LAYOUTS.length]!;

  return (
    <div className="space-y-6">
      <a href={hrefFor({ page: 'examples' })} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> All examples
      </a>
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">{layout.name}</h1>
        <p className="text-muted-foreground">{layout.description}</p>
        <Features items={layout.features} />
      </div>

      <Tabs
        ariaLabel="Layout size"
        value={variant}
        onChange={setVariant}
        options={[
          { value: 'desktop', label: 'Desktop' },
          { value: 'mobile', label: 'Mobile' },
        ]}
      />

      <CodeDemo
        title={`${layout.name} · ${variant}`}
        code={source ?? '// Loading the source…'}
        previewClassName="showcase-canvas bg-background rounded-xl p-3 sm:p-6"
      >
        {variant === 'desktop' ? (
          <DesktopFrame label={`${layout.name}, desktop`}>
            <Suspense fallback={<Loading />}><View /></Suspense>
          </DesktopFrame>
        ) : (
          <div className="mx-auto w-full max-w-[400px]">
            <PhoneFrame label={`${layout.name}, mobile`}>
              <Suspense fallback={<Loading />}><View /></Suspense>
            </PhoneFrame>
          </div>
        )}
      </CodeDemo>

      <nav aria-label="More examples" className="flex justify-between text-sm">
        <a href={hrefFor({ page: 'examples', id: prev.id })} className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" /> {prev.name}
        </a>
        <a href={hrefFor({ page: 'examples', id: next.id })} className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground">
          {next.name} <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </nav>
    </div>
  );
}

const Loading = () => <p className="p-6 text-sm text-muted-foreground">Loading…</p>;

export function ExamplesPage({ id }: { id?: string }) {
  useEffect(() => window.scrollTo?.(0, 0), [id]);
  if (!id) return <Overview />;
  const layout = findLayout(id);
  if (!layout)
    return (
      <div className="py-24 text-center">
        <h1 className="text-2xl font-semibold">No example called “{id}”</h1>
        <a href={hrefFor({ page: 'examples' })} className="mt-4 inline-block text-sm text-muted-foreground underline">
          Back to the examples
        </a>
      </div>
    );
  // Keyed: the Desktop/Mobile choice belongs to one layout.
  return <Detail key={layout.id} layout={layout} />;
}
