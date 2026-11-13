import { act, fireEvent, render, screen } from '@testing-library/react';
import { Suspense } from 'react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { ThemeProvider } from '@bilo-io/ui/theme';

import { searchExamples } from '../search';
import { ExamplesPage } from '../components/examples-page';
import { LAYOUTS, layoutComponent, loadSource, sourcePaths, type Variant } from './index';

const cases = LAYOUTS.flatMap((l) => (['desktop', 'mobile'] as Variant[]).map((v) => [l.id, v] as const));

describe('example layouts', () => {
  beforeAll(() => {
    window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;
  });

  it('has six layouts, each with a description and 3 to 5 features', () => {
    expect(LAYOUTS).toHaveLength(6);
    for (const l of LAYOUTS) {
      expect(l.description.length).toBeGreaterThan(10);
      expect(l.features.length).toBeGreaterThanOrEqual(3);
      expect(l.features.length).toBeLessThanOrEqual(5);
    }
  });

  it.each(cases)('renders %s (%s) and tags blocks for the cascade', async (id, variant) => {
    const View = layoutComponent(id, variant);
    const { container } = render(
      <ThemeProvider>
        <Suspense fallback={null}>
          <View />
        </Suspense>
      </ThemeProvider>,
    );
    await vi.waitFor(() => expect(container.querySelector('[data-c]')).not.toBeNull());
  });

  it.each(cases)('serves the source behind %s (%s)', async (id, variant) => {
    expect(sourcePaths(id, variant)[0]).toBe(`./${id}/${variant}.tsx`);
    expect(await loadSource(id, variant)).toContain('export default function');
  });

  it('shows shared helpers under a header in the code', async () => {
    expect(await loadSource('forkful', 'desktop')).toContain('// ── forkful/deck.tsx ──');
  });

  it('finds layouts by name, keyword and description', () => {
    expect(searchExamples('forkf', LAYOUTS).map((l) => l.id)).toEqual(['forkful']);
    expect(searchExamples('fintech', LAYOUTS).map((l) => l.id)).toEqual(['ticker']);
    expect(searchExamples('', LAYOUTS)).toHaveLength(6);
    expect(searchExamples('zzzz', LAYOUTS)).toEqual([]);
  });
});

describe('Forkful swipe deck', () => {
  it('moves a liked place into the matches list via the keyboard', async () => {
    vi.useFakeTimers();
    const View = layoutComponent('forkful', 'desktop');
    render(
      <Suspense fallback={null}>
        <View />
      </Suspense>,
    );
    await act(async () => {
      await vi.dynamicImportSettled();
    });
    const deck = screen.getByRole('group', { name: /restaurant cards/i });
    expect(screen.getByText(/Matches \(0\)/)).toBeInTheDocument();
    fireEvent.keyDown(deck, { key: 'ArrowRight' });
    await act(async () => {
      vi.advanceTimersByTime(300);
    });
    expect(screen.getByText(/Matches \(1\)/)).toBeInTheDocument();
    fireEvent.keyDown(deck, { key: 'ArrowLeft' });
    await act(async () => {
      vi.advanceTimersByTime(300);
    });
    expect(screen.getByText(/Matches \(1\)/)).toBeInTheDocument();
    vi.useRealTimers();
  });
});

describe('Examples page', () => {
  it('lists every layout on the overview', () => {
    render(<ExamplesPage />);
    for (const l of LAYOUTS) expect(screen.getByRole('heading', { name: l.name })).toBeInTheDocument();
  });

  it('shows one layout with its features and a Desktop/Mobile toggle', async () => {
    render(<ExamplesPage id="pulse" />);
    expect(screen.getByRole('heading', { level: 1, name: 'Pulse' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Mobile' })).toBeInTheDocument();
    expect(await screen.findByText(/Pulse · desktop/)).toBeInTheDocument();
  });

  it('explains an unknown id', () => {
    render(<ExamplesPage id="nope" />);
    expect(screen.getByText(/No example called/)).toBeInTheDocument();
  });
});
