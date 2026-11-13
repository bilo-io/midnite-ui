import { Button, CodeDemo } from '@bilo-io/ui';

const code = `<Button variant="outline">Click me</Button>`;

export default function Tabbed() {
  return (
    <div className="w-full max-w-xl">
      <CodeDemo title="Outline button" description="Preview and code, one at a time." code={code}>
        <Button variant="outline">Click me</Button>
      </CodeDemo>
    </div>
  );
}
