import { GradientGlow } from '@bilo-io/ui';

export default function Triggers() {
  return (
    <div className="grid max-w-2xl gap-6 sm:grid-cols-3">
      <GradientGlow className="rounded-xl">
        <div className="rounded-xl bg-card p-4">
          <input
            className="w-full bg-transparent text-sm outline-none"
            placeholder="Focus me"
            aria-label="Focus trigger"
          />
        </div>
      </GradientGlow>
      <GradientGlow trigger="hover" className="rounded-xl">
        <div className="rounded-xl bg-card p-4 text-sm">Hover me</div>
      </GradientGlow>
      <GradientGlow trigger="always" className="rounded-xl">
        <div className="rounded-xl bg-card p-4 text-sm">Always on</div>
      </GradientGlow>
    </div>
  );
}
