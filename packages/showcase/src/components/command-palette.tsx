import { useEffect, useMemo, useRef, useState } from 'react';
import { CornerDownLeft, Palette, Search } from 'lucide-react';

import { cn } from '@bilo-io/ui';

import { COMPONENTS } from '../catalog';
import { navigate, type Route } from '../router';
import { searchComponents } from '../search';

type Item = { key: string; label: string; hint: string; route: Route };

const TOKENS_ITEM: Item = {
  key: 'tokens',
  label: 'Design tokens',
  hint: 'Foundations',
  route: { page: 'tokens' },
};

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const items = useMemo<Item[]>(() => {
    const hits = searchComponents(query, COMPONENTS).map(({ doc }) => ({
      key: doc.id,
      label: doc.name,
      hint: doc.category,
      route: { page: 'component', id: doc.id } as Route,
    }));
    const q = query.trim().toLowerCase();
    const showTokens =
      q === '' ||
      ['design tokens', 'colors', 'colours', 'radius', 'palette'].some((t) => t.includes(q));
    return showTokens ? [...hits, TOKENS_ITEM] : hits;
  }, [query]);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    setActive(0);
    // Focus after the dialog paints.
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  if (!open) return null;

  const choose = (item: Item | undefined) => {
    if (!item) return;
    navigate(item.route);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-background/60 p-4 pt-[12vh] backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search components"
        className="w-full max-w-xl overflow-hidden rounded-xl border border-border/60 bg-popover text-popover-foreground shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-border/60 px-4">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActive((i) => Math.min(i + 1, items.length - 1));
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActive((i) => Math.max(i - 1, 0));
              } else if (e.key === 'Enter') {
                e.preventDefault();
                choose(items[active]);
              } else if (e.key === 'Escape') {
                onClose();
              }
            }}
            placeholder="Search components, props, keywords…"
            aria-label="Search components"
            aria-controls="palette-results"
            aria-activedescendant={items[active] ? `palette-${items[active].key}` : undefined}
            role="combobox"
            aria-expanded="true"
            className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <kbd className="hidden rounded border border-border/60 px-1.5 py-0.5 text-[10px] text-muted-foreground sm:block">
            esc
          </kbd>
        </div>
        <ul
          id="palette-results"
          ref={listRef}
          role="listbox"
          className="max-h-[50vh] overflow-y-auto p-2"
        >
          {items.length === 0 ? (
            <li className="px-3 py-8 text-center text-sm text-muted-foreground">
              No components match “{query}”.
            </li>
          ) : (
            items.map((item, i) => (
              <li
                key={item.key}
                id={`palette-${item.key}`}
                data-index={i}
                role="option"
                aria-selected={i === active}
                onMouseMove={() => setActive(i)}
                onClick={() => choose(item)}
                className={cn(
                  'flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm',
                  i === active && 'bg-accent text-accent-foreground',
                )}
              >
                {item.key === 'tokens' ? (
                  <Palette className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <span className="flex h-4 w-4 items-center justify-center font-mono text-[10px] text-muted-foreground">
                    {item.label[0]}
                  </span>
                )}
                <span className="font-medium">{item.label}</span>
                <span className="ml-auto text-xs text-muted-foreground">{item.hint}</span>
                {i === active ? (
                  <CornerDownLeft className="h-3.5 w-3.5 text-muted-foreground" />
                ) : null}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
