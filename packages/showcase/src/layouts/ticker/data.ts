export type Instrument = { sym: string; name: string; price: number; change: number; series: number[] };

// A deterministic wobble, so every render (and every test) draws the same chart.
const wave = (seed: number, drift: number, n = 40) =>
  Array.from({ length: n }, (_, i) =>
    Math.min(95, Math.max(5, 40 + drift * i + Math.sin(i * 0.55 + seed) * 11 + Math.sin(i * 1.7 + seed * 2) * 5)),
  );

export const WATCHLIST: Instrument[] = [
  { sym: 'NOVA', name: 'Nova Systems', price: 184.32, change: 2.41, series: wave(1, 0.5) },
  { sym: 'ORBT', name: 'Orbit Energy', price: 56.8, change: -1.12, series: wave(2, -0.3) },
  { sym: 'LUMA', name: 'Luma Health', price: 312.05, change: 0.64, series: wave(3, 0.2) },
  { sym: 'KITE', name: 'Kite Logistics', price: 92.47, change: 3.9, series: wave(4, 0.8) },
  { sym: 'BRNZ', name: 'Bronze Metals', price: 27.15, change: -2.38, series: wave(5, -0.6) },
];

export const RANGES = ['1D', '1W', '1M', '1Y'] as const;

export const POSITIONS = [
  { sym: 'NOVA', qty: 40, avg: 161.2, last: 184.32 },
  { sym: 'KITE', qty: 120, avg: 84.9, last: 92.47 },
  { sym: 'BRNZ', qty: 300, avg: 29.4, last: 27.15 },
];

export const fmt = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
