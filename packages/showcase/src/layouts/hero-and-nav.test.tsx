import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { ThemeProvider } from '@bilo-io/ui/theme';

import { App } from '../app';
import HeroStage from './hero-stage';
import { LAYOUTS } from './index';

beforeAll(() => {
  window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;
  HTMLCanvasElement.prototype.getContext = vi.fn(() => null) as never;
});

describe('HeroStage', () => {
  it('is an inert picture with a chip per layout and a pause control', async () => {
    const { container } = render(<HeroStage />);
    for (const l of LAYOUTS) expect(screen.getByRole('button', { name: l.name })).toBeInTheDocument();
    const picture = container.querySelector('[inert]');
    expect(picture).not.toBeNull();
    expect(picture).toHaveAttribute('aria-hidden', 'true');
    await waitFor(() => expect(container.querySelector('[data-c]')).not.toBeNull());
    const pause = screen.getByRole('button', { name: /pause the layout tour/i });
    fireEvent.click(pause);
    expect(screen.getByRole('button', { name: /play the layout tour/i })).toBeInTheDocument();
  });

  it('plays two layers during a switch, then settles on the new one', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const { container } = render(<HeroStage />);
    await waitFor(() => expect(container.querySelector('[data-c]')).not.toBeNull());
    fireEvent.click(screen.getByRole('button', { name: 'Ticker' }));
    expect(container.querySelector('[data-phase="out"]')).not.toBeNull();
    expect(screen.getByRole('button', { name: 'Ticker' })).toHaveAttribute('aria-current', 'true');
    await act(async () => {
      vi.advanceTimersByTime(2500);
    });
    expect(container.querySelector('[data-phase="out"]')).toBeNull();
    expect(container.querySelector('[data-phase="in"]')).toBeNull();
    vi.useRealTimers();
  });
});

describe('navigating between example routes', () => {
  it('survives hash changes across the index and every layout, desktop and mobile', async () => {
    window.location.hash = '#/examples/ticker';
    render(
      <ThemeProvider>
        <App />
      </ThemeProvider>,
    );
    const go = async (hash: string) => {
      await act(async () => {
        window.location.hash = hash;
        window.dispatchEvent(new HashChangeEvent('hashchange'));
      });
    };
    for (const l of LAYOUTS) {
      await go(`#/examples/${l.id}`);
      expect(await screen.findByRole('heading', { level: 1, name: l.name })).toBeInTheDocument();
      fireEvent.click(screen.getByRole('tab', { name: 'Mobile' }));
      expect(await screen.findByText(`${l.name} · mobile`)).toBeInTheDocument();
      await go('#/examples');
      expect(await screen.findByRole('heading', { level: 1, name: 'Examples' })).toBeInTheDocument();
    }
    await go('#/');
    expect(await screen.findByRole('heading', { level: 1 })).toBeInTheDocument();
    await go('#/examples/circle');
    expect(await screen.findByRole('heading', { level: 1, name: 'Circle' })).toBeInTheDocument();
  });
});
