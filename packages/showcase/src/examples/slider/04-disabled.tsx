import { Slider } from '@bilo-io/ui';

export default function Disabled() {
  return (
    <div className="flex w-80 max-w-full flex-col gap-4">
      <Slider label="Locked by policy" defaultValue={50} disabled />
      <Slider
        label="Locked, with a gradient"
        defaultValue={65}
        gradient={['#0ea5e9', '#14b8a6', '#84cc16']}
        disabled
      />
    </div>
  );
}
