'use client';

import { useEffect, useRef, type ReactNode } from 'react';

import { cn } from '../lib/cn';
import type { BrowserSupportResult, SupportedBrowsers } from '../lib/browser-support';
import { useBrowserSupport } from '../lib/use-browser-support';
import {
  BROWSER_IDS,
  BrowserIcon,
  browserDownloadUrl,
  browserName,
  type BrowserId,
} from './browser-icon';

/**
 * Copy overrides — all optional, defaulting to English. Message builders get the
 * detected browser's name and version so translations can reorder them.
 */
export type BrowserSupportLabels = {
  /** The browser is not on the supported list (default '{name} {version} is not supported'). */
  notSupported?: (browser: { name: string; version: string }) => string;
  /** The browser is listed but too old (default '{name} {version} is out of date. Version {min} or newer is needed.'). */
  outdated?: (browser: { name: string; version: string }, minVersion: string) => string;
  /** Shown only with `showWhenSupported` (default '{name} {version} is supported'). */
  supported?: (browser: { name: string; version: string }) => string;
  /** Heading above the list of supported browsers (default 'Supported browsers'). */
  supportedBrowsers?: string;
  /** Per-browser minimum (default 'version {min} or newer'). */
  minVersion?: (minVersion: string) => string;
  /** Accessible name of a download link (default 'Download {name}'). */
  download?: (name: string) => string;
};

const defaults = {
  notSupported: ({ name, version }) => `${name} ${version}`.trim() + ' is not supported',
  outdated: ({ name, version }, min) =>
    `${name} ${version} is out of date. Version ${min} or newer is needed.`,
  supported: ({ name, version }) => `${name} ${version}`.trim() + ' is supported',
  supportedBrowsers: 'Supported browsers',
  minVersion: (min) => `version ${min} or newer`,
  download: (name) => `Download ${name}`,
} satisfies Required<BrowserSupportLabels>;

export type BrowserSupportListProps = {
  supported: SupportedBrowsers;
  labels?: BrowserSupportLabels;
  className?: string;
};

/** The supported browsers as a row of logo links to each download page, with the minimum version. */
export function BrowserSupportList({ supported, labels, className }: BrowserSupportListProps) {
  const minVersion = labels?.minVersion ?? defaults.minVersion;
  const download = labels?.download ?? defaults.download;
  const ids = BROWSER_IDS.filter((id) => supported[id] !== undefined);

  return (
    <ul className={cn('flex flex-wrap gap-2', className)}>
      {ids.map((id: BrowserId) => (
        <li key={id}>
          <a
            href={browserDownloadUrl(id)}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={`${download(browserName(id))} (${minVersion(supported[id] ?? '')})`}
            className="flex items-center gap-2 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs text-card-foreground transition-colors hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <BrowserIcon browser={id} className="h-5 w-5" />
            <span className="flex flex-col leading-tight">
              <span className="font-medium">{browserName(id)}</span>
              <span className="text-muted-foreground">{minVersion(supported[id] ?? '')}</span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export type BrowserSupportProps = {
  /** Minimum version per browser. Browsers not listed are unsupported. */
  supported: SupportedBrowsers;
  /** Called in an effect once each time the check result changes (not every render). */
  onCheck?: (result: BrowserSupportResult) => void;
  /** Check this user-agent instead of `navigator.userAgent` (tests, docs, server hints). */
  userAgent?: string;
  /** Render the callout even when the browser is supported (as a `status`). */
  showWhenSupported?: boolean;
  /** Replaces the default body: nodes, or a render prop given the result. */
  children?: ReactNode | ((result: BrowserSupportResult) => ReactNode);
  labels?: BrowserSupportLabels;
  className?: string;
};

/**
 * Warns when the visitor's browser is missing from `supported` or older than its
 * minimum version, and renders nothing otherwise (and nothing on the server or
 * during hydration — the check needs `navigator`). The default body names the
 * detected browser and links the supported ones; `children` overrides it.
 */
export function BrowserSupport({
  supported,
  onCheck,
  userAgent,
  showWhenSupported = false,
  children,
  labels,
  className,
}: BrowserSupportProps) {
  const result = useBrowserSupport(supported, { userAgent });

  const onCheckRef = useRef(onCheck);
  useEffect(() => {
    onCheckRef.current = onCheck;
  });
  useEffect(() => {
    if (result) onCheckRef.current?.(result);
  }, [result]);

  if (!result || (result.supported && !showWhenSupported)) return null;

  const { browser } = result;
  const message = result.supported
    ? (labels?.supported ?? defaults.supported)(browser)
    : result.reason === 'outdated' && result.minVersion !== undefined
      ? (labels?.outdated ?? defaults.outdated)(browser, result.minVersion)
      : (labels?.notSupported ?? defaults.notSupported)(browser);

  return (
    <div
      role={result.supported ? 'status' : 'alert'}
      data-reason={result.reason}
      className={cn(
        'flex flex-col gap-3 rounded-lg border p-4 text-sm text-foreground',
        result.supported
          ? 'border-success/40 bg-success/10'
          : 'border-destructive/40 bg-destructive/10',
        className,
      )}
    >
      {typeof children === 'function' ? (
        children(result)
      ) : children !== undefined && children !== null ? (
        children
      ) : (
        <>
          <div className="flex items-center gap-3">
            {browser.id !== 'unknown' && <BrowserIcon browser={browser.id} className="h-7 w-7" />}
            <p className="font-medium">{message}</p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-xs text-muted-foreground">
              {labels?.supportedBrowsers ?? defaults.supportedBrowsers}
            </p>
            <BrowserSupportList supported={supported} labels={labels} />
          </div>
        </>
      )}
    </div>
  );
}
