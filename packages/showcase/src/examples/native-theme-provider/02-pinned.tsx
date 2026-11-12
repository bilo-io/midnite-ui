import { StyleSheet, View } from 'react-native';

import { Button, Card, CardHeader, CardTitle, ThemeProvider } from '@bilo-io/ui-native';

// A nested provider pins its subtree, whatever the device (or the app) says.
export default function Pinned() {
  return (
    <View style={styles.stack}>
      {(['light', 'dark'] as const).map((scheme) => (
        <ThemeProvider key={scheme} scheme={scheme}>
          <Card>
            <CardHeader style={styles.header}>
              <CardTitle>{scheme}</CardTitle>
              <Button size="sm">Continue</Button>
            </CardHeader>
          </Card>
        </ThemeProvider>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 12 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
