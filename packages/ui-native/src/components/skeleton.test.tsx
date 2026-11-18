import { render, screen, waitFor } from '@testing-library/react';
import { AccessibilityInfo, Animated } from 'react-native';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Skeleton } from './skeleton';

afterEach(() => vi.restoreAllMocks());

describe('Skeleton', () => {
  it('pulses by default', async () => {
    vi.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(false);
    const loop = vi.spyOn(Animated, 'loop');
    render(<Skeleton width="70%" height={12} testID="s" />);
    expect(screen.getByTestId('s')).toHaveStyle({ width: '70%', height: '12px' });
    await waitFor(() => expect(loop).toHaveBeenCalled());
  });

  it('is a static block under reduce motion', async () => {
    vi.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(true);
    const stop = vi.fn();
    const loop = vi
      .spyOn(Animated, 'loop')
      .mockReturnValue({ start: vi.fn(), stop, reset: vi.fn() } as never);
    render(<Skeleton width={40} height={40} radius={20} testID="s" />);
    // The first render starts the pulse; reduce motion stops it once the query resolves.
    await waitFor(() => expect(stop).toHaveBeenCalled());
    expect(loop).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('s')).toHaveStyle({ opacity: '1' });
  });
});
