export type Shot = { id: string; user: string; hue: number; caption: string; likes: number; place: string };

export const SHOTS: Shot[] = [
  { id: 's1', user: 'atelier.nox', hue: 330, caption: 'Golden hour on the rooftop', likes: 2140, place: 'Lisbon' },
  { id: 's2', user: 'wild.mara', hue: 150, caption: 'Moss, mist and a very long hike', likes: 986, place: 'Faroe Islands' },
  { id: 's3', user: 'daily.ilya', hue: 210, caption: 'Blue hour, no filter', likes: 3302, place: 'Tallinn' },
  { id: 's4', user: 'noor.makes', hue: 25, caption: 'Terracotta studies, week four', likes: 754, place: 'Marrakesh' },
  { id: 's5', user: 'theo.frames', hue: 275, caption: 'Neon rain', likes: 1520, place: 'Osaka' },
  { id: 's6', user: 'sana.sketch', hue: 55, caption: 'Lemons for the whole week', likes: 612, place: 'Amalfi' },
  { id: 's7', user: 'juno.out', hue: 185, caption: 'Salt flats at dawn', likes: 2890, place: 'Uyuni' },
  { id: 's8', user: 'atelier.nox', hue: 355, caption: 'Behind the scenes', likes: 433, place: 'Studio' },
  { id: 's9', user: 'wild.mara', hue: 120, caption: 'Fern season', likes: 871, place: 'Oregon' },
];

export const STORIES = ['atelier.nox', 'wild.mara', 'daily.ilya', 'noor.makes', 'theo.frames', 'sana.sketch'].map(
  (user, i) => ({ user, hue: (i * 57 + 330) % 360 }),
);
