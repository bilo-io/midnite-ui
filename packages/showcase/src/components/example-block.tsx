import { CodeDemo } from '@bilo-io/ui';

import type { Example } from '../examples';

/** A web example: the live preview or its source, one at a time. (Native ones: ../mobile.) */
export function ExampleBlock({ example, anchor }: { example: Example; anchor: string }) {
  const { Component } = example;
  return (
    <div id={anchor} className="scroll-mt-24">
      <CodeDemo
        title={example.title}
        code={example.source}
        previewClassName="showcase-canvas min-h-[180px] rounded-xl p-6 sm:p-10"
      >
        <Component />
      </CodeDemo>
    </div>
  );
}
