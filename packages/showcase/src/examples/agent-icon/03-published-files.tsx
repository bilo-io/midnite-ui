import { useState } from 'react';

import { AGENT_IDS, agentFiles } from '@bilo-io/ui';

// The same marks as files, for a README, a PR comment or any page that links
// rather than imports. Served at /agents/ on the docs site.
const BASE = 'https://bilo-io.github.io/midnite-ui/agents/';

const onDark = (file: string) => file.endsWith('-white') || file === 'grok-color';

export default function PublishedFiles() {
  const [copied, setCopied] = useState<string>();
  return (
    <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
      {AGENT_IDS.flatMap(agentFiles).map((file) => (
        <button
          key={file}
          type="button"
          title={`Copy ${BASE}${file}.svg`}
          onClick={() => {
            void navigator.clipboard?.writeText(`${BASE}${file}.svg`).then(() => setCopied(file));
          }}
          className={`flex flex-col items-center gap-2 rounded-lg border border-border/60 p-3 transition hover:border-primary/60 ${
            onDark(file) ? 'bg-zinc-900 text-zinc-300' : 'bg-white text-zinc-600'
          }`}
        >
          <img src={`agents/${file}.svg`} alt="" className="h-7 w-7" />
          <span className="font-mono text-[10px]">
            {copied === file ? 'URL copied' : `${file}.svg`}
          </span>
        </button>
      ))}
    </div>
  );
}
