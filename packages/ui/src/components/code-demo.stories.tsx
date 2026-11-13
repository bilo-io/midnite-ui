import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';

import { Button } from './button';
import { CodeDemo } from './code-demo';

const meta = {
  title: 'Reading/CodeDemo',
  component: CodeDemo,
  args: {
    title: 'Outline button',
    description: 'Preview and source side by side in one card.',
    code: '<Button variant="outline">Click me</Button>',
    children: <Button variant="outline">Click me</Button>,
  },
  argTypes: {
    layout: { control: 'inline-radio', options: ['tabs', 'stacked'] },
    defaultView: { control: 'inline-radio', options: ['preview', 'code'] },
  },
} satisfies Meta<typeof CodeDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Tabs: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('tab', { name: 'Code' }));
    await expect(canvas.getByRole('button', { name: 'Copy code' })).toBeInTheDocument();
  },
};

export const Stacked: Story = {
  args: { layout: 'stacked' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole('button', { name: 'Code' });
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  },
};
