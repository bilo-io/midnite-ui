import { describe, expect, it } from 'vitest';

import { resolveGrammar, type CodeLanguage } from './code-block';

describe('resolveGrammar', () => {
  it('maps aliases onto the registered grammars', () => {
    const cases: Array<[CodeLanguage, string]> = [
      ['tsx', 'typescript'],
      ['jsx', 'javascript'],
      ['html', 'xml'],
      ['xml', 'xml'],
      ['typescript', 'typescript'],
      ['bash', 'bash'],
      ['css', 'css'],
      ['json', 'json'],
    ];
    for (const [lang, grammar] of cases) expect(resolveGrammar(lang)).toBe(grammar);
  });

  it('falls back to typescript for an unknown language', () => {
    expect(resolveGrammar('nope' as CodeLanguage)).toBe('typescript');
  });
});
