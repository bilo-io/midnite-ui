import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { contrastRatio, contrastTextForHex } from '../theme/contrast';
import { Chip } from './chip';

describe('Chip', () => {
  it.each([
    ['#facc15', '#000000'],
    ['#1e293b', '#ffffff'],
  ])('reads on %s with %s text at ≥ 4.5:1', (fill, ink) => {
    expect(contrastTextForHex(fill)).toBe(ink);
    expect(contrastRatio(ink, fill)).toBeGreaterThanOrEqual(4.5);
    render(<Chip label={`on ${fill}`} color={fill} />);
    expect(screen.getByText(`on ${fill}`)).toHaveStyle({ color: ink });
  });

  it('is a selectable button when pressable', () => {
    const onPress = vi.fn();
    render(<Chip label="Bugs" selected onPress={onPress} />);
    const chip = screen.getByRole('button', { name: 'Bugs' });
    expect(chip).toHaveAttribute('aria-selected', 'true');
    fireEvent.click(chip);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('is plain text without onPress', () => {
    render(<Chip label="ui" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
