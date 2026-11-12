import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { useTheme as useWebTheme } from '@bilo-io/ui/theme';
import { ThemeProvider, useTheme } from '@bilo-io/ui-native';

/**
 * Hands the showcase's resolved light/dark (from @bilo-io/ui/theme) to
 * @bilo-io/ui-native, so the React Native previews flip with the page.
 */
export function NativeTheme({ children }: { children: ReactNode }) {
  const { resolved } = useWebTheme();
  return <ThemeProvider scheme={resolved}>{children}</ThemeProvider>;
}

/** A React Native screen body: the background token, the example padded inside. */
export function NativeScreen({
  children,
  scroll = false,
}: {
  children: ReactNode;
  scroll?: boolean;
}) {
  const { colors } = useTheme();
  if (!scroll) {
    return <View style={[styles.screen, { backgroundColor: colors.background }]}>{children}</View>;
  }
  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.screen}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { padding: 20, flexGrow: 1 },
});
