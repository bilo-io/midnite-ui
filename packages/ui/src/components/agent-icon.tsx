import { useId, type SVGProps } from 'react';

import { cn } from '../lib/cn';
import { AGENT_ICON_DATA } from './agent-icons.generated';

export type AgentId = keyof typeof AGENT_ICON_DATA;

/** Every agent with a mark, in alphabetical order. */
export const AGENT_IDS = Object.keys(AGENT_ICON_DATA) as AgentId[];

/** The display name of an agent ("GitHub Copilot" for `copilot`). */
export const agentName = (id: AgentId): string => AGENT_ICON_DATA[id].name;

/** The brand colour of an agent, or `undefined` when it has no single one (monochrome brands, antigravity's multicolour art). */
export const agentColor = (id: AgentId): string | undefined =>
  'color' in AGENT_ICON_DATA[id] ? (AGENT_ICON_DATA[id] as { color: string }).color : undefined;

/**
 * Every file name (without `.svg`) published for an agent under `/agents/` —
 * `claude`, `claude-color`, `claude-white`, … — for a caller that links to the
 * file rather than rendering the component.
 */
export const agentFiles = (id: AgentId): readonly string[] => AGENT_ICON_DATA[id].files;

export type AgentIconVariant = 'color' | 'mono';

export type AgentIconProps = Omit<SVGProps<SVGSVGElement>, 'children'> & {
  agent: AgentId;
  /**
   * `color` (default) paints the brand colour, or the multi-colour artwork for
   * antigravity; `mono` paints with `currentColor`, so the mark takes the
   * surrounding text colour. Monochrome brands look the same either way.
   */
  variant?: AgentIconVariant;
  /** Accessible name. Omitted, the icon is decorative (`aria-hidden`). */
  title?: string;
};

/**
 * A coding agent's mark — Claude, Codex, Copilot, Cursor and the rest — rendered
 * from the same SVGs the sites publish at `/agents/`. The markup is generated
 * from `assets/agents/` by `scripts/agent-icons.mjs`, so the component and the
 * files cannot drift. Sized `h-4 w-4` by default; override via `className`.
 */
export function AgentIcon({
  agent,
  variant = 'color',
  title,
  className,
  ...props
}: AgentIconProps) {
  const data = AGENT_ICON_DATA[agent] as {
    name: string;
    color?: string;
    mono: string;
    art?: string;
  };
  // Ids inside an inline svg are document-global; scope the artwork's mask and
  // filter ids so two copies on one page do not resolve against each other.
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const art = variant === 'color' ? data.art : undefined;
  const markup = art ? art.replaceAll('__UID__', uid) : data.mono;
  const fill = art
    ? undefined
    : variant === 'color'
      ? (data.color ?? 'currentColor')
      : 'currentColor';

  return (
    <svg
      viewBox="0 0 24 24"
      fill={fill}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable={false}
      data-agent={agent}
      className={cn('h-4 w-4 shrink-0', className)}
      {...props}
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}
