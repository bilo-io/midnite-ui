import type { ReactNode } from 'react';
import { type StyleProp, StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { contrastRatio, NON_TEXT_CONTRAST } from '../theme/contrast';
import { withAlpha } from '../theme/palette';
import { useTheme } from '../theme/theme-provider';

export type BadgeTone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';

export type BadgeProps = {
  tone?: BadgeTone;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/**
 * A small status pill. `neutral` and `primary` are solid fills; the semantic
 * tones are their hue at 0.15 behind `foreground` text, with a full-strength
 * dot carrying the hue (light-mode amber cannot hold 4.5:1 as text).
 */
export function Badge({ tone = 'neutral', children, style, testID }: BadgeProps) {
  const theme = useTheme();
  const hue: Partial<Record<BadgeTone, string>> = {
    success: theme.colors.success,
    warning: theme.accents.status.wip,
    danger: theme.accents.kind.bug,
    info: theme.accents.status.todo,
  };
  const tinted = hue[tone];
  const fill = tinted
    ? withAlpha(tinted, 0.15)
    : tone === 'primary'
      ? theme.colors.primary
      : theme.colors.muted;
  const ink = tinted
    ? theme.colors.foreground
    : tone === 'primary'
      ? theme.colors.primaryForeground
      : theme.colors.mutedForeground;
  return (
    <View
      testID={testID}
      style={[
        styles.badge,
        {
          backgroundColor: fill,
          borderRadius: theme.radius.full,
          paddingHorizontal: theme.space[2],
          gap: theme.space[1],
        },
        style,
      ]}
    >
      {tinted ? (
        <View
          testID={testID ? `${testID}-dot` : undefined}
          style={[
            styles.dot,
            { backgroundColor: tinted, borderRadius: theme.radius.full },
            // Under the 3:1 non-text floor, a dot gets a 1dp border outline.
            contrastRatio(tinted, theme.colors.background) < NON_TEXT_CONTRAST && {
              borderWidth: 1,
              borderColor: theme.colors.border,
            },
          ]}
        />
      ) : null}
      <Text
        numberOfLines={1}
        maxFontSizeMultiplier={1.4}
        style={[theme.type.xs, { color: ink, fontWeight: theme.font.medium }]}
      >
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 2,
  },
  dot: { width: 6, height: 6 },
});
