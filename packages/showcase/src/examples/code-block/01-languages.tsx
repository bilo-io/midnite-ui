import { CodeBlock } from '@bilo-io/ui';

const install = 'pnpm add @bilo-io/ui';
const snippet = `import { Button } from '@bilo-io/ui';

export function Save() {
  return <Button variant="outline">Save</Button>;
}`;

export default function Languages() {
  return (
    <div className="w-full max-w-xl space-y-3">
      <CodeBlock code={install} language="bash" />
      <CodeBlock code={snippet} language="tsx" />
    </div>
  );
}
