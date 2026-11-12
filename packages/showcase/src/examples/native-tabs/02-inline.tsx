import { useState } from 'react';

import { Tabs } from '@bilo-io/ui-native';

export default function Inline() {
  const [view, setView] = useState<'preview' | 'code'>('preview');
  return (
    <Tabs
      accessibilityLabel="View"
      options={[
        { value: 'preview', label: 'Preview' },
        { value: 'code', label: 'Code' },
      ]}
      value={view}
      onChange={setView}
    />
  );
}
