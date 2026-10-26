import { Textarea } from '@bilo-io/ui';

export default function States() {
  return (
    <div className="flex max-w-md flex-col gap-3">
      <Textarea
        defaultValue="Describe the task for the agent to pick up…"
        aria-label="Task description"
      />
      <Textarea disabled placeholder="Disabled" aria-label="Disabled field" />
    </div>
  );
}
