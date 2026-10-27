import { Slider } from '@bilo-io/ui';

// Colour stops become a left-to-right linear gradient; the filled track and the
// knob wear it, and the focus ring takes the middle stop.
const SUNSET = ['#f43f5e', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];
const OCEAN = ['#0ea5e9', '#06b6d4', '#14b8a6', '#22c55e', '#84cc16'];
const EMBER = ['#7c2d12', '#c2410c', '#f97316', '#fbbf24', '#fde68a'];

export default function Gradients() {
  return (
    <div className="flex w-80 max-w-full flex-col gap-4">
      <Slider label="Sunset" defaultValue={70} gradient={SUNSET} />
      <Slider label="Ocean" defaultValue={45} gradient={OCEAN} />
      <Slider label="Ember" defaultValue={85} gradient={EMBER} />
      <Slider
        label="Any CSS background"
        defaultValue={60}
        gradient="linear-gradient(90deg, hsl(280 90% 60%), hsl(330 90% 60%))"
      />
    </div>
  );
}
