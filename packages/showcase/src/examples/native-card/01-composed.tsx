import { StyleSheet, Text, View } from 'react-native';

import { Button, Card, CardContent, CardHeader, CardTitle, useTheme } from '@bilo-io/ui-native';

export default function Composed() {
  const { colors } = useTheme();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Storage</CardTitle>
        <Text style={[styles.figure, { color: colors.cardForeground }]}>42.6 GB free</Text>
      </CardHeader>
      <CardContent style={styles.content}>
        <View style={[styles.bar, { backgroundColor: colors.muted }]}>
          <View style={[styles.fill, { backgroundColor: colors.primary }]} />
        </View>
        <Text style={{ color: colors.mutedForeground }}>85.4 of 128 GB used</Text>
        <Button variant="outline" size="sm">
          Manage storage
        </Button>
      </CardContent>
    </Card>
  );
}

const styles = StyleSheet.create({
  figure: { fontSize: 24, fontWeight: '600' },
  content: { gap: 12 },
  bar: { height: 8, borderRadius: 4, overflow: 'hidden' },
  fill: { width: '67%', height: '100%' },
});
