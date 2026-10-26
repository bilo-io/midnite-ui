import { color, type ColorScale } from '@bilo-io/ui';

import { CodeBlock } from './code-block';

// Semantic colours come from the typed `color` map, so both themes render side
// by side whatever the page theme is. The status/kind/node families exist only
// as CSS variables, so they render live in the current theme.

const camelToKebab = (s: string) => s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

const FAMILIES: { title: string; vars: string[] }[] = [
  {
    title: 'Status',
    vars: [
      'status-backlog',
      'status-todo',
      'status-wip',
      'status-waiting',
      'status-done',
      'status-abandoned',
    ],
  },
  {
    title: 'Kind',
    vars: ['kind-bug', 'kind-feature', 'kind-question', 'kind-chore', 'kind-unknown'],
  },
  {
    title: 'Node',
    vars: ['node-trigger', 'node-action', 'node-logic', 'node-data', 'node-storage'],
  },
];

// Literal class names: Tailwind only generates classes it can find whole in source.
const RADII = [
  ['sm', 'rounded-sm'],
  ['md', 'rounded-md'],
  ['lg', 'rounded-lg'],
] as const;

function ThemePanel({ name, scale }: { name: string; scale: ColorScale }) {
  const keys = (Object.keys(scale) as (keyof ColorScale)[]).filter(
    (k) => !k.endsWith('Foreground'),
  );
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium capitalize">{name}</h3>
      <div
        className="grid grid-cols-2 gap-3 rounded-xl border border-border/60 p-3 sm:grid-cols-3"
        style={{ background: `hsl(${scale.background})` }}
      >
        {keys.map((key) => {
          // Label ink by the swatch's own lightness, not its paired *-foreground
          // token: `foreground` and `ring` have no pair, and muted's pair is
          // deliberately low-contrast.
          const lightness = Number(/(\d+(?:\.\d+)?)%\s*$/.exec(scale[key])?.[1] ?? 50);
          const fg = lightness > 55 ? '240 10% 3.9%' : '0 0% 98%';
          return (
            <div
              key={key}
              className="flex h-20 flex-col justify-end rounded-lg p-2.5"
              style={{
                background: `hsl(${scale[key]})`,
                color: `hsl(${fg})`,
                boxShadow: `inset 0 0 0 1px hsl(${scale.border})`,
              }}
            >
              <span className="text-xs font-medium">--{camelToKebab(key)}</span>
              <span className="font-mono text-[10px] opacity-70">{scale[key]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function TokensPage() {
  return (
    <div className="space-y-12">
      <header className="space-y-3">
        <p className="text-sm text-muted-foreground">Foundations</p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Design tokens</h1>
        <p className="max-w-2xl text-muted-foreground">
          HSL triplets as CSS custom properties, flipped by a{' '}
          <code className="rounded bg-muted px-1 font-mono text-[0.85em]">.dark</code> class on the
          root. Import the stylesheet once and map the tokens in your Tailwind config.
        </p>
      </header>

      <CodeBlock
        code={"import '@bilo-io/ui/styles';\nimport { color, radius } from '@bilo-io/ui';"}
      />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Semantic colours</h2>
        <div className="grid gap-6 lg:grid-cols-2">
          <ThemePanel name="light" scale={color.light} />
          <ThemePanel name="dark" scale={color.dark} />
        </div>
      </section>

      {FAMILIES.map((family) => (
        <section key={family.title} className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">{family.title} hues</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {family.vars.map((v) => (
              <div key={v} className="overflow-hidden rounded-lg border border-border/60">
                <div className="h-14" style={{ background: `hsl(var(--${v}))` }} />
                <p className="px-2.5 py-2 font-mono text-[11px] text-muted-foreground">--{v}</p>
              </div>
            ))}
          </div>
        </section>
      ))}

      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Radius</h2>
        <div className="flex flex-wrap gap-6">
          {RADII.map(([r, cls]) => (
            <div key={r} className="space-y-2 text-center">
              <div className={`h-20 w-20 border-2 border-foreground/70 bg-muted ${cls}`} />
              <p className="font-mono text-xs text-muted-foreground">rounded-{r}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
