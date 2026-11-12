import { color } from '@bilo-io/ui/tokens';
import { render, screen } from '@testing-library/react';
import { Text } from 'react-native';
import { describe, expect, it } from 'vitest';

import { hsl } from './palette';
import { ThemeProvider, useTheme } from './theme-provider';

function Probe() {
  const theme = useTheme();
  return <Text testID="probe">{`${theme.scheme} ${theme.colors.background}`}</Text>;
}

describe('ThemeProvider', () => {
  it('follows the device scheme by default (light in jsdom)', () => {
    render(<Probe />);
    expect(screen.getByTestId('probe')).toHaveTextContent(`light ${hsl(color.light.background)}`);
  });

  it('lets `scheme` pin the theme', () => {
    render(
      <ThemeProvider scheme="dark">
        <Probe />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('probe')).toHaveTextContent(`dark ${hsl(color.dark.background)}`);
  });
});
