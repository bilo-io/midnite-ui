import { Text } from 'react-native';

import { EmptyState, useTheme } from '@bilo-io/ui-native';

export default function NoResults() {
  const { colors } = useTheme();
  return (
    <EmptyState
      icon={<Text style={{ color: colors.mutedForeground, fontSize: 32 }}>⌕</Text>}
      title="No items match"
      body="Nothing in this project matches the filters you picked."
      action={{ label: 'Clear filters', onPress: () => {} }}
    />
  );
}
