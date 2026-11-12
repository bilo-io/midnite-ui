import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Tabs, useTheme } from '@bilo-io/ui-native';

type Range = 'day' | 'week' | 'month';

const TOTALS: Record<Range, string> = { day: '1h 12m', week: '9h 40m', month: '41h 05m' };

export default function Segmented() {
  const { colors } = useTheme();
  const [range, setRange] = useState<Range>('week');
  return (
    <View style={styles.stack}>
      <Tabs
        accessibilityLabel="Range"
        stretch
        options={[
          { value: 'day', label: 'Day' },
          { value: 'week', label: 'Week' },
          { value: 'month', label: 'Month' },
        ]}
        value={range}
        onChange={setRange}
      />
      <Text style={[styles.total, { color: colors.foreground }]}>{TOTALS[range]}</Text>
      <Text style={{ color: colors.mutedForeground }}>Focus time this {range}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 8 },
  total: { marginTop: 12, fontSize: 32, fontWeight: '600' },
});
