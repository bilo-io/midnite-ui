import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';

import { Slider } from './slider';

const meta = {
  title: 'Primitives/Slider',
  component: Slider,
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

// Spectra in the shape Midnite Studio's loops wear: five stops, left to right.
const SUNSET = ['#f43f5e', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];
const OCEAN = ['#0ea5e9', '#06b6d4', '#14b8a6', '#22c55e', '#84cc16'];
const EMBER = ['#7c2d12', '#c2410c', '#f97316', '#fbbf24', '#fde68a'];

/** Controlled, labelled — Tab to it, then arrow keys step it. */
export const Interactive: Story = {
  render: () => {
    const [v, setV] = useState(30);
    return (
      <div className="w-72">
        <Slider
          label="Auto-rotate subagents"
          min={10}
          max={100}
          step={5}
          value={v}
          onValueChange={setV}
          gradient={SUNSET}
          aria-valuetext={`${v}% context`}
        />
      </div>
    );
  },
  // Keyboard reach: Tab lands on the native range input, whose arrow/Home/End/
  // Page stepping is the browser's own (synthetic key events are untrusted, so
  // they cannot drive it from here — the native element is the guarantee).
  play: async ({ canvasElement }) => {
    const slider = within(canvasElement).getByRole('slider') as HTMLInputElement;
    await expect(slider.value).toBe('30');
    await expect(slider.type).toBe('range');
    await expect(slider.step).toBe('5');
    await userEvent.tab();
    await expect(slider).toHaveFocus();
  },
};

/** No gradient: the primary token. */
export const Default: Story = {
  render: () => (
    <div className="w-72">
      <Slider aria-label="Volume" defaultValue={40} />
    </div>
  ),
};

/** Colour-stop spectra and a raw CSS gradient string. */
export const Gradients: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-4">
      <Slider label="Sunset" defaultValue={70} gradient={SUNSET} />
      <Slider label="Ocean" defaultValue={45} gradient={OCEAN} />
      <Slider label="Ember" defaultValue={85} gradient={EMBER} />
      <Slider
        label="CSS string"
        defaultValue={60}
        gradient="linear-gradient(90deg, hsl(280 90% 60%), hsl(330 90% 60%))"
      />
    </div>
  ),
};

/** Disabled dims the control and blocks input. */
export const Disabled: Story = {
  render: () => (
    <div className="w-72">
      <Slider label="Locked" defaultValue={50} gradient={OCEAN} disabled />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('slider')).toBeDisabled();
  },
};
