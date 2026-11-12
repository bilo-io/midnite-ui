// @vitest-environment node
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

// The showcase is a pure consumer of the published libraries: it may import
// `@bilo-io/ui` and `@bilo-io/ui-native` (public entries only) and nothing else
// from the workspace. This guard greps the source for any other workspace import.

const srcDir = fileURLToPath(new URL('./', import.meta.url));

/** Quoted specifier for any workspace package the showcase must NOT import (legacy scope included). */
const FORBIDDEN_IMPORT = /['"]@(?:bilo-io|midnite)\/(?!ui(?:-native)?(?:\/|['"]))[^'"]+['"]/;

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    if (!/\.(ts|tsx)$/.test(entry.name)) return [];
    // Tests legitimately name other packages (this file does); exclude specs.
    if (/\.(test|spec)\.(ts|tsx)$/.test(entry.name)) return [];
    return [full];
  });
}

describe('@bilo-io/showcase package boundary', () => {
  it('imports only @bilo-io/ui and @bilo-io/ui-native from the workspace', () => {
    const offenders = sourceFiles(srcDir)
      .filter((file) => FORBIDDEN_IMPORT.test(readFileSync(file, 'utf8')))
      .map((file) => file.slice(srcDir.length));

    expect(offenders).toEqual([]);
  });

  // The Mobile mode is a lazy chunk: react-native-web, @bilo-io/ui-native and
  // the native demos load only when someone opens it. A static import of any of
  // them from the rest of the app would pull them back into the main bundle.
  it('reaches the Mobile mode only through mobile/lazy', () => {
    const mobileOnly =
      /(?:from|import)\s*\(?\s*['"](?:react-native|@bilo-io\/ui-native|[./]+\/mobile(?:\/(?!lazy['"])[^'"]*)?)['"]/;
    const offenders = sourceFiles(srcDir)
      .filter((file) => {
        const rel = file.slice(srcDir.length);
        return !rel.startsWith('mobile/') && !/^examples\/native-/.test(rel);
      })
      .filter((file) => mobileOnly.test(readFileSync(file, 'utf8')))
      .map((file) => file.slice(srcDir.length));

    expect(offenders).toEqual([]);
  });
});
