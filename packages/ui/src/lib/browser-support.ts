import type { BrowserId } from '../components/browser-icon';

/** Minimum version per browser, e.g. `{ chrome: '90', safari: '14.1' }`. Browsers not listed are unsupported. */
export type SupportedBrowsers = Partial<Record<BrowserId, string>>;

export type DetectedBrowser = {
  id: BrowserId | 'unknown';
  name: string;
  /** Dotted version as reported by the user agent ('' when unknown). */
  version: string;
  os?: 'Windows' | 'macOS' | 'iOS' | 'Android' | 'ChromeOS' | 'Linux';
  mobile: boolean;
};

export type BrowserSupportReason = 'ok' | 'outdated' | 'not-listed' | 'unknown';

export type BrowserSupportResult = {
  /** `false` only for `outdated` and `not-listed`; an `unknown` browser is not nagged. */
  supported: boolean;
  reason: BrowserSupportReason;
  browser: DetectedBrowser;
  /** The minimum version required of this browser, when it is listed. */
  minVersion?: string;
};

export type DetectHints = {
  /** Brave hides itself in the UA; `'brave' in navigator` is the only signal. */
  brave?: boolean;
};

const NAMES: Record<BrowserId, string> = {
  brave: 'Brave',
  chrome: 'Chrome',
  edge: 'Edge',
  firefox: 'Firefox',
  ie: 'Internet Explorer',
  opera: 'Opera',
  safari: 'Safari',
  samsung: 'Samsung Internet',
  vivaldi: 'Vivaldi',
};

// Order matters: Chromium derivatives all carry `Chrome/` (and Safari) tokens,
// so the more specific token has to be tried first. On iOS every browser is
// WebKit, but CriOS/FxiOS/EdgiOS/OPiOS still identify the product.
const RULES: ReadonlyArray<readonly [BrowserId, RegExp]> = [
  ['edge', /\bEdg(?:A|iOS)?\/([\d.]+)/],
  ['edge', /\bEdge\/([\d.]+)/],
  ['opera', /\bOPR\/([\d.]+)/],
  ['opera', /\bOPiOS\/([\d.]+)/],
  ['opera', /\bOpera\/[\d.]+.*\bVersion\/([\d.]+)/],
  ['opera', /\bOpera[/ ]([\d.]+)/],
  ['samsung', /\bSamsungBrowser\/([\d.]+)/],
  ['vivaldi', /\bVivaldi\/([\d.]+)/],
  ['firefox', /\bFirefox\/([\d.]+)/],
  ['firefox', /\bFxiOS\/([\d.]+)/],
  ['chrome', /\bChrome\/([\d.]+)/],
  ['chrome', /\bCriOS\/([\d.]+)/],
  ['safari', /\bVersion\/([\d.]+).*\bSafari\//],
  ['ie', /\bMSIE ([\d.]+)/],
  ['ie', /\bTrident\/.*\brv:([\d.]+)/],
];

function detectOs(ua: string): DetectedBrowser['os'] {
  if (/\b(?:iPhone|iPad|iPod)\b/.test(ua)) return 'iOS';
  if (/\bAndroid\b/.test(ua)) return 'Android';
  if (/\bCrOS\b/.test(ua)) return 'ChromeOS';
  if (/\bWindows\b/.test(ua)) return 'Windows';
  if (/\bMac OS X\b|\bMacintosh\b/.test(ua)) return 'macOS';
  if (/\bLinux\b|\bX11\b/.test(ua)) return 'Linux';
  return undefined;
}

/** Identifies the browser from a user-agent string. Pure: pass `navigator.userAgent` on the client. */
export function detectBrowser(userAgent: string, hints: DetectHints = {}): DetectedBrowser {
  const os = detectOs(userAgent);
  const mobile = /\bMobi|\bAndroid\b|\b(?:iPhone|iPad|iPod)\b/.test(userAgent);
  const base = { ...(os ? { os } : {}), mobile };

  for (const [id, re] of RULES) {
    const version = re.exec(userAgent)?.[1];
    if (version === undefined) continue;
    // Brave reports a plain Chrome UA; the hint upgrades it.
    const resolved: BrowserId = id === 'chrome' && hints.brave ? 'brave' : id;
    return { id: resolved, name: NAMES[resolved], version, ...base };
  }
  return { id: 'unknown', name: 'Unknown browser', version: '', ...base };
}

/** Numeric dotted-version compare: negative, zero or positive. `'4.10'` is greater than `'4.9'`. */
export function compareVersions(a: string, b: string): number {
  const parts = (v: string) => v.split('.').map((p) => Number.parseInt(p, 10) || 0);
  const pa = parts(a);
  const pb = parts(b);
  for (let i = 0; i < Math.max(pa.length, pb.length); i += 1) {
    const diff = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

/** Whether `browser` meets the `supported` minimums. */
export function checkBrowserSupport(
  browser: DetectedBrowser,
  supported: SupportedBrowsers,
): BrowserSupportResult {
  if (browser.id === 'unknown') return { supported: true, reason: 'unknown', browser };
  const minVersion = supported[browser.id];
  if (minVersion === undefined) return { supported: false, reason: 'not-listed', browser };
  if (browser.version && compareVersions(browser.version, minVersion) < 0) {
    return { supported: false, reason: 'outdated', browser, minVersion };
  }
  return { supported: true, reason: 'ok', browser, minVersion };
}
