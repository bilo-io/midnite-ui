import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';

import { AGENT_IDS, AgentIcon, agentColor, agentFiles, agentName } from './agent-icon';

const meta = {
  title: 'Brand/AgentIcon',
  component: AgentIcon,
  args: { agent: 'claude', variant: 'color', className: 'h-10 w-10' },
  argTypes: {
    agent: { control: 'select', options: AGENT_IDS },
    variant: { control: 'inline-radio', options: ['color', 'mono'] },
  },
} satisfies Meta<typeof AgentIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Every agent, in both variants, with its brand colour. */
export const AllAgents: Story = {
  render: () => (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3">
      {AGENT_IDS.map((id) => (
        <div
          key={id}
          className="flex flex-col items-center gap-3 rounded-lg border border-border p-4 text-center"
        >
          <div className="flex items-center gap-4">
            <AgentIcon agent={id} className="h-8 w-8" title={agentName(id)} />
            <AgentIcon agent={id} variant="mono" className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="text-sm font-medium">{agentName(id)}</div>
          <div className="font-mono text-[11px] text-muted-foreground">
            {agentColor(id) ?? (id === 'antigravity' ? 'multicolour' : 'monochrome')}
          </div>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole('img')).toHaveLength(AGENT_IDS.length);
  },
};

/** The published files, served from /agents/ next to Storybook and the sites. */
export const Files: Story = {
  render: () => (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3">
      {AGENT_IDS.flatMap((id) => agentFiles(id)).map((file) => (
        <figure
          key={file}
          className={`flex flex-col items-center gap-2 rounded-lg border border-border p-3 ${
            /-white$/.test(file) || file === 'grok-color' ? 'bg-zinc-900' : 'bg-white'
          }`}
        >
          <img src={`agents/${file}.svg`} alt={file} className="h-8 w-8" />
          <figcaption
            className={`font-mono text-[10px] ${
              /-white$/.test(file) || file === 'grok-color' ? 'text-zinc-300' : 'text-zinc-600'
            }`}
          >
            {file}.svg
          </figcaption>
        </figure>
      ))}
    </div>
  ),
};
