import { fireEvent, render, screen } from '@testing-library/react';
import { Text } from 'react-native';
import { describe, expect, it } from 'vitest';

import { Accordion } from './accordion';

describe('Accordion', () => {
  it('starts closed and opens on press, reporting expanded', () => {
    render(
      <Accordion title="Notifications" count={3}>
        <Text>Body copy</Text>
      </Accordion>,
    );
    const trigger = screen.getByRole('button', { name: 'Notifications, 3' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Body copy')).not.toBeInTheDocument();
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Body copy')).toBeInTheDocument();
  });

  it('honours defaultOpen and closes again', () => {
    render(
      <Accordion title="Privacy" defaultOpen variant="bare">
        <Text>Shown</Text>
      </Accordion>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Privacy' }));
    expect(screen.queryByText('Shown')).not.toBeInTheDocument();
  });
});
