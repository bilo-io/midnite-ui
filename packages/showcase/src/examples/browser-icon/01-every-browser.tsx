import { BROWSER_IDS, BrowserIcon, browserColor, browserName } from '@bilo-io/ui';

export default function EveryBrowser() {
  return (
    <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {BROWSER_IDS.map((id) => (
        <div
          key={id}
          className="flex flex-col items-center gap-3 rounded-xl border border-border/60 bg-card p-4"
        >
          <BrowserIcon browser={id} title={browserName(id)} className="h-10 w-10" />
          <div className="text-center">
            <div className="text-sm font-medium">{browserName(id)}</div>
            <div className="font-mono text-[11px] text-muted-foreground">{browserColor(id)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
