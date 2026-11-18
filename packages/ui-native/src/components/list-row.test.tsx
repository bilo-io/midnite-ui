import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ListRow } from './list-row';

describe('ListRow', () => {
  it('fires onPress', () => {
    const onPress = vi.fn();
    render(<ListRow title="Theme" meta="System" onPress={onPress} />);
    fireEvent.click(screen.getByRole('button', { name: /Theme/ }));
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(screen.getByText('System')).toBeInTheDocument();
  });

  it('fires onLongPress after a held press', () => {
    vi.useFakeTimers();
    try {
      const onLongPress = vi.fn();
      render(<ListRow title="#1241 Switch repo" subtitle="Todo" onLongPress={onLongPress} />);
      const row = screen.getByRole('button', { name: /#1241/ });
      fireEvent.mouseDown(row, { button: 0, buttons: 1 });
      vi.advanceTimersByTime(600);
      expect(onLongPress).toHaveBeenCalledTimes(1);
    } finally {
      vi.useRealTimers();
    }
  });

  it('is not a button without a handler, and grows with a subtitle', () => {
    render(<ListRow title="Version" subtitle="0.5.0" testID="row" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByTestId('row')).not.toHaveAttribute('aria-disabled');
    expect(screen.getByTestId('row')).toHaveStyle({ minHeight: '72px' });
  });
});
