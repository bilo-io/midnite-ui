import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';

import { ThemeToggle } from './theme-toggle';

const meta = {
  title: 'Components/ThemeToggle',
  component: ThemeToggle,
  decorators: [
    // The menu opens to the right of the trigger; keep it inside the frame.
    (Story) => (
      <div className="flex min-h-[16rem] items-end p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Backed by the real ThemeProvider from the global decorator — picking an option
 * actually flips the `dark` class on the preview document, which is the point.
 * (The toolbar "Theme" global re-seeds it on the next remount.)
 */
export const Default: Story = {};

/** Opening the menu and picking "Light" makes it the active (checked) choice. */
export const SelectLight: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Toggle theme' }));
    const menu = await canvas.findByRole('menu');
    await userEvent.click(within(menu).getByRole('menuitemradio', { name: 'Light' }));
    // Selecting closes the menu; reopen and confirm Light is now checked.
    await userEvent.click(canvas.getByRole('button', { name: 'Toggle theme' }));
    await expect(canvas.getByRole('menuitemradio', { name: 'Light' })).toBeChecked();
  },
};

/** Expanded, the trigger reads as a sidenav row: the selected option's icon and label. */
export const ExpandedShowsSelection: Story = {
  args: { expanded: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Toggle theme' });
    await userEvent.click(trigger);
    await userEvent.click(
      within(await canvas.findByRole('menu')).getByRole('menuitemradio', { name: 'Dark' }),
    );
    await expect(trigger).toHaveTextContent('Dark');
    await userEvent.click(trigger);
    await userEvent.click(
      within(await canvas.findByRole('menu')).getByRole('menuitemradio', { name: 'System' }),
    );
    await expect(trigger).toHaveTextContent('System');
  },
};
