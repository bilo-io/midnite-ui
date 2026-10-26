import { Plus } from 'lucide-react';

import { Accordion, Button } from '@bilo-io/ui';

export default function Stacked() {
  return (
    <div className="max-w-md space-y-2">
      <Accordion
        title="Sub agents"
        count={2}
        defaultOpen
        action={
          <Button size="icon" variant="ghost" aria-label="Add sub agent">
            <Plus className="h-3.5 w-3.5" />
          </Button>
        }
      >
        <div className="p-3 text-sm text-muted-foreground">Two sub-agents configured.</div>
      </Accordion>
      <Accordion title="Advanced">
        <div className="p-3 text-sm text-muted-foreground">Collapsed by default.</div>
      </Accordion>
    </div>
  );
}
