import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { BrowserSupport } from './browser-support';

const IE11 = 'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko';
const OLD_CHROME =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.0.0 Safari/537.36';
const NEW_CHROME =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
const supported = { chrome: '90', firefox: '88' };

describe('BrowserSupport', () => {
  it('renders nothing when the browser is supported', () => {
    const { container } = render(<BrowserSupport supported={supported} userAgent={NEW_CHROME} />);
    expect(container.innerHTML).toBe("");
  });

  it('warns about a browser that is not listed, with the supported list', () => {
    render(<BrowserSupport supported={supported} userAgent={IE11} />);
    const alert = screen.getByRole('alert');
    expect(alert.textContent).toContain('Internet Explorer 11.0 is not supported');
    const link = screen.getByRole('link', { name: /Download Chrome/ });
    expect(link.getAttribute('href')).toBe('https://www.google.com/chrome/');
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noreferrer noopener');
    expect(screen.getAllByRole('link')).toHaveLength(2);
  });

  it('asks for a newer version when outdated', () => {
    render(<BrowserSupport supported={supported} userAgent={OLD_CHROME} />);
    expect(screen.getByRole('alert').textContent).toContain('Chrome 60.0.0.0 is out of date. Version 90 or newer is needed.');
  });

  it('shows a status when asked to render a supported browser', () => {
    render(<BrowserSupport supported={supported} userAgent={NEW_CHROME} showWhenSupported />);
    expect(screen.getByRole('status').textContent).toContain('Chrome 124.0.0.0 is supported');
  });

  it('takes its copy from labels', () => {
    render(
      <BrowserSupport
        supported={supported}
        userAgent={IE11}
        labels={{ notSupported: ({ name }) => `${name} wird nicht unterstützt` }}
      />,
    );
    expect(screen.getByRole('alert').textContent).toContain('Internet Explorer wird nicht unterstützt');
  });

  it('calls onCheck once per result, not once per render', () => {
    const onCheck = vi.fn();
    const { rerender } = render(
      <BrowserSupport supported={{ ...supported }} userAgent={IE11} onCheck={onCheck} />,
    );
    rerender(<BrowserSupport supported={{ ...supported }} userAgent={IE11} onCheck={onCheck} />);
    expect(onCheck).toHaveBeenCalledTimes(1);
    expect(onCheck.mock.calls[0]![0]).toMatchObject({ supported: false, reason: 'not-listed' });

    rerender(<BrowserSupport supported={supported} userAgent={OLD_CHROME} onCheck={onCheck} />);
    expect(onCheck).toHaveBeenCalledTimes(2);
    expect(onCheck.mock.calls[1]![0]).toMatchObject({ reason: 'outdated' });
  });

  it('reports supported results to onCheck even though nothing renders', () => {
    const onCheck = vi.fn();
    render(<BrowserSupport supported={supported} userAgent={NEW_CHROME} onCheck={onCheck} />);
    expect(onCheck).toHaveBeenCalledWith(expect.objectContaining({ supported: true, reason: 'ok' }));
  });

  it('lets children replace the body, as nodes or a render prop', () => {
    const { rerender } = render(
      <BrowserSupport supported={supported} userAgent={IE11}>
        <p>Please upgrade.</p>
      </BrowserSupport>,
    );
    expect(screen.getByRole('alert').textContent).toContain('Please upgrade.');
    expect(screen.queryByRole('link')).toBeNull();

    rerender(
      <BrowserSupport supported={supported} userAgent={IE11}>
        {(r) => <p>{`${r.browser.id}:${r.reason}`}</p>}
      </BrowserSupport>,
    );
    expect(screen.getByRole('alert').textContent).toContain('ie:not-listed');
  });

  it('checks the live navigator.userAgent by default', () => {
    // jsdom's UA is not a known browser, so nothing is flagged.
    const onCheck = vi.fn();
    const { container } = render(<BrowserSupport supported={{}} onCheck={onCheck} />);
    expect(container.innerHTML).toBe("");
    expect(onCheck).toHaveBeenCalledTimes(1);
  });
});
