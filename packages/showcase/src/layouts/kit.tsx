import type { CSSProperties } from 'react';

import { cn } from '@bilo-io/ui';

// Shared bits for the example layouts: no photos and no brand marks, only
// gradients, initials and inline SVG, so nothing is fetched at runtime.

export const gradient = (hue: number, spread = 40) =>
  `linear-gradient(135deg, hsl(${hue} 80% 62%), hsl(${(hue + spread) % 360} 78% 46%))`;

export const initials = (name: string) =>
  name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

/** A round initials avatar on a hue-derived gradient. */
export function Avatar({
  name,
  hue,
  size = 36,
  className,
}: {
  name: string;
  hue: number;
  size?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white',
        className,
      )}
      style={{ width: size, height: size, fontSize: size * 0.38, background: gradient(hue) }}
    >
      {initials(name)}
    </span>
  );
}

/** A stand-in for a photo: layered radial gradients, steered by a hue and a seed. */
export function Art({
  hue,
  seed = 0,
  className,
  style,
}: {
  hue: number;
  seed?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const x = 20 + ((seed * 37) % 60);
  const y = 15 + ((seed * 53) % 60);
  return (
    <div
      aria-hidden
      className={cn('relative overflow-hidden', className)}
      style={{
        background: `radial-gradient(circle at ${x}% ${y}%, hsl(${(hue + 50) % 360} 90% 70% / 0.9), transparent 45%), radial-gradient(circle at ${100 - x}% ${100 - y}%, hsl(${(hue + 300) % 360} 80% 55% / 0.8), transparent 50%), ${gradient(hue, 80)}`,
        ...style,
      }}
    >
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full opacity-25">
        <path d={`M0 ${70 - (seed % 3) * 8} Q30 ${50 + (seed % 4) * 6} 55 70 T100 ${60 + (seed % 5) * 4} V100 H0Z`} fill="white" />
      </svg>
    </div>
  );
}

/** The app's mark: a rounded square with one letter, in the app's hue. */
export function Mark({ letter, hue, size = 28 }: { letter: string; hue: number; size?: number }) {
  return (
    <span
      aria-hidden
      className="inline-flex shrink-0 items-center justify-center rounded-lg font-bold text-white"
      style={{ width: size, height: size, fontSize: size * 0.55, background: gradient(hue, 50) }}
    >
      {letter}
    </span>
  );
}
