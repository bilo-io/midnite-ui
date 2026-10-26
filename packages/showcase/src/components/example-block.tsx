import { useState } from 'react';

import { Tabs } from '@bilo-io/ui';

import type { Example } from '../examples';
import { CodeBlock } from './code-block';

type View = 'preview' | 'code';

export function ExampleBlock({ example, anchor }: { example: Example; anchor: string }) {
  const [view, setView] = useState<View>('preview');
  const { Component } = example;
  return (
    <section id={anchor} className="scroll-mt-24 space-y-3">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-base font-semibold tracking-tight">{example.title}</h3>
        <Tabs
          ariaLabel={`${example.title} view`}
          options={[
            { value: 'preview', label: 'Preview' },
            { value: 'code', label: 'Code' },
          ]}
          value={view}
          onChange={setView}
        />
      </div>
      {view === 'preview' ? (
        <div className="showcase-canvas flex min-h-[180px] items-center justify-center overflow-hidden rounded-xl border border-border/60 p-6 sm:p-10">
          <Component />
        </div>
      ) : (
        <CodeBlock code={example.source} />
      )}
    </section>
  );
}
