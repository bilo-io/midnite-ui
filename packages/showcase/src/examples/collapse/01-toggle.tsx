import { useState } from 'react';

import { Button, Collapse } from '@bilo-io/ui';

export default function Toggle() {
  const [open, setOpen] = useState(false);
  return (
    <div className="max-w-md space-y-2">
      <Button size="sm" variant="outline" onClick={() => setOpen((o) => !o)}>
        {open ? 'Collapse' : 'Expand'}
      </Button>
      <Collapse open={open}>
        <div className="rounded-md border bg-card p-4 text-sm text-muted-foreground">
          This body animates open and closed by transitioning a CSS grid track between 0fr and 1fr.
        </div>
      </Collapse>
    </div>
  );
}
