import { useState } from 'react';

import { Input } from '@bilo-io/ui';

export default function Controlled() {
  const [value, setValue] = useState('');
  return (
    <div className="flex max-w-xs flex-col gap-2">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type something…"
        aria-label="Message"
      />
      <p className="text-xs text-muted-foreground">{value.length} characters</p>
    </div>
  );
}
