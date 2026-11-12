import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Tabs } from './tabs';

function Segmented() {
  const [value, setValue] = useState<'day' | 'week' | 'month'>('week');
  return (
    <Tabs
      accessibilityLabel="Range"
      options={[
        { value: 'day', label: 'Day' },
        { value: 'week', label: 'Week' },
        { value: 'month', label: 'Month' },
      ]}
      value={value}
      onChange={setValue}
    />
  );
}

describe('Tabs', () => {
  it('is a labelled tab list with the selected tab marked', () => {
    render(<Segmented />);
    expect(screen.getByRole('tablist', { name: 'Range' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Week' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Day' })).toHaveAttribute('aria-selected', 'false');
  });

  it('selects a tab on press', () => {
    render(<Segmented />);
    fireEvent.click(screen.getByRole('tab', { name: 'Month' }));
    expect(screen.getByRole('tab', { name: 'Month' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Week' })).toHaveAttribute('aria-selected', 'false');
  });
});
