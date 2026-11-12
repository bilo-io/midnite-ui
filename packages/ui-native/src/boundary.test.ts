// @vitest-environment node
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

// @bilo-io/ui-native shares @bilo-io/ui's token VALUES and nothing else. A React
// Native app cannot load react-dom, lucide-react (DOM SVG), the web components
// or their CSS, so the shipped source may import only what is listed here:
// relative modules (its own files and the `?inline` crescent PNGs), React,
// React Native, and the DOM-free `@bilo-io/ui/tokens` entry, which the build
// inlines into dist.

const srcDir = fileURLToPath(new URL('./', import.meta.url));

/** Every module specifier a file imports (static, dynamic, re-export, require). */
function specifiers(source: string): string[] {
  const found: string[] = [];
  const pattern =
    /(?:import|export)\s[^'"]*?from\s*['"]([^'"]+)['"]|import\s*\(\s*['"]([^'"]+)['"]|require\(\s*['"]([^'"]+)['"]|import\s+['"]([^'"]+)['"]/g;
  for (const m of source.matchAll(pattern)) found.push((m[1] ?? m[2] ?? m[3] ?? m[4])!);
  return found;
}

const ALLOWED = /^(\.|react$|react\/jsx-runtime$|react-native$|@bilo-io\/ui\/tokens$)/;

const outsideAllowlist = (specs: string[]) => specs.filter((spec) => !ALLOWED.test(spec));

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    if (!/\.(ts|tsx)$/.test(entry.name)) return [];
    // Tests run through react-native-web and may name anything; the rule is
    // about what ships.
    if (/\.(test|spec)\.(ts|tsx)$/.test(entry.name)) return [];
    return [full];
  });
}

describe('@bilo-io/ui-native package boundary', () => {
  it('imports only relative modules, react, react/jsx-runtime, react-native and @bilo-io/ui/tokens', () => {
    const offenders = sourceFiles(srcDir).flatMap((file) =>
      outsideAllowlist(specifiers(readFileSync(file, 'utf8'))).map(
        (spec) => `${file.slice(srcDir.length)}: ${spec}`,
      ),
    );
    expect(offenders).toEqual([]);
  });

  it('reads the tokens from @bilo-io/ui rather than keeping its own copy', () => {
    const palette = readFileSync(join(srcDir, 'theme/palette.ts'), 'utf8');
    expect(specifiers(palette)).toContain('@bilo-io/ui/tokens');
    // No HSL triplet literal anywhere in the shipped source.
    const literals = sourceFiles(srcDir).filter((file) =>
      /['"]\d{1,3} \d{1,3}(?:\.\d+)?% \d{1,3}(?:\.\d+)?%['"]/.test(readFileSync(file, 'utf8')),
    );
    expect(literals).toEqual([]);
  });

  it('rejects anything off the allowlist (the guard itself works)', () => {
    const sample = [
      "import { Button } from '@bilo-io/ui';",
      "import '@bilo-io/ui/styles';",
      "import { createPortal } from 'react-dom';",
      "import { View } from 'react-native-web';",
      "import { Svg } from 'react-native-svg';",
      "import { useTheme } from './theme/theme-provider';",
      "import { color } from '@bilo-io/ui/tokens';",
    ].join('\n');
    expect(outsideAllowlist(specifiers(sample))).toEqual([
      '@bilo-io/ui',
      '@bilo-io/ui/styles',
      'react-dom',
      'react-native-web',
      'react-native-svg',
    ]);
  });
});
