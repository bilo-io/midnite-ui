import { Text } from 'react-native';

import { AppBar, Avatar, IconButton, useTheme } from '@bilo-io/ui-native';

export default function RepoSwitcher() {
  const { colors } = useTheme();
  return (
    <AppBar
      title="bilo-io/midnite-studio ▾"
      subtitle="⎇ main"
      onTitlePress={() => {}}
      leading={
        <IconButton
          icon={<Text style={{ color: colors.foreground, fontSize: 18 }}>◧</Text>}
          label="Open forge panel"
          onPress={() => {}}
        />
      }
      trailing={<Avatar name="bilo-io" size={32} />}
    />
  );
}
