import { AgentIcon, Button } from '@bilo-io/ui';

export default function InContext() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="outline">
        <AgentIcon agent="claude" className="mr-2" /> Open in Claude
      </Button>
      <Button variant="outline">
        <AgentIcon agent="codex" className="mr-2" /> Open in Codex
      </Button>
      {/* mono takes the text colour, so it follows hover and theme. */}
      <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 px-2.5 py-1 text-xs text-muted-foreground">
        <AgentIcon agent="copilot" variant="mono" className="h-3.5 w-3.5" /> Reviewed by Copilot
      </span>
      <span className="inline-flex items-center gap-1.5 text-sm text-primary">
        <AgentIcon agent="cursor" variant="mono" /> cursor
      </span>
    </div>
  );
}
