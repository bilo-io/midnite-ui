import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SegmentedControl } from './segmented-control';

function Views() {
  const [value, setValue] = useState('board');
  return (
    <SegmentedControl
      segments={[
        { key: 'board', label: 'Board' },
        { key: 'list', label: 'List' },
        { key: 'graph', label: 'Graph' },
      ]}
      value={value}
      onChange={setValue}
    />
  );
}

describe('SegmentedControl', () => {
  it('is a tab list that changes and reports the selected segment', () => {
    render(<Views />);
    expect(screen.getByRole('tablist', { name: 'View' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Board' })).toHaveAttribute('aria-selected', 'true');
    fireEvent.click(screen.getByRole('tab', { name: 'Graph' }));
    expect(screen.getByRole('tab', { name: 'Graph' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Board' })).toHaveAttribute('aria-selected', 'false');
  });
});
