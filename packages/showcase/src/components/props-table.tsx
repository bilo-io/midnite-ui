import type { PropDoc } from '../catalog';

export function PropsTable({ props }: { props: PropDoc[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border/60">
      <table className="w-full text-left text-sm">
        <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-4 py-2.5 font-medium">Prop</th>
            <th className="px-4 py-2.5 font-medium">Type</th>
            <th className="px-4 py-2.5 font-medium">Default</th>
            <th className="px-4 py-2.5 font-medium">Description</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {props.map((p) => (
            <tr key={p.name} className="align-top">
              <td className="whitespace-nowrap px-4 py-3 font-mono text-[13px] font-medium">
                {p.name}
              </td>
              <td className="px-4 py-3 font-mono text-[12px] text-muted-foreground">{p.type}</td>
              <td className="whitespace-nowrap px-4 py-3 font-mono text-[12px] text-muted-foreground">
                {p.default ?? '—'}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                <InlineCode text={p.description} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Renders `backticked` spans of catalog copy as code chips. */
export function InlineCode({ text }: { text: string }) {
  return (
    <>
      {text.split(/(`[^`]+`)/).map((part, i) =>
        part.startsWith('`') && part.endsWith('`') ? (
          <code
            key={i}
            className="rounded bg-muted px-1 py-0.5 font-mono text-[0.85em] text-foreground"
          >
            {part.slice(1, -1)}
          </code>
        ) : (
          part
        ),
      )}
    </>
  );
}
