import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { createTheme, withAlpha } from '../theme/palette';
import { Badge, type BadgeTone } from './badge';

const t = createTheme('light');

describe('Badge', () => {
  it.each<[BadgeTone, string]>([
    ['success', t.colors.success],
    ['warning', t.accents.status.wip],
    ['danger', t.accents.kind.bug],
    ['info', t.accents.status.todo],
  ])('draws %s as its hue at 0.15 with a dot, text in foreground', (tone, hue) => {
    render(
      <Badge tone={tone} testID="b">
        {tone}
      </Badge>,
    );
    expect(screen.getByTestId('b')).toHaveStyle({ backgroundColor: withAlpha(hue, 0.15) });
    expect(screen.getByTestId('b-dot')).toHaveStyle({ backgroundColor: hue });
    expect(screen.getByText(tone)).toHaveStyle({ color: t.colors.foreground });
  });

  it('outlines a dot under 3:1 (light amber) and not one above', () => {
    render(
      <>
        <Badge tone="warning" testID="w">
          Pending
        </Badge>
        <Badge tone="info" testID="i">
          Open
        </Badge>
      </>,
    );
    expect(screen.getByTestId('w-dot')).toHaveStyle({ borderWidth: '1px' });
    expect(screen.getByTestId('i-dot')).not.toHaveStyle({ borderWidth: '1px' });
  });

  it('draws neutral and primary as solid fills with no dot', () => {
    render(
      <>
        <Badge testID="n">Draft</Badge>
        <Badge tone="primary" testID="p">
          Last used
        </Badge>
      </>,
    );
    expect(screen.getByTestId('n')).toHaveStyle({ backgroundColor: t.colors.muted });
    expect(screen.getByText('Draft')).toHaveStyle({ color: t.colors.mutedForeground });
    expect(screen.getByTestId('p')).toHaveStyle({ backgroundColor: t.colors.primary });
    expect(screen.getByText('Last used')).toHaveStyle({ color: t.colors.primaryForeground });
    expect(screen.queryByTestId('n-dot')).not.toBeInTheDocument();
  });
});
