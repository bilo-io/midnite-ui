export type Spot = {
  id: string;
  name: string;
  cuisine: string;
  hue: number;
  price: 1 | 2 | 3;
  km: number;
  rating: number;
  open: boolean;
  tags: string[];
};

export const SPOTS: Spot[] = [
  { id: 'r1', name: 'Saffron & Smoke', cuisine: 'Persian', hue: 25, price: 2, km: 0.6, rating: 4.7, open: true, tags: ['Grill', 'Vegetarian friendly'] },
  { id: 'r2', name: 'Bao Bao Social', cuisine: 'Taiwanese', hue: 350, price: 1, km: 1.1, rating: 4.5, open: true, tags: ['Late night', 'Dumplings'] },
  { id: 'r3', name: 'Casa Olivar', cuisine: 'Spanish', hue: 95, price: 3, km: 2.4, rating: 4.8, open: false, tags: ['Tapas', 'Natural wine'] },
  { id: 'r4', name: 'Pho Real', cuisine: 'Vietnamese', hue: 160, price: 1, km: 0.9, rating: 4.6, open: true, tags: ['Noodles', 'Quick'] },
  { id: 'r5', name: 'The Copper Pan', cuisine: 'Modern European', hue: 40, price: 3, km: 3.2, rating: 4.9, open: true, tags: ['Tasting menu'] },
  { id: 'r6', name: 'Taqueria Luna', cuisine: 'Mexican', hue: 300, price: 1, km: 1.7, rating: 4.4, open: true, tags: ['Tacos', 'Patio'] },
];

export const CUISINES = ['Any', 'Persian', 'Taiwanese', 'Spanish', 'Vietnamese', 'Mexican'] as const;
