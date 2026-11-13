import { type ReactNode, useLayoutEffect, useRef, useState } from 'react';

// Fixed-size stages for the layouts. A layout is built at its real size (a
// 1120x700 window, a 390x780 phone screen) and the whole frame is scaled with a
// CSS transform to fit its column, so nothing re-flows and a narrow page never
// scrolls sideways.

export const DESKTOP = { w: 1120, h: 700 } as const;
export const PHONE = { w: 390, h: 780 } as const;
const BEZEL = 10;

function useFit(outerW: number, outerH: number, maxScale = 1) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => setScale(Math.min(maxScale, el.clientWidth / outerW) || 0.5);
    fit();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [outerW, maxScale]);
  return { ref, scale, height: outerH * scale };
}

/** A browser-window frame around a desktop layout. */
export function DesktopFrame({ children, label }: { children: ReactNode; label: string }) {
  const chrome = 32;
  const { ref, scale, height } = useFit(DESKTOP.w, DESKTOP.h + chrome);
  return (
    <div ref={ref} className="w-full" style={{ height }}>
      <figure
        aria-label={label}
        className="m-0 origin-top-left overflow-hidden rounded-xl border border-border bg-background shadow-2xl"
        style={{ width: DESKTOP.w, height: DESKTOP.h + chrome, transform: `scale(${scale})` }}
      >
        <div aria-hidden className="flex h-8 items-center gap-1.5 border-b border-border bg-muted/60 px-3">
          {['bg-destructive/70', 'bg-[hsl(var(--status-wip))]', 'bg-success/80'].map((c) => (
            <span key={c} className={`h-2.5 w-2.5 rounded-full ${c}`} />
          ))}
          <span className="mx-auto h-4 w-64 rounded bg-background/70" />
        </div>
        <div className="relative overflow-hidden" style={{ height: DESKTOP.h }}>
          {children}
        </div>
      </figure>
    </div>
  );
}

/** A phone bezel around a mobile layout. `maxScale` caps it (it never upsizes past 1). */
export function PhoneFrame({
  children,
  label,
  maxHeight,
}: {
  children: ReactNode;
  label: string;
  maxHeight?: number;
}) {
  const outerW = PHONE.w + BEZEL * 2;
  const outerH = PHONE.h + BEZEL * 2;
  const cap = maxHeight ? maxHeight / outerH : 1;
  const { ref, scale, height } = useFit(outerW, outerH, cap);
  return (
    <div ref={ref} className="flex w-full justify-center" style={{ height }}>
      <div style={{ width: outerW * scale, height }}>
        <figure
          aria-label={label}
          className="relative m-0 origin-top-left rounded-[48px] bg-zinc-950 shadow-2xl ring-1 ring-zinc-700/60"
          style={{ width: outerW, height: outerH, padding: BEZEL, transform: `scale(${scale})` }}
        >
          <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[38px] bg-background">
            <div
              aria-hidden
              className="relative flex h-11 shrink-0 items-center justify-between px-7 text-[13px] font-semibold"
            >
              <span>9:41</span>
              <span className="absolute left-1/2 top-2 h-6 w-24 -translate-x-1/2 rounded-full bg-black" />
              <span className="h-2.5 w-5 rounded-[3px] border border-foreground/60 p-px">
                <span className="block h-full w-3/4 rounded-[1px] bg-foreground" />
              </span>
            </div>
            <div className="relative min-h-0 flex-1 overflow-hidden">{children}</div>
            <div aria-hidden className="flex h-5 shrink-0 items-start justify-center">
              <span className="h-1 w-28 rounded-full bg-foreground/70" />
            </div>
          </div>
        </figure>
      </div>
    </div>
  );
}
