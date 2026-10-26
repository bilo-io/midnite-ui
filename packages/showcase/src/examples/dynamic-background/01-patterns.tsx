import { useState } from 'react';

import { DynamicBackground, Tabs, type BackgroundPattern } from '@bilo-io/ui';

const patterns: BackgroundPattern[] = [
  'aurora',
  'dots',
  'grid',
  'topographic',
  'waves',
  'mesh-gradient',
];

export default function Patterns() {
  const [pattern, setPattern] = useState<BackgroundPattern>('aurora');
  return (
    <div className="flex w-full flex-col gap-3">
      <Tabs
        ariaLabel="Pattern"
        options={patterns.map((p) => ({ value: p, label: p }))}
        value={pattern}
        onChange={setPattern}
      />
      <div className="relative h-56 w-full overflow-hidden rounded-lg border border-border/60 bg-background">
        <DynamicBackground pattern={pattern} />
        <p className="relative p-4 text-sm text-muted-foreground">
          Move the pointer over the canvas.
        </p>
      </div>
    </div>
  );
}
