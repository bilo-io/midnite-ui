import { BrowserSupport } from '@bilo-io/ui';

// A fixed userAgent stands in for an old Chrome, so the callout always shows.
const OLD_CHROME =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.0.0 Safari/537.36';

export default function OutdatedBrowser() {
  return (
    <BrowserSupport
      userAgent={OLD_CHROME}
      supported={{ chrome: '90', edge: '90', firefox: '88', safari: '14.1', opera: '76' }}
    />
  );
}
