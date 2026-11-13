import {
  type CSSProperties,
  type ReactNode,
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { ArrowUpRight, Pause, Play } from 'lucide-react';

import { cn } from '@bilo-io/ui';

import { hrefFor } from '../router';
import { DesktopFrame, PhoneFrame } from './frames';
import { LAYOUTS, type Variant, layoutComponent, preloadLayout } from './index';

// The landing hero: one frame that cycles through every example layout.
//
// A transition plays two layers at once inside a frame that never changes: the
// layout leaving (blocks fly out along a diagonal sweep from the top-left) and
// the layout arriving (blocks drop in from the opposite side with an
// overshooting spring: shell, then content, then accents). A bright band
// crosses the frame between them and the whole stage does a small dolly, with
// the phone trailing the desktop. Blocks are the `data-c` elements; `Cascade`
// numbers and aims them. Only transform, opacity, filter and stroke offsets
// animate, with no animation library.
//
// Auto-advance is the active chip's progress bar `animationend`, so pausing
// the bar (hover, keyboard focus, a hidden tab, the button) pauses the show.

const EXIT_MS = 1100; // the leaving layer is unmounted after this
const SETTLE_MS = 2200; // the arriving layer has finished building by now
const EASE_IN_MS = 140; // arriving blocks start this long after the transition begins

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  useEffect(() => {
    if (typeof matchMedia !== 'function') return;
    const mq = matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setReduced(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
}

/** Offset of `el` from `root`, ignoring transforms (so it is stable mid-animation). */
function offsetWithin(el: HTMLElement, root: HTMLElement) {
  let x = 0;
  let y = 0;
  for (let n: HTMLElement | null = el; n && n !== root; n = n.offsetParent as HTMLElement | null) {
    x += n.offsetLeft;
    y += n.offsetTop;
  }
  return { x, y };
}

function countUp(el: HTMLElement, delay: number): () => void {
  const node = el.firstChild;
  const final = el.dataset.final ?? node?.nodeValue ?? '';
  const m = /\d[\d,]*(\.\d+)?/.exec(final);
  if (!node || !m) return () => {};
  el.dataset.final = final;
  const target = Number(m[0].replace(/,/g, ''));
  const decimals = m[1] ? m[1].length - 1 : 0;
  const grouped = m[0].includes(',');
  const render = (v: number) =>
    final.replace(
      m[0],
      v.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
        useGrouping: grouped,
      }),
    );
  node.nodeValue = render(0);
  let raf = 0;
  const timer = setTimeout(() => {
    const t0 = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / 650);
      node.nodeValue = render(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(step);
      else node.nodeValue = final;
    };
    raf = requestAnimationFrame(step);
  }, delay);
  return () => {
    clearTimeout(timer);
    cancelAnimationFrame(raf);
    node.nodeValue = final;
  };
}

/**
 * Aims every `[data-c]` below it: a flight vector away from the top-left, an
 * exit delay by diagonal rank, an entrance delay by tier (shell, content,
 * accents), and the stroke lengths that charts and rings draw from. Re-aims as
 * lazy content mounts.
 */
function Cascade({
  phase,
  enter = EASE_IN_MS,
  exit = 0,
  children,
}: {
  phase: 'in' | 'out' | 'idle';
  enter?: number;
  exit?: number;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const counted = useRef(false);
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const cancels: Array<() => void> = [];
    let seen = -1;
    const aim = () => {
      const blocks = [...root.querySelectorAll<HTMLElement>('[data-c]')];
      if (blocks.length === seen) return;
      seen = blocks.length;
      const w = root.offsetWidth || 1;
      const h = root.offsetHeight || 1;
      const nested = (el: HTMLElement) => !!el.parentElement?.closest('[data-c]');
      const info = blocks.map((el) => {
        const { x, y } = offsetWithin(el, root);
        const cx = x + el.offsetWidth / 2;
        const cy = y + el.offsetHeight / 2;
        return { el, cx, cy, diag: cx / w + cy / h, nested: nested(el) };
      });
      const byDiag = [...info].sort((a, b) => a.diag - b.diag);
      const tiers: Record<number, typeof info> = { 0: [], 1: [], 2: [] };
      for (const b of byDiag) {
        const tier = b.nested ? 2 : /^(HEADER|NAV|ASIDE)$/.test(b.el.tagName) ? 0 : 1;
        tiers[tier]!.push(b);
      }
      const base = [0, 110, 380] as const;
      const step = [40, 32, 22] as const;
      const cap = [160, 340, 220] as const;
      for (const tier of [0, 1, 2] as const) {
        tiers[tier]!.forEach((b, rank) => {
          const len = Math.hypot(b.cx - w * 0.1, b.cy - h * 0.1) || 1;
          const reach = 40 + Math.min(40, (b.diag / 2) * 60);
          b.el.style.setProperty('--dx', `${((b.cx - w * 0.1) / len) * reach}px`);
          b.el.style.setProperty('--dy', `${((b.cy - h * 0.1) / len) * reach}px`);
          b.el.style.setProperty('--di', `${base[tier] + Math.min(rank * step[tier], cap[tier])}ms`);
        });
      }
      byDiag
        .filter((b) => !b.nested)
        .forEach((b, rank) => b.el.style.setProperty('--do', `${Math.min(rank * 36, 300)}ms`));

      for (const c of root.querySelectorAll<SVGCircleElement>('circle[stroke-dasharray]')) {
        c.style.setProperty('--len', String(parseFloat(c.getAttribute('stroke-dasharray') ?? '200')));
      }
      for (const p of root.querySelectorAll<SVGPathElement>('svg path[fill="none"][stroke]')) {
        if (typeof p.getTotalLength !== 'function') continue;
        const len = Math.ceil(p.getTotalLength());
        p.dataset.draw = '';
        p.style.setProperty('--len', String(len));
      }
      if (phase === 'in' && !counted.current) {
        const counters = root.querySelectorAll<HTMLElement>('[data-count]');
        counters.forEach((el) => cancels.push(countUp(el, enter + 200)));
        counted.current = counters.length > 0;
      }
    };
    aim();
    const mo = new MutationObserver(aim);
    mo.observe(root, { childList: true, subtree: true });
    return () => {
      cancels.forEach((c) => c());
      counted.current = false;
      mo.disconnect();
    };
    // Aimed once per mount: a layer's phase and offsets are fixed for its life.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div
      ref={ref}
      className="cascade relative h-full w-full"
      data-phase={phase}
      style={{ '--eo': `${enter}ms`, '--xo': `${exit}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}

/** One layout, in one variant, as a layer of the frame. */
function Layer({
  id,
  variant,
  phase,
  enter,
  exit,
}: {
  id: string;
  variant: Variant;
  phase: 'in' | 'out' | 'idle';
  enter?: number;
  exit?: number;
}) {
  const View = layoutComponent(id, variant);
  return (
    <div className={cn('absolute inset-0', phase === 'in' && 'layer-in', phase === 'out' && 'layer-out')}>
      <Cascade phase={phase} enter={enter} exit={exit}>
        <Suspense fallback={null}>
          <View />
        </Suspense>
      </Cascade>
    </div>
  );
}

export default function HeroStage() {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [phase, setPhase] = useState<'in' | 'idle'>('in');
  const [swaps, setSwaps] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(() => typeof document !== 'undefined' && document.hidden);
  const [paused, setPaused] = useState(false);
  // Unknown until the stage is measured, so the first paint is never the wrong frame.
  const [narrow, setNarrow] = useState<boolean | null>(null);
  const stage = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
      busy.current = false;
    },
    [],
  );

  useEffect(() => {
    const t = setTimeout(() => !busy.current && setPhase('idle'), SETTLE_MS);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onVis = () => setHidden(document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  useLayoutEffect(() => {
    const el = stage.current;
    if (!el) return;
    setNarrow(el.clientWidth < 640);
    if (typeof ResizeObserver === 'undefined') return;
    // A little hysteresis, so a stage sitting on the threshold does not flap.
    const ro = new ResizeObserver(() =>
      setNarrow((was) => (was ? el.clientWidth < 670 : el.clientWidth < 620)),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    preloadLayout(LAYOUTS[(index + 1) % LAYOUTS.length]!.id);
  }, [index]);

  const go = useCallback(
    (target: number) => {
      if (busy.current || target === index) return;
      if (reduced) {
        setIndex(target);
        return;
      }
      busy.current = true;
      preloadLayout(LAYOUTS[target]!.id);
      setPrev(index);
      setIndex(target);
      setPhase('in');
      setSwaps((n) => n + 1);
      timers.current = [
        setTimeout(() => setPrev(null), EXIT_MS),
        setTimeout(() => {
          setPhase('idle');
          busy.current = false;
          timers.current = [];
        }, SETTLE_MS),
      ];
    },
    [index, reduced],
  );

  const current = LAYOUTS[index]!;
  const playing = !paused && !hovered && !focused && !hidden && !reduced;
  const animated = !reduced && swaps > 0;
  // The first layout builds in on arrival, a little sooner than between layouts.
  const enter = swaps === 0 ? 120 : EASE_IN_MS;

  const layers = (variant: Variant, trail: number) => (
    <>
      {prev !== null && !reduced ? (
        <Layer key={`out-${swaps}`} id={LAYOUTS[prev]!.id} variant={variant} phase="out" exit={trail} />
      ) : null}
      <Layer
        key={`in-${current.id}-${reduced ? 'r' : swaps}`}
        id={current.id}
        variant={variant}
        phase={reduced ? 'idle' : phase}
        enter={enter + trail}
      />
    </>
  );

  return (
    <div
      role="group"
      aria-label="Example layouts"
      onPointerEnter={(e) => e.pointerType !== 'touch' && setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={(e) => setFocused(e.target.matches(':focus-visible'))}
      onBlur={() => setFocused(false)}
      className="min-w-0 space-y-3"
    >
      <div
        ref={stage}
        className="showcase-canvas relative overflow-hidden rounded-2xl border border-border/60 p-3 shadow-xl sm:p-4"
      >
        {/* A decorative picture of the layouts: nothing in it takes focus or clicks. */}
        <div inert aria-hidden className="pointer-events-none">
          {narrow === null ? null : narrow ? (
            <div className="mx-auto w-full max-w-[260px]">
              <div key={animated ? swaps : 'still'} className={cn(animated && 'hero-camera-phone', reduced && 'hero-fade')}>
                <PhoneFrame label={`${current.name}, mobile`} maxHeight={500}>
                  {layers('mobile', 0)}
                </PhoneFrame>
              </div>
            </div>
          ) : (
            <div className="relative">
              <div key={animated ? swaps : 'still'} className={cn(animated && 'hero-camera', reduced && 'hero-fade')}>
                <DesktopFrame label={`${current.name}, desktop`}>{layers('desktop', 0)}</DesktopFrame>
              </div>
              <div className="absolute -bottom-3 right-[3%] w-[21%] drop-shadow-2xl">
                <div key={animated ? swaps : 'still'} className={cn(animated && 'hero-camera-phone')}>
                  <PhoneFrame label={`${current.name}, mobile`}>{layers('mobile', 120)}</PhoneFrame>
                </div>
              </div>
            </div>
          )}
        </div>
        {animated ? (
          <div key={swaps} aria-hidden className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
            <div className="hero-wipe absolute inset-y-[-10%] left-0 w-[34%]">
              {/* The glow: a soft, blurred copy of the band behind it. */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, hsl(280 95% 62% / 0.55) 30%, hsl(190 95% 55% / 0.85) 52%, hsl(335 95% 62% / 0.55) 74%, transparent)',
                  filter: 'blur(14px)',
                }}
              />
              <div
                className="absolute inset-y-0 left-[44%] w-[12%]"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, hsl(0 0% 100% / 0.95) 45%, hsl(190 100% 80% / 0.95) 55%, transparent)',
                }}
              />
            </div>
          </div>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <ul className="flex flex-1 flex-wrap gap-1.5" aria-label="Choose a layout">
          {LAYOUTS.map((l, i) => {
            const on = i === index;
            return (
              <li key={l.id}>
                <button
                  type="button"
                  aria-current={on}
                  onClick={() => go(i)}
                  className={cn(
                    'relative overflow-hidden rounded-full border px-3 py-1 text-xs transition-colors',
                    on ? 'border-foreground/40 bg-accent text-foreground' : 'border-border/60 text-muted-foreground hover:text-foreground',
                  )}
                >
                  {l.name}
                  {on && !reduced ? (
                    <span
                      key={index}
                      aria-hidden
                      onAnimationEnd={() => go((index + 1) % LAYOUTS.length)}
                      className="hero-progress absolute inset-x-0 bottom-0 h-0.5 bg-primary"
                      style={{ animationPlayState: playing ? 'running' : 'paused' }}
                    />
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
        <div className="flex items-center gap-3 text-xs">
          {reduced ? null : (
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? 'Play the layout tour' : 'Pause the layout tour'}
              className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border/60 text-muted-foreground hover:text-foreground"
            >
              {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
            </button>
          )}
          <a
            href={hrefFor({ page: 'examples', id: current.id })}
            className="inline-flex items-center gap-1 text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
          >
            Open {current.name} <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
