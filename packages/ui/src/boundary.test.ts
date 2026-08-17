import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

// @bilo-io/ui is a leaf: it must import NOTHING from another in-repo package.
// This guard greps the shipped source for any workspace import specifier and
// fails if one appears, so the leaf rule is enforced in CI rather than relying
// on review.

const srcDir = fileURLToPath(new URL('./', import.meta.url));

/** Quoted module specifier for any other workspace package (legacy scope included). */
const FORBIDDEN_IMPORT = /['"]@(?:bilo-io|midnite)\/(?!ui(?:\/|['"]))[^'"]+['"]/;

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    if (!/\.(ts|tsx)$/.test(entry.name)) return [];
    // Tests legitimately name other packages (this file does); the rule is
    // about the shipped library graph, so exclude specs from the scan.
    if (/\.(test|spec)\.(ts|tsx)$/.test(entry.name)) return [];
    return [full];
  });
}

describe('@bilo-io/ui package boundary', () => {
  it('imports nothing from other in-repo packages (it is a leaf)', () => {
    const offenders = sourceFiles(srcDir)
      .filter((file) => FORBIDDEN_IMPORT.test(readFileSync(file, 'utf8')))
      .map((file) => file.slice(srcDir.length));

    expect(offenders).toEqual([]);
  });
});
