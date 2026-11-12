import { useEffect } from 'react';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';

import { catalogFor, type ComponentDoc } from '../catalog';
import { examplesFor } from '../examples';
import { hrefFor, inMode, type Mode } from '../router';
import { CodeBlock } from './code-block';
import { ExampleBlock } from './example-block';
import { InlineCode, PropsTable } from './props-table';
import { REPO_URL } from './top-bar';

const anchorFor = (key: string) => `example-${key.split('/')[1]}`;

const PACKAGE: Record<Mode, { name: string; src: string }> = {
  web: { name: '@bilo-io/ui', src: 'packages/ui/src/components' },
  mobile: { name: '@bilo-io/ui-native', src: 'packages/ui-native/src/components' },
};

export function ComponentPage({
  doc,
  example,
  mode = 'web',
}: {
  doc: ComponentDoc;
  example?: string;
  mode?: Mode;
}) {
  const examples = examplesFor(doc.id, mode);
  const { components } = catalogFor(mode);
  const index = components.findIndex((c) => c.id === doc.id);
  const prev = components[index - 1];
  const next = components[index + 1];
  const pkg = PACKAGE[mode];

  useEffect(() => {
    if (example)
      document.getElementById(`example-${example}`)?.scrollIntoView({ behavior: 'smooth' });
    else window.scrollTo({ top: 0 });
  }, [doc.id, example]);

  const importLine = `import { ${doc.exports.join(', ')} } from '${pkg.name}';`;

  return (
    <div className="flex gap-10">
      <article className="min-w-0 flex-1 space-y-10">
        <header className="space-y-3">
          <p className="text-sm text-muted-foreground">{doc.category}</p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{doc.name}</h1>
          <p className="max-w-2xl text-base text-muted-foreground">
            <InlineCode text={doc.description} />
          </p>
          {mode === 'mobile' ? (
            <p className="max-w-2xl text-sm text-muted-foreground">
              React Native, rendered here through react-native-web on a 390×844 screen. The code
              panels hold the exact source of each preview.
            </p>
          ) : null}
          <a
            href={`${REPO_URL}/tree/main/${pkg.src}`}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            Source <ExternalLink className="h-3 w-3" />
          </a>
        </header>

        <CodeBlock code={importLine} />

        <div className="space-y-10">
          {examples.map((ex) => (
            <ExampleBlock key={ex.key} example={ex} anchor={anchorFor(ex.key)} mode={mode} />
          ))}
        </div>

        <section id="props" className="scroll-mt-24 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">Props</h2>
          <PropsTable props={doc.props} />
        </section>

        <nav
          className="grid gap-3 border-t border-border/60 pt-6 sm:grid-cols-2"
          aria-label="Pagination"
        >
          {prev ? (
            <a
              href={hrefFor(inMode({ page: 'component', id: prev.id }, mode))}
              className="group rounded-xl border border-border/60 p-4 hover:border-border"
            >
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <ArrowLeft className="h-3 w-3" /> Previous
              </span>
              <span className="font-medium">{prev.name}</span>
            </a>
          ) : (
            <span />
          )}
          {next ? (
            <a
              href={hrefFor(inMode({ page: 'component', id: next.id }, mode))}
              className="group rounded-xl border border-border/60 p-4 text-right hover:border-border"
            >
              <span className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                Next <ArrowRight className="h-3 w-3" />
              </span>
              <span className="font-medium">{next.name}</span>
            </a>
          ) : null}
        </nav>
      </article>

      <aside className="hidden w-44 shrink-0 xl:block">
        <div className="sticky top-24 space-y-2 text-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
            On this page
          </p>
          {examples.map((ex) => (
            <a
              key={ex.key}
              href={hrefFor(
                inMode({ page: 'component', id: doc.id, example: ex.key.split('/')[1] }, mode),
              )}
              className="block text-muted-foreground hover:text-foreground"
            >
              {ex.title}
            </a>
          ))}
          <button
            type="button"
            onClick={() => document.getElementById('props')?.scrollIntoView({ behavior: 'smooth' })}
            className="block text-muted-foreground hover:text-foreground"
          >
            Props
          </button>
        </div>
      </aside>
    </div>
  );
}
