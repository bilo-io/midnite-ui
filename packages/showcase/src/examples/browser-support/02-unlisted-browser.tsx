import { BrowserSupport } from '@bilo-io/ui';

// Internet Explorer 11 is not on the list at all.
const IE11 = 'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko';

export default function UnlistedBrowser() {
  return (
    <BrowserSupport
      userAgent={IE11}
      supported={{ chrome: '90', edge: '90', firefox: '88', safari: '14.1' }}
      labels={{ supportedBrowsers: 'Please switch to one of these' }}
    />
  );
}
