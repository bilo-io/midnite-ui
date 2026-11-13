import { useState } from 'react';

import { BrowserIcon, BrowserSupport, type BrowserSupportResult } from '@bilo-io/ui';

// The live check: your own browser against a deliberately high bar. onCheck
// reports the result once; showWhenSupported keeps the callout visible either way.
export default function YourBrowser() {
  const [result, setResult] = useState<BrowserSupportResult>();
  return (
    <div className="flex w-full flex-col gap-3">
      <BrowserSupport
        showWhenSupported
        onCheck={setResult}
        supported={{ chrome: '200', edge: '200', firefox: '200', safari: '5', brave: '1' }}
      />
      {result && (
        <p className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
          {result.browser.id !== 'unknown' && (
            <BrowserIcon browser={result.browser.id} className="h-4 w-4" />
          )}
          {result.browser.id} {result.browser.version} · {result.browser.os ?? 'unknown os'} ·{' '}
          {result.reason}
        </p>
      )}
    </div>
  );
}
