import { StyleSheet, View } from 'react-native';

import { Slider, useTheme } from '@bilo-io/ui-native';

export default function Steps() {
  const { colors } = useTheme();
  return (
    <View style={styles.stack}>
      <Slider label="Brightness" defaultValue={50} step={10} />
      <Slider label="Warmth" defaultValue={70} color={colors.destructive} />
      <Slider label="Locked" defaultValue={25} disabled />
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 24 },
});
