import { useState } from 'react';
import { Compass, Film, Heart, Home, MessageCircle, PlusSquare, Search, Send, User } from 'lucide-react';

import { Button, Tabs, cn } from '@bilo-io/ui';

import { Art, Avatar, Mark } from '../kit';
import { SHOTS, STORIES } from './data';

const NAV = [
  { label: 'Home', Icon: Home },
  { label: 'Search', Icon: Search },
  { label: 'Explore', Icon: Compass },
  { label: 'Reels', Icon: Film },
  { label: 'Create', Icon: PlusSquare },
  { label: 'Profile', Icon: User },
] as const;

export default function SnaplineDesktop() {
  const [view, setView] = useState<'feed' | 'grid'>('feed');
  const [saved, setSaved] = useState<Record<string, boolean>>({});

  return (
    <div className="grid h-full grid-cols-[210px_1fr_300px] bg-background text-sm">
      <nav aria-label="Primary" className="flex flex-col gap-1 border-r border-border p-4">
        <div data-c className="mb-4 flex items-center gap-2 px-2 text-lg font-semibold">
          <Mark letter="S" hue={330} /> Snapline
        </div>
        {NAV.map(({ label, Icon }, i) => (
          <button
            key={label}
            data-c
            type="button"
            aria-current={i === 0 ? 'page' : undefined}
            className={cn('flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-accent', i === 0 && 'font-semibold')}
          >
            <Icon className="h-5 w-5" /> {label}
          </button>
        ))}
      </nav>

      <main className="min-w-0 space-y-4 overflow-hidden px-8 py-5">
        <div data-c className="flex gap-4">
          {STORIES.map((s) => (
            <div key={s.user} className="flex w-16 shrink-0 flex-col items-center gap-1">
              <span className="rounded-full p-[2.5px]" style={{ background: `conic-gradient(from 180deg, hsl(${s.hue} 90% 60%), hsl(${(s.hue + 80) % 360} 90% 55%), hsl(${s.hue} 90% 60%))` }}>
                <span className="block rounded-full bg-background p-[2px]"><Avatar name={s.user} hue={s.hue} size={54} /></span>
              </span>
              <span className="w-full truncate text-center text-[11px]">{s.user}</span>
            </div>
          ))}
        </div>

        <div data-c>
          <Tabs
            ariaLabel="Feed layout"
            value={view}
            onChange={setView}
            options={[{ value: 'feed', label: 'Feed' }, { value: 'grid', label: 'Grid' }]}
          />
        </div>

        {view === 'feed' ? (
          <div className="mx-auto max-w-md space-y-3">
            {SHOTS.slice(0, 2).map((shot, i) => (
              <article key={shot.id} data-c className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <Avatar name={shot.user} hue={shot.hue} size={30} />
                  <div className="leading-tight">
                    <p className="font-semibold">{shot.user}</p>
                    <p className="text-xs text-muted-foreground">{shot.place}</p>
                  </div>
                </div>
                <Art hue={shot.hue} seed={i + 2} className="aspect-[5/3] w-full rounded-lg" />
                <div className="flex items-center gap-1 text-foreground">
                  <Button variant="ghost" size="icon" aria-label="Like"><Heart className="h-5 w-5" /></Button>
                  <Button variant="ghost" size="icon" aria-label="Comment"><MessageCircle className="h-5 w-5" /></Button>
                  <Button variant="ghost" size="icon" aria-label="Send"><Send className="h-5 w-5" /></Button>
                </div>
                <p><span className="font-semibold">{shot.likes.toLocaleString()} likes</span> · {shot.caption}</p>
              </article>
            ))}
          </div>
        ) : (
          <ul className="grid grid-cols-3 gap-1.5">
            {SHOTS.map((shot, i) => (
              <li key={shot.id} data-c>
                <button type="button" onClick={() => setSaved((s) => ({ ...s, [shot.id]: !s[shot.id] }))} aria-pressed={!!saved[shot.id]} aria-label={shot.caption} className="group relative block w-full overflow-hidden rounded-md">
                  <Art hue={shot.hue} seed={i} className="aspect-square w-full transition-transform duration-300 group-hover:scale-105" />
                  {saved[shot.id] ? <Heart className="absolute right-2 top-2 h-4 w-4 fill-white text-white" /> : null}
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>

      <aside aria-label="Suggestions" className="space-y-4 p-6">
        <div data-c className="flex items-center gap-3">
          <Avatar name="You Today" hue={190} size={44} />
          <div className="leading-tight"><p className="font-semibold">you.today</p><p className="text-xs text-muted-foreground">Your account</p></div>
        </div>
        <p data-c className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Suggested for you</p>
        {STORIES.slice(1, 5).map((s) => (
          <div key={s.user} data-c className="flex items-center gap-3">
            <Avatar name={s.user} hue={s.hue} size={34} />
            <span className="flex-1 truncate font-medium">{s.user}</span>
            <Button size="sm" variant="outline">Follow</Button>
          </div>
        ))}
      </aside>
    </div>
  );
}
