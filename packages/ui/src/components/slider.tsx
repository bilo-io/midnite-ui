'use client';

import * as React from 'react';
import { cn } from '../lib/cn';

/** A CSS `<image>`/colour string, or colour stops laid left to right. */
export type SliderGradient = string | readonly string[];

export type SliderProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'value' | 'defaultValue' | 'onChange' | 'min' | 'max' | 'step' | 'children'
> & {
  /** Controlled value. Leave undefined (and pass `defaultValue`) for uncontrolled. */
  value?: number;
  /** Starting value when uncontrolled. Defaults to `min`. */
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  /** Called with the next value as a number. */
  onValueChange?: (value: number) => void;
  /**
   * Paints the filled track and the knob. A string is any CSS background
   * (`linear-gradient(…)` or a plain colour); an array is colour stops, joined
   * into a left-to-right linear gradient. Omit for the primary token.
   */
  gradient?: SliderGradient;
  /** Visible label, wired to the input with `htmlFor`. */
  label?: React.ReactNode;
  /** Classes for the outer wrapper (the input itself takes none). */
  className?: string;
};

const KNOB = 14; // px — keep in step with the size-3.5 knob and the native thumb.

/** Resolves the `gradient` prop to a CSS background and a focus-ring colour. */
export function sliderPaint(gradient: SliderGradient | undefined): {
  ramp: string;
  focus: string;
} {
  if (gradient === undefined || gradient.length === 0) {
    return { ramp: 'hsl(var(--primary))', focus: 'hsl(var(--ring))' };
  }
  if (typeof gradient === 'string') {
    const isImage = /gradient\(|url\(/.test(gradient);
    return { ramp: gradient, focus: isImage ? 'hsl(var(--ring))' : gradient };
  }
  const stops = gradient as readonly string[];
  const ramp = stops.length === 1 ? stops[0]! : `linear-gradient(90deg, ${stops.join(', ')})`;
  return { ramp, focus: stops[Math.floor((stops.length - 1) / 2)]! };
}

/**
 * A range slider: a native `<input type="range">` (so keyboard, forms and
 * assistive tech behave natively) drawn transparent over a painted track and
 * knob. The filled part of the track and the knob wear `gradient`; the rest of
 * the track stays `--muted`. The knob carries a popover-coloured ring so it
 * reads on light and dark, and a focus-visible ring in the gradient's middle
 * stop. Controlled (`value`) or uncontrolled (`defaultValue`).
 */
export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      value,
      defaultValue,
      min = 0,
      max = 100,
      step = 1,
      onValueChange,
      gradient,
      label,
      className,
      disabled,
      id,
      style,
      ...props
    },
    ref,
  ) => {
    const autoId = React.useId();
    const inputId = id ?? autoId;
    const [inner, setInner] = React.useState(defaultValue ?? min);
    const current = value ?? inner;
    const span = max - min;
    const frac = span > 0 ? Math.min(1, Math.max(0, (current - min) / span)) : 0;
    const { ramp, focus } = sliderPaint(gradient);

    const vars = {
      '--slider-ramp': ramp,
      '--slider-focus': focus,
      '--slider-frac': String(frac),
    } as React.CSSProperties;

    return (
      <div
        data-slider=""
        data-disabled={disabled ? '' : undefined}
        className={cn('flex w-full min-w-0 flex-col gap-1.5', disabled && 'opacity-50', className)}
        style={vars}
      >
        {label != null && (
          <label htmlFor={inputId} className="text-sm text-muted-foreground">
            {label}
          </label>
        )}
        <div className="relative flex h-4 w-full items-center">
          <input
            ref={ref}
            id={inputId}
            type="range"
            min={min}
            max={max}
            step={step}
            value={current}
            disabled={disabled}
            onChange={(event) => {
              const next = Number(event.target.value);
              if (value === undefined) setInner(next);
              onValueChange?.(next);
            }}
            className="peer absolute inset-0 z-10 m-0 h-full w-full cursor-pointer appearance-none bg-transparent opacity-0 disabled:cursor-not-allowed [&::-moz-range-thumb]:size-3.5 [&::-moz-range-thumb]:border-0 [&::-webkit-slider-thumb]:size-3.5 [&::-webkit-slider-thumb]:appearance-none"
            style={style}
            {...props}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 h-1.5 overflow-hidden rounded-full bg-muted"
          >
            <div
              data-slider-fill=""
              className="h-full rounded-full"
              style={{
                width: `calc(${KNOB / 2}px + (100% - ${KNOB}px) * var(--slider-frac))`,
                background: 'var(--slider-ramp)',
              }}
            />
          </div>
          <div
            aria-hidden
            data-slider-knob=""
            className="pointer-events-none absolute z-20 size-3.5 rounded-full border-2 border-popover shadow-[0_0_0_1px_hsl(var(--border))] transition-shadow peer-focus-visible:shadow-[0_0_0_2px_var(--slider-focus)]"
            style={{
              left: `calc((100% - ${KNOB}px) * var(--slider-frac))`,
              background: 'var(--slider-ramp)',
            }}
          />
        </div>
      </div>
    );
  },
);
Slider.displayName = 'Slider';
