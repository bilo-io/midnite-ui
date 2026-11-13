import { BrowserIcon, BrowserSupport, BrowserSupportList } from '@bilo-io/ui';

const IE11 = 'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko';
const supported = { chrome: '90', firefox: '88' };

// children as a render prop replace the default body.
export default function CustomRender() {
  return (
    <BrowserSupport userAgent={IE11} supported={supported} className="border-dashed">
      {(result) => (
        <div className="flex flex-col gap-3">
          <p className="flex items-center gap-2 font-medium">
            {result.browser.id !== 'unknown' && (
              <BrowserIcon browser={result.browser.id} className="h-5 w-5" />
            )}
            Sorry, {result.browser.name} {result.browser.version} won't work here
            <span className="font-mono text-xs text-muted-foreground">({result.reason})</span>
          </p>
          <BrowserSupportList supported={supported} />
        </div>
      )}
    </BrowserSupport>
  );
}
