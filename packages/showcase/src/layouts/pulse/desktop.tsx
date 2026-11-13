import { useState } from 'react';
import { Activity, Dumbbell, Flame, Footprints, Heart, Moon, Settings } from 'lucide-react';

import { AreaChart, Button, Card, ContextRing, MetricDial, Slider, Tabs, cn } from '@bilo-io/ui';

import { Mark } from '../kit';
import { HEART, RINGS, WEEK, WORKOUTS } from './data';
import { ActivityRings } from './rings';

const NAV = [
  { label: 'Today', Icon: Activity },
  { label: 'Workouts', Icon: Dumbbell },
  { label: 'Sleep', Icon: Moon },
  { label: 'Heart', Icon: Heart },
  { label: 'Settings', Icon: Settings },
] as const;

export default function PulseDesktop() {
  const [range, setRange] = useState<'day' | 'week'>('day');
  const [goal, setGoal] = useState(700);
  const [done, setDone] = useState<Record<string, boolean>>({});

  return (
    <div className="grid h-full grid-cols-[200px_1fr] bg-muted/30 text-sm">
      <nav aria-label="Primary" className="space-y-1 border-r border-border bg-card p-4">
        <div data-c className="mb-4 flex items-center gap-2 px-2 text-lg font-semibold"><Mark letter="P" hue={350} /> Pulse</div>
        {NAV.map(({ label, Icon }, i) => (
          <button key={label} data-c type="button" aria-current={i === 0 ? 'page' : undefined} className={cn('flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-accent', i === 0 && 'bg-accent font-medium')}>
            <Icon className="h-4 w-4" /> {label}
          </button>
        ))}
      </nav>

      <main className="min-w-0 space-y-4 overflow-hidden p-5">
        <header data-c className="flex items-end justify-between">
          <div><h3 className="text-xl font-semibold">Good morning, Sam</h3><p className="text-muted-foreground">You are 74% of the way to today's move goal.</p></div>
          <Tabs ariaLabel="Range" value={range} onChange={setRange} options={[{ value: 'day', label: 'Day' }, { value: 'week', label: 'Week' }]} />
        </header>

        <div className="grid grid-cols-[300px_1fr_1fr] gap-4">
          <Card data-c className="flex items-center gap-4 p-4">
            <ActivityRings size={132} />
            <ul className="space-y-1.5 text-xs">
              {RINGS.map((r) => (
                <li key={r.id}><span className="block font-semibold" style={{ color: `hsl(var(${r.hueVar}))` }}>{r.label}</span><span className="tabular-nums">{r.value}/{r.goal} {r.unit}</span></li>
              ))}
            </ul>
          </Card>
          <Card data-c className="space-y-3 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Vitals</p>
            <div className="flex justify-around">
              <MetricDial pct={78} label="Steps" hueVar="--status-todo" sublabel="7.8k of 10k" />
              <MetricDial pct={86} label="Sleep" hueVar="--status-waiting" sublabel="6h 52m" />
            </div>
          </Card>
          <Card data-c className="space-y-2 p-4">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground"><Heart className="h-3.5 w-3.5 text-destructive" />Heart rate</p>
            <p className="text-2xl font-semibold tabular-nums">62 <span className="text-xs font-normal text-muted-foreground">bpm resting</span></p>
            <AreaChart className="w-full" series={[{ data: HEART, hueVar: '--destructive' }]} />
          </Card>
        </div>

        <div className="grid grid-cols-[1fr_1fr] gap-4">
          <Card data-c className="p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">This week, % of move goal</p>
            <div className="flex h-40 items-end gap-3">
              {WEEK.map((d) => (
                <div key={d.day} className="flex flex-1 flex-col items-center justify-end gap-1.5">
                  <div className={cn('w-full rounded-t-md', d.pct >= 100 ? 'bg-success' : 'bg-primary/70')} style={{ height: Math.round(Math.min(100, d.pct) * 1.25) }} />
                  <span className="text-[11px] text-muted-foreground">{d.day}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card data-c className="space-y-2 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Workouts</p>
            {WORKOUTS.slice(0, 3).map((w) => (
              <div key={w.id} className="flex items-center gap-3">
                <ContextRing tokens={w.intensity} limit={200_000} />
                <span className="flex-1 leading-tight"><span className="block font-medium">{w.name}</span><span className="text-xs text-muted-foreground">{w.detail}</span></span>
                <span className="flex items-center gap-1 text-xs tabular-nums text-muted-foreground"><Flame className="h-3.5 w-3.5" />{w.kcal}</span>
                <Button size="sm" variant={done[w.id] ? 'secondary' : 'outline'} aria-pressed={!!done[w.id]} onClick={() => setDone((s) => ({ ...s, [w.id]: !s[w.id] }))}>{done[w.id] ? 'Logged' : 'Log'}</Button>
              </div>
            ))}
          </Card>
        </div>

        <Card data-c className="flex items-center gap-6 p-4">
          <Footprints className="h-5 w-5 text-primary" />
          <div className="flex-1"><Slider label={`Daily move goal: ${goal} kcal`} min={300} max={1200} step={50} value={goal} onValueChange={setGoal} /></div>
        </Card>
      </main>
    </div>
  );
}
