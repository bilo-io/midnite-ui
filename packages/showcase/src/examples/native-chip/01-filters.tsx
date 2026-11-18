import { useState } from 'react';
import { Text, View } from 'react-native';

import { Chip, useTheme } from '@bilo-io/ui-native';

export default function Filters() {
  const { colors } = useTheme();
  const [on, setOn] = useState<string[]>(['bug']);
  const toggle = (k: string) =>
    setOn((v) => (v.includes(k) ? v.filter((x) => x !== k) : [...v, k]));
  return (
    <View style={{ gap: 16 }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {['bug', 'feature', 'chore'].map((k) => (
          <Chip
            key={k}
            label={k}
            selected={on.includes(k)}
            onPress={() => toggle(k)}
            leading={
              on.includes(k) ? (
                <Text style={{ color: colors.accentForeground, fontSize: 12 }}>✓</Text>
              ) : undefined
            }
          />
        ))}
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        <Chip label="In progress" color="#facc15" />
        <Chip label="Blocked" color="#1e293b" />
        <Chip label="Shipped" color="#22c55e" />
      </View>
    </View>
  );
}
