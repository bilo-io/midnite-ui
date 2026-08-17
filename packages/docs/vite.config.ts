import mdx from '@mdx-js/rollup';
import react from '@vitejs/plugin-react';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import { defineConfig } from 'vite';

// The docs app is a plain Vite + React SPA — a pure consumer of @bilo-io/ui and
// @bilo-io/shell. MDX is the authoring format: prose with inline live JSX
// examples rendered by the real library components.
//
// `providerImportSource` wires every MDX file to the @mdx-js/react MDXProvider so
// our prose-element mapping (src/components/mdx-components.tsx) styles markdown
// with the design-system tokens. `remark-mdx-frontmatter` turns each page's YAML
// frontmatter into an `export const frontmatter` the route registry reads.
export default defineConfig({
  // Relative base so assets resolve correctly under any deployment subpath —
  // including GitHub Pages' /<repo>/ prefix. Hash routing handles navigation;
  // only the asset URLs need to be subpath-aware.
  base: './',
  // Deterministic dev/preview ports; fail loudly if taken rather than drifting.
  server: { port: 5173, strictPort: true },
  preview: { port: 4173, strictPort: true },
  plugins: [
    {
      enforce: 'pre',
      ...mdx({
        // Author docs in .mdx only; leave .md to Vite's own loaders (?raw etc.).
        mdExtensions: [],
        providerImportSource: '@mdx-js/react',
        remarkPlugins: [
          remarkGfm,
          remarkFrontmatter,
          [remarkMdxFrontmatter, { name: 'frontmatter' }],
        ],
        // Stable, text-derived ids on every heading so the on-page TOC (and any
        // deep link) can anchor to a section. `rehype-highlight` colours fenced
        // code with highlight.js (`.hljs-*` classes) against the shared palette
        // in @bilo-io/ui/code-highlight.css.
        rehypePlugins: [rehypeSlug, rehypeHighlight],
      }),
    },
    react({ include: /\.(jsx|tsx|mdx?)$/ }),
  ],
});
