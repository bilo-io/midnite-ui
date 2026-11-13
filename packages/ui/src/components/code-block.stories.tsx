import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';

import { CodeBlock } from './code-block';

const meta = {
  title: 'Reading/CodeBlock',
  component: CodeBlock,
  args: {
    language: 'tsx',
    code: `import { Button } from '@bilo-io/ui';\n\nexport const Save = () => <Button>Save</Button>;`,
  },
  argTypes: {
    language: {
      control: 'select',
      options: ['typescript', 'javascript', 'tsx', 'jsx', 'bash', 'html', 'xml', 'css', 'json'],
    },
  },
} satisfies Meta<typeof CodeBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Copy code' })).toBeInTheDocument();
  },
};

export const Bash: Story = { args: { language: 'bash', code: 'pnpm add @bilo-io/ui' } };

export const NoCopy: Story = {
  args: { language: 'json', code: '{ "name": "@bilo-io/ui" }', showCopy: false },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole('button')).toBeNull();
  },
};
