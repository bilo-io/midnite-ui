import { BROWSER_IDS } from '@bilo-io/ui';

// The same logos as files, for a README or any page that links rather than
// imports. Served at /browsers/ on the docs site.
const BASE = 'https://bilo-io.github.io/midnite-ui/browsers/';

export default function PublishedFiles() {
  return (
    <div className="grid w-full grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-9">
      {BROWSER_IDS.map((id) => (
        <a
          key={id}
          href={`${BASE}${id}.svg`}
          target="_blank"
          rel="noreferrer noopener"
          className="flex flex-col items-center gap-2 rounded-lg border border-border/60 bg-white p-3 text-zinc-600 transition hover:border-primary/60"
        >
          <img src={`browsers/${id}.svg`} alt="" className="h-7 w-7" />
          <span className="font-mono text-[10px]">{id}.svg</span>
        </a>
      ))}
    </div>
  );
}
