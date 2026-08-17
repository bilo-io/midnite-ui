import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { ThemeProvider } from '@bilo-io/ui/theme';

import { App } from './app';
import './styles.css';

const container = document.getElementById('root');
if (!container) throw new Error('docs app: missing #root element');

// The whole app is wrapped in the library's ThemeProvider — light/dark/system/
// time resolution + the `.dark` toggle on <html> come from @bilo-io/ui, the same
// runtime a host app uses. This is the proof the lib is consumable standalone.
createRoot(container).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
);
