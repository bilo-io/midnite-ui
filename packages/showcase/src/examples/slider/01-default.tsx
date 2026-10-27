import { useState } from 'react';

import { Slider } from '@bilo-io/ui';

export default function Default() {
  const [volume, setVolume] = useState(40);
  return (
    <div className="flex w-80 max-w-full flex-col gap-4">
      <Slider
        label="Volume"
        value={volume}
        onValueChange={setVolume}
        aria-valuetext={`${volume}%`}
      />
      <Slider aria-label="Uncontrolled" defaultValue={70} />
    </div>
  );
}
