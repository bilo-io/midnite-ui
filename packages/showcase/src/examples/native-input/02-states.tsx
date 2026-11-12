import { StyleSheet, View } from 'react-native';

import { Input } from '@bilo-io/ui-native';

export default function States() {
  return (
    <View style={styles.stack}>
      <Input accessibilityLabel="Search" placeholder="Search…" />
      <Input label="Workspace" defaultValue="midnite" />
      <Input label="Plan" defaultValue="Locked by your admin" disabled />
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 16 },
});
