import { useState } from 'react';

import { Switch } from '@bilo-io/ui';

export default function Settings() {
  const [notify, setNotify] = useState(true);
  const [sync, setSync] = useState(false);
  return (
    <div className="flex max-w-sm flex-col gap-4 text-sm">
      <label className="flex items-center justify-between gap-4">
        Notifications
        <Switch checked={notify} onCheckedChange={setNotify} aria-label="Notifications" />
      </label>
      <label className="flex items-center justify-between gap-4">
        Background sync
        <Switch checked={sync} onCheckedChange={setSync} aria-label="Background sync" />
      </label>
      <label className="flex items-center justify-between gap-4 text-muted-foreground">
        Locked by policy
        <Switch checked disabled onCheckedChange={() => {}} aria-label="Locked by policy" />
      </label>
    </div>
  );
}
