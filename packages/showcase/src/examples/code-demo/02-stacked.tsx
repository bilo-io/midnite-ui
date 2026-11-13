import { Button, CodeDemo } from '@bilo-io/ui';

const code = `<Button>Save</Button>
<Button variant="ghost">Cancel</Button>`;

export default function Stacked() {
  return (
    <div className="w-full max-w-xl">
      <CodeDemo title="Button pair" layout="stacked" code={code}>
        <div className="flex gap-2">
          <Button>Save</Button>
          <Button variant="ghost">Cancel</Button>
        </div>
      </CodeDemo>
    </div>
  );
}
