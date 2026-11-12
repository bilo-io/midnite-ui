import { StyleSheet, View } from 'react-native';

import { Button } from '@bilo-io/ui-native';

export default function Variants() {
  return (
    <View style={styles.stack}>
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 12 },
});
