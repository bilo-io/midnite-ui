import { readFileSync, readdirSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

// @ts-expect-error — a plain .mjs build script, no declarations.
import { ASSETS_DIR, OUT_FILE, buildAgentIconModule } from '../../scripts/agent-icons.mjs';
import { AGENT_IDS, AgentIcon, agentColor, agentFiles } from './agent-icon';

describe('AgentIcon', () => {
  it('generated data is in step with assets/agents/', () => {
    expect(readFileSync(OUT_FILE as string, 'utf8')).toBe(buildAgentIconModule());
  });

  it('covers every file in assets/agents/', () => {
    const files = readdirSync(ASSETS_DIR as string)
      .filter((f) => f.endsWith('.svg'))
      .map((f) => f.slice(0, -4))
      .sort();
    expect(AGENT_IDS.flatMap((id) => agentFiles(id)).sort()).toEqual(files);
    expect(files).toHaveLength(38);
  });

  it('paints the brand colour, or currentColor in mono', () => {
    const color = renderToStaticMarkup(createElement(AgentIcon, { agent: 'claude' }));
    const mono = renderToStaticMarkup(
      createElement(AgentIcon, { agent: 'claude', variant: 'mono' }),
    );
    expect(color).toContain(`fill="${agentColor('claude')}"`);
    expect(mono).toContain('fill="currentColor"');
    expect(mono).not.toContain('#D97757');
  });

  it('monochrome brands paint with currentColor in both variants', () => {
    expect(agentColor('grok')).toBeUndefined();
    expect(renderToStaticMarkup(createElement(AgentIcon, { agent: 'grok' }))).toContain(
      'fill="currentColor"',
    );
  });

  it('scopes the antigravity artwork ids per instance', () => {
    const html = renderToStaticMarkup(createElement(AgentIcon, { agent: 'antigravity' }));
    expect(html).not.toContain('__UID__');
    expect(html).toMatch(/mask="url\(#antigravity-mask-[A-Za-z0-9]+\)"/);
  });

  it('is decorative without a title and labelled with one', () => {
    const plain = renderToStaticMarkup(createElement(AgentIcon, { agent: 'codex' }));
    const named = renderToStaticMarkup(
      createElement(AgentIcon, { agent: 'codex', title: 'Codex' }),
    );
    expect(plain).toContain('aria-hidden="true"');
    expect(named).toContain('role="img"');
    expect(named).toContain('aria-label="Codex"');
  });
});
