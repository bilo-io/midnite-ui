import { describe, expect, it } from 'vitest';

import { checkBrowserSupport, compareVersions, detectBrowser } from './browser-support';

const UA = {
  chromeMac:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  chromeWin:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.109 Safari/537.36',
  chromeAndroid:
    'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.6367.82 Mobile Safari/537.36',
  chromeIos:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/124.0.6367.88 Mobile/15E148 Safari/604.1',
  chromeOs:
    'Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  firefoxWin: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0',
  firefoxLinux: 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0',
  firefoxAndroid: 'Mozilla/5.0 (Android 14; Mobile; rv:125.0) Gecko/125.0 Firefox/125.0',
  firefoxIos:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/125.0 Mobile/15E148 Safari/605.1.15',
  safariMac:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Safari/605.1.15',
  safariIos:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1',
  safariIpad:
    'Mozilla/5.0 (iPad; CPU OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
  edgeWin:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.2478.67',
  edgeAndroid:
    'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36 EdgA/124.0.2478.62',
  edgeIos:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 EdgiOS/124.2478.50 Mobile/15E148 Safari/605.1.15',
  edgeLegacy:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 Edge/18.19582',
  operaWin:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 OPR/110.0.0.0',
  operaIos:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) OPiOS/16.0.15.124050 Mobile/15E148 Safari/9537.53',
  operaPresto: 'Opera/9.80 (Windows NT 6.1; U; en) Presto/2.10.289 Version/12.02',
  samsung:
    'Mozilla/5.0 (Linux; Android 13; SAMSUNG SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/24.0 Chrome/117.0.0.0 Mobile Safari/537.36',
  vivaldi:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Vivaldi/6.7.3329.31',
  ie11: 'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko',
  ie10: 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)',
  ie9: 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)',
  bot: 'Googlebot/2.1 (+http://www.google.com/bot.html)',
};

describe('detectBrowser', () => {
  const cases: Array<[keyof typeof UA, string, string, boolean, string | undefined]> = [
    ['chromeMac', 'chrome', '124.0.0.0', false, 'macOS'],
    ['chromeWin', 'chrome', '120.0.6099.109', false, 'Windows'],
    ['chromeAndroid', 'chrome', '124.0.6367.82', true, 'Android'],
    ['chromeIos', 'chrome', '124.0.6367.88', true, 'iOS'],
    ['chromeOs', 'chrome', '124.0.0.0', false, 'ChromeOS'],
    ['firefoxWin', 'firefox', '125.0', false, 'Windows'],
    ['firefoxLinux', 'firefox', '115.0', false, 'Linux'],
    ['firefoxAndroid', 'firefox', '125.0', true, 'Android'],
    ['firefoxIos', 'firefox', '125.0', true, 'iOS'],
    ['safariMac', 'safari', '17.4.1', false, 'macOS'],
    ['safariIos', 'safari', '17.4', true, 'iOS'],
    ['safariIpad', 'safari', '16.6', true, 'iOS'],
    ['edgeWin', 'edge', '124.0.2478.67', false, 'Windows'],
    ['edgeAndroid', 'edge', '124.0.2478.62', true, 'Android'],
    ['edgeIos', 'edge', '124.2478.50', true, 'iOS'],
    ['edgeLegacy', 'edge', '18.19582', false, 'Windows'],
    ['operaWin', 'opera', '110.0.0.0', false, 'Windows'],
    ['operaIos', 'opera', '16.0.15.124050', true, 'iOS'],
    ['operaPresto', 'opera', '12.02', false, 'Windows'],
    ['samsung', 'samsung', '24.0', true, 'Android'],
    ['vivaldi', 'vivaldi', '6.7.3329.31', false, 'Windows'],
    ['ie11', 'ie', '11.0', false, 'Windows'],
    ['ie10', 'ie', '10.0', false, 'Windows'],
    ['ie9', 'ie', '9.0', false, 'Windows'],
  ];

  it.each(cases)('%s', (key, id, version, mobile, os) => {
    expect(detectBrowser(UA[key])).toMatchObject({ id, version, mobile, os });
  });

  it('names the browser', () => {
    expect(detectBrowser(UA.samsung).name).toBe('Samsung Internet');
    expect(detectBrowser(UA.ie11).name).toBe('Internet Explorer');
  });

  it('upgrades a Chrome UA to Brave on the hint, and only Chrome', () => {
    expect(detectBrowser(UA.chromeMac, { brave: true })).toMatchObject({
      id: 'brave',
      name: 'Brave',
      version: '124.0.0.0',
    });
    expect(detectBrowser(UA.firefoxWin, { brave: true }).id).toBe('firefox');
    expect(detectBrowser(UA.edgeWin, { brave: true }).id).toBe('edge');
  });

  it('reports unknown for bots and empty strings', () => {
    expect(detectBrowser(UA.bot)).toMatchObject({ id: 'unknown', version: '', mobile: false });
    expect(detectBrowser('').id).toBe('unknown');
  });
});

describe('compareVersions', () => {
  it('compares numerically, not lexically', () => {
    expect(compareVersions('4.10', '4.9')).toBeGreaterThan(0);
    expect(compareVersions('4.9', '4.10')).toBeLessThan(0);
    expect(compareVersions('10', '9.9.9')).toBeGreaterThan(0);
  });
  it('treats missing parts as zero', () => {
    expect(compareVersions('1', '1.0.0')).toBe(0);
    expect(compareVersions('1.0.1', '1')).toBeGreaterThan(0);
  });
  it('tolerates junk', () => {
    expect(compareVersions('', '0')).toBe(0);
    expect(compareVersions('17.4-beta', '17.4')).toBe(0);
  });
});

describe('checkBrowserSupport', () => {
  const supported = { chrome: '90', firefox: '88', safari: '14.1' };

  it('ok at or above the minimum', () => {
    expect(checkBrowserSupport(detectBrowser(UA.chromeMac), supported)).toMatchObject({
      supported: true,
      reason: 'ok',
      minVersion: '90',
    });
    expect(checkBrowserSupport(detectBrowser(UA.safariMac), { safari: '17.4.1' }).supported).toBe(
      true,
    );
  });

  it('outdated below the minimum', () => {
    const result = checkBrowserSupport(detectBrowser(UA.firefoxLinux), { firefox: '120' });
    expect(result).toMatchObject({ supported: false, reason: 'outdated', minVersion: '120' });
    expect(result.browser.version).toBe('115.0');
  });

  it('not-listed when the browser is missing', () => {
    const result = checkBrowserSupport(detectBrowser(UA.ie11), supported);
    expect(result).toMatchObject({ supported: false, reason: 'not-listed' });
    expect(result.minVersion).toBeUndefined();
  });

  it('does not nag an unknown browser', () => {
    expect(checkBrowserSupport(detectBrowser(UA.bot), supported)).toMatchObject({
      supported: true,
      reason: 'unknown',
    });
  });
});
