import { useState } from 'react';
import { Activity, Dumbbell, Flame, Heart, Moon } from 'lucide-react';

import { AreaChart, Card, ContextRing, MetricDial, Tabs, cn } from '@bilo-io/ui';

import { Mark } from '../kit';
import { HEART, RINGS, WEEK, WORKOUTS } from './data';
import { ActivityRings } from './rings';

const TABS = [
  { label: 'Today', Icon: Activity },
  { label: 'Workouts', Icon: Dumbbell },
  { label: 'Sleep', Icon: Moon },
  { label: 'Heart', Icon: Heart },
] as const;

export default function PulseMobile() {
  const [range, setRange] = useState<'day' | 'week'>('day');

  return (
    <div className="flex h-full flex-col bg-muted/30 text-sm">
      <header data-c className="flex items-center justify-between px-4 py-2.5">
        <span className="flex items-center gap-2 font-semibold"><Mark letter="P" hue={350} size={26} /> Pulse</span>
        <Tabs ariaLabel="Range" value={range} onChange={setRange} options={[{ value: 'day', label: 'Day' }, { value: 'week', label: 'Week' }]} />
      </header>
      <div className="min-h-0 flex-1 space-y-3 overflow-hidden px-3">
        <Card data-c className="flex items-center gap-4 p-4">
          <ActivityRings size={120} />
          <ul className="space-y-1.5 text-xs">
            {RINGS.map((r) => (
              <li key={r.id}><span className="block font-semibold" style={{ color: `hsl(var(${r.hueVar}))` }}>{r.label}</span><span className="tabular-nums">{r.value}/{r.goal} {r.unit}</span></li>
            ))}
          </ul>
        </Card>
        <div data-c className="grid grid-cols-2 gap-3">
          <Card className="flex justify-center p-3"><MetricDial pct={78} label="Steps" hueVar="--status-todo" /></Card>
          <Card className="space-y-1 p-3">
            <p className="flex items-center gap-1 text-xs text-muted-foreground"><Heart className="h-3.5 w-3.5 text-destructive" />62 bpm</p>
            <AreaChart className="w-full" series={[{ data: HEART, hueVar: '--destructive' }]} />
          </Card>
        </div>
        <Card data-c className="p-3">
          <div className="flex h-20 items-end gap-2">
            {WEEK.map((d) => (
              <div key={d.day} className="flex flex-1 flex-col items-center justify-end gap-1">
                <div className={cn('w-full rounded-t', d.pct >= 100 ? 'bg-success' : 'bg-primary/70')} style={{ height: Math.round(Math.min(100, d.pct) * 0.55) }} />
                <span className="text-[10px] text-muted-foreground">{d.day[0]}</span>
              </div>
            ))}
          </div>
        </Card>
        {WORKOUTS.slice(0, 2).map((w) => (
          <Card key={w.id} data-c className="flex items-center gap-3 p-3">
            <ContextRing tokens={w.intensity} limit={200_000} />
            <span className="flex-1 leading-tight"><span className="block font-medium">{w.name}</span><span className="text-xs text-muted-foreground">{w.detail}</span></span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground"><Flame className="h-3.5 w-3.5" />{w.kcal}</span>
          </Card>
        ))}
      </div>
      <nav aria-label="Primary" data-c className="grid shrink-0 grid-cols-4 border-t border-border bg-card pb-1">
        {TABS.map(({ label, Icon }, i) => (
          <button key={label} type="button" aria-current={i === 0 ? 'page' : undefined} className={cn('flex flex-col items-center gap-0.5 py-2 text-[11px]', i === 0 ? 'text-primary' : 'text-muted-foreground')}>
            <Icon className="h-5 w-5" /> {label}
          </button>
        ))}
      </nav>
    </div>
  );
}
