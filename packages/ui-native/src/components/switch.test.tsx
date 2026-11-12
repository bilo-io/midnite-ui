import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Switch } from './switch';

function Controlled() {
  const [on, setOn] = useState(false);
  return <Switch checked={on} onCheckedChange={setOn} accessibilityLabel="Wi-Fi" />;
}

describe('Switch', () => {
  it('toggles and reports aria-checked', () => {
    render(<Controlled />);
    const toggle = screen.getByRole('switch', { name: 'Wi-Fi' });
    expect(toggle).toHaveAttribute('aria-checked', 'false');
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-checked', 'true');
  });

  it('does not change when disabled', () => {
    const onCheckedChange = vi.fn();
    render(
      <Switch checked disabled onCheckedChange={onCheckedChange} accessibilityLabel="Locked" />,
    );
    fireEvent.click(screen.getByRole('switch', { name: 'Locked' }));
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it('keeps a consumer aria-* prop the state helper does not set', () => {
    render(
      <Switch checked={false} onCheckedChange={() => {}} accessibilityLabel="Sync" aria-busy />,
    );
    const toggle = screen.getByRole('switch', { name: 'Sync' });
    expect(toggle).toHaveAttribute('aria-busy', 'true');
    expect(toggle).toHaveAttribute('aria-checked', 'false');
  });
});
