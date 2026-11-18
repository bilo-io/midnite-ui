import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { EmptyState } from './empty-state';

describe('EmptyState', () => {
  it('shows title and body, and fires its action', () => {
    const onPress = vi.fn();
    render(
      <EmptyState
        title="No items match"
        body="Try another filter."
        action={{ label: 'Clear filters', onPress }}
      />,
    );
    expect(screen.getByRole('heading', { name: 'No items match' })).toBeInTheDocument();
    expect(screen.getByText('Try another filter.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
