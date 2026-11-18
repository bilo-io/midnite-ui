import { Text, View } from 'react-native';

import { IconButton, useTheme } from '@bilo-io/ui-native';

export default function Variants() {
  const { colors } = useTheme();
  const glyph = (g: string, color = colors.foreground) => (
    <Text style={{ color, fontSize: 18 }}>{g}</Text>
  );
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <IconButton icon={glyph('◧')} label="Open panel" onPress={() => {}} />
      <IconButton icon={glyph('⧉')} label="Copy" onPress={() => {}} size={32} />
      <IconButton
        icon={glyph('⋯', colors.secondaryForeground)}
        label="More"
        variant="filled"
        onPress={() => {}}
      />
      <IconButton icon={glyph('✎')} label="Edit" onPress={() => {}} disabled />
    </View>
  );
}
