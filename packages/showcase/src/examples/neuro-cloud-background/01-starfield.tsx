import { NeuroCloudBackground } from '@bilo-io/ui';

export default function Starfield() {
  return (
    <div className="relative h-56 w-full overflow-hidden rounded-lg border border-border/60 bg-background">
      <NeuroCloudBackground animate />
    </div>
  );
}
