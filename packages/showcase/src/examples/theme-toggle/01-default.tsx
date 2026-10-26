import { ThemeToggle } from '@bilo-io/ui';

// Needs a ThemeProvider from '@bilo-io/ui/theme' above it — this site has one, so
// picking a theme here re-themes the whole page.
export default function Default() {
  return (
    <div className="flex items-center gap-6">
      <ThemeToggle />
      <ThemeToggle expanded />
    </div>
  );
}
