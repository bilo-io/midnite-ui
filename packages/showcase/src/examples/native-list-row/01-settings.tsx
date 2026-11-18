import { Text, View } from 'react-native';

import { Avatar, ListRow, useTheme } from '@bilo-io/ui-native';

export default function Settings() {
  const { colors } = useTheme();
  return (
    <View style={{ margin: -20 }}>
      <ListRow
        title="bilo-io"
        subtitle="github.com · signed in"
        leading={<Avatar name="bilo-io" size={40} />}
        onPress={() => {}}
      />
      <ListRow title="Theme" meta="System" onPress={() => {}} />
      <ListRow
        title="Notifications"
        meta="On"
        onPress={() => {}}
        trailing={<Text style={{ color: colors.mutedForeground }}>›</Text>}
      />
      <ListRow title="Version" meta="0.5.0" divider={false} />
    </View>
  );
}
