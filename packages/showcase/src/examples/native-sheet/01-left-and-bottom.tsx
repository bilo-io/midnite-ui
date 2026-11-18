import { useState } from 'react';
import { Text, View } from 'react-native';

import { Button, ListRow, Sheet } from '@bilo-io/ui-native';

export default function LeftAndBottom() {
  const [side, setSide] = useState<'left' | 'bottom' | null>(null);
  return (
    <View style={{ flex: 1, minHeight: 520, margin: -20, padding: 20, gap: 12 }}>
      <Button onPress={() => setSide('left')}>Open forge panel</Button>
      <Button variant="outline" onPress={() => setSide('bottom')}>
        Move to…
      </Button>
      {/* modal={false} keeps the sheet inside this phone; an app leaves it as a Modal. */}
      <Sheet
        open={side === 'left'}
        onOpenChange={(o) => !o && setSide(null)}
        side="left"
        title="Forge"
        modal={false}
      >
        <ListRow title="bilo-io" subtitle="github.com" />
        <ListRow title="Add account" onPress={() => {}} />
      </Sheet>
      <Sheet
        open={side === 'bottom'}
        onOpenChange={(o) => !o && setSide(null)}
        side="bottom"
        title="Move to…"
        modal={false}
      >
        {['Todo', 'In progress', 'Done'].map((s) => (
          <ListRow key={s} title={s} onPress={() => setSide(null)} trailing={<Text>›</Text>} />
        ))}
      </Sheet>
    </View>
  );
}
