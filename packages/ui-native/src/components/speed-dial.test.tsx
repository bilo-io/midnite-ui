import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Text } from 'react-native';
import { describe, expect, it, vi } from 'vitest';

import { SpeedDial, type SpeedDialAction } from './speed-dial';

function Dial({ actions }: { actions: SpeedDialAction[] }) {
  const [open, setOpen] = useState(false);
  return (
    <SpeedDial
      open={open}
      onOpenChange={setOpen}
      actions={actions}
      icon={<Text>+</Text>}
      label="Quick actions"
    />
  );
}

const make = () => ({
  issue: vi.fn(),
  notes: vi.fn(),
});

describe('SpeedDial', () => {
  const setup = () => {
    const fns = make();
    render(
      <Dial
        actions={[
          { key: 'issue', label: 'New issue', icon: <Text>+</Text>, onPress: fns.issue },
          {
            key: 'notes',
            label: 'Notes',
            icon: <Text>N</Text>,
            onPress: fns.notes,
            disabled: true,
          },
        ]}
      />,
    );
    return fns;
  };

  it('opens on the FAB and closes on the scrim', () => {
    setup();
    const fab = screen.getByRole('button', { name: 'Quick actions' });
    expect(fab).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('button', { name: 'New issue' })).not.toBeInTheDocument();
    fireEvent.click(fab);
    expect(fab).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: 'New issue' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Close actions' }));
    expect(screen.queryByRole('button', { name: 'New issue' })).not.toBeInTheDocument();
  });

  it('fires an action and closes', () => {
    const fns = setup();
    fireEvent.click(screen.getByRole('button', { name: 'Quick actions' }));
    fireEvent.click(screen.getByRole('button', { name: 'New issue' }));
    expect(fns.issue).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('button', { name: 'New issue' })).not.toBeInTheDocument();
  });

  it('keeps a disabled action inert and open', () => {
    const fns = setup();
    fireEvent.click(screen.getByRole('button', { name: 'Quick actions' }));
    const notes = screen.getByRole('button', { name: 'Notes, coming soon' });
    expect(notes).toHaveAttribute('aria-disabled', 'true');
    fireEvent.click(notes);
    expect(fns.notes).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'New issue' })).toBeInTheDocument();
  });
});
