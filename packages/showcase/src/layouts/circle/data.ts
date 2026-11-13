export type Person = { id: string; name: string; hue: number; online?: boolean };

export const PEOPLE: Person[] = [
  { id: 'mara', name: 'Mara Okafor', hue: 285, online: true },
  { id: 'ilya', name: 'Ilya Brandt', hue: 200, online: true },
  { id: 'noor', name: 'Noor Haddad', hue: 20 },
  { id: 'theo', name: 'Theo Lindqvist', hue: 150, online: true },
  { id: 'sana', name: 'Sana Whitfield', hue: 340 },
  { id: 'juno', name: 'Juno Park', hue: 60, online: true },
];

export type Post = {
  id: string;
  author: Person;
  when: string;
  body: string;
  hue: number;
  likes: number;
  comments: number;
};

const p = (i: number) => PEOPLE[i] as Person;

export const POSTS: Post[] = [
  {
    id: 'p1',
    author: p(0),
    when: '2h',
    body: 'Sunrise run along the harbour. The fog burned off right as I hit the lighthouse.',
    hue: 28,
    likes: 128,
    comments: 14,
  },
  {
    id: 'p2',
    author: p(3),
    when: '5h',
    body: 'Finally shipped the thing we were talking about all spring. Thank you, all of you.',
    hue: 210,
    likes: 342,
    comments: 51,
  },
  {
    id: 'p3',
    author: p(5),
    when: '1d',
    body: 'Sourdough attempt number nine. We do not talk about attempts one through eight.',
    hue: 40,
    likes: 87,
    comments: 22,
  },
];

export const SHORTCUTS = ['Home', 'Friends', 'Groups', 'Events', 'Saved'] as const;
