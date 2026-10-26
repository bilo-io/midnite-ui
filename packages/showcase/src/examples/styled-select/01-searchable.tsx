import { useState } from 'react';

import { StyledSelect, type SelectOption } from '@bilo-io/ui';

const options: SelectOption<string>[] = [
  { value: 'todo', label: 'To do' },
  { value: 'wip', label: 'In progress' },
  { value: 'review', label: 'In review' },
  { value: 'done', label: 'Done' },
];

export default function Searchable() {
  const [value, setValue] = useState('todo');
  return (
    <div className="max-w-xs">
      <StyledSelect
        aria-label="Status"
        options={options}
        value={value}
        onChange={setValue}
        isSearchable
      />
    </div>
  );
}
