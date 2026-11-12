import { StyleSheet, Text, View } from 'react-native';

import { type ColorName, useTheme } from '@bilo-io/ui-native';

const SWATCHES: ColorName[] = ['primary', 'secondary', 'accent', 'muted', 'destructive', 'success'];

export default function Tokens() {
  const { scheme, colors, radius } = useTheme();
  return (
    <View style={styles.stack}>
      <Text style={{ color: colors.mutedForeground }}>
        {`useTheme() → ${scheme} · radius ${radius.sm}/${radius.md}/${radius.lg}`}
      </Text>
      {SWATCHES.map((name) => (
        <View key={name} style={styles.row}>
          <View
            style={[
              styles.swatch,
              {
                backgroundColor: colors[name],
                borderColor: colors.border,
                borderRadius: radius.md,
              },
            ]}
          />
          <Text style={{ color: colors.foreground }}>{name}</Text>
          <Text style={[styles.value, { color: colors.mutedForeground }]}>{colors[name]}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 10 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  swatch: { width: 32, height: 32, borderWidth: 1 },
  value: { marginLeft: 'auto', fontSize: 11, fontFamily: 'monospace' },
});
