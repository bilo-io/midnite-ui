import { Input } from '@bilo-io/ui';

export default function States() {
  return (
    <div className="flex max-w-xs flex-col gap-3">
      <Input defaultValue="midnite" aria-label="Name" />
      <Input placeholder="Search tasks…" aria-label="Search tasks" />
      <Input disabled placeholder="Disabled" aria-label="Disabled field" />
    </div>
  );
}
