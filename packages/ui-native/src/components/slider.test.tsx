import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { layoutPerPixel, Slider, snapValue, valueAt } from './slider';

// react-native-web's `onLayout` goes through one ResizeObserver; keep its
// callback so a test can report a size the way a browser would.
let reportResize: ((entries: { target: Element }[]) => void) | undefined;
window.ResizeObserver = class {
  constructor(callback: (entries: { target: Element }[]) => void) {
    reportResize = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
} as unknown as typeof ResizeObserver;

describe('snapValue', () => {
  it('clamps and snaps to the step', () => {
    expect(snapValue(42, 0, 100, 5)).toBe(40);
    expect(snapValue(-3, 0, 100, 1)).toBe(0);
    expect(snapValue(120, 0, 100, 1)).toBe(100);
    expect(snapValue(0.30000000000000004, 0, 1, 0.1)).toBe(0.3);
    expect(snapValue(Number.NaN, 10, 20, 1)).toBe(10);
  });
});

describe('valueAt', () => {
  it('maps a position on the track to a value (the knob centre travels inside it)', () => {
    // 218dp wide, an 18dp knob: 200dp of travel starting 9dp in.
    expect(valueAt(9, 218, 0, 100, 1)).toBe(0);
    expect(valueAt(109, 218, 0, 100, 1)).toBe(50);
    expect(valueAt(209, 218, 0, 100, 1)).toBe(100);
    expect(valueAt(500, 218, 0, 100, 1)).toBe(100);
  });
});

describe('layoutPerPixel', () => {
  it('is layout width over drawn width, or 1 when either is unknown', () => {
    const drawn = (width: number) => ({ getBoundingClientRect: () => ({ width }) });
    expect(layoutPerPixel(drawn(109), 218)).toBe(2);
    expect(layoutPerPixel(drawn(218), 218)).toBe(1);
    expect(layoutPerPixel(drawn(0), 218)).toBe(1);
    expect(layoutPerPixel(drawn(109), 0)).toBe(1);
    expect(layoutPerPixel(42, 218)).toBe(1);
    expect(layoutPerPixel(null, 218)).toBe(1);
  });
});

describe('Slider', () => {
  it('is an adjustable with its range and value', () => {
    render(<Slider label="Volume" defaultValue={30} />);
    const slider = screen.getByRole('slider', { name: 'Volume' });
    expect(slider).toHaveAttribute('aria-valuemin', '0');
    expect(slider).toHaveAttribute('aria-valuemax', '100');
    expect(slider).toHaveAttribute('aria-valuenow', '30');
  });

  it('steps with the arrow keys and jumps with Home/End', () => {
    const onValueChange = vi.fn();
    render(
      <Slider
        accessibilityLabel="Brightness"
        defaultValue={50}
        step={5}
        onValueChange={onValueChange}
      />,
    );
    const slider = screen.getByRole('slider', { name: 'Brightness' });
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(slider).toHaveAttribute('aria-valuenow', '55');
    fireEvent.keyDown(slider, { key: 'ArrowDown' });
    fireEvent.keyDown(slider, { key: 'ArrowDown' });
    expect(slider).toHaveAttribute('aria-valuenow', '45');
    fireEvent.keyDown(slider, { key: 'End' });
    expect(slider).toHaveAttribute('aria-valuenow', '100');
    fireEvent.keyDown(slider, { key: 'Home' });
    expect(onValueChange).toHaveBeenLastCalledWith(0);
  });

  it('stays put while disabled', () => {
    const onValueChange = vi.fn();
    render(
      <Slider
        accessibilityLabel="Locked"
        defaultValue={20}
        disabled
        onValueChange={onValueChange}
      />,
    );
    fireEvent.keyDown(screen.getByRole('slider', { name: 'Locked' }), { key: 'ArrowRight' });
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('follows `value` when controlled', () => {
    const { rerender } = render(<Slider accessibilityLabel="Zoom" value={10} />);
    fireEvent.keyDown(screen.getByRole('slider', { name: 'Zoom' }), { key: 'ArrowRight' });
    // No onValueChange wired to state, so the controlled value holds.
    expect(screen.getByRole('slider', { name: 'Zoom' })).toHaveAttribute('aria-valuenow', '10');
    rerender(<Slider accessibilityLabel="Zoom" value={70} />);
    expect(screen.getByRole('slider', { name: 'Zoom' })).toHaveAttribute('aria-valuenow', '70');
  });

  it('maps a click to the value under it inside a CSS-scaled frame', async () => {
    // A 218dp track (200dp of knob travel from 9dp in) drawn at half size at
    // x=100, as in the showcase's scaled phone: offsetWidth (onLayout) is 218,
    // the pointer sees 109px.
    const onSlidingComplete = vi.fn();
    render(<Slider accessibilityLabel="Scaled" onSlidingComplete={onSlidingComplete} />);
    const slider = screen.getByRole('slider', { name: 'Scaled' });
    Object.defineProperty(slider, 'offsetWidth', { configurable: true, value: 218 });
    slider.getBoundingClientRect = () =>
      ({ left: 100, top: 0, width: 109, height: 14, right: 209, bottom: 14 }) as DOMRect;
    act(() => reportResize?.([{ target: slider }]));

    const at = (fraction: number) => 100 + (9 + fraction * 200) / 2;
    const click = (clientX: number) => {
      fireEvent.mouseDown(slider, { clientX, clientY: 7, button: 0, buttons: 1 });
      fireEvent.mouseUp(slider, { clientX, clientY: 7, button: 0 });
    };
    // onLayout lands on a timer (UIManager.measure), so retry until it has.
    await waitFor(() => {
      click(at(0.5));
      expect(slider).toHaveAttribute('aria-valuenow', '50');
    });
    click(at(0.98));
    expect(slider).toHaveAttribute('aria-valuenow', '98');
    expect(onSlidingComplete).toHaveBeenLastCalledWith(98);
  });
});
