import { useState } from 'react';
import { GitGraph, KanbanSquare, List } from 'lucide-react';

import { Tabs, type TabOption } from '@bilo-io/ui';

const options: TabOption<string>[] = [
  { value: 'board', label: 'Board', icon: <KanbanSquare className="h-3.5 w-3.5" /> },
  { value: 'list', label: 'List', icon: <List className="h-3.5 w-3.5" /> },
  { value: 'graph', label: 'Graph', icon: <GitGraph className="h-3.5 w-3.5" /> },
];

export default function Segmented() {
  const [value, setValue] = useState('board');
  return (
    <div className="flex flex-col items-start gap-3">
      <Tabs ariaLabel="View" options={options} value={value} onChange={setValue} />
      <p className="text-xs text-muted-foreground">
        Showing the {value} view. Arrow keys move between tabs.
      </p>
    </div>
  );
}
