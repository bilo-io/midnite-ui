import { useState } from 'react';

import { Tabs } from '@bilo-io/ui';

import type { Example } from '../examples';
import type { Mode } from '../router';
import { CodeBlock } from './code-block';
import { PhoneFrame } from './phone-frame';

type View = 'preview' | 'code';

export function ExampleBlock({
  example,
  anchor,
  mode = 'web',
}: {
  example: Example;
  anchor: string;
  mode?: Mode;
}) {
  const [view, setView] = useState<View>('preview');
  const { Component } = example;
  if (mode === 'mobile') return <NativeExampleBlock example={example} anchor={anchor} />;
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

/**
 * A React Native example: the phone and its source side by side (stacked on
 * narrow screens), since a phone-shaped preview leaves the width free.
 */
function NativeExampleBlock({ example, anchor }: { example: Example; anchor: string }) {
  const { Component } = example;
  return (
    <section id={anchor} className="scroll-mt-24 space-y-3">
      <h3 className="text-base font-semibold tracking-tight">{example.title}</h3>
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
        {/* Clips the device's unscaled layout box, which is wider than a phone-width column. */}
        <div className="showcase-canvas overflow-hidden rounded-xl border border-border/60 p-4">
          <PhoneFrame label={`${example.title}, on a phone`} maxHeight={600}>
            <Component />
          </PhoneFrame>
        </div>
        <CodeBlock code={example.source} className="min-w-0 [&_pre]:max-h-[634px]" />
      </div>
    </section>
  );
}
