import { AGENT_IDS, AgentIcon, agentColor, agentName } from '@bilo-io/ui';

export default function EveryAgent() {
  return (
    <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {AGENT_IDS.map((id) => (
        <div
          key={id}
          className="flex flex-col items-center gap-3 rounded-xl border border-border/60 bg-card p-4"
        >
          <div className="flex items-center gap-4">
            <AgentIcon agent={id} title={agentName(id)} className="h-8 w-8" />
            <AgentIcon agent={id} variant="mono" className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="text-center">
            <div className="text-sm font-medium">{agentName(id)}</div>
            <div className="font-mono text-[11px] text-muted-foreground">
              {agentColor(id) ?? (id === 'antigravity' ? 'multicolour' : 'monochrome')}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
