import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Switch, useTheme } from '@bilo-io/ui-native';

export default function Settings() {
  const { colors } = useTheme();
  const [notify, setNotify] = useState(true);
  const [sync, setSync] = useState(false);
  const rows = [
    { label: 'Notifications', checked: notify, onChange: setNotify },
    { label: 'Background sync', checked: sync, onChange: setSync },
    { label: 'Locked by policy', checked: true, disabled: true },
  ];
  return (
    <View style={styles.list}>
      {rows.map((row) => (
        <View key={row.label} style={[styles.row, { borderColor: colors.border }]}>
          <Text style={{ color: row.disabled ? colors.mutedForeground : colors.foreground }}>
            {row.label}
          </Text>
          <Switch
            checked={row.checked}
            onCheckedChange={row.onChange ?? (() => {})}
            disabled={row.disabled}
            accessibilityLabel={row.label}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 0 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
