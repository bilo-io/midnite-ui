import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Slider, sliderPaint } from './slider';

const root = (el: HTMLElement) => el.closest<HTMLElement>('[data-slider]')!;

describe('Slider', () => {
  it('renders a native range input named by its label', () => {
    render(<Slider label="Volume" min={10} max={90} step={5} defaultValue={30} />);
    const input = screen.getByRole('slider', { name: 'Volume' }) as HTMLInputElement;
    expect(input.type).toBe('range');
    expect(input.min).toBe('10');
    expect(input.max).toBe('90');
    expect(input.step).toBe('5');
    expect(input.value).toBe('30');
  });

  it('reports a change as a number and stays where the parent puts it', () => {
    const onValueChange = vi.fn();
    render(<Slider aria-label="Level" value={20} onValueChange={onValueChange} />);
    const input = screen.getByRole('slider', { name: 'Level' }) as HTMLInputElement;
    fireEvent.change(input, { target: { value: '55' } });
    expect(onValueChange).toHaveBeenCalledWith(55);
    // Controlled: no parent update, so the value snaps back.
    expect(input.value).toBe('20');
  });

  it('moves itself when uncontrolled and tracks the fill fraction', () => {
    render(<Slider aria-label="Level" defaultValue={0} />);
    const input = screen.getByRole('slider', { name: 'Level' }) as HTMLInputElement;
    fireEvent.change(input, { target: { value: '25' } });
    expect(input.value).toBe('25');
    expect(root(input).style.getPropertyValue('--slider-frac')).toBe('0.25');
  });

  it('paints the knob where the browser snaps and clamps the value', () => {
    const { rerender } = render(<Slider aria-label="Snap" step={5} value={7} />);
    const input = screen.getByRole('slider', { name: 'Snap' }) as HTMLInputElement;
    expect(input.value).toBe('5');
    expect(root(input).style.getPropertyValue('--slider-frac')).toBe('0.05');
    rerender(<Slider aria-label="Snap" step={5} value={Number.NaN} />);
    expect(root(input).style.getPropertyValue('--slider-frac')).toBe('0');
    rerender(<Slider aria-label="Snap" step={5} value={250} />);
    expect(root(input).style.getPropertyValue('--slider-frac')).toBe('1');
  });

  it('keeps its place when it goes from controlled to uncontrolled', () => {
    const { rerender } = render(<Slider aria-label="Mode" defaultValue={10} value={60} />);
    rerender(<Slider aria-label="Mode" defaultValue={10} />);
    expect((screen.getByRole('slider', { name: 'Mode' }) as HTMLInputElement).value).toBe('60');
  });

  it('puts style on the wrapper beside its own variables', () => {
    render(<Slider aria-label="Styled" style={{ maxWidth: 200 }} defaultValue={50} />);
    const el = root(screen.getByRole('slider', { name: 'Styled' }));
    expect(el.style.maxWidth).toBe('200px');
    expect(el.style.getPropertyValue('--slider-frac')).toBe('0.5');
  });

  it('paints the ramp from colour stops, focus ring in the middle stop', () => {
    render(<Slider aria-label="Spectrum" gradient={['red', 'lime', 'blue']} defaultValue={50} />);
    const el = root(screen.getByRole('slider', { name: 'Spectrum' }));
    expect(el.style.getPropertyValue('--slider-ramp')).toBe(
      'linear-gradient(90deg, red, lime, blue)',
    );
    expect(el.style.getPropertyValue('--slider-focus')).toBe('lime');
  });

  it('passes a CSS gradient string through and defaults to the primary token', () => {
    const { rerender } = render(
      <Slider aria-label="S" gradient="linear-gradient(90deg, #f00, #00f)" />,
    );
    expect(root(screen.getByRole('slider')).style.getPropertyValue('--slider-ramp')).toBe(
      'linear-gradient(90deg, #f00, #00f)',
    );
    rerender(<Slider aria-label="S" />);
    expect(root(screen.getByRole('slider')).style.getPropertyValue('--slider-ramp')).toBe(
      'hsl(var(--primary))',
    );
  });

  it('disables the input and dims the whole control', () => {
    render(<Slider aria-label="Off" disabled />);
    const input = screen.getByRole('slider', { name: 'Off' });
    expect(input).toHaveProperty('disabled', true);
    expect(root(input).hasAttribute('data-disabled')).toBe(true);
  });
});

describe('sliderPaint', () => {
  it('uses a single stop as a solid colour and its own focus ring', () => {
    expect(sliderPaint(['teal'])).toEqual({ ramp: 'teal', focus: 'teal' });
    expect(sliderPaint('teal')).toEqual({ ramp: 'teal', focus: 'teal' });
  });

  it('drops a stop position from the focus colour and a lone stop', () => {
    expect(sliderPaint(['red 0%', 'lime 50%', 'blue 100%']).focus).toBe('lime');
    expect(sliderPaint(['rgb(1 2 3) 10% 30%']).ramp).toBe('rgb(1 2 3)');
  });

  it('keeps the ring token for an image gradient', () => {
    expect(sliderPaint('linear-gradient(red, blue)').focus).toBe('hsl(var(--ring))');
  });
});
