import type { ReactNode } from 'react';
import { Pressable, type StyleProp, StyleSheet, Text, type ViewStyle } from 'react-native';

import { a11yState } from '../lib/a11y';
import { contrastTextForHex } from '../theme/contrast';
import { useTheme } from '../theme/theme-provider';

export type ChipProps = {
  label: string;
  /** A `#rrggbb` fill (a project field option's colour); the text picks black or white to read on it. */
  color?: string;
  selected?: boolean;
  onPress?: () => void;
  leading?: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/** A compact label or filter pill. Pressable when `onPress` is set. */
export function Chip({ label, color, selected, onPress, leading, style, testID }: ChipProps) {
  const theme = useTheme();
  const fill = color ?? (selected ? theme.colors.accent : 'transparent');
  const ink = color
    ? contrastTextForHex(color)
    : selected
      ? theme.colors.accentForeground
      : theme.colors.foreground;
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      {...(onPress && selected !== undefined ? a11yState({ selected }) : {})}
      disabled={!onPress}
      onPress={onPress}
      hitSlop={8}
      testID={testID}
      style={[
        styles.chip,
        {
          backgroundColor: fill,
          borderColor: color ?? (selected ? theme.colors.accent : theme.colors.border),
          borderRadius: theme.radius.full,
          paddingHorizontal: theme.space[3],
          gap: theme.space[1],
        },
        style,
      ]}
    >
      {leading}
      <Text
        numberOfLines={1}
        maxFontSizeMultiplier={1.4}
        style={[theme.type.xs, { color: ink, fontWeight: theme.font.medium }]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    minHeight: 28,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
