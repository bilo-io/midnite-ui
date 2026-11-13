import { useState } from 'react';
import { Bookmark, Clock, Navigation, Search, Star } from 'lucide-react';

import { Button, Card, Input, Switch, Tabs, cn } from '@bilo-io/ui';

import { Mark } from '../kit';
import { CHIPS, PLACES, REVIEWS, type Chip } from './data';
import { MapCanvas } from './map';

export default function WayfindDesktop() {
  const [chip, setChip] = useState<Chip>('All');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string | null>('harbor');
  const [tab, setTab] = useState<'overview' | 'reviews'>('overview');
  const [route, setRoute] = useState(true);

  const results = PLACES.filter(
    (p) => (chip === 'All' || p.kind === chip) && p.name.toLowerCase().includes(query.toLowerCase()),
  );
  const place = PLACES.find((p) => p.id === selected);

  return (
    <div className="relative h-full overflow-hidden text-sm">
      <MapCanvas places={results} selected={selected} onSelect={setSelected} route={route} className="absolute inset-0 h-full w-full" />

      <div data-c className="absolute left-4 top-4 flex w-80 flex-col gap-3">
        <Card className="space-y-3 p-3 shadow-lg">
          <div className="flex items-center gap-2">
            <Mark letter="W" hue={160} size={26} />
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input aria-label="Search places" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search nearby" className="pl-9" />
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Category">
            {CHIPS.map((c) => (
              <button key={c} type="button" aria-pressed={chip === c} onClick={() => setChip(c)} className={cn('rounded-full border border-border px-3 py-1 text-xs transition-colors', chip === c ? 'bg-primary text-primary-foreground' : 'hover:bg-accent')}>
                {c}
              </button>
            ))}
          </div>
        </Card>
        <Card className="divide-y divide-border overflow-hidden shadow-lg">
          {results.length === 0 ? <p className="p-4 text-muted-foreground">Nothing nearby matches.</p> : null}
          {results.map((p) => (
            <button key={p.id} data-c type="button" onClick={() => setSelected(p.id)} aria-current={p.id === selected} className={cn('flex w-full items-center gap-3 p-3 text-left transition-colors hover:bg-accent', p.id === selected && 'bg-accent')}>
              <span className="flex-1">
                <span className="block font-medium">{p.name}</span>
                <span className="text-xs text-muted-foreground">{p.kind} · {p.distance}</span>
              </span>
              <span className="flex items-center gap-1 text-xs"><Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />{p.rating}</span>
            </button>
          ))}
        </Card>
      </div>

      {place ? (
        <Card data-c className="absolute right-4 top-4 flex w-80 flex-col gap-3 p-4 shadow-lg">
          <div>
            <h3 className="text-lg font-semibold">{place.name}</h3>
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" /> {place.rating} ({place.reviews.toLocaleString()}) · {place.kind}
            </p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" className="flex-1 gap-1.5" onClick={() => setRoute(true)}><Navigation className="h-4 w-4" />Directions</Button>
            <Button size="sm" variant="outline" aria-label="Save place"><Bookmark className="h-4 w-4" /></Button>
          </div>
          <Tabs ariaLabel="Place details" value={tab} onChange={setTab} options={[{ value: 'overview', label: 'Overview' }, { value: 'reviews', label: 'Reviews' }]} />
          {tab === 'overview' ? (
            <div className="space-y-2">
              <p>{place.blurb}</p>
              <p className="flex items-center gap-2 text-muted-foreground"><Clock className="h-4 w-4" />{place.open}</p>
              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <span>Show route on map</span>
                <Switch checked={route} onCheckedChange={setRoute} aria-label="Show route on map" />
              </div>
            </div>
          ) : (
            <ul className="space-y-3">
              {REVIEWS.map((r) => (
                <li key={r.who}><p className="font-medium">{r.who} <span className="text-yellow-500">{'★'.repeat(r.stars)}</span></p><p className="text-muted-foreground">{r.text}</p></li>
              ))}
            </ul>
          )}
        </Card>
      ) : null}
    </div>
  );
}
