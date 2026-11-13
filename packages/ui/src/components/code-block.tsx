'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import css from 'highlight.js/lib/languages/css';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import { Check, Copy } from 'lucide-react';

import { cn } from '../lib/cn';

// A small grammar set; the core build keeps the rest of highlight.js out of the
// bundle. Colours come from @bilo-io/ui/code-highlight.css.
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('css', css);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('json', json);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('xml', xml);

export type CodeLanguage =
  'typescript' | 'javascript' | 'tsx' | 'jsx' | 'bash' | 'html' | 'xml' | 'css' | 'json';

type Grammar = 'typescript' | 'javascript' | 'bash' | 'xml' | 'css' | 'json';

const GRAMMAR: Record<CodeLanguage, Grammar> = {
  typescript: 'typescript',
  tsx: 'typescript',
  javascript: 'javascript',
  jsx: 'javascript',
  bash: 'bash',
  html: 'xml',
  xml: 'xml',
  css: 'css',
  json: 'json',
};

/** The highlight.js grammar a `CodeLanguage` (including the tsx/jsx/html aliases) maps to. */
export function resolveGrammar(language: CodeLanguage): string {
  return GRAMMAR[language] ?? 'typescript';
}

export type CodeBlockLabels = {
  /** Accessible name of the copy button (default 'Copy code'). */
  copy?: string;
  /** Accessible name right after copying (default 'Copied'). */
  copied?: string;
};

export function CopyButton({
  text,
  className,
  labels,
}: {
  text: string;
  className?: string;
  labels?: CodeBlockLabels;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  return (
    <button
      type="button"
      aria-label={copied ? (labels?.copied ?? 'Copied') : (labels?.copy ?? 'Copy code')}
      onClick={() => {
        // writeText rejects when permission is denied or the page is unfocused.
        void navigator.clipboard
          ?.writeText(text)
          .then(() => {
            setCopied(true);
            clearTimeout(timer.current);
            timer.current = setTimeout(() => setCopied(false), 1500);
          })
          .catch(() => {});
      }}
      className={cn(
        'inline-flex h-7 w-7 items-center justify-center rounded-md border border-border/60 bg-background/80 text-muted-foreground backdrop-blur transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
        className,
      )}
    >
      {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

export interface CodeBlockProps {
  code: string;
  language?: CodeLanguage;
  className?: string;
  /** Show the hover/focus copy button (default true). */
  showCopy?: boolean;
  labels?: CodeBlockLabels;
}

/** Syntax-highlighted source with an optional copy button. */
export function CodeBlock({
  code,
  language = 'typescript',
  className,
  showCopy = true,
  labels,
}: CodeBlockProps) {
  // highlight.js escapes the source before wrapping tokens, so the HTML is safe.
  const html = useMemo(
    () => hljs.highlight(code, { language: resolveGrammar(language) }).value,
    [code, language],
  );
  return (
    <div className={cn('group relative', className)}>
      <pre className="overflow-x-auto rounded-lg border border-border/60 bg-muted/40 p-4 text-[13px] leading-relaxed">
        <code className="hljs font-mono" dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
      {showCopy ? (
        <CopyButton
          text={code}
          labels={labels}
          className="absolute right-2 top-2 opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100"
        />
      ) : null}
    </div>
  );
}
