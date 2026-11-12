import { render, screen } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { ThemeProvider } from '@bilo-io/ui/theme';

import { findComponent } from './catalog';
import { ComponentPage } from './components/component-page';
import { HomePage } from './components/home-page';
import { NATIVE_EXAMPLES } from './mobile/mobile';

// The Mobile showcase renders React Native through react-native-web; these
// mount every native demo in its phone frame the way the page does. The phones
// come from the lazy ./mobile chunk, hence the `find*` queries.
const cases = [...NATIVE_EXAMPLES.entries()].map(([id]) => id);

describe('Mobile showcase', () => {
  // ComponentPage scrolls to the top on mount, and the overview hero draws on a
  // canvas; jsdom implements neither.
  beforeAll(() => {
    window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;
    HTMLCanvasElement.prototype.getContext = vi.fn(() => null) as never;
  });

  it.each(cases)('renders every %s example in a phone frame', async (id) => {
    const doc = findComponent(id, 'mobile')!;
    render(
      <ThemeProvider>
        <ComponentPage doc={doc} mode="mobile" />
      </ThemeProvider>,
    );
    expect(screen.getAllByRole('heading', { level: 1 })[0]).toHaveTextContent(doc.name);
    expect(await screen.findAllByRole('figure')).toHaveLength(NATIVE_EXAMPLES.get(id)!.length);
    const importLine = `import { ${doc.exports.join(', ')} } from '@bilo-io/ui-native';`;
    expect([...document.querySelectorAll('code')].map((c) => c.textContent)).toContain(importLine);
  });

  it('titles the overview "Midnite Mobile UI" and links into the mobile routes', async () => {
    render(
      <ThemeProvider>
        <HomePage mode="mobile" />
      </ThemeProvider>,
    );
    // The first h1 is the hero's; the card previews' RN headers follow it.
    expect(screen.getAllByRole('heading', { level: 1 })[0]).toHaveTextContent('Midnite Mobile UI');
    const button = screen
      .getAllByRole('link')
      .find((a) => a.getAttribute('href') === '#/mobile/button');
    expect(button).toBeDefined();
    expect(await screen.findByLabelText('Button preview')).toBeInTheDocument();
  });
});
