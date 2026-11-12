import { lazy } from 'react';

// The one door into ./mobile (the Mobile mode's chunk). Each export is a
// React.lazy over the same dynamic import, so the first one rendered fetches
// the chunk and the rest resolve from it.
const mobile = () => import('./mobile');

export const NativeExamples = lazy(() => mobile().then((m) => ({ default: m.NativeExamples })));
export const NativeExampleToc = lazy(() => mobile().then((m) => ({ default: m.NativeExampleToc })));
export const NativeCardPreview = lazy(() =>
  mobile().then((m) => ({ default: m.NativeCardPreview })),
);
