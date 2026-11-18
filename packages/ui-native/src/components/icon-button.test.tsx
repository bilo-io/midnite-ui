import { fireEvent, render, screen } from '@testing-library/react';
import { Text } from 'react-native';
import { describe, expect, it, vi } from 'vitest';

import { IconButton } from './icon-button';

describe('IconButton', () => {
  it('is named by its label and calls onPress', () => {
    const onPress = vi.fn();
    render(<IconButton icon={<Text>≡</Text>} label="Open panel" onPress={onPress} />);
    fireEvent.click(screen.getByRole('button', { name: 'Open panel' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('is inert when disabled', () => {
    const onPress = vi.fn();
    render(<IconButton icon={<Text>≡</Text>} label="Copy" onPress={onPress} disabled />);
    const button = screen.getByRole('button', { name: 'Copy' });
    fireEvent.click(button);
    expect(onPress).not.toHaveBeenCalled();
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });
});
