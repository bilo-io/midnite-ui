import { type ComponentType, useEffect } from 'react';

import type { ComponentDoc } from '../catalog';
import { CodeBlock } from '@bilo-io/ui';
import { ExampleToc, scrollToExample } from '../components/example-toc';
import { anchorFor, type Example, type ExampleModule, load, NATIVE_PREFIX } from '../examples';
import { NativeScreen, NativeTheme } from './native-stage';
import { PhoneFrame, SCREEN_W } from './phone-frame';

// Everything the Mobile mode renders: the React Native demos, the phone frame,
// and through them @bilo-io/ui-native and react-native-web. The app reaches this
// module only through ./lazy, so all of it is one chunk that the Web / Desktop
// mode never downloads.

const nativeModules = import.meta.glob<ExampleModule>('../examples/native-*/*.tsx', {
  eager: true,
});
const nativeSources = import.meta.glob<string>('../examples/native-*/*.tsx', {
  eager: true,
  query: '?raw',
  import: 'default',
});

/** The React Native demos, keyed by the native component id (the folder minus `native-`). */
export const NATIVE_EXAMPLES: ReadonlyMap<string, Example[]> = load(
  nativeModules,
  nativeSources,
  (folder) => folder.slice(NATIVE_PREFIX.length),
);

const nativeExamplesFor = (componentId: string) => NATIVE_EXAMPLES.get(componentId) ?? [];

/** A component page's React Native examples, each in a phone beside its source. */
export function NativeExamples({ docId, example }: { docId: string; example?: string }) {
  // The page's own scroll ran before this chunk arrived, so a deep link to an
  // example lands here once the sections exist.
  useEffect(() => {
    if (example) scrollToExample(example);
  }, [docId, example]);

  return (
    <>
      {nativeExamplesFor(docId).map((ex) => (
        <NativeExampleBlock key={ex.key} example={ex} anchor={anchorFor(ex.key)} />
      ))}
    </>
  );
}

/** The "On this page" links for a native component. */
export function NativeExampleToc({ docId }: { docId: string }) {
  return <ExampleToc docId={docId} examples={nativeExamplesFor(docId)} mode="mobile" />;
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

/** A native demo in an overview card: the top of a phone screen, at real width and scaled down. */
export function NativeCardPreview({ doc }: { doc: ComponentDoc }) {
  const Preview: ComponentType | undefined = nativeExamplesFor(doc.id)[0]?.Component;
  return (
    <div
      aria-label={`${doc.name} preview`}
      className="pointer-events-none absolute left-1/2 top-4 shrink-0 origin-top -translate-x-1/2 scale-[0.62] overflow-hidden rounded-t-[28px] border border-b-0 border-border/60 shadow-lg"
      style={{ width: SCREEN_W }}
    >
      <NativeTheme>
        <NativeScreen>{Preview ? <Preview /> : null}</NativeScreen>
      </NativeTheme>
    </div>
  );
}
