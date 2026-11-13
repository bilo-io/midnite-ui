'use client';

import { type ReactNode, useId, useState } from 'react';
import { ChevronDown } from 'lucide-react';

import { cn } from '../lib/cn';
import { CodeBlock, type CodeBlockLabels, type CodeLanguage } from './code-block';
import { Tabs } from './tabs';

export type CodeDemoView = 'preview' | 'code';

export type CodeDemoLabels = CodeBlockLabels & {
  /** Preview tab label (default 'Preview'). */
  preview?: string;
  /** Code tab / toggle label (default 'Code'). */
  code?: string;
};

export interface CodeDemoProps {
  title?: string;
  description?: ReactNode;
  /** The source shown in the code panel. Pass the real file (`?raw`), not a hand-copied string. */
  code: string;
  language?: CodeLanguage;
  /** The live demo. */
  children: ReactNode;
  /** Uncontrolled initial view (default 'preview'). */
  defaultView?: CodeDemoView;
  /** Controlled view; pair with `onViewChange`. */
  view?: CodeDemoView;
  onViewChange?: (view: CodeDemoView) => void;
  /** 'tabs' swaps preview and code; 'stacked' keeps the preview with the code collapsing below. */
  layout?: 'tabs' | 'stacked';
  labels?: CodeDemoLabels;
  className?: string;
  /** Classes for the preview surface. */
  previewClassName?: string;
  /** Classes for the code block. */
  codeClassName?: string;
}

/**
 * A live demo with its source: a card with a title, and either Preview/Code tabs
 * or (stacked) the preview with a collapsible code panel beneath it.
 */
export function CodeDemo({
  title,
  description,
  code,
  language = 'tsx',
  children,
  defaultView = 'preview',
  view: viewProp,
  onViewChange,
  layout = 'tabs',
  labels,
  className,
  previewClassName,
  codeClassName,
}: CodeDemoProps) {
  const [inner, setInner] = useState<CodeDemoView>(defaultView);
  const view = viewProp ?? inner;
  const setView = (next: CodeDemoView) => {
    if (viewProp === undefined) setInner(next);
    onViewChange?.(next);
  };
  const panelId = useId();
  const previewLabel = labels?.preview ?? 'Preview';
  const codeLabel = labels?.code ?? 'Code';
  const label = title ?? 'Demo';

  const preview = (
    <div
      className={cn(
        'flex min-h-[120px] items-center justify-center overflow-hidden rounded-lg border border-border/60 bg-card p-6',
        previewClassName,
      )}
    >
      {children}
    </div>
  );
  const source = (
    <CodeBlock code={code} language={language} labels={labels} className={codeClassName} />
  );

  return (
    <section className={cn('space-y-3', className)}>
      {title || description || layout === 'tabs' ? (
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            {title ? <h3 className="text-base font-semibold tracking-tight">{title}</h3> : null}
            {description ? (
              <p className="text-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>
          {layout === 'tabs' ? (
            <Tabs
              ariaLabel={`${label} view`}
              options={[
                { value: 'preview', label: previewLabel },
                { value: 'code', label: codeLabel },
              ]}
              value={view}
              onChange={setView}
            />
          ) : null}
        </div>
      ) : null}
      {layout === 'tabs' ? (
        view === 'preview' ? (
          preview
        ) : (
          source
        )
      ) : (
        <>
          {preview}
          <button
            type="button"
            aria-expanded={view === 'code'}
            aria-controls={panelId}
            onClick={() => setView(view === 'code' ? 'preview' : 'code')}
            className="inline-flex items-center gap-1.5 rounded text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <ChevronDown
              className={cn('h-3.5 w-3.5 transition-transform', view === 'code' && 'rotate-180')}
            />
            {codeLabel}
          </button>
          <div id={panelId} hidden={view !== 'code'}>
            {view === 'code' ? source : null}
          </div>
        </>
      )}
    </section>
  );
}
