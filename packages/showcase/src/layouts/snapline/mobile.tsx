import { useState } from 'react';
import { Compass, Heart, Home, MessageCircle, PlusSquare, Search, Send, User } from 'lucide-react';

import { Button, cn } from '@bilo-io/ui';

import { Art, Avatar } from '../kit';
import { SHOTS, STORIES } from './data';

const TABS = [Home, Search, PlusSquare, Compass, User];
const TAB_NAMES = ['Home', 'Search', 'Create', 'Explore', 'Profile'];

export default function SnaplineMobile() {
  const [liked, setLiked] = useState<Record<string, boolean>>({});

  return (
    <div className="flex h-full flex-col bg-background text-sm">
      <header data-c className="flex items-center justify-between px-4 py-2.5">
        <span className="text-xl font-semibold italic tracking-tight">Snapline</span>
        <div className="flex">
          <Button variant="ghost" size="icon" aria-label="Activity"><Heart className="h-5 w-5" /></Button>
          <Button variant="ghost" size="icon" aria-label="Messages"><Send className="h-5 w-5" /></Button>
        </div>
      </header>

      <div className="min-h-0 flex-1 space-y-3 overflow-hidden">
        <div data-c className="flex gap-3 px-3">
          {STORIES.map((s) => (
            <div key={s.user} className="flex w-16 shrink-0 flex-col items-center gap-1">
              <span className="rounded-full p-[2.5px]" style={{ background: `conic-gradient(from 180deg, hsl(${s.hue} 90% 60%), hsl(${(s.hue + 80) % 360} 90% 55%), hsl(${s.hue} 90% 60%))` }}>
                <span className="block rounded-full bg-background p-[2px]"><Avatar name={s.user} hue={s.hue} size={54} /></span>
              </span>
              <span className="w-full truncate text-center text-[11px]">{s.user}</span>
            </div>
          ))}
        </div>

        {SHOTS.slice(0, 2).map((shot, i) => (
          <article key={shot.id} data-c className="space-y-1.5">
            <div className="flex items-center gap-2.5 px-3">
              <Avatar name={shot.user} hue={shot.hue} size={28} />
              <div className="leading-tight"><p className="font-semibold">{shot.user}</p><p className="text-xs text-muted-foreground">{shot.place}</p></div>
            </div>
            <Art hue={shot.hue} seed={i + 4} className="aspect-square w-full" />
            <div className="flex items-center px-1">
              <Button variant="ghost" size="icon" aria-label="Like" aria-pressed={!!liked[shot.id]} onClick={() => setLiked((s) => ({ ...s, [shot.id]: !s[shot.id] }))}>
                <Heart className={cn('h-5 w-5', liked[shot.id] && 'fill-destructive text-destructive')} />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Comment"><MessageCircle className="h-5 w-5" /></Button>
              <Button variant="ghost" size="icon" aria-label="Send"><Send className="h-5 w-5" /></Button>
            </div>
            <p className="px-3"><span className="font-semibold">{(shot.likes + (liked[shot.id] ? 1 : 0)).toLocaleString()} likes</span> · {shot.caption}</p>
          </article>
        ))}
      </div>

      <nav aria-label="Primary" data-c className="flex shrink-0 justify-around border-t border-border py-2">
        {TABS.map((Icon, i) => (
          <button key={TAB_NAMES[i]} type="button" aria-label={TAB_NAMES[i]} aria-current={i === 0 ? 'page' : undefined} className={cn('p-1.5', i === 0 ? 'text-foreground' : 'text-muted-foreground')}>
            <Icon className="h-6 w-6" />
          </button>
        ))}
      </nav>
    </div>
  );
}
