import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ThemeProvider } from '../theme/theme-provider';
import { MidniteLogo, Wordmark } from './brand';

describe('Wordmark', () => {
  it('reads as one phrase, letter-by-letter ramp and all', () => {
    render(<Wordmark product="Mobile UI" testID="mark" />);
    expect(screen.getByTestId('mark')).toHaveTextContent('Midnite Mobile UI');
  });
});

describe('MidniteLogo', () => {
  it('is one image named after the product, with the mark for the scheme', () => {
    const { rerender } = render(
      <ThemeProvider scheme="light">
        <MidniteLogo product="Mobile UI" />
      </ThemeProvider>,
    );
    const logo = screen.getByRole('img', { name: 'Midnite Mobile UI' });
    const lightSrc = logo.querySelector('img')?.getAttribute('src');
    expect(lightSrc).toMatch(/^data:image\/png;base64,/);

    rerender(
      <ThemeProvider scheme="dark">
        <MidniteLogo product="Mobile UI" />
      </ThemeProvider>,
    );
    const darkSrc = screen
      .getByRole('img', { name: 'Midnite Mobile UI' })
      .querySelector('img')
      ?.getAttribute('src');
    expect(darkSrc).toMatch(/^data:image\/png;base64,/);
    expect(darkSrc).not.toBe(lightSrc);
  });
});
