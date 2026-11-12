import { StyleSheet, Text, View } from 'react-native';

import { Accordion, Button, useTheme } from '@bilo-io/ui-native';

export default function Stacked() {
  const { colors } = useTheme();
  const body = [styles.body, { color: colors.mutedForeground }];
  return (
    <View style={styles.stack}>
      <Accordion title="Notifications" count={3} defaultOpen>
        <Text style={body}>Mentions, replies and weekly digests.</Text>
      </Accordion>
      <Accordion
        title="Devices"
        count={2}
        action={
          <Button size="sm" variant="ghost">
            Add
          </Button>
        }
      >
        <Text style={body}>iPhone 16 · Pixel 9</Text>
      </Accordion>
      <Accordion title="Advanced" variant="bare">
        <Text style={body}>Bare sections drop the card and rule off the title.</Text>
      </Accordion>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 12 },
  body: { padding: 12, lineHeight: 20 },
});
