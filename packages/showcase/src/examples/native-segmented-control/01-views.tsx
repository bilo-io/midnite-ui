import { useState } from 'react';

import { SegmentedControl } from '@bilo-io/ui-native';

export default function Views() {
  const [view, setView] = useState('board');
  return (
    <SegmentedControl
      segments={[
        { key: 'board', label: 'Board' },
        { key: 'list', label: 'List' },
        { key: 'graph', label: 'Graph' },
      ]}
      value={view}
      onChange={setView}
    />
  );
}
