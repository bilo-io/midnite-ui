import { useState } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { Text } from 'react-native';
import { describe, expect, it, vi } from 'vitest';

import { Sheet } from './sheet';

function Harness({ side, onClose }: { side: 'left' | 'bottom'; onClose: () => void }) {
  const [open, setOpen] = useState(true);
  return (
    <Sheet
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) onClose();
      }}
      side={side}
      title="Repositories"
    >
      <Text>midnite-studio</Text>
    </Sheet>
  );
}

describe.each(['left', 'bottom'] as const)('Sheet (%s)', (side) => {
  it('renders its title and children when open', () => {
    render(<Harness side={side} onClose={() => {}} />);
    expect(screen.getByRole('heading', { name: 'Repositories' })).toBeInTheDocument();
    expect(screen.getByText('midnite-studio')).toBeInTheDocument();
  });

  it('closes on a scrim press', () => {
    const onClose = vi.fn();
    render(<Harness side={side} onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes on onRequestClose (Android back; Escape on the web)', () => {
    const onClose = vi.fn();
    render(<Harness side={side} onClose={onClose} />);
    act(() => {
      fireEvent.keyUp(document, { key: 'Escape' });
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe('Sheet in place', () => {
  it('renders without a Modal and still closes on the scrim', () => {
    const onOpenChange = vi.fn();
    render(
      <Sheet open onOpenChange={onOpenChange} side="left" modal={false} title="Forge">
        <Text>accounts</Text>
      </Sheet>,
    );
    expect(screen.getByText('accounts')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});

describe('Sheet closed', () => {
  it('renders nothing', () => {
    render(
      <Sheet open={false} onOpenChange={() => {}} side="bottom">
        <Text>hidden</Text>
      </Sheet>,
    );
    expect(screen.queryByText('hidden')).not.toBeInTheDocument();
  });
});
