import { useState } from 'react';

import { Button, PasscodePad } from '@bilo-io/ui';

export default function Unlock() {
  const [unlocked, setUnlocked] = useState(false);

  if (unlocked) {
    return (
      <div className="flex flex-col items-center gap-3 text-sm">
        <p>Unlocked.</p>
        <Button size="sm" variant="outline" onClick={() => setUnlocked(false)}>
          Lock again
        </Button>
      </div>
    );
  }

  // The demo passcode is 1234.
  return (
    <PasscodePad
      mode="unlock"
      expected="1234"
      autoFocus={false}
      onSuccess={() => setUnlocked(true)}
    />
  );
}
