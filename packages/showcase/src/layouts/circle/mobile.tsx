import { useState } from 'react';
import { Bell, Heart, Home, MessageCircle, PlusSquare, Search, Share2, Users } from 'lucide-react';

import { Button, Card, cn } from '@bilo-io/ui';

import { Art, Avatar, Mark } from '../kit';
import { PEOPLE, POSTS } from './data';

const TABS = [
  { label: 'Home', Icon: Home },
  { label: 'Friends', Icon: Users },
  { label: 'Post', Icon: PlusSquare },
  { label: 'Alerts', Icon: Bell },
] as const;

export default function CircleMobile() {
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [tab, setTab] = useState('Home');

  return (
    <div className="flex h-full flex-col bg-muted/30 text-sm">
      <header data-c className="flex items-center gap-2 border-b border-border bg-card px-4 py-2.5">
        <Mark letter="C" hue={265} size={26} />
        <span className="font-semibold">Circle</span>
        <div className="ml-auto flex">
          <Button variant="ghost" size="icon" aria-label="Search"><Search className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" aria-label="Messages"><MessageCircle className="h-4 w-4" /></Button>
        </div>
      </header>

      <div className="min-h-0 flex-1 space-y-3 overflow-hidden p-3">
        <div data-c className="flex gap-3">
          {PEOPLE.slice(0, 5).map((person) => (
            <div key={person.id} className="flex w-14 shrink-0 flex-col items-center gap-1">
              <Avatar name={person.name} hue={person.hue} size={52} className="ring-2 ring-primary ring-offset-2 ring-offset-background" />
              <span className="w-full truncate text-center text-[11px] text-muted-foreground">{person.name.split(' ')[0]}</span>
            </div>
          ))}
        </div>

        <Card data-c className="flex items-center gap-2 p-2.5">
          <Avatar name="You Today" hue={190} size={32} />
          <span className="h-8 flex-1 rounded-full bg-muted px-3 py-1.5 text-muted-foreground">What is on your mind?</span>
        </Card>

        {POSTS.slice(0, 2).map((post) => (
          <Card key={post.id} data-c className="overflow-hidden">
            <div className="flex items-center gap-2.5 p-2.5">
              <Avatar name={post.author.name} hue={post.author.hue} size={32} />
              <div className="leading-tight">
                <p className="font-semibold">{post.author.name}</p>
                <p className="text-xs text-muted-foreground">{post.when}</p>
              </div>
            </div>
            <p className="px-2.5 pb-2.5">{post.body}</p>
            <Art hue={post.hue} seed={post.likes} className="h-36 w-full" />
            <div className="flex border-t border-border p-1 text-muted-foreground">
              <Button
                variant="ghost"
                size="sm"
                aria-pressed={!!liked[post.id]}
                onClick={() => setLiked((s) => ({ ...s, [post.id]: !s[post.id] }))}
                className={cn('flex-1 gap-1.5', liked[post.id] && 'text-destructive')}
              >
                <Heart className={cn('h-4 w-4', liked[post.id] && 'fill-current')} />
                {post.likes + (liked[post.id] ? 1 : 0)}
              </Button>
              <Button variant="ghost" size="sm" className="flex-1 gap-1.5"><MessageCircle className="h-4 w-4" />{post.comments}</Button>
              <Button variant="ghost" size="sm" className="flex-1" aria-label="Share"><Share2 className="h-4 w-4" /></Button>
            </div>
          </Card>
        ))}
      </div>

      <nav aria-label="Primary" data-c className="grid shrink-0 grid-cols-4 border-t border-border bg-card pb-1">
        {TABS.map(({ label, Icon }) => (
          <button
            key={label}
            type="button"
            onClick={() => setTab(label)}
            aria-current={tab === label ? 'page' : undefined}
            className={cn('flex flex-col items-center gap-0.5 py-2 text-[11px]', tab === label ? 'text-primary' : 'text-muted-foreground')}
          >
            <Icon className="h-5 w-5" /> {label}
          </button>
        ))}
      </nav>
    </div>
  );
}
