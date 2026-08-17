// @vitest-environment node
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

// The docs app is a pure consumer of the two published libraries: it may import
// `@bilo-io/ui` and `@bilo-io/shell` (public entries only) and nothing else from
// the workspace. This guard greps the source for any other workspace import.

const srcDir = fileURLToPath(new URL('./', import.meta.url));

/** Quoted specifier for any workspace package docs must NOT import (legacy scope included). */
const FORBIDDEN_IMPORT = /['"]@(?:bilo-io|midnite)\/(?!(?:ui|shell)(?:\/|['"]))[^'"]+['"]/;

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    if (!/\.(ts|tsx|mdx)$/.test(entry.name)) return [];
    // Tests legitimately name other packages (this file does); exclude specs.
    if (/\.(test|spec)\.(ts|tsx)$/.test(entry.name)) return [];
    return [full];
  });
}

describe('@bilo-io/docs package boundary', () => {
  it('imports only @bilo-io/ui + @bilo-io/shell from the workspace', () => {
    const offenders = sourceFiles(srcDir)
      .filter((file) => FORBIDDEN_IMPORT.test(readFileSync(file, 'utf8')))
      .map((file) => file.slice(srcDir.length));

    expect(offenders).toEqual([]);
  });
});
