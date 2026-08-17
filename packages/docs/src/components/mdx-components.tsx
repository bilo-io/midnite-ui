import { proseComponents } from '@bilo-io/ui';

// The prose element map for every MDX render path in this app (the MDXProvider
// in app.tsx). The map itself lives in `@bilo-io/ui` so reading typography is
// defined once in the design system rather than per consumer. Root-relative
// links still route through react-router rather than doing a full-page
// navigation via the `ReadingLayoutProvider` in app.tsx, which injects a Link
// adapter into the shared map.
export const mdxComponents = proseComponents;
