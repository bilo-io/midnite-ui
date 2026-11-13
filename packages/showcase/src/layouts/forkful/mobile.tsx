import { useState } from 'react';

import { Card, Tabs } from '@bilo-io/ui';

import { Art, Mark } from '../kit';
import { SPOTS, type Spot } from './data';
import { SwipeDeck } from './deck';

export default function ForkfulMobile() {
  const [tab, setTab] = useState<'discover' | 'matches'>('discover');
  const [matches, setMatches] = useState<Spot[]>([]);

  return (
    <div className="flex h-full flex-col bg-muted/30 text-sm">
      <header data-c className="flex items-center justify-between bg-card px-4 py-2.5">
        <span className="flex items-center gap-2 font-semibold"><Mark letter="F" hue={20} size={26} /> Forkful</span>
        <Tabs
          ariaLabel="Section"
          value={tab}
          onChange={setTab}
          options={[{ value: 'discover', label: 'Discover' }, { value: 'matches', label: `Matches ${matches.length}` }]}
        />
      </header>

      {tab === 'discover' ? (
        <main data-c className="flex flex-1 items-center justify-center overflow-hidden p-4">
          <SwipeDeck spots={SPOTS} onDecide={(spot, liked) => liked && setMatches((m) => [spot, ...m])} />
        </main>
      ) : (
        <ul className="flex-1 space-y-2 overflow-hidden p-4">
          {matches.length === 0 ? <li className="text-muted-foreground">No matches yet. Swipe right to save a place.</li> : null}
          {matches.map((m) => (
            <li key={m.id}>
              <Card data-c className="flex items-center gap-3 p-3">
                <Art hue={m.hue} seed={m.name.length} className="h-12 w-12 rounded-lg" />
                <span className="leading-tight"><span className="block font-medium">{m.name}</span><span className="text-xs text-muted-foreground">{m.cuisine} · {m.km} km</span></span>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
