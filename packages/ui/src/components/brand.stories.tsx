import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';

import { MidniteLogo, Wordmark } from './brand';

const meta = {
  title: 'Brand/Wordmark',
  component: Wordmark,
  args: { product: 'UI', tone: 'rainbow', className: 'text-3xl' },
  argTypes: { tone: { control: 'inline-radio', options: ['rainbow', 'inherit'] } },
} satisfies Meta<typeof Wordmark>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  play: async ({ canvasElement }) => {
    // A real space between the halves, so the accessible text reads as two words.
    await expect(within(canvasElement).getByText('Midnite').parentElement).toHaveTextContent(
      'Midnite UI',
    );
  },
};

/** The sizes the sites set it at: nav, page title, hero. */
export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col items-start gap-6">
      <Wordmark {...args} className="text-base" />
      <Wordmark {...args} className="text-3xl" />
      <Wordmark {...args} className="text-6xl" />
    </div>
  ),
};

/** The crescent and the wordmark, as the title bar wears them. */
export const Logo: Story = {
  render: (args) => (
    <div className="flex flex-col items-start gap-6">
      <MidniteLogo product={args.product} />
      <MidniteLogo product={args.product} size={40} className="text-xl" />
      <MidniteLogo size={48} markOnly />
    </div>
  ),
};
