import { type ReactNode, Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowUpRight, Pause, Play } from 'lucide-react';

import { cn } from '@bilo-io/ui';

import { hrefFor } from '../router';
import { DesktopFrame, PhoneFrame } from './frames';
import { LAYOUTS, layoutComponent, preloadLayout } from './index';

// The landing hero: one frame that cycles through every example layout.
//
// Motion: each layout's blocks carry `data-c`. This stage numbers them in DOM
// order (`--ci`), and CSS staggers them out (`data-phase="out"`), then, once
// the next layout has mounted, in (`data-phase="in"`), while a gradient band
// sweeps across the frame. Only transform, opacity and filter animate. The
// auto-advance is the progress bar's own `animationend`, so pausing the bar
// (hover, focus, hidden tab, the button) pauses the whole show.

const OUT_MS = 700;
const IN_MS = 2100;
const DWELL_MS = 6000;

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

/** Numbers every `[data-c]` below it (and re-numbers as lazy content mounts). */
function Cascade({ phase, children }: { phase: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const number = () =>
      root.querySelectorAll<HTMLElement>('[data-c]').forEach((el, i) => el.style.setProperty('--ci', String(Math.min(i, 26))));
    number();
    const mo = new MutationObserver(number);
    mo.observe(root, { childList: true, subtree: true });
    return () => mo.disconnect();
  }, []);
  return (
    <div ref={ref} className="cascade h-full w-full" data-phase={phase}>
      {children}
    </div>
  );
}

export default function HeroStage() {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<'in' | 'out' | 'idle'>('in');
  const [wipe, setWipe] = useState(0);
  const [held, setHeld] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [paused, setPaused] = useState(false);
  const [narrow, setNarrow] = useState(() => typeof window !== 'undefined' && window.innerWidth < 640);
  const stage = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useEffect(() => {
    const onVis = () => setHidden(document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  useLayoutEffect(() => {
    const el = stage.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => setNarrow(el.clientWidth < 640));
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
      setPhase('out');
      setWipe((w) => w + 1);
      timers.current.push(
        setTimeout(() => {
          setIndex(target);
          setPhase('in');
        }, OUT_MS),
        setTimeout(() => {
          setPhase('idle');
          busy.current = false;
        }, OUT_MS + IN_MS),
      );
    },
    [index, reduced],
  );

  const current = LAYOUTS[index]!;
  const Desktop = layoutComponent(current.id, 'desktop');
  const Mobile = layoutComponent(current.id, 'mobile');
  const playing = !paused && !held && !hidden && !reduced;

  return (
    <section
      aria-label="Example layouts"
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={() => setHeld(false)}
      className="space-y-3"
    >
      <div
        ref={stage}
        className="showcase-canvas relative overflow-hidden rounded-2xl border border-border/60 p-3 shadow-xl sm:p-5"
      >
        {/* A decorative picture of the layout: nothing in it takes focus or clicks. */}
        <div inert aria-hidden className="pointer-events-none">
          <div key={current.id} className={cn('relative', reduced && 'hero-fade')}>
            {narrow ? (
              <div className="mx-auto w-full max-w-[260px]">
                <Cascade phase={phase}>
                  <PhoneFrame label={`${current.name}, mobile`} maxHeight={520}>
                    <Suspense fallback={null}><Mobile /></Suspense>
                  </PhoneFrame>
                </Cascade>
              </div>
            ) : (
              <>
                <Cascade phase={phase}>
                  <DesktopFrame label={`${current.name}, desktop`}>
                    <Suspense fallback={null}><Desktop /></Suspense>
                  </DesktopFrame>
                </Cascade>
                <div className="absolute -bottom-3 right-[3%] w-[19%] drop-shadow-2xl">
                  <Cascade phase={phase}>
                    <PhoneFrame label={`${current.name}, mobile`}>
                      <Suspense fallback={null}><Mobile /></Suspense>
                    </PhoneFrame>
                  </Cascade>
                </div>
              </>
            )}
          </div>
        </div>
        {wipe > 0 && !reduced ? (
          <div
            key={wipe}
            aria-hidden
            className="hero-wipe pointer-events-none absolute inset-0 z-10"
            style={{
              background:
                'linear-gradient(105deg, transparent 32%, hsl(var(--primary) / 0.22) 46%, hsl(var(--primary) / 0.38) 50%, hsl(var(--primary) / 0.22) 54%, transparent 68%)',
            }}
          />
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <ul className="flex flex-1 flex-wrap gap-1.5" aria-label="Choose a layout">
          {LAYOUTS.map((l, i) => {
            const on = i === index;
            return (
              <li key={l.id} className="relative">
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
                      style={{ animationPlayState: playing ? 'running' : 'paused', ['--hero-ms' as string]: `${DWELL_MS}ms` }}
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
            {current.name}: {current.description.replace(/\.$/, '').toLowerCase()} <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
