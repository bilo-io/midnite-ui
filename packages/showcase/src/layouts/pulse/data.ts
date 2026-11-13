export const RINGS = [
  { id: 'move', label: 'Move', value: 520, goal: 700, unit: 'kcal', hueVar: '--destructive' },
  { id: 'exercise', label: 'Exercise', value: 34, goal: 45, unit: 'min', hueVar: '--success' },
  { id: 'stand', label: 'Stand', value: 9, goal: 12, unit: 'hr', hueVar: '--status-todo' },
] as const;

export const WORKOUTS = [
  { id: 'w1', name: 'Morning run', detail: '5.2 km · 28:40', kcal: 340, intensity: 150_000 },
  { id: 'w2', name: 'Strength: upper', detail: '45 min', kcal: 260, intensity: 110_000 },
  { id: 'w3', name: 'Evening ride', detail: '14 km · 41:10', kcal: 410, intensity: 175_000 },
  { id: 'w4', name: 'Mobility flow', detail: '20 min', kcal: 80, intensity: 40_000 },
];

export const WEEK = [
  { day: 'Mon', pct: 82 },
  { day: 'Tue', pct: 100 },
  { day: 'Wed', pct: 64 },
  { day: 'Thu', pct: 91 },
  { day: 'Fri', pct: 48 },
  { day: 'Sat', pct: 120 },
  { day: 'Sun', pct: 74 },
];

export const HEART = [46, 48, 47, 52, 60, 74, 82, 70, 58, 54, 52, 50, 55, 66, 78, 72, 60, 52];
