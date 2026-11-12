import { StyleSheet, View } from 'react-native';

import { MidniteLogo } from '@bilo-io/ui-native';

export default function Logo() {
  return (
    <View style={styles.stack}>
      <MidniteLogo product="Mobile UI" />
      <MidniteLogo product="UI" size={40} textSize={22} />
      <MidniteLogo markOnly size={56} />
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 20, alignItems: 'flex-start' },
});
