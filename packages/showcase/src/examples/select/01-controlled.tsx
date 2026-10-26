import { useState } from 'react';

import { Select, type SelectOption } from '@bilo-io/ui';

const options: SelectOption<string>[] = [
  { value: 'sonnet', label: 'Claude Sonnet' },
  { value: 'opus', label: 'Claude Opus' },
  { value: 'haiku', label: 'Claude Haiku' },
];

export default function Controlled() {
  const [value, setValue] = useState('sonnet');
  return (
    <div className="max-w-xs">
      <Select aria-label="Model" options={options} value={value} onChange={setValue} />
    </div>
  );
}
