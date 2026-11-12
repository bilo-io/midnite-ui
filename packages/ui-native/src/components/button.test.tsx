import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Button } from './button';

describe('Button', () => {
  it('is a button that calls onPress', () => {
    const onPress = vi.fn();
    render(<Button onPress={onPress}>Save</Button>);
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('ignores presses and reports it when disabled', () => {
    const onPress = vi.fn();
    render(
      <Button disabled onPress={onPress}>
        Save
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Save' });
    fireEvent.click(button);
    expect(onPress).not.toHaveBeenCalled();
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });

  it('reports busy and blocks presses while loading', () => {
    const onPress = vi.fn();
    render(
      <Button loading onPress={onPress} accessibilityLabel="Saving">
        Save
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Saving' });
    fireEvent.click(button);
    expect(onPress).not.toHaveBeenCalled();
    expect(button).toHaveAttribute('aria-busy', 'true');
  });

  it('hides its label under the spinner while loading, keeping the name', () => {
    render(<Button loading>Save</Button>);
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    expect(screen.getByText('Save').parentElement).toHaveStyle({ opacity: '0' });
  });

  it('keeps a consumer aria-* prop the state helper does not set', () => {
    render(
      <Button aria-expanded accessibilityLabel="Menu">
        Menu
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Menu' });
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(button).not.toHaveAttribute('aria-checked');
  });
});
