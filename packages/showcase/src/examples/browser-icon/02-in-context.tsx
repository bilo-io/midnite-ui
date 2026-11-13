import { BrowserIcon, browserDownloadUrl, browserName, buttonVariants } from '@bilo-io/ui';

export default function InContext() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {(['chrome', 'firefox', 'safari'] as const).map((id) => (
        <a
          key={id}
          href={browserDownloadUrl(id)}
          target="_blank"
          rel="noreferrer noopener"
          className={buttonVariants({ variant: 'outline' })}
        >
          <BrowserIcon browser={id} className="mr-2" /> Get {browserName(id)}
        </a>
      ))}
      <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 px-2.5 py-1 text-xs text-muted-foreground">
        <BrowserIcon browser="brave" className="h-3.5 w-3.5" /> Brave users welcome
      </span>
    </div>
  );
}
