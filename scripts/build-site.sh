#!/usr/bin/env bash
# Build the whole public site into _site/: the docs at the root, the showcase
# under /showcase/ and ui's Storybook under /storybook/.
#
# This is the Vercel build (vercel.json), which has pnpm but not moon, so it
# calls each package's own script in dependency order. Keep the layout in step
# with .github/workflows/pages.yml, which builds the same tree through moon.
set -euo pipefail

cd "$(dirname "$0")/.."

pnpm --filter @bilo-io/ui build
pnpm --filter @bilo-io/shell build
pnpm --filter @bilo-io/docs build
pnpm --filter @bilo-io/showcase build
pnpm --filter @bilo-io/ui build-storybook

rm -rf _site
mkdir -p _site/showcase _site/storybook
cp -R packages/docs/dist/. _site/
cp -R packages/showcase/dist/. _site/showcase/
cp -R packages/ui/storybook-static/. _site/storybook/
# The agent marks, linkable from anywhere at /agents/<name>.svg.
mkdir -p _site/agents
cp -R packages/ui/assets/agents/. _site/agents/
