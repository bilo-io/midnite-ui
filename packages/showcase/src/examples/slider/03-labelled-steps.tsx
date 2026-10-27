import { useState } from 'react';

import { Slider } from '@bilo-io/ui';

const LOOP = ['#f43f5e', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];

export default function LabelledSteps() {
  const [percent, setPercent] = useState(30);
  return (
    <div className="flex w-80 max-w-full flex-col gap-1">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <label htmlFor="auto-rotate">Auto-rotate subagents</label>
        <span className="font-mono text-foreground">{percent}%</span>
      </div>
      <Slider
        id="auto-rotate"
        min={10}
        max={100}
        step={5}
        value={percent}
        onValueChange={setPercent}
        gradient={LOOP}
        aria-valuetext={`${percent}% context`}
      />
    </div>
  );
}
