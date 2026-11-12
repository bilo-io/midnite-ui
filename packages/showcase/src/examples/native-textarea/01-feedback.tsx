import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Textarea, useTheme } from '@bilo-io/ui-native';

const LIMIT = 280;

export default function Feedback() {
  const { colors } = useTheme();
  const [text, setText] = useState('');
  return (
    <View style={styles.stack}>
      <Textarea
        label="Feedback"
        value={text}
        onChangeText={(next) => setText(next.slice(0, LIMIT))}
        placeholder="What should we build next?"
      />
      <Text style={[styles.count, { color: colors.mutedForeground }]}>
        {text.length}/{LIMIT}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 6 },
  count: { alignSelf: 'flex-end', fontSize: 12 },
});
