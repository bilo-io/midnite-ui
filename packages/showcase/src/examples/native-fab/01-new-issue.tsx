import { Text, View } from 'react-native';

import { Fab, useTheme } from '@bilo-io/ui-native';

export default function NewIssue() {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, minHeight: 240 }}>
      <Text style={{ color: colors.mutedForeground }}>Screen content</Text>
      <Fab
        icon={<Text style={{ color: colors.primaryForeground, fontSize: 24 }}>+</Text>}
        label="New issue"
        onPress={() => {}}
      />
    </View>
  );
}
