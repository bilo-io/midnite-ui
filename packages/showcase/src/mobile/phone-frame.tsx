import { type ReactNode, useLayoutEffect, useRef, useState } from 'react';

import { NativeScreen, NativeTheme } from './native-stage';

// An iPhone-sized stage: a 390×844 screen (the logical size of a 6.1" iPhone)
// in a rounded bezel, scaled down to fit its column and a height cap. The
// screen is rendered at its real size and the whole device is transformed, so
// the React Native layout inside sees exactly 390dp of width.
export const SCREEN_W = 390;
export const SCREEN_H = 844;
const BEZEL = 12;
const DEVICE_W = SCREEN_W + BEZEL * 2;
const DEVICE_H = SCREEN_H + BEZEL * 2;

export function PhoneFrame({
  children,
  label,
  maxHeight = 680,
}: {
  children: ReactNode;
  /** Names the device for assistive tech, e.g. the example's title. */
  label: string;
  maxHeight?: number;
}) {
  const outer = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(maxHeight / DEVICE_H);

  useLayoutEffect(() => {
    const el = outer.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const fit = () => setScale(Math.min(1, el.clientWidth / DEVICE_W, maxHeight / DEVICE_H));
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(el);
    return () => observer.disconnect();
  }, [maxHeight]);

  return (
    <div ref={outer} className="flex w-full justify-center" style={{ height: DEVICE_H * scale }}>
      <figure
        aria-label={label}
        className="relative shrink-0 rounded-[60px] bg-zinc-950 shadow-2xl ring-1 ring-zinc-700/60 dark:ring-zinc-600/50"
        style={{
          width: DEVICE_W,
          height: DEVICE_H,
          padding: BEZEL,
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
        }}
      >
        <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[48px] bg-background">
          <StatusBar />
          <div className="min-h-0 flex-1">
            <NativeTheme>
              <NativeScreen scroll>{children}</NativeScreen>
            </NativeTheme>
          </div>
          {/* The home indicator. */}
          <div aria-hidden className="flex h-8 shrink-0 items-center justify-center">
            <span className="h-[5px] w-32 rounded-full bg-foreground/80" />
          </div>
        </div>
      </figure>
    </div>
  );
}

/** 9:41, the Dynamic Island and the signal/battery glyphs: decoration only. */
function StatusBar() {
  return (
    <div
      aria-hidden
      className="relative flex h-[54px] shrink-0 items-center justify-between px-8 text-[15px] font-semibold text-foreground"
    >
      <span className="w-14 text-center">9:41</span>
      <span className="absolute left-1/2 top-[11px] h-[34px] w-[122px] -translate-x-1/2 rounded-full bg-black" />
      <span className="flex w-14 items-center justify-center gap-1">
        <span className="flex items-end gap-[2px]">
          {[4, 6, 8, 10].map((h) => (
            <span key={h} className="w-[3px] rounded-sm bg-foreground" style={{ height: h }} />
          ))}
        </span>
        <span className="ml-1 flex h-[11px] w-[22px] items-center rounded-[3px] border border-foreground/50 p-[1.5px]">
          <span className="h-full w-[70%] rounded-[1.5px] bg-foreground" />
        </span>
      </span>
    </div>
  );
}
