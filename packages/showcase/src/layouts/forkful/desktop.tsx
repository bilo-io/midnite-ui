import { useMemo, useState } from 'react';

import { Card, Slider, Switch, cn } from '@bilo-io/ui';

import { Art, Mark } from '../kit';
import { CUISINES, SPOTS, type Spot } from './data';
import { SwipeDeck } from './deck';

export default function ForkfulDesktop() {
  const [cuisine, setCuisine] = useState<(typeof CUISINES)[number]>('Any');
  const [km, setKm] = useState(4);
  const [openNow, setOpenNow] = useState(false);
  const [matches, setMatches] = useState<Spot[]>([]);

  const spots = useMemo(
    () => SPOTS.filter((s) => (cuisine === 'Any' || s.cuisine === cuisine) && s.km <= km && (!openNow || s.open)),
    [cuisine, km, openNow],
  );

  return (
    <div className="grid h-full grid-cols-[260px_1fr_280px] bg-muted/30 text-sm">
      <aside className="space-y-5 border-r border-border bg-card p-5">
        <div data-c className="flex items-center gap-2 text-lg font-semibold"><Mark letter="F" hue={20} /> Forkful</div>
        <div data-c className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cuisine</p>
          <div className="flex flex-wrap gap-1.5">
            {CUISINES.map((c) => (
              <button key={c} type="button" aria-pressed={cuisine === c} onClick={() => setCuisine(c)} className={cn('rounded-full border border-border px-3 py-1 text-xs transition-colors', cuisine === c ? 'bg-primary text-primary-foreground' : 'hover:bg-accent')}>{c}</button>
            ))}
          </div>
        </div>
        <div data-c><Slider label={`Within ${km} km`} min={1} max={5} step={0.5} value={km} onValueChange={setKm} /></div>
        <label data-c className="flex items-center justify-between">
          Open now <Switch checked={openNow} onCheckedChange={setOpenNow} aria-label="Open now" />
        </label>
        <p data-c className="text-xs text-muted-foreground">Tip: use the arrow keys to decide without the mouse.</p>
      </aside>

      <main data-c className="flex items-center justify-center p-6">
        <SwipeDeck key={spots.map((s) => s.id).join()} spots={spots} onDecide={(spot, liked) => liked && setMatches((m) => [spot, ...m])} />
      </main>

      <aside className="space-y-3 border-l border-border bg-card p-5">
        <p data-c className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Matches ({matches.length})</p>
        {matches.length === 0 ? <p data-c className="text-muted-foreground">Swipe right on a place to save it here.</p> : null}
        <ul className="space-y-2">
          {matches.map((m) => (
            <li key={m.id}>
              <Card data-c className="flex items-center gap-3 p-2.5">
                <Art hue={m.hue} seed={m.name.length} className="h-10 w-10 rounded-lg" />
                <span className="leading-tight"><span className="block font-medium">{m.name}</span><span className="text-xs text-muted-foreground">{m.cuisine} · {m.km} km</span></span>
              </Card>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
