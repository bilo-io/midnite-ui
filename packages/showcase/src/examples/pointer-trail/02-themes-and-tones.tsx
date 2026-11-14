import { useState, type CSSProperties } from 'react';

import {
  PointerTrail,
  Tabs,
  type PointerTrailTone,
  type PointerTrailVariant,
} from '@bilo-io/ui';

const LIGHT_VARS: CSSProperties = {
  backgroundColor: 'hsl(0 0% 100%)',
  color: 'hsl(240 10% 3.9%)',
  borderColor: 'hsl(240 5.9% 90%)',
  ['--background' as string]: '0 0% 100%',
  ['--foreground' as string]: '240 10% 3.9%',
};

const DARK_VARS: CSSProperties = {
  backgroundColor: 'hsl(240 10% 3.9%)',
  color: 'hsl(0 0% 98%)',
  borderColor: 'hsl(240 3.7% 15.9%)',
  ['--background' as string]: '240 10% 3.9%',
  ['--foreground' as string]: '0 0% 98%',
};

export default function ThemesAndTones() {
  const [variant, setVariant] = useState<PointerTrailVariant>('trail');
  const [tone, setTone] = useState<PointerTrailTone>('foreground');

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <Tabs
          ariaLabel="Variant"
          options={[
            { value: 'trail', label: 'trail' },
            { value: 'ring', label: 'ring' },
            { value: 'fluid', label: 'fluid' },
          ]}
          value={variant}
          onChange={setVariant}
        />
        <Tabs
          ariaLabel="Tone"
          options={[
            { value: 'foreground', label: 'foreground (text colour)' },
            { value: 'gradient', label: 'gradient (fluid primary)' },
          ]}
          value={tone}
          onChange={setTone}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div
          className="relative flex h-40 flex-col justify-between overflow-hidden rounded-xl border p-4"
          style={LIGHT_VARS}
        >
          <PointerTrail variant={variant} tone={tone} contained />
          <div className="relative z-20 flex items-center justify-between">
            <span className="text-xs font-semibold">Light theme</span>
            <span className="font-mono text-[11px] opacity-65">
              {tone === 'foreground' ? 'hsl(var(--foreground))' : 'primary gradient'}
            </span>
          </div>
          <p className="relative z-20 text-xs opacity-70">
            Dark text ink (`240 10% 3.9%`) or fluid primary gradient on white.
          </p>
        </div>

        <div
          className="dark relative flex h-40 flex-col justify-between overflow-hidden rounded-xl border p-4"
          style={DARK_VARS}
        >
          <PointerTrail variant={variant} tone={tone} contained />
          <div className="relative z-20 flex items-center justify-between">
            <span className="text-xs font-semibold">Dark theme</span>
            <span className="font-mono text-[11px] opacity-65">
              {tone === 'foreground' ? 'hsl(var(--foreground))' : 'primary gradient'}
            </span>
          </div>
          <p className="relative z-20 text-xs opacity-70">
            Light text ink (`0 0% 98%`) or fluid primary gradient on near-black.
          </p>
        </div>
      </div>
    </div>
  );
}
