import { render, screen } from '@testing-library/react';
import { Text } from 'react-native';
import { describe, expect, it } from 'vitest';

import { Card, CardContent, CardHeader, CardTitle } from './card';

describe('Card', () => {
  it('composes a titled surface and forwards accessibility props', () => {
    render(
      <Card accessibilityLabel="Storage summary" testID="card">
        <CardHeader>
          <CardTitle>Storage</CardTitle>
        </CardHeader>
        <CardContent>
          <Text>42 GB free</Text>
        </CardContent>
      </Card>,
    );
    expect(screen.getByRole('heading', { name: 'Storage' })).toBeInTheDocument();
    expect(screen.getByTestId('card')).toHaveAttribute('aria-label', 'Storage summary');
    expect(screen.getByText('42 GB free')).toBeInTheDocument();
  });
});
