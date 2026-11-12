'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Clock, Laptop, Moon, Sun, type LucideIcon } from 'lucide-react';
import { cn } from '../lib/cn';
import { Button } from './button';
import { useTheme, type ThemePreference } from '../theme/theme-context';

/**
 * Copy overrides for the toggle — all optional, defaulting to the current
 * English strings so non-i18n consumers (docs, admin) are unaffected; app
 * consumers pass translated values (Phase 82 Theme E).
 */
export type ThemeToggleLabels = {
  /** Accessible name of the collapsed icon button (default 'Toggle theme'). */
  toggle?: string;
  /**
   * Tooltip (collapsed) / accessible prefix (expanded) — default 'Theme'. The
   * expanded trigger is named "Theme: Dark"; it also names the menu.
   */
  theme?: string;
  /** Menu option labels; the expanded trigger shows the selected one. */
  light?: string;
  dark?: string;
  system?: string;
  time?: string;
};

const ORDER: readonly ThemePreference[] = ['light', 'dark', 'system', 'time'];

const ICONS: Record<ThemePreference, LucideIcon> = {
  light: Sun,
  dark: Moon,
  system: Laptop,
  time: Clock,
};

const DEFAULT_OPTION_LABELS: Record<ThemePreference, string> = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
  time: 'Time',
};

export function ThemeToggle({
  expanded,
  labels,
}: {
  expanded?: boolean;
  labels?: ThemeToggleLabels;
}) {
  const toggleLabel = labels?.toggle ?? 'Toggle theme';
  const themeLabel = labels?.theme ?? 'Theme';
  const option = (value: ThemePreference) => ({
    value,
    Icon: ICONS[value],
    label: labels?.[value] ?? DEFAULT_OPTION_LABELS[value],
  });
  const options = ORDER.map(option);
  const { preference, resolved, setPreference } = useTheme();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // The two triggers anchor the menu differently; don't carry it across a switch.
  useEffect(() => {
    setOpen(false);
  }, [expanded]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const TriggerIcon = resolved === 'dark' ? Moon : Sun;
  // The expanded trigger reads like every other sidenav row: the saved
  // preference's icon and label ("System" with the laptop), not a generic
  // "Theme". The collapsed trigger shows the resolved light/dark glyph instead.
  const selected = option(preference);

  return (
    <div ref={rootRef} className="group relative">
      {expanded ? (
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-full items-center gap-3 rounded-md px-2.5 text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
        >
          <selected.Icon className="h-4 w-4 shrink-0" />
          <span className="truncate text-sm">
            <span className="sr-only">{themeLabel}: </span>
            {selected.label}
          </span>
        </button>
      ) : (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={toggleLabel}
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <TriggerIcon className="h-4 w-4" />
        </Button>
      )}
      {!open && !expanded ? (
        <span
          role="tooltip"
          className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 whitespace-nowrap rounded-md border border-border/80 bg-card px-2 py-1 text-xs font-medium text-foreground opacity-0 shadow-md transition-opacity duration-100 group-hover:opacity-100"
        >
          {themeLabel}
        </span>
      ) : null}
      {open ? (
        <div
          role="menu"
          aria-label={themeLabel}
          className={cn(
            'absolute z-50 rounded-md border bg-card text-card-foreground p-1 shadow-md',
            // Expanded: the dropup spans the sidenav's full width; collapsed: a
            // fixed-width flyout to the right of the icon rail.
            expanded
              ? 'bottom-full left-0 mb-1 w-full min-w-[10rem]'
              : 'bottom-0 left-full ml-2 min-w-[10rem]',
          )}
        >
          {options.map(({ value, label, Icon }) => {
            const active = preference === value;
            return (
              <button
                key={value}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                onClick={() => {
                  setPreference(value);
                  setOpen(false);
                }}
                className={cn(
                  'flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors',
                  'hover:bg-accent hover:text-accent-foreground',
                  active && 'bg-accent text-accent-foreground',
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
                {active ? <Check className="ml-auto h-4 w-4" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
