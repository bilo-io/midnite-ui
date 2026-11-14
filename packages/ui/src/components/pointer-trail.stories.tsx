import type { Meta, StoryObj } from '@storybook/react-vite';
import { PointerTrail, type PointerTrailVariant } from './pointer-trail';

const VARIANTS: readonly { variant: PointerTrailVariant; label: string; detail: string }[] = [
  { variant: 'trail', label: 'Trail', detail: 'Theme foreground text colour' },
  { variant: 'fluid', label: 'Fluid', detail: 'Animated primary gradient' },
  { variant: 'aurora', label: 'Aurora', detail: 'Rotating blue-violet-pink orb' },
  { variant: 'ring', label: 'Ring', detail: 'Precision dot + lagging ring' },
];

const meta = {
  title: 'Effects/PointerTrail',
  component: PointerTrail,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="flex min-h-[320px] items-center justify-center p-8 text-sm text-muted-foreground">
        Move and click the mouse to preview the pointer effect.
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PointerTrail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Trail: Story = {
  args: { variant: 'trail' },
};

export const Fluid: Story = {
  args: { variant: 'fluid' },
};

export const Aurora: Story = {
  args: { variant: 'aurora' },
};

export const Ring: Story = {
  args: { variant: 'ring' },
};

export const AllVariants: Story = {
  decorators: [],
  render: () => (
    <div className="grid gap-4 p-6 sm:grid-cols-2">
      {VARIANTS.map(({ variant, label, detail }) => (
        <div
          key={variant}
          className="relative flex h-40 flex-col justify-between overflow-hidden rounded-xl border border-border/60 bg-card p-4"
        >
          <PointerTrail variant={variant} contained />
          <div className="relative z-20 flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">{label}</span>
            <span className="font-mono text-xs text-muted-foreground">{variant}</span>
          </div>
          <p className="relative z-20 text-xs text-muted-foreground">{detail}</p>
        </div>
      ))}
    </div>
  ),
};

export const Themes: Story = {
  decorators: [],
  render: () => (
    <div className="grid gap-4 p-6 sm:grid-cols-2">
      <div
        className="relative flex h-40 flex-col justify-between overflow-hidden rounded-xl border p-4"
        style={{
          backgroundColor: 'hsl(0 0% 100%)',
          color: 'hsl(240 10% 3.9%)',
          borderColor: 'hsl(240 5.9% 90%)',
          ['--background' as string]: '0 0% 100%',
          ['--foreground' as string]: '240 10% 3.9%',
        }}
      >
        <PointerTrail variant="trail" contained />
        <span className="relative z-20 text-sm font-medium">Light theme (text ink)</span>
        <span className="relative z-20 font-mono text-xs opacity-70">--foreground: 240 10% 3.9%</span>
      </div>
      <div
        className="dark relative flex h-40 flex-col justify-between overflow-hidden rounded-xl border p-4"
        style={{
          backgroundColor: 'hsl(240 10% 3.9%)',
          color: 'hsl(0 0% 98%)',
          borderColor: 'hsl(240 3.7% 15.9%)',
          ['--background' as string]: '240 10% 3.9%',
          ['--foreground' as string]: '0 0% 98%',
        }}
      >
        <PointerTrail variant="trail" contained />
        <span className="relative z-20 text-sm font-medium">Dark theme (text ink)</span>
        <span className="relative z-20 font-mono text-xs opacity-70">--foreground: 0 0% 98%</span>
      </div>
    </div>
  ),
};
