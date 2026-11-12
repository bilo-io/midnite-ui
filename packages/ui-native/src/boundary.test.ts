// @vitest-environment node
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

// @bilo-io/ui-native shares @bilo-io/ui's token VALUES and nothing else. A React
// Native app cannot load react-dom, lucide-react (DOM SVG), the web components
// or their CSS, so the only workspace import allowed is the DOM-free
// `@bilo-io/ui/tokens` entry. This guard greps the shipped source for the rest.

const srcDir = fileURLToPath(new URL('./', import.meta.url));

/** Every module specifier a file imports (static, dynamic, re-export, require). */
function specifiers(source: string): string[] {
  const found: string[] = [];
  const pattern =
    /(?:import|export)\s[^'"]*?from\s*['"]([^'"]+)['"]|import\s*\(\s*['"]([^'"]+)['"]|require\(\s*['"]([^'"]+)['"]|import\s+['"]([^'"]+)['"]/g;
  for (const m of source.matchAll(pattern)) found.push((m[1] ?? m[2] ?? m[3] ?? m[4])!);
  return found;
}

const FORBIDDEN = [
  /^react-dom(?:\/|$)/,
  /^lucide-react(?:\/|$)/,
  /^react-native-web(?:\/|$)/,
  /\.css$/,
  // Any workspace package except the tokens entry of @bilo-io/ui.
  /^@(?:bilo-io|midnite)\/(?!ui\/tokens$)/,
];

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
  it('imports only react, react-native and @bilo-io/ui/tokens', () => {
    const offenders = sourceFiles(srcDir).flatMap((file) =>
      specifiers(readFileSync(file, 'utf8'))
        .filter((spec) => FORBIDDEN.some((rule) => rule.test(spec)))
        .map((spec) => `${file.slice(srcDir.length)}: ${spec}`),
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

  it('catches a forbidden import (the guard itself works)', () => {
    const sample = "import { Button } from '@bilo-io/ui';\nimport '@bilo-io/ui/styles';";
    expect(specifiers(sample).filter((s) => FORBIDDEN.some((r) => r.test(s)))).toEqual([
      '@bilo-io/ui',
      '@bilo-io/ui/styles',
    ]);
  });
});
