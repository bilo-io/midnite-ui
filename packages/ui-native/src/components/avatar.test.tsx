import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Avatar, initialsOf } from './avatar';

describe('Avatar', () => {
  it('falls back to initials without a uri', () => {
    render(<Avatar name="Ada Lovelace" />);
    expect(screen.getByRole('img', { name: 'Ada Lovelace' })).toHaveTextContent('AL');
  });

  it('falls back to initials when the image fails', async () => {
    // jsdom loads no images; this one fails as soon as it is given a src.
    class FailingImage {
      onerror: ((e: unknown) => void) | null = null;
      onload: (() => void) | null = null;
      set src(_v: string) {
        setTimeout(() => this.onerror?.({ type: 'error' }), 0);
      }
    }
    vi.stubGlobal('Image', FailingImage);
    try {
      render(<Avatar name="bilo-io" uri="https://example.invalid/a.png" />);
      await waitFor(() =>
        expect(screen.getByRole('img', { name: 'bilo-io' })).toHaveTextContent('BI'),
      );
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('derives initials', () => {
    expect(initialsOf('bilo')).toBe('BI');
    expect(initialsOf('Grace Brewster Hopper')).toBe('GH');
    expect(initialsOf('  ')).toBe('?');
  });
});
