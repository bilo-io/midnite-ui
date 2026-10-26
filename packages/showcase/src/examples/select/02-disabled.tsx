import { Select } from '@bilo-io/ui';

export default function Disabled() {
  return (
    <div className="max-w-xs">
      <Select
        aria-label="Model"
        options={[{ value: 'sonnet', label: 'Claude Sonnet' }]}
        value="sonnet"
        onChange={() => {}}
        disabled
      />
    </div>
  );
}
