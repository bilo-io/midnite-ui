// The showcase's table of contents: one entry per component page, in the order
// the sidebar lists them. The live examples are NOT here — they are the files
// under ./examples/<id>/, discovered by ./examples.ts, so adding a demo is adding
// a file. catalog.test.ts holds the two in step.

export type Category =
  | 'Actions & forms'
  | 'Layout & surfaces'
  | 'Data display'
  | 'Backdrops'
  | 'Security'
  | 'Theming'
  | 'Brand'
  | 'Icons'
  | 'Reading';

export const CATEGORIES: readonly Category[] = [
  'Actions & forms',
  'Layout & surfaces',
  'Data display',
  'Backdrops',
  'Security',
  'Theming',
  'Brand',
  'Icons',
  'Reading',
];

export type PropDoc = {
  name: string;
  type: string;
  default?: string;
  description: string;
};

export type ComponentDoc = {
  /** Route segment and the examples folder name. */
  id: string;
  name: string;
  category: Category;
  description: string;
  /** The named exports a consumer imports for this page. */
  exports: string[];
  /** Extra search terms that are not in the name or description. */
  keywords: string[];
  props: PropDoc[];
  /** Its demo needs a wide stage, so the overview card shrinks it further. */
  wide?: boolean;
};

export const COMPONENTS: readonly ComponentDoc[] = [
  {
    id: 'button',
    name: 'Button',
    category: 'Actions & forms',
    description:
      'The primary action primitive, with five variants and four sizes. Forwards its ref and every native button prop.',
    exports: ['Button', 'buttonVariants'],
    keywords: ['cta', 'action', 'click', 'icon button', 'cva'],
    props: [
      {
        name: 'variant',
        type: "'default' | 'secondary' | 'outline' | 'ghost' | 'destructive'",
        default: "'default'",
        description: 'Visual weight of the button.',
      },
      {
        name: 'size',
        type: "'default' | 'sm' | 'lg' | 'icon'",
        default: "'default'",
        description: 'Height and padding. `icon` is square; give it an aria-label.',
      },
      {
        name: '...props',
        type: 'ButtonHTMLAttributes',
        description: 'Any native button attribute, including `disabled` and `onClick`.',
      },
    ],
  },
  {
    id: 'input',
    name: 'Input',
    category: 'Actions & forms',
    description:
      'A single-line text field on the design tokens. Forwards its ref; give every field an accessible name.',
    exports: ['Input'],
    keywords: ['text field', 'form', 'textbox'],
    props: [
      { name: '...props', type: 'InputHTMLAttributes', description: 'Any native input attribute.' },
    ],
  },
  {
    id: 'textarea',
    name: 'Textarea',
    category: 'Actions & forms',
    description: 'A multi-line text field matching Input.',
    exports: ['Textarea'],
    keywords: ['multiline', 'form', 'textbox'],
    props: [
      {
        name: '...props',
        type: 'TextareaHTMLAttributes',
        description: 'Any native textarea attribute.',
      },
    ],
  },
  {
    id: 'select',
    name: 'Select',
    category: 'Actions & forms',
    description:
      'A controlled, typed single-select. The listbox renders in a portal, so it is never clipped by a scrolling parent.',
    exports: ['Select', 'SelectOption'],
    keywords: ['dropdown', 'listbox', 'picker', 'menu'],
    props: [
      {
        name: 'options',
        type: 'SelectOption<T>[]',
        description: 'The `{ value, label }` choices.',
      },
      { name: 'value', type: 'T', description: 'The selected value.' },
      {
        name: 'onChange',
        type: '(value: T) => void',
        description: 'Called with the picked value.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        description: 'Blocks opening the menu.',
      },
    ],
  },
  {
    id: 'styled-select',
    name: 'StyledSelect',
    category: 'Actions & forms',
    description:
      'A react-select single-select re-skinned with the design tokens, for when the list needs search. ModelComboSelect builds on it.',
    exports: ['StyledSelect', 'ModelComboSelect'],
    keywords: ['react-select', 'combobox', 'searchable', 'autocomplete', 'dropdown'],
    props: [
      {
        name: 'options',
        type: 'SelectOption<T>[]',
        description: 'The `{ value, label }` choices.',
      },
      { name: 'value', type: 'T', description: 'The selected value.' },
      {
        name: 'onChange',
        type: '(value: T) => void',
        description: 'Called with the picked value.',
      },
      {
        name: 'isSearchable',
        type: 'boolean',
        default: 'false',
        description: 'Lets the user type to filter.',
      },
    ],
  },
  {
    id: 'slider',
    name: 'Slider',
    category: 'Actions & forms',
    description:
      'A range slider over a native `<input type="range">`, so arrows, Home/End and Page keys work natively. An optional gradient paints the filled track and the knob; the rest of the track stays neutral.',
    exports: ['Slider', 'sliderPaint', 'sliderValue'],
    keywords: ['range', 'gradient', 'spectrum', 'volume', 'percent', 'knob'],
    props: [
      {
        name: 'value',
        type: 'number',
        description: 'Controlled value. Omit it (and pass `defaultValue`) for uncontrolled.',
      },
      { name: 'defaultValue', type: 'number', default: 'min', description: 'Uncontrolled start.' },
      { name: 'min', type: 'number', default: '0', description: 'Lowest value.' },
      { name: 'max', type: 'number', default: '100', description: 'Highest value.' },
      { name: 'step', type: 'number', default: '1', description: 'Keyboard and drag increment.' },
      {
        name: 'onValueChange',
        type: '(value: number) => void',
        description: 'Called with the next value as a number.',
      },
      {
        name: 'gradient',
        type: 'string | string[]',
        default: 'primary token',
        description:
          'A CSS background (`linear-gradient(…)` or a colour), or colour stops joined left to right. Paints the fill and the knob; the focus ring takes the middle stop.',
      },
      {
        name: 'label',
        type: 'ReactNode',
        description: 'Visible label wired to the input. Otherwise pass `aria-label`.',
      },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Locks and dims it.' },
      {
        name: '...props',
        type: 'InputHTMLAttributes',
        description:
          'Any other native input attribute (`aria-valuetext`, `name`, …). `className` and `style` go on the wrapper.',
      },
    ],
  },
  {
    id: 'switch',
    name: 'Switch',
    category: 'Actions & forms',
    description:
      'A controlled on/off toggle with `role="switch"`. It is a native button, so Space toggles it.',
    exports: ['Switch'],
    keywords: ['toggle', 'checkbox', 'setting', 'boolean'],
    props: [
      { name: 'checked', type: 'boolean', description: 'Current state.' },
      {
        name: 'onCheckedChange',
        type: '(checked: boolean) => void',
        description: 'Called with the next state.',
      },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Locks the switch.' },
    ],
  },
  {
    id: 'tabs',
    name: 'Tabs',
    category: 'Actions & forms',
    description:
      'A controlled segmented control implementing the WAI-ARIA tabs keyboard pattern: one tab stop, arrows to move, Home and End to jump.',
    exports: ['Tabs', 'TabOption'],
    keywords: ['segmented control', 'tablist', 'toggle group', 'switcher'],
    props: [
      {
        name: 'options',
        type: 'TabOption<T>[]',
        description: '`{ value, label, icon? }` per tab.',
      },
      { name: 'value', type: 'T', description: 'The active tab.' },
      {
        name: 'onChange',
        type: '(value: T) => void',
        description: 'Called when a tab is activated.',
      },
      { name: 'ariaLabel', type: 'string', description: 'Accessible name of the tablist.' },
    ],
  },
  {
    id: 'accordion',
    name: 'Accordion',
    category: 'Layout & surfaces',
    description:
      'A titled disclosure section with an optional count and trailing action. Uncontrolled; the trigger carries aria-expanded and aria-controls.',
    exports: ['Accordion'],
    keywords: ['disclosure', 'expand', 'section', 'details'],
    props: [
      { name: 'title', type: 'string', description: 'Section heading.' },
      { name: 'count', type: 'number', description: 'A badge after the title.' },
      { name: 'icon', type: 'ReactNode', description: 'Leading glyph.' },
      { name: 'action', type: 'ReactNode', description: 'Trailing control, outside the trigger.' },
      { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Initial state.' },
      {
        name: 'variant',
        type: "'card' | 'bare'",
        default: "'card'",
        description: 'With or without the card surface.',
      },
    ],
  },
  {
    id: 'collapse',
    name: 'Collapse',
    category: 'Layout & surfaces',
    description:
      'A controlled height animation for any content, done with a CSS grid track rather than measured heights.',
    exports: ['Collapse'],
    keywords: ['animate', 'expand', 'reveal', 'height'],
    props: [
      { name: 'open', type: 'boolean', description: 'Expanded or collapsed.' },
      { name: 'children', type: 'ReactNode', description: 'The content to reveal.' },
    ],
  },
  {
    id: 'card',
    name: 'Card',
    category: 'Layout & surfaces',
    description: 'The bordered surface, with header, title and content parts for composition.',
    exports: ['Card', 'CardHeader', 'CardTitle', 'CardContent'],
    keywords: ['panel', 'surface', 'container', 'box'],
    props: [
      {
        name: '...props',
        type: 'HTMLAttributes<HTMLDivElement>',
        description: 'Each part is a div that forwards its props and className.',
      },
    ],
  },
  {
    id: 'rail-shell',
    wide: true,
    name: 'RailShell',
    category: 'Layout & surfaces',
    description:
      'A three-column layout with collapsible left and right rails. It owns no state; the toggles live in the content layer.',
    exports: ['RailShell', 'RailFloatingToggle', 'RailHeaderToggle', 'RailConfig'],
    keywords: ['sidebar', 'layout', 'panels', 'columns', 'drawer'],
    props: [
      {
        name: 'left',
        type: 'RailConfig',
        description: '`{ title, icon?, open, onToggle, content }` for the left rail.',
      },
      { name: 'right', type: 'RailConfig', description: 'The same for the right rail.' },
      {
        name: 'isMobile',
        type: 'boolean',
        description: 'Mobile layout; also drops the floating rail toggles.',
      },
      { name: 'children', type: 'ReactNode', description: 'The centre column.' },
    ],
  },
  {
    id: 'gradient-glow',
    wide: true,
    name: 'GradientGlow',
    category: 'Layout & surfaces',
    description:
      'An animated gradient border around any element, lit on focus, on hover, or always.',
    exports: ['GradientGlow'],
    keywords: ['border', 'highlight', 'focus ring', 'animated', 'composer'],
    props: [
      {
        name: 'trigger',
        type: "'focus' | 'hover' | 'always'",
        default: "'focus'",
        description: 'When the glow shows.',
      },
      { name: 'className', type: 'string', description: 'Match the child’s border radius here.' },
    ],
  },
  {
    id: 'area-chart',
    name: 'AreaChart',
    category: 'Data display',
    description:
      'A lightweight SVG area chart for 0–100 series, coloured by token. LegendDot labels a series.',
    exports: ['AreaChart', 'LegendDot', 'ChartSeries'],
    keywords: ['graph', 'sparkline', 'chart', 'time series', 'monitor'],
    props: [
      {
        name: 'series',
        type: 'ChartSeries[]',
        description: '`{ data: number[], hueVar }`; the first series paints on top.',
      },
      { name: 'className', type: 'string', description: 'Size it; the aspect ratio is kept.' },
    ],
  },
  {
    id: 'metric-dial',
    name: 'MetricDial',
    category: 'Data display',
    description:
      'A ring dial for a single percentage with a label and optional sublabel. Input is clamped to 0–100.',
    exports: ['MetricDial'],
    keywords: ['gauge', 'percentage', 'cpu', 'ram', 'gpu', 'progress'],
    props: [
      { name: 'pct', type: 'number', description: 'The value, 0–100.' },
      { name: 'label', type: 'string', description: 'What is measured.' },
      { name: 'hueVar', type: 'string', description: 'A colour token name, e.g. `--status-wip`.' },
      { name: 'sublabel', type: 'string', description: 'Supporting line under the dial.' },
    ],
  },
  {
    id: 'radial-gauge',
    name: 'RadialGauge',
    category: 'Data display',
    description:
      'A storage gauge: used against total bytes, with formatted figures and an accessible label.',
    exports: ['RadialGauge'],
    keywords: ['disk', 'storage', 'bytes', 'usage', 'progress'],
    props: [
      { name: 'usedBytes', type: 'number', description: 'Bytes used.' },
      { name: 'totalBytes', type: 'number', description: 'Capacity.' },
      {
        name: 'labels',
        type: 'RadialGaugeLabels',
        description: 'Overrides for every visible and spoken string.',
      },
    ],
  },
  {
    id: 'context-ring',
    name: 'ContextRing',
    category: 'Data display',
    description:
      'A compact token-usage ring that turns from green to amber to red as a context window fills. Hover for the figures.',
    exports: ['ContextRing'],
    keywords: ['tokens', 'llm', 'context window', 'usage', 'progress'],
    props: [
      { name: 'tokens', type: 'number', description: 'Tokens used.' },
      { name: 'limit', type: 'number', description: 'Window size.' },
      { name: 'labels', type: 'ContextRingLabels', description: 'Aria and tooltip copy.' },
    ],
  },
  {
    id: 'dynamic-background',
    wide: true,
    name: 'DynamicBackground',
    category: 'Backdrops',
    description:
      'A pointer-reactive canvas backdrop with eleven patterns. Decorative and aria-hidden; it fills its positioned parent.',
    exports: ['DynamicBackground', 'BackgroundPattern'],
    keywords: ['canvas', 'animation', 'aurora', 'grid', 'dots', 'waves', 'pattern'],
    props: [
      {
        name: 'pattern',
        type: 'BackgroundPattern',
        description:
          'One of `starfield`, `grid`, `gradient`, `dots`, `topographic`, `aurora`, `plus-cross`, `waves`, `grain`, `blueprint`, `mesh-gradient` or `none`.',
      },
    ],
  },
  {
    id: 'neuro-cloud-background',
    wide: true,
    name: 'NeuroCloudBackground',
    category: 'Backdrops',
    description:
      'The animated neural starfield behind the lock screen. Fills its positioned parent.',
    exports: ['NeuroCloudBackground'],
    keywords: ['starfield', 'canvas', 'animation', 'lock screen', 'particles'],
    props: [
      {
        name: 'animate',
        type: 'boolean',
        description: 'Run the animation loop, or draw one still frame.',
      },
    ],
  },
  {
    id: 'passcode-pad',
    name: 'PasscodePad',
    category: 'Security',
    description:
      'A four-digit passcode entry, for unlocking or for setting a new code with confirmation. Dialog wrappers ship alongside it.',
    exports: ['PasscodePad', 'PasscodeSetupDialog', 'PasscodeUnlockDialog', 'PASSCODE_LENGTH'],
    keywords: ['pin', 'lock', 'unlock', 'password', 'otp'],
    props: [
      {
        name: 'mode',
        type: "'set' | 'unlock'",
        description: 'Unlock against `expected`, or choose and confirm a new code.',
      },
      { name: 'expected', type: 'string', description: 'The code to match in unlock mode.' },
      {
        name: 'onSuccess',
        type: '(code: string) => void',
        description: 'Called with the accepted code.',
      },
      { name: 'onCancel', type: '() => void', description: 'Shows a cancel action when set.' },
      {
        name: 'labels',
        type: 'Partial<PasscodePadLabels>',
        description: 'Overrides for every string.',
      },
    ],
  },
  {
    id: 'theme-toggle',
    name: 'ThemeToggle',
    category: 'Theming',
    description:
      'A menu for light, dark, system and time-of-day themes, backed by the ThemeProvider from `@bilo-io/ui/theme`.',
    exports: ['ThemeToggle'],
    keywords: ['dark mode', 'light mode', 'theme', 'appearance'],
    props: [
      {
        name: 'expanded',
        type: 'boolean',
        default: 'false',
        description: 'A labelled trigger instead of the icon-only one.',
      },
      { name: 'labels', type: 'ThemeToggleLabels', description: 'Overrides for every string.' },
    ],
  },
  {
    id: 'wordmark',
    name: 'Wordmark',
    category: 'Brand',
    description:
      'The midnite wordmark and crescent, as the website wears them: "Midnite" in the Damion brand face with the rainbow ramp, the product name in the UI face. Import `@bilo-io/ui/brand.css` once.',
    exports: ['Wordmark', 'MidniteLogo'],
    keywords: ['brand', 'logo', 'crescent', 'damion', 'rainbow', 'gradient', 'title', 'midnite'],
    props: [
      {
        name: 'product',
        type: 'string',
        description: 'The second half: "UI", "Studio". Omit for "Midnite" alone.',
      },
      {
        name: 'tone',
        type: "'rainbow' | 'inherit'",
        default: "'rainbow'",
        description: 'Rainbow ramp and glow, or inherit the parent paint.',
      },
      {
        name: 'size',
        type: 'number',
        default: '28',
        description: 'MidniteLogo only: the crescent in px.',
      },
      {
        name: 'markOnly',
        type: 'boolean',
        default: 'false',
        description: 'MidniteLogo only: the crescent without the wordmark.',
      },
    ],
  },
  {
    id: 'agent-icon',
    wide: true,
    name: 'Agent icon',
    category: 'Icons',
    description:
      'The marks of every coding agent (Claude, Codex, Copilot, Cursor, Gemini and ten more), generated from the SVG files published at `/agents/`. Brand colour or `currentColor`.',
    exports: ['AgentIcon', 'AGENT_IDS', 'agentName', 'agentColor', 'agentFiles'],
    keywords: [
      'agent',
      'ai',
      'logo',
      'claude',
      'codex',
      'copilot',
      'cursor',
      'gemini',
      'grok',
      'svg',
    ],
    props: [
      { name: 'agent', type: 'AgentId', description: 'One of `AGENT_IDS`.' },
      {
        name: 'variant',
        type: "'color' | 'mono'",
        default: "'color'",
        description: 'Brand colour, or `currentColor`.',
      },
      {
        name: 'title',
        type: 'string',
        description: 'Accessible name; omitted, the icon is decorative.',
      },
    ],
  },
  {
    id: 'brand-icons',
    name: 'Brand icons',
    category: 'Icons',
    description: 'Inline SVG marks for services an app commonly links to. Each takes any SVG prop.',
    exports: ['GithubIcon', 'SlackIcon', 'DiscordIcon', 'GoogleIcon', 'LinearIcon'],
    keywords: ['logo', 'svg', 'github', 'slack', 'discord', 'google', 'linear'],
    props: [
      {
        name: '...props',
        type: 'SVGProps<SVGSVGElement>',
        description: 'Size with className; colour follows currentColor where the mark allows.',
      },
    ],
  },
  {
    id: 'prose',
    wide: true,
    name: 'Prose',
    category: 'Reading',
    description:
      'The shared reading typography. Hand `proseComponents` to MDX or react-markdown; ReadingLayout and TableOfContents build on it.',
    exports: ['Prose', 'proseComponents', 'ReadingLayout', 'TableOfContents'],
    keywords: ['typography', 'markdown', 'mdx', 'article', 'docs', 'toc'],
    props: [
      { name: 'children', type: 'ReactNode', description: 'Content built from the element map.' },
    ],
  },
];

export function findComponent(id: string): ComponentDoc | undefined {
  return COMPONENTS.find((c) => c.id === id);
}
