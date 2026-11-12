import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Input } from './input';
import { Textarea } from './textarea';

describe('Input', () => {
  it('takes its label as the accessible name and reports typing', () => {
    const onChangeText = vi.fn();
    render(<Input label="Email" placeholder="you@example.com" onChangeText={onChangeText} />);
    expect(screen.getByText('Email')).toBeInTheDocument();
    const field = screen.getByRole('textbox', { name: 'Email' });
    fireEvent.change(field, { target: { value: 'a@b.co' } });
    expect(onChangeText).toHaveBeenCalledWith('a@b.co');
  });

  it('is read-only and reported disabled when disabled', () => {
    render(<Input accessibilityLabel="Locked" disabled defaultValue="fixed" />);
    const field = screen.getByRole('textbox', { name: 'Locked' });
    expect(field).toHaveAttribute('readonly');
    expect(field).toHaveAttribute('aria-disabled', 'true');
  });
});

describe('Textarea', () => {
  it('renders a multi-line field that reports typing', () => {
    const onChangeText = vi.fn();
    render(<Textarea label="Notes" onChangeText={onChangeText} />);
    const field = screen.getByRole('textbox', { name: 'Notes' });
    expect(field.tagName).toBe('TEXTAREA');
    fireEvent.change(field, { target: { value: 'line one\nline two' } });
    expect(onChangeText).toHaveBeenCalledWith('line one\nline two');
  });
});
