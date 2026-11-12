import { StyleSheet, Text, View } from 'react-native';

import { Button, useTheme } from '@bilo-io/ui-native';

export default function Sizes() {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      <Button size="sm">Small</Button>
      <Button>Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon" variant="outline" accessibilityLabel="Add">
        <Text style={[styles.glyph, { color: colors.foreground }]}>+</Text>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 12 },
  glyph: { fontSize: 20, lineHeight: 22 },
});
