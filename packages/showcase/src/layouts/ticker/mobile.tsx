import { useState } from 'react';
import { TrendingUp } from 'lucide-react';

import { AreaChart, Button, Card, MetricDial, Tabs, cn } from '@bilo-io/ui';

import { Mark } from '../kit';
import { RANGES, WATCHLIST, fmt } from './data';

export default function TickerMobile() {
  const [sym, setSym] = useState('NOVA');
  const [range, setRange] = useState<(typeof RANGES)[number]>('1D');
  const inst = WATCHLIST.find((w) => w.sym === sym) ?? WATCHLIST[0]!;
  const shown = inst.series.slice(-({ '1D': 40, '1W': 28, '1M': 18, '1Y': 40 }[range]));

  return (
    <div className="flex h-full flex-col gap-3 bg-muted/30 p-3 text-sm">
      <header data-c className="flex items-center justify-between">
        <span className="flex items-center gap-2 font-semibold"><Mark letter="T" hue={150} size={26} /> Ticker</span>
        <span className="flex items-center gap-1 text-success"><TrendingUp className="h-4 w-4" />+1.8%</span>
      </header>
      <Card data-c className="p-4">
        <p className="text-xs text-muted-foreground">Portfolio value</p>
        <p className="text-3xl font-semibold tabular-nums">$48,215.60</p>
      </Card>
      <div data-c className="flex gap-2 overflow-hidden">
        {WATCHLIST.map((w) => (
          <button key={w.sym} type="button" onClick={() => setSym(w.sym)} aria-pressed={w.sym === sym} className={cn('shrink-0 rounded-full border border-border px-3 py-1 text-xs font-medium', w.sym === sym ? 'bg-primary text-primary-foreground' : 'bg-card')}>{w.sym}</button>
        ))}
      </div>
      <Card data-c className="space-y-2 p-4">
        <div className="flex items-end justify-between">
          <div><p className="text-xs text-muted-foreground">{inst.name}</p><p className="text-2xl font-semibold tabular-nums">${fmt(inst.price)}</p></div>
          <span className={cn('text-xs', inst.change >= 0 ? 'text-success' : 'text-destructive')}>{inst.change >= 0 ? '+' : ''}{inst.change}%</span>
        </div>
        <AreaChart className="h-28 w-full" series={[{ data: shown, hueVar: inst.change >= 0 ? '--success' : '--destructive' }]} />
        <Tabs ariaLabel="Range" value={range} onChange={setRange} options={RANGES.map((r) => ({ value: r, label: r }))} />
      </Card>
      <div data-c className="grid grid-cols-3 gap-2">
        <Card className="flex justify-center p-2"><MetricDial pct={62} label="RSI" hueVar="--status-wip" /></Card>
        <Card className="flex justify-center p-2"><MetricDial pct={38} label="Volume" hueVar="--status-todo" /></Card>
        <Card className="flex justify-center p-2"><MetricDial pct={81} label="Momentum" hueVar="--status-done" /></Card>
      </div>
      <div data-c className="mt-auto grid grid-cols-2 gap-3">
        <Button>Buy {sym}</Button>
        <Button variant="outline">Sell</Button>
      </div>
    </div>
  );
}
