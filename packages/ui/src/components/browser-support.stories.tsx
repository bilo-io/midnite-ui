import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, within } from 'storybook/test';

import { BrowserSupport, BrowserSupportList } from './browser-support';

const IE11 = 'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko';
const OLD_CHROME =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.0.0 Safari/537.36';
const NEW_CHROME =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

const supported = {
  chrome: '90',
  edge: '90',
  firefox: '88',
  safari: '14.1',
  opera: '76',
};

const meta = {
  title: 'Components/BrowserSupport',
  component: BrowserSupport,
  args: { supported, userAgent: IE11, onCheck: fn() },
} satisfies Meta<typeof BrowserSupport>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The browser is not on the list. */
export const NotListed: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('alert')).toHaveTextContent(
      'Internet Explorer 11.0 is not supported',
    );
    await expect(canvas.getAllByRole('link')).toHaveLength(5);
    await expect(args.onCheck).toHaveBeenCalledTimes(1);
  },
};

/** Listed, but below its minimum version. */
export const Outdated: Story = {
  args: { userAgent: OLD_CHROME },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('alert')).toHaveTextContent(
      'Version 90 or newer is needed',
    );
  },
};

/** A supported browser renders nothing unless `showWhenSupported` is set. */
export const SupportedHidden: Story = {
  args: { userAgent: NEW_CHROME },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('[role="alert"], [role="status"]')).toBeNull();
  },
};

export const SupportedShown: Story = {
  args: { userAgent: NEW_CHROME, showWhenSupported: true },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('status')).toHaveTextContent('is supported');
  },
};

/** `children` replace the body; a function receives the result. */
export const RenderProp: Story = {
  args: {
    children: (result) => (
      <p>
        {result.browser.name} {result.browser.version}: {result.reason}
      </p>
    ),
  },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('alert')).toHaveTextContent('not-listed');
  },
};

export const List: StoryObj<typeof BrowserSupportList> = {
  render: () => <BrowserSupportList supported={supported} />,
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getAllByRole('link')).toHaveLength(5);
  },
};
