import { CodeBlock } from '@bilo-io/ui';

export default function NoCopy() {
  return (
    <div className="w-full max-w-xl">
      <CodeBlock
        language="json"
        showCopy={false}
        code={JSON.stringify({ name: '@bilo-io/ui', private: false }, null, 2)}
      />
    </div>
  );
}
