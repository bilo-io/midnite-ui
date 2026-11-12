import { StyleSheet, View } from 'react-native';

import { Wordmark } from '@bilo-io/ui-native';

export default function WordmarkExample() {
  return (
    <View style={styles.stack}>
      <Wordmark size={28} />
      <Wordmark product="Mobile UI" size={22} />
      <Wordmark product="Studio" tone="inherit" size={18} />
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 16, alignItems: 'flex-start' },
});
