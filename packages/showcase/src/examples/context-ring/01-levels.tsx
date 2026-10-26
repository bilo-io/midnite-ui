import { ContextRing } from '@bilo-io/ui';

export default function Levels() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      {[12_000, 42_000, 104_000, 130_000, 168_000, 200_000].map((tokens) => (
        <div key={tokens} className="flex flex-col items-center gap-1.5">
          <ContextRing tokens={tokens} limit={200_000} />
          <span className="text-[10px] tabular-nums text-muted-foreground">
            {Math.round((tokens / 200_000) * 100)}%
          </span>
        </div>
      ))}
    </div>
  );
}
