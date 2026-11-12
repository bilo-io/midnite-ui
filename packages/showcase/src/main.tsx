import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { ThemeProvider } from '@bilo-io/ui/theme';

import { App } from './app';
import { restoreMode } from './router';
import './styles.css';

// Before the first render, so a bare visit reopens the last platform's overview.
restoreMode();

const container = document.getElementById('root');
if (!container) throw new Error('showcase: missing #root element');

// Wrapped in the library's ThemeProvider, so the ThemeToggle in the top bar and
// the one on its own page drive the real runtime a host app would use.
createRoot(container).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
);
