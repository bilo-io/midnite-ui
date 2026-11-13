import { useEffect, useState } from 'react';
import { TrendingDown, TrendingUp } from 'lucide-react';

import { AreaChart, Button, Card, Input, MetricDial, RadialGauge, Slider, Switch, Tabs, cn } from '@bilo-io/ui';

import { Mark } from '../kit';
import { POSITIONS, RANGES, WATCHLIST, fmt } from './data';

// Random-walk tick: keeps the live chart moving.
const tick = (s: number[]) => [...s.slice(1), Math.min(95, Math.max(5, (s[s.length - 1] ?? 50) + (Math.random() - 0.48) * 6))];

export default function TickerDesktop() {
  const [sym, setSym] = useState('NOVA');
  const [range, setRange] = useState<(typeof RANGES)[number]>('1D');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [qty, setQty] = useState('10');
  const [limit, setLimit] = useState(false);
  const [limitPct, setLimitPct] = useState(50);
  const inst = WATCHLIST.find((w) => w.sym === sym) ?? WATCHLIST[0]!;
  const [live, setLive] = useState(inst.series);

  useEffect(() => {
    setLive(inst.series);
  }, [inst]);
  useEffect(() => {
    const id = setInterval(() => {
      // A hidden tab or a reduced-motion reader has no use for a moving chart.
      if (document.hidden || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      setLive(tick);
    }, 1500);
    return () => clearInterval(id);
  }, []);

  const shown = range === '1D' ? live : live.slice(-({ '1W': 28, '1M': 18, '1Y': 40, '1D': 40 }[range]));
  const price = inst.price * (1 + ((live[live.length - 1] ?? 50) - (inst.series[inst.series.length - 1] ?? 50)) / 1000);
  const total = price * (Number(qty) || 0);

  return (
    <div className="grid h-full grid-cols-[250px_1fr_280px] grid-rows-[auto_1fr] gap-4 bg-muted/30 p-4 text-sm">
      <header data-c className="col-span-3 flex items-center gap-3">
        <span className="flex items-center gap-2 text-lg font-semibold"><Mark letter="T" hue={150} /> Ticker</span>
        <span className="text-muted-foreground">Portfolio</span>
        <span data-count className="font-semibold tabular-nums">$48,215.60</span>
        <span className="flex items-center gap-1 text-success"><TrendingUp className="h-4 w-4" />+1.8% today</span>
        <span className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground"><span className="h-2 w-2 animate-pulse rounded-full bg-success" />Market open</span>
      </header>

      <Card data-c className="overflow-hidden">
        <p className="p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Watchlist</p>
        <ul>
          {WATCHLIST.map((w) => (
            <li key={w.sym}>
              <button type="button" data-c onClick={() => setSym(w.sym)} aria-current={w.sym === sym} className={cn('flex w-full items-center gap-2 px-3 py-2.5 text-left transition-colors hover:bg-accent', w.sym === sym && 'bg-accent')}>
                <span className="flex-1"><span className="block font-semibold">{w.sym}</span><span className="text-xs text-muted-foreground">{w.name}</span></span>
                <AreaChart className="w-14" series={[{ data: w.series, hueVar: w.change >= 0 ? '--success' : '--destructive' }]} />
                <span className="w-16 text-right tabular-nums"><span className="block">{fmt(w.price)}</span><span className={cn('text-xs', w.change >= 0 ? 'text-success' : 'text-destructive')}>{w.change >= 0 ? '+' : ''}{w.change}%</span></span>
              </button>
            </li>
          ))}
        </ul>
      </Card>

      <div className="flex min-h-0 flex-col gap-4">
        <Card data-c className="space-y-3 p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground">{inst.name}</p>
              <p data-count className="text-3xl font-semibold tabular-nums">{`$${fmt(price)}`}</p>
              <p className={cn('flex items-center gap-1 text-xs', inst.change >= 0 ? 'text-success' : 'text-destructive')}>
                {inst.change >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}{inst.change}% today
              </p>
            </div>
            <Tabs ariaLabel="Range" value={range} onChange={setRange} options={RANGES.map((r) => ({ value: r, label: r }))} />
          </div>
          <AreaChart className="h-36 w-full" series={[{ data: shown, hueVar: inst.change >= 0 ? '--success' : '--destructive' }]} />
        </Card>
        <div data-c className="grid grid-cols-4 gap-4">
          <Card className="flex justify-center p-3"><MetricDial pct={62} label="RSI" hueVar="--status-wip" /></Card>
          <Card className="flex justify-center p-3"><MetricDial pct={38} label="Volume" hueVar="--status-todo" /></Card>
          <Card className="flex justify-center p-3"><MetricDial pct={81} label="Momentum" hueVar="--status-done" /></Card>
          <Card className="flex items-center justify-center p-3"><div className="flex flex-col items-center"><RadialGauge usedBytes={31_000} totalBytes={48_000} labels={{ bytes: (n) => `$${(n / 1000).toFixed(0)}k`, of: (t) => `of ${t}`, used: (p) => `${p}% invested`, free: (f) => `${f} cash` }} /></div></Card>
        </div>
        <Card data-c className="min-h-0 flex-1 overflow-hidden">
          <table className="w-full text-left">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground"><tr><th className="p-2.5">Position</th><th>Qty</th><th>Avg</th><th>Last</th><th className="pr-3 text-right">P/L</th></tr></thead>
            <tbody>
              {POSITIONS.map((p) => {
                const pl = (p.last - p.avg) * p.qty;
                return (
                  <tr key={p.sym} className="border-t border-border tabular-nums"><td className="p-2.5 font-semibold">{p.sym}</td><td>{p.qty}</td><td>{fmt(p.avg)}</td><td>{fmt(p.last)}</td><td className={cn('pr-3 text-right', pl >= 0 ? 'text-success' : 'text-destructive')}>{pl >= 0 ? '+' : ''}{fmt(pl)}</td></tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      </div>

      <Card data-c className="space-y-4 p-4">
        <Tabs ariaLabel="Order side" value={side} onChange={setSide} options={[{ value: 'buy', label: 'Buy' }, { value: 'sell', label: 'Sell' }]} />
        <label className="block space-y-1.5"><span className="text-xs text-muted-foreground">Quantity</span><Input inputMode="numeric" value={qty} onChange={(e) => setQty(e.target.value.replace(/\D/g, ''))} /></label>
        <label className="flex items-center justify-between">Limit order <Switch checked={limit} onCheckedChange={setLimit} aria-label="Limit order" /></label>
        {limit ? <Slider label={`Limit ${limitPct}% of range`} min={0} max={100} value={limitPct} onValueChange={setLimitPct} /> : null}
        <dl className="space-y-1.5 border-t border-border pt-3 tabular-nums">
          <div className="flex justify-between"><dt className="text-muted-foreground">Est. price</dt><dd>${fmt(price)}</dd></div>
          <div className="flex justify-between font-semibold"><dt>Total</dt><dd>${fmt(total)}</dd></div>
        </dl>
        <Button className={cn('w-full', side === 'sell' && 'bg-destructive text-destructive-foreground hover:bg-destructive/90')}>{side === 'buy' ? 'Buy' : 'Sell'} {sym}</Button>
      </Card>
    </div>
  );
}
