import { fireEvent, render, screen } from '@testing-library/react';
import { Text } from 'react-native';
import { describe, expect, it, vi } from 'vitest';

import { Fab } from './fab';

describe('Fab', () => {
  it('is a button named by its label that fires onPress', () => {
    const onPress = vi.fn();
    render(<Fab icon={<Text>+</Text>} label="New issue" onPress={onPress} />);
    const fab = screen.getByRole('button', { name: 'New issue' });
    fireEvent.click(fab);
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
