// @vitest-environment node
// (This grep-the-source guard uses node fs + a file:// import.meta.url; the
// package's default test env is jsdom, where import.meta.url isn't a file URL.)
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

// @bilo-io/shell is a MID-TIER package: the wired app frame host apps mount. It
// may depend on `@bilo-io/ui` ONLY — never on an app. This guard greps the
// shipped source for any other workspace import and fails if one appears, so the
// `ui ◀ shell ◀ apps` edge is enforced in CI rather than by review.

const srcDir = fileURLToPath(new URL('./', import.meta.url));

/** Quoted specifier for any workspace package shell must NOT import (legacy scope included). */
const FORBIDDEN_IMPORT = /['"]@(?:bilo-io|midnite)\/(?!ui(?:\/|['"]))[^'"]+['"]/;

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    if (!/\.(ts|tsx)$/.test(entry.name)) return [];
    // Tests legitimately name other packages (this file does); the rule is about
    // the shipped library graph, so exclude specs from the scan.
    if (/\.(test|spec)\.(ts|tsx)$/.test(entry.name)) return [];
    return [full];
  });
}

describe('@bilo-io/shell package boundary', () => {
  it('imports only from @bilo-io/ui (no other workspace package)', () => {
    const offenders = sourceFiles(srcDir)
      .filter((file) => FORBIDDEN_IMPORT.test(readFileSync(file, 'utf8')))
      .map((file) => file.slice(srcDir.length));

    expect(offenders).toEqual([]);
  });
});
