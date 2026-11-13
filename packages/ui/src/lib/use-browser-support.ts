import { useMemo, useSyncExternalStore } from 'react';

import {
  checkBrowserSupport,
  detectBrowser,
  type BrowserSupportResult,
  type SupportedBrowsers,
} from './browser-support';

const subscribe = () => () => {};
const clientUserAgent = () => navigator.userAgent;
const clientBrave = () => 'brave' in navigator;
const serverSnapshot = () => null;
const serverFalse = () => false;

/**
 * Whether the current browser meets `supported`. SSR-safe: returns `null` on the
 * server and during hydration (so markup matches), then the result once mounted.
 * Pass `userAgent` to check a fixed string instead (tests, docs, server hints) —
 * that result is available immediately.
 */
export function useBrowserSupport(
  supported: SupportedBrowsers,
  { userAgent }: { userAgent?: string } = {},
): BrowserSupportResult | null {
  const liveUa = useSyncExternalStore(subscribe, clientUserAgent, serverSnapshot);
  const brave = useSyncExternalStore(subscribe, clientBrave, serverFalse);
  const ua = userAgent ?? liveUa;
  // An inline `supported={{...}}` is a new object each render; key on its content.
  const key = JSON.stringify(supported);

  return useMemo(
    () =>
      ua === null
        ? null
        : checkBrowserSupport(
            detectBrowser(ua, userAgent === undefined ? { brave } : {}),
            JSON.parse(key) as SupportedBrowsers,
          ),
    [ua, brave, key, userAgent],
  );
}
