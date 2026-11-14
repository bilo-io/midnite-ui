import { useState } from 'react';

import { PointerTrail, Tabs, type PointerTrailVariant } from '@bilo-io/ui';

const VARIANTS: readonly {
  variant: PointerTrailVariant;
  label: string;
  caption: string;
}[] = [
  {
    variant: 'trail',
    label: 'trail',
    caption: 'Theme foreground text ink + trailing chain',
  },
  {
    variant: 'fluid',
    label: 'fluid',
    caption: 'Primary gradient swirling & morphing like fluid',
  },
  {
    variant: 'aurora',
    label: 'aurora',
    caption: 'Rotating blue → violet → pink aurora orb',
  },
  {
    variant: 'ring',
    label: 'ring',
    caption: 'Precision dot + lagging outer ring',
  },
];

export default function Variants() {
  const [active, setActive] = useState<PointerTrailVariant>('fluid');

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs
          ariaLabel="Active viewport cursor variant"
          options={VARIANTS.map(({ variant, label }) => ({ value: variant, label }))}
          value={active}
          onChange={setActive}
        />
        <span className="text-xs text-muted-foreground">
          Hover any stage or move across the page
        </span>
      </div>

      <PointerTrail variant={active} />

      <div className="grid gap-3 sm:grid-cols-2">
        {VARIANTS.map(({ variant, label, caption }) => (
          <div
            key={variant}
            onClick={() => setActive(variant)}
            className="relative flex h-36 cursor-pointer flex-col justify-between overflow-hidden rounded-xl border border-border/60 bg-background/80 p-4 transition hover:border-border"
          >
            <PointerTrail variant={variant} contained />
            <div className="relative z-20 flex items-center justify-between">
              <span className="font-mono text-xs font-medium text-foreground">{label}</span>
              {active === variant ? (
                <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">
                  active on page
                </span>
              ) : null}
            </div>
            <p className="relative z-20 text-xs text-muted-foreground">{caption}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
