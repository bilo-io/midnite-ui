import { useEffect, useState } from 'react';

import { AreaChart, LegendDot } from '@bilo-io/ui';

const next = (series: number[], spread: number) => {
  const last = series[series.length - 1] ?? 50;
  const value = Math.min(100, Math.max(0, last + (Math.random() - 0.5) * spread));
  return [...series.slice(1), value];
};

export default function Live() {
  const [cpu, setCpu] = useState([12, 18, 24, 20, 32, 45, 40, 55, 48, 60, 52, 68]);
  const [ram, setRam] = useState([40, 42, 44, 46, 45, 48, 50, 52, 51, 54, 56, 58]);

  useEffect(() => {
    const id = setInterval(() => {
      setCpu((s) => next(s, 30));
      setRam((s) => next(s, 6));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex w-96 max-w-full flex-col gap-2">
      <div className="flex gap-4 text-xs">
        <LegendDot hueVar="--status-wip" label="CPU" value={Math.round(cpu[cpu.length - 1] ?? 0)} />
        <LegendDot
          hueVar="--status-todo"
          label="RAM"
          value={Math.round(ram[ram.length - 1] ?? 0)}
        />
      </div>
      <AreaChart
        className="w-full"
        series={[
          { data: cpu, hueVar: '--status-wip' },
          { data: ram, hueVar: '--status-todo' },
        ]}
      />
    </div>
  );
}
