import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { CodeBlock } from './code-block';
import { CodeDemo } from './code-demo';

const code = '<Button>Hi</Button>';

describe('CodeDemo', () => {
  it('shows the preview first and the highlighted code after switching tabs', () => {
    render(
      <CodeDemo title="Demo" code={code}>
        <span>live</span>
      </CodeDemo>,
    );
    expect(screen.getByText('live')).toBeTruthy();
    expect(screen.getByRole('tablist', { name: 'Demo view' })).toBeTruthy();
    fireEvent.click(screen.getByRole('tab', { name: 'Code' }));
    expect(screen.queryByText('live')).toBeNull();
    expect(document.querySelector('code.hljs')?.textContent).toBe(code);
    expect(screen.getByRole('button', { name: 'Copy code' })).toBeTruthy();
  });

  it('escapes markup in the source', () => {
    render(
      <CodeDemo code={'<img src=x onerror=alert(1)>'} defaultView="code">
        <span>live</span>
      </CodeDemo>,
    );
    expect(document.querySelector('img')).toBeNull();
  });

  it('is controlled when view is given', () => {
    const onViewChange = vi.fn();
    render(
      <CodeDemo code={code} view="preview" onViewChange={onViewChange}>
        <span>live</span>
      </CodeDemo>,
    );
    fireEvent.click(screen.getByRole('tab', { name: 'Code' }));
    expect(onViewChange).toHaveBeenCalledWith('code');
    expect(screen.getByText('live')).toBeTruthy();
  });

  it('stacked layout collapses the code with aria-expanded', () => {
    render(
      <CodeDemo code={code} layout="stacked" labels={{ code: 'Source' }}>
        <span>live</span>
      </CodeDemo>,
    );
    const toggle = screen.getByRole('button', { name: 'Source' });
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(toggle);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByText('live')).toBeTruthy();
    expect(document.getElementById(toggle.getAttribute('aria-controls')!)?.hidden).toBe(false);
  });
});

describe('CodeBlock', () => {
  it('hides the copy button when showCopy is false and honours labels', () => {
    const { rerender } = render(<CodeBlock code="a" showCopy={false} />);
    expect(screen.queryByRole('button')).toBeNull();
    rerender(<CodeBlock code="a" labels={{ copy: 'Kopieer' }} />);
    expect(screen.getByRole('button', { name: 'Kopieer' })).toBeTruthy();
  });
});
