import { useState } from 'react';

import { Button } from '@bilo-io/ui';

export default function States() {
  const [count, setCount] = useState(0);
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button onClick={() => setCount((n) => n + 1)}>Clicked {count}×</Button>
      <Button disabled>Disabled</Button>
    </div>
  );
}
