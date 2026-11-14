import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { PointerTrail } from './pointer-trail';

function mockMedia({ fine = true, reduced = false } = {}) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      matches: query.includes('pointer: fine')
        ? fine
        : query.includes('prefers-reduced-motion')
          ? reduced
          : false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  );
}

describe('PointerTrail', () => {
  beforeEach(() => mockMedia());
  afterEach(() => vi.unstubAllGlobals());

  it('marks host ready and renders trail nodes for trail, fluid and aurora variants', () => {
    const { rerender } = render(<PointerTrail variant="trail" length={10} />);
    const host = screen.getByTestId('pointer-fx');
    expect(host.getAttribute('data-ready')).toBe('');
    expect(host.getAttribute('data-variant')).toBe('trail');
    expect(host.getAttribute('data-tone')).toBe('foreground');
    expect(host.querySelectorAll('.pointer-trail')).toHaveLength(10);
    expect(host.querySelector('.pointer-dot')).not.toBeNull();

    rerender(<PointerTrail variant="fluid" length={12} />);
    expect(host.getAttribute('data-variant')).toBe('fluid');
    expect(host.getAttribute('data-tone')).toBe('gradient');
    expect(host.querySelectorAll('.pointer-trail')).toHaveLength(12);

    rerender(<PointerTrail variant="aurora" length={8} />);
    expect(host.getAttribute('data-variant')).toBe('aurora');
    expect(host.getAttribute('data-tone')).toBe('gradient');
    expect(host.querySelectorAll('.pointer-trail')).toHaveLength(8);
  });

  it('renders a lagging ring and dot for the ring variant and respects tone overrides', () => {
    const { rerender } = render(<PointerTrail variant="ring" />);
    const host = screen.getByTestId('pointer-fx');
    expect(host.getAttribute('data-variant')).toBe('ring');
    expect(host.getAttribute('data-tone')).toBe('foreground');
    expect(host.querySelector('.pointer-ring')).not.toBeNull();
    expect(host.querySelector('.pointer-dot')).not.toBeNull();
    expect(host.querySelectorAll('.pointer-trail')).toHaveLength(0);

    rerender(<PointerTrail variant="ring" tone="gradient" />);
    expect(host.getAttribute('data-tone')).toBe('gradient');
  });

  it('supports contained mode and tracks pointer down and up states', () => {
    render(
      <div>
        <PointerTrail variant="fluid" contained />
      </div>,
    );
    const host = screen.getByTestId('pointer-fx');
    expect(host.getAttribute('data-contained')).toBe('');
    expect(host.getAttribute('data-active')).toBe('');

    fireEvent.pointerDown(host.parentElement!);
    expect(host.getAttribute('data-down')).toBe('');

    fireEvent.pointerUp(document);
    expect(host.hasAttribute('data-down')).toBe(false);
  });

  it('stays off under reduced motion or touch-only pointers', () => {
    mockMedia({ fine: true, reduced: true });
    const { rerender } = render(<PointerTrail />);
    expect(screen.getByTestId('pointer-fx').hasAttribute('data-ready')).toBe(false);

    mockMedia({ fine: false, reduced: false });
    rerender(<PointerTrail variant="aurora" />);
    expect(screen.getByTestId('pointer-fx').hasAttribute('data-ready')).toBe(false);
  });
});
