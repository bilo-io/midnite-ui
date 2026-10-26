import type { ReactNode } from 'react';
import { LayoutGrid, Palette } from 'lucide-react';

import { cn } from '@bilo-io/ui';

import { CATEGORIES, COMPONENTS } from '../catalog';
import { hrefFor, type Route } from '../router';

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm transition-colors',
        active
          ? 'bg-accent font-medium text-foreground'
          : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground',
      )}
    >
      {children}
    </a>
  );
}

export function Sidebar({ route, onNavigate }: { route: Route; onNavigate?: () => void }) {
  const currentId = route.page === 'component' ? route.id : null;
  return (
    <nav
      aria-label="Components"
      className="space-y-6 text-sm"
      onClick={(e) => (e.target as HTMLElement).closest('a') && onNavigate?.()}
    >
      <div className="space-y-0.5">
        <NavLink href={hrefFor({ page: 'home' })} active={route.page === 'home'}>
          <LayoutGrid className="h-4 w-4" /> Overview
        </NavLink>
        <NavLink href={hrefFor({ page: 'tokens' })} active={route.page === 'tokens'}>
          <Palette className="h-4 w-4" /> Design tokens
        </NavLink>
      </div>
      {CATEGORIES.map((category) => {
        const docs = COMPONENTS.filter((c) => c.category === category);
        if (docs.length === 0) return null;
        return (
          <div key={category} className="space-y-1">
            <p className="px-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
              {category}
            </p>
            <div className="space-y-0.5">
              {docs.map((doc) => (
                <NavLink
                  key={doc.id}
                  href={hrefFor({ page: 'component', id: doc.id })}
                  active={doc.id === currentId}
                >
                  {doc.name}
                </NavLink>
              ))}
            </div>
          </div>
        );
      })}
    </nav>
  );
}
