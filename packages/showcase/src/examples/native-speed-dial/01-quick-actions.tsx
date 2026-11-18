import { useState } from 'react';
import { Text, View } from 'react-native';

import { SpeedDial, useTheme } from '@bilo-io/ui-native';

export default function QuickActions() {
  const { colors } = useTheme();
  const [open, setOpen] = useState(true);
  const icon = (g: string, color = colors.secondaryForeground) => (
    <Text style={{ color, fontSize: 18 }}>{g}</Text>
  );
  return (
    <View style={{ flex: 1, minHeight: 780, margin: -20 }}>
      <SpeedDial
        open={open}
        onOpenChange={setOpen}
        icon={icon('+', colors.primaryForeground)}
        label="Quick actions"
        actions={[
          { key: 'issue', label: 'New issue', icon: icon('+'), onPress: () => {} },
          { key: 'agent', label: 'Open agent', icon: icon('⌁'), onPress: () => {} },
          { key: 'repo', label: 'Switch repo', icon: icon('⇆'), onPress: () => {} },
          { key: 'notes', label: 'Notes', icon: icon('✎'), onPress: () => {}, disabled: true },
        ]}
      />
    </View>
  );
}
