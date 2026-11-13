import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';

import { BROWSER_IDS, BrowserIcon, browserColor, browserName } from './browser-icon';

const meta = {
  title: 'Brand/BrowserIcon',
  component: BrowserIcon,
  args: { browser: 'chrome', className: 'h-10 w-10' },
  argTypes: { browser: { control: 'select', options: BROWSER_IDS } },
} satisfies Meta<typeof BrowserIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Every browser with its brand colour. Two of each render side by side to prove ids are scoped. */
export const AllBrowsers: Story = {
  render: () => (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3">
      {BROWSER_IDS.map((id) => (
        <div
          key={id}
          className="flex flex-col items-center gap-3 rounded-lg border border-border p-4 text-center"
        >
          <div className="flex items-center gap-4">
            <BrowserIcon browser={id} className="h-10 w-10" title={browserName(id)} />
            <BrowserIcon browser={id} className="h-6 w-6" />
          </div>
          <div className="text-sm font-medium">{browserName(id)}</div>
          <div className="font-mono text-[11px] text-muted-foreground">{browserColor(id)}</div>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole('img')).toHaveLength(BROWSER_IDS.length);
    const ids = [...canvasElement.querySelectorAll('[id]')].map((el) => el.id);
    await expect(new Set(ids).size).toBe(ids.length);
  },
};

/** The published files, served from /browsers/ next to Storybook and the sites. */
export const Files: Story = {
  render: () => (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3">
      {BROWSER_IDS.map((id) => (
        <figure
          key={id}
          className="flex flex-col items-center gap-2 rounded-lg border border-border bg-white p-3"
        >
          <img src={`browsers/${id}.svg`} alt={browserName(id)} className="h-8 w-8" />
          <figcaption className="font-mono text-[10px] text-zinc-600">{id}.svg</figcaption>
        </figure>
      ))}
    </div>
  ),
};
