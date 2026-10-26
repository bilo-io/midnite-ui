import { MetricDial } from '@bilo-io/ui';

export default function DashboardRow() {
  return (
    <div className="flex flex-wrap gap-8">
      <MetricDial pct={42} label="CPU" hueVar="--status-wip" />
      <MetricDial pct={78} label="RAM" hueVar="--status-todo" sublabel="25.1 GB of 32 GB" />
      <MetricDial pct={74} label="GPU" hueVar="--status-done" sublabel="Apple M2 Pro" />
    </div>
  );
}
