export type Place = {
  id: string;
  name: string;
  kind: 'Coffee' | 'Food' | 'Park' | 'Museum';
  x: number;
  y: number;
  rating: number;
  reviews: number;
  distance: string;
  open: string;
  blurb: string;
};

export const PLACES: Place[] = [
  { id: 'harbor', name: 'Harbor Roasters', kind: 'Coffee', x: 300, y: 250, rating: 4.7, reviews: 812, distance: '0.4 km', open: 'Open until 6 pm', blurb: 'Small-batch roaster with a window onto the old docks.' },
  { id: 'night', name: 'Night Market Noodles', kind: 'Food', x: 520, y: 180, rating: 4.5, reviews: 1290, distance: '0.9 km', open: 'Open until 11 pm', blurb: 'Hand-pulled noodles and a long communal table.' },
  { id: 'fern', name: 'Fernhill Gardens', kind: 'Park', x: 190, y: 400, rating: 4.8, reviews: 2204, distance: '1.2 km', open: 'Open 24 hours', blurb: 'Terraced gardens with a quiet pond at the top.' },
  { id: 'modern', name: 'Museum of the Modern', kind: 'Museum', x: 600, y: 360, rating: 4.6, reviews: 3410, distance: '1.8 km', open: 'Open until 5 pm', blurb: 'Contemporary art in a converted power station.' },
];

export const CHIPS = ['All', 'Coffee', 'Food', 'Park', 'Museum'] as const;
export type Chip = (typeof CHIPS)[number];

export const REVIEWS = [
  { who: 'Mara O.', stars: 5, text: 'Go early, sit by the window.' },
  { who: 'Ilya B.', stars: 4, text: 'Great flat white, slow service at peak.' },
];
