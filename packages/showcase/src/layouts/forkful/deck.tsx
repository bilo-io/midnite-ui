import { type KeyboardEvent, type PointerEvent, useEffect, useRef, useState } from 'react';
import { Heart, MapPin, RotateCcw, Star, X } from 'lucide-react';

import { Button, cn } from '@bilo-io/ui';

import { Art } from '../kit';
import type { Spot } from './data';

const THRESHOLD = 90;
const price = (n: number) => '$'.repeat(n);

/**
 * A swipeable card stack. Drag a card, press the buttons, or use the arrow
 * keys (right to like, left to pass). `onDecide` reports each choice.
 */
export function SwipeDeck({
  spots,
  onDecide,
  className,
}: {
  spots: Spot[];
  onDecide: (spot: Spot, liked: boolean) => void;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const [dx, setDx] = useState(0);
  const [exit, setExit] = useState<1 | -1 | 0>(0);
  const start = useRef<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => setIndex(0), [spots]);

  const top = spots[index];
  const decide = (dir: 1 | -1) => {
    if (!top || exit) return;
    setExit(dir);
    timer.current = setTimeout(() => {
      onDecide(top, dir === 1);
      setIndex((i) => i + 1);
      setExit(0);
      setDx(0);
    }, 240);
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    start.current = e.clientX;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (start.current !== null) setDx(e.clientX - start.current);
  };
  const onPointerUp = () => {
    if (start.current === null) return;
    start.current = null;
    if (Math.abs(dx) > THRESHOLD) decide(dx > 0 ? 1 : -1);
    else setDx(0);
  };
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') decide(1);
    if (e.key === 'ArrowLeft') decide(-1);
  };

  const shift = exit ? exit * 520 : dx;
  const dragging = start.current !== null;

  return (
    <div className={cn('flex w-full max-w-xs flex-col items-center gap-4', className)}>
      <div
        tabIndex={0}
        role="group"
        aria-label="Restaurant cards. Arrow right to like, arrow left to pass."
        onKeyDown={onKeyDown}
        className="relative h-[26rem] w-full max-w-xs rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {top ? null : (
          <div className="flex h-full flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-border text-center text-muted-foreground">
            <p>You have seen everything nearby.</p>
            <Button variant="outline" size="sm" onClick={() => setIndex(0)}><RotateCcw className="mr-1.5 h-4 w-4" />Start over</Button>
          </div>
        )}
        {spots.slice(index, index + 3).map((spot, depth) => {
          const isTop = depth === 0;
          const rot = isTop ? shift / 18 : 0;
          return (
            <div
              key={spot.id}
              data-testid={isTop ? 'top-card' : undefined}
              onPointerDown={isTop ? onPointerDown : undefined}
              onPointerMove={isTop ? onPointerMove : undefined}
              onPointerUp={isTop ? onPointerUp : undefined}
              onPointerCancel={isTop ? onPointerUp : undefined}
              aria-hidden={!isTop}
              className="absolute inset-0 touch-pan-y select-none overflow-hidden rounded-3xl border border-border bg-card shadow-xl"
              style={{
                transform: isTop
                  ? `translateX(${shift}px) rotate(${rot}deg)`
                  : `translateY(${depth * 12}px) scale(${1 - depth * 0.05})`,
                transition: dragging && isTop ? 'none' : 'transform 240ms cubic-bezier(0.2, 0.9, 0.2, 1)',
                zIndex: 3 - depth,
                opacity: exit && isTop ? 0.4 : 1,
                cursor: isTop ? 'grab' : undefined,
              }}
            >
              <Art hue={spot.hue} seed={spot.name.length} className="h-3/5 w-full" />
              {isTop ? (
                <>
                  <span className="absolute left-4 top-4 -rotate-12 rounded-md border-2 border-success px-2 py-0.5 text-lg font-extrabold uppercase text-success" style={{ opacity: Math.min(1, Math.max(0, shift / THRESHOLD)) }}>Yum</span>
                  <span className="absolute right-4 top-4 rotate-12 rounded-md border-2 border-destructive px-2 py-0.5 text-lg font-extrabold uppercase text-destructive" style={{ opacity: Math.min(1, Math.max(0, -shift / THRESHOLD)) }}>Nope</span>
                </>
              ) : null}
              <div className="space-y-1.5 p-4">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-lg font-semibold">{spot.name}</h3>
                  <span className="flex items-center gap-1 text-sm"><Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />{spot.rating}</span>
                </div>
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground"><MapPin className="h-3.5 w-3.5" />{spot.cuisine} · {price(spot.price)} · {spot.km} km</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {spot.tags.map((t) => <span key={t} className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{t}</span>)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-5">
        <Button variant="outline" size="icon" aria-label="Pass" onClick={() => decide(-1)} disabled={!top} className="h-12 w-12 rounded-full text-destructive"><X className="h-6 w-6" /></Button>
        <Button variant="outline" size="icon" aria-label="Like" onClick={() => decide(1)} disabled={!top} className="h-12 w-12 rounded-full text-success"><Heart className="h-6 w-6" /></Button>
      </div>
    </div>
  );
}
