import { useState } from 'react';
import { Bell, Bookmark, CalendarDays, Heart, Home, MessageCircle, Search, Share2, Users, UsersRound } from 'lucide-react';

import { Button, Card, Input, cn } from '@bilo-io/ui';

import { Art, Avatar, Mark } from '../kit';
import { PEOPLE, POSTS, SHORTCUTS } from './data';

const ICONS = { Home, Friends: Users, Groups: UsersRound, Events: CalendarDays, Saved: Bookmark };

export default function CircleDesktop() {
  const [liked, setLiked] = useState<Record<string, boolean>>({ p2: true });
  const [active, setActive] = useState<(typeof SHORTCUTS)[number]>('Home');

  return (
    <div className="flex h-full flex-col bg-muted/30 text-sm">
      <header data-c className="flex h-14 shrink-0 items-center gap-4 border-b border-border bg-card px-5">
        <div className="flex items-center gap-2 font-semibold">
          <Mark letter="C" hue={265} /> Circle
        </div>
        <div className="relative w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input aria-label="Search Circle" placeholder="Search people and posts" className="rounded-full pl-9" />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Messages"><MessageCircle className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" aria-label="Notifications"><Bell className="h-4 w-4" /></Button>
          <Avatar name="You Today" hue={190} size={32} />
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-[220px_1fr_260px] gap-5 overflow-hidden p-5">
        <nav aria-label="Shortcuts" className="space-y-1">
          {SHORTCUTS.map((label) => {
            const Icon = ICONS[label];
            return (
              <button
                key={label}
                data-c
                type="button"
                onClick={() => setActive(label)}
                aria-current={active === label ? 'page' : undefined}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left font-medium transition-colors hover:bg-accent',
                  active === label && 'bg-accent',
                )}
              >
                <Icon className="h-4 w-4 text-primary" /> {label}
              </button>
            );
          })}
        </nav>

        <main className="min-w-0 space-y-4 overflow-hidden">
          <Card data-c className="flex items-center gap-3 p-3">
            <Avatar name="You Today" hue={190} />
            <button type="button" className="h-9 flex-1 rounded-full bg-muted px-4 text-left text-muted-foreground">
              What is on your mind?
            </button>
            <Button size="sm">Post</Button>
          </Card>

          <div className="flex gap-3">
            {PEOPLE.slice(0, 5).map((person, i) => (
              <div key={person.id} data-c className="relative h-28 flex-1 overflow-hidden rounded-xl">
                <Art hue={person.hue} seed={i} className="absolute inset-0" />
                <Avatar name={person.name} hue={person.hue} size={28} className="absolute left-2 top-2 ring-2 ring-primary" />
                <span className="absolute bottom-2 left-2 text-xs font-medium text-white drop-shadow">{person.name.split(' ')[0]}</span>
              </div>
            ))}
          </div>

          {POSTS.slice(0, 2).map((post) => (
            <Card key={post.id} data-c className="overflow-hidden">
              <div className="flex items-center gap-3 p-3">
                <Avatar name={post.author.name} hue={post.author.hue} />
                <div className="leading-tight">
                  <p className="font-semibold">{post.author.name}</p>
                  <p className="text-xs text-muted-foreground">{post.when}</p>
                </div>
              </div>
              <p className="px-3 pb-3">{post.body}</p>
              <Art hue={post.hue} seed={post.likes} className="h-40 w-full" />
              <div className="flex items-center gap-1 border-t border-border p-1.5 text-muted-foreground">
                <Button
                  variant="ghost"
                  size="sm"
                  aria-pressed={!!liked[post.id]}
                  onClick={() => setLiked((s) => ({ ...s, [post.id]: !s[post.id] }))}
                  className={cn('flex-1 gap-2', liked[post.id] && 'text-destructive')}
                >
                  <Heart className={cn('h-4 w-4', liked[post.id] && 'fill-current')} />
                  {post.likes + (liked[post.id] ? 1 : 0)}
                </Button>
                <Button variant="ghost" size="sm" className="flex-1 gap-2"><MessageCircle className="h-4 w-4" />{post.comments}</Button>
                <Button variant="ghost" size="sm" className="flex-1 gap-2"><Share2 className="h-4 w-4" />Share</Button>
              </div>
            </Card>
          ))}
        </main>

        <aside aria-label="Contacts" className="space-y-3">
          <p data-c className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contacts</p>
          {PEOPLE.map((person) => (
            <div key={person.id} data-c className="flex items-center gap-3">
              <span className="relative">
                <Avatar name={person.name} hue={person.hue} size={32} />
                {person.online ? <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-success ring-2 ring-background" /> : null}
              </span>
              <span className="font-medium">{person.name}</span>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}
