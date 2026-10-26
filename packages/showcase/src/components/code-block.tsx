import { useMemo, useState } from 'react';
import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import { Check, Copy } from 'lucide-react';

import { cn } from '@bilo-io/ui';

// Only the three grammars the site shows; the core build keeps the rest out of
// the bundle. Colours come from @bilo-io/ui/code-highlight.css (styles.css).
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('xml', xml);

export function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      aria-label={copied ? 'Copied' : 'Copy code'}
      onClick={() => {
        void navigator.clipboard?.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        });
      }}
      className={cn(
        'inline-flex h-7 w-7 items-center justify-center rounded-md border border-border/60 bg-background/80 text-muted-foreground backdrop-blur transition-colors hover:text-foreground',
        className,
      )}
    >
      {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

export function CodeBlock({
  code,
  language = 'typescript',
  className,
}: {
  code: string;
  language?: 'typescript' | 'bash';
  className?: string;
}) {
  // highlight.js escapes the source before wrapping tokens, so the HTML is safe.
  const html = useMemo(() => hljs.highlight(code, { language }).value, [code, language]);
  return (
    <div className={cn('group relative', className)}>
      <pre className="overflow-x-auto rounded-lg border border-border/60 bg-muted/40 p-4 text-[13px] leading-relaxed">
        <code className="hljs font-mono" dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
      <CopyButton
        text={code}
        className="absolute right-2 top-2 opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100"
      />
    </div>
  );
}
