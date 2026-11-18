import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { AppBar } from './app-bar';

describe('AppBar', () => {
  it('renders the title and subtitle', () => {
    render(<AppBar title="bilo-io/midnite-studio" subtitle="main" />);
    expect(screen.getByRole('heading', { name: 'bilo-io/midnite-studio' })).toBeInTheDocument();
    expect(screen.getByText('main')).toBeInTheDocument();
  });

  it('makes the title a button that fires onTitlePress', () => {
    const onTitlePress = vi.fn();
    render(<AppBar title="bilo-io/midnite-studio" subtitle="main" onTitlePress={onTitlePress} />);
    fireEvent.click(screen.getByRole('button', { name: /bilo-io\/midnite-studio/ }));
    expect(onTitlePress).toHaveBeenCalledTimes(1);
  });

  it('pads the top inset', () => {
    render(<AppBar title="Repo" insetTop={47} testID="bar" />);
    expect(screen.getByTestId('bar')).toHaveStyle({ paddingTop: '47px', height: '103px' });
  });
});
