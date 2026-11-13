import { useState } from 'react';
import { Navigation, Search, Star } from 'lucide-react';

import { Button, Card, cn } from '@bilo-io/ui';

import { CHIPS, PLACES, type Chip } from './data';
import { MapCanvas } from './map';

export default function WayfindMobile() {
  const [chip, setChip] = useState<Chip>('All');
  const [selected, setSelected] = useState<string | null>('harbor');
  const [open, setOpen] = useState(false);

  const results = PLACES.filter((p) => chip === 'All' || p.kind === chip);
  const place = PLACES.find((p) => p.id === selected);

  return (
    <div className="relative h-full overflow-hidden text-sm">
      <MapCanvas places={results} selected={selected} onSelect={setSelected} route className="absolute inset-0 h-full w-full" />

      <div data-c className="absolute inset-x-3 top-3 space-y-2">
        <Card className="flex items-center gap-2 rounded-full px-4 py-2.5 shadow-lg">
          <Search className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Search here</span>
        </Card>
        <div className="flex gap-1.5 overflow-hidden" role="group" aria-label="Category">
          {CHIPS.map((c) => (
            <button key={c} type="button" aria-pressed={chip === c} onClick={() => setChip(c)} className={cn('shrink-0 rounded-full border border-border px-3 py-1 text-xs shadow', chip === c ? 'bg-primary text-primary-foreground' : 'bg-card')}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {place ? (
        <Card data-c className={cn('absolute inset-x-0 bottom-0 rounded-b-none rounded-t-2xl p-4 shadow-2xl transition-[height] duration-300', open ? 'h-72' : 'h-40')}>
          <button type="button" aria-expanded={open} aria-label={open ? 'Collapse details' : 'Expand details'} onClick={() => setOpen((o) => !o)} className="mx-auto mb-3 block h-1.5 w-10 rounded-full bg-muted-foreground/40" />
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold">{place.name}</h3>
              <p className="flex items-center gap-1 text-xs text-muted-foreground"><Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />{place.rating} · {place.kind} · {place.distance}</p>
              <p className="text-xs text-success">{place.open}</p>
            </div>
            <Button size="sm" className="gap-1.5"><Navigation className="h-4 w-4" />Go</Button>
          </div>
          {open ? <p className="mt-3 text-muted-foreground">{place.blurb}</p> : null}
        </Card>
      ) : null}
    </div>
  );
}
