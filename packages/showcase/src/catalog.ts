import type { Mode } from './router';

// The showcase's table of contents: one entry per component page, in the order
// the sidebar lists them. The live examples are NOT here — they are the files
// under ./examples/<id>/, discovered by ./examples.ts, so adding a demo is adding
// a file. catalog.test.ts holds the two in step.
//
// Two catalogs, one per platform: COMPONENTS is @bilo-io/ui (the Web / Desktop
// showcase), NATIVE_COMPONENTS is @bilo-io/ui-native (the Mobile one, examples
// under ./examples/native-<id>/). Ids repeat across them on purpose, so the
// platform toggle can keep you on the same component.

export type Category =
  | 'Actions & forms'
  | 'Layout & surfaces'
  | 'Data display'
  | 'Backdrops'
  | 'Security'
  | 'Theming'
  | 'Brand'
  | 'Icons'
  | 'Reading'
  | 'Midnite Mobile UI';

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

/** The Mobile showcase lists every React Native component under one heading. */
export const NATIVE_CATEGORY = 'Midnite Mobile UI' satisfies Category;
export const NATIVE_CATEGORIES: readonly Category[] = [NATIVE_CATEGORY];

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
        description:
          'A sidenav row showing the selected option (icon and label) instead of the icon-only trigger.',
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
    id: 'browser-icon',
    wide: true,
    name: 'Browser icon',
    category: 'Icons',
    description:
      'The logos of nine browsers (Chrome, Firefox, Safari, Edge, Opera, Brave, Samsung Internet, Vivaldi, Internet Explorer), generated from the SVG files published at `/browsers/`. Gradient ids are scoped per instance.',
    exports: ['BrowserIcon', 'BROWSER_IDS', 'browserName', 'browserColor', 'browserDownloadUrl'],
    keywords: ['browser', 'logo', 'chrome', 'firefox', 'safari', 'edge', 'opera', 'brave', 'svg'],
    props: [
      { name: 'browser', type: 'BrowserId', description: 'One of `BROWSER_IDS`.' },
      {
        name: 'title',
        type: 'string',
        description: 'Accessible name; omitted, the icon is decorative.',
      },
    ],
  },
  {
    id: 'browser-support',
    name: 'Browser support',
    category: 'Layout & surfaces',
    description:
      'A warning callout shown only when the visitor\'s browser is missing from a supported list or older than its minimum version. SSR-safe, dependency-free, with the detection exported as pure functions.',
    exports: [
      'BrowserSupport',
      'BrowserSupportList',
      'useBrowserSupport',
      'detectBrowser',
      'checkBrowserSupport',
      'compareVersions',
    ],
    keywords: ['browser', 'compatibility', 'user agent', 'outdated', 'upgrade', 'warning', 'detect'],
    props: [
      {
        name: 'supported',
        type: 'Partial<Record<BrowserId, string>>',
        description: 'Minimum version per browser; unlisted browsers are unsupported.',
      },
      {
        name: 'onCheck',
        type: '(result: BrowserSupportResult) => void',
        description: 'Called once each time the result changes.',
      },
      {
        name: 'userAgent',
        type: 'string',
        description: 'Check this string instead of `navigator.userAgent`.',
      },
      {
        name: 'showWhenSupported',
        type: 'boolean',
        default: 'false',
        description: 'Render a status callout even when the browser is supported.',
      },
      {
        name: 'children',
        type: 'ReactNode | ((result) => ReactNode)',
        description: 'Replaces the default body.',
      },
      {
        name: 'labels',
        type: 'BrowserSupportLabels',
        description: 'Copy overrides; message entries are functions for interpolation.',
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
  {
    id: 'code-block',
    name: 'CodeBlock',
    category: 'Reading',
    description:
      'Syntax-highlighted source on the shared highlight.js palette, with a copy button. Grammars are registered individually, so the bundle stays small.',
    exports: ['CodeBlock', 'CopyButton'],
    keywords: ['code', 'syntax', 'highlight', 'snippet', 'pre', 'copy'],
    props: [
      { name: 'code', type: 'string', description: 'The source to show.' },
      {
        name: 'language',
        type: "'typescript' | 'javascript' | 'tsx' | 'jsx' | 'bash' | 'html' | 'xml' | 'css' | 'json'",
        default: "'typescript'",
        description: '`tsx`, `jsx` and `html` alias the typescript, javascript and xml grammars.',
      },
      { name: 'showCopy', type: 'boolean', default: 'true', description: 'Show the copy button.' },
      {
        name: 'labels',
        type: '{ copy?: string; copied?: string }',
        description: 'Accessible names for the copy button, for translation.',
      },
      { name: 'className', type: 'string', description: 'Classes for the wrapper.' },
    ],
  },
  {
    id: 'code-demo',
    name: 'CodeDemo',
    category: 'Reading',
    description:
      'A live demo with its source. Tabs swap preview and code; the stacked layout keeps the preview and collapses the code beneath it. Pass the source as a string, ideally a `?raw` import of the demo file.',
    exports: ['CodeDemo'],
    keywords: ['example', 'playground', 'preview', 'source', 'docs', 'snippet'],
    props: [
      { name: 'code', type: 'string', description: 'The source shown in the code panel.' },
      { name: 'children', type: 'ReactNode', description: 'The live demo.' },
      { name: 'title', type: 'string', description: 'Heading; also names the view tabs.' },
      { name: 'description', type: 'ReactNode', description: 'Supporting text under the title.' },
      {
        name: 'language',
        type: 'CodeLanguage',
        default: "'tsx'",
        description: 'Grammar for the code panel.',
      },
      {
        name: 'layout',
        type: "'tabs' | 'stacked'",
        default: "'tabs'",
        description: 'Preview/Code tabs, or the preview with a collapsible code panel.',
      },
      {
        name: 'defaultView',
        type: "'preview' | 'code'",
        default: "'preview'",
        description: 'Initial view when uncontrolled.',
      },
      {
        name: 'view / onViewChange',
        type: "'preview' | 'code'",
        description: 'Controlled view.',
      },
      {
        name: 'labels',
        type: '{ preview?, code?, copy?, copied? }',
        description: 'User-visible copy, for translation.',
      },
      {
        name: 'previewClassName',
        type: 'string',
        description: 'Classes for the preview surface.',
      },
    ],
  },
];

const RN_KEYWORDS = ['react native', 'mobile', 'ios', 'android', 'native'];

export const NATIVE_COMPONENTS: readonly ComponentDoc[] = [
  {
    id: 'button',
    name: 'Button',
    category: NATIVE_CATEGORY,
    description:
      'The primary action as a `Pressable`, with the web Button’s five variants and four sizes on the same tokens. `loading` covers the label with a spinner and reports busy.',
    exports: ['Button'],
    keywords: ['cta', 'action', 'press', 'pressable', 'spinner', ...RN_KEYWORDS],
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
        description:
          'Height and padding in dp (36, 32, 40; `icon` is 36×36). Label an icon button.',
      },
      {
        name: 'children',
        type: 'ReactNode',
        description: 'A string is set in the label style; anything else renders as given.',
      },
      {
        name: 'loading',
        type: 'boolean',
        default: 'false',
        description:
          'Hides the content under an `ActivityIndicator` (the width holds), blocks presses, sets `busy`.',
      },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Blocks presses.' },
      { name: 'textStyle', type: 'StyleProp<TextStyle>', description: 'Extra label style.' },
      {
        name: '...props',
        type: 'PressableProps',
        description: 'Any `Pressable` prop: `onPress`, `accessibilityLabel`, `hitSlop`, …',
      },
    ],
  },
  {
    id: 'input',
    name: 'Input',
    category: NATIVE_CATEGORY,
    description:
      'A single-line `TextInput` on the field tokens, with the ring colour on focus. `label` draws a visible label and names the field.',
    exports: ['Input'],
    keywords: ['text field', 'form', 'textinput', 'keyboard', ...RN_KEYWORDS],
    props: [
      {
        name: 'label',
        type: 'string',
        description: 'Visible label; also the accessible name unless `accessibilityLabel` is set.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        description: 'Read-only, dimmed and reported disabled.',
      },
      {
        name: '...props',
        type: 'TextInputProps',
        description: 'Any `TextInput` prop: `value`, `onChangeText`, `keyboardType`, …',
      },
    ],
  },
  {
    id: 'textarea',
    name: 'Textarea',
    category: NATIVE_CATEGORY,
    description: 'A multi-line field matching Input: at least 80dp tall, text from the top.',
    exports: ['Textarea'],
    keywords: ['multiline', 'form', 'textinput', ...RN_KEYWORDS],
    props: [
      { name: 'numberOfLines', type: 'number', default: '4', description: 'Initial rows.' },
      { name: 'label', type: 'string', description: 'As on Input.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'As on Input.' },
      { name: '...props', type: 'TextInputProps', description: 'Any `TextInput` prop.' },
    ],
  },
  {
    id: 'switch',
    name: 'Switch',
    category: NATIVE_CATEGORY,
    description:
      'A controlled on/off toggle with the switch role and an animated thumb, drawn like the web Switch rather than the platform control.',
    exports: ['Switch'],
    keywords: ['toggle', 'setting', 'boolean', ...RN_KEYWORDS],
    props: [
      { name: 'checked', type: 'boolean', description: 'Current state.' },
      {
        name: 'onCheckedChange',
        type: '(checked: boolean) => void',
        description: 'Called with the next state.',
      },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Locks the switch.' },
      {
        name: 'accessibilityLabel',
        type: 'string',
        description: 'Name it when no visible text does.',
      },
    ],
  },
  {
    id: 'tabs',
    name: 'Tabs',
    category: NATIVE_CATEGORY,
    description:
      'The segmented control: a tab list whose selected segment sits on the accent fill. `stretch` shares the full width, the usual phone layout.',
    exports: ['Tabs', 'TabOption'],
    keywords: ['segmented control', 'tablist', 'switcher', ...RN_KEYWORDS],
    props: [
      {
        name: 'options',
        type: 'TabOption<T>[]',
        description: '`{ value, label, icon? }` per segment.',
      },
      { name: 'value', type: 'T', description: 'The selected segment.' },
      { name: 'onChange', type: '(value: T) => void', description: 'Called on press.' },
      {
        name: 'accessibilityLabel',
        type: 'string',
        description: 'Accessible name of the tab list.',
      },
      {
        name: 'stretch',
        type: 'boolean',
        default: 'false',
        description: 'Segments share the full width.',
      },
    ],
  },
  {
    id: 'slider',
    name: 'Slider',
    category: NATIVE_CATEGORY,
    description:
      'A range slider in pure React Native: a PanResponder over a painted track, no native module. Screen readers get the adjustable role; on the web it answers the arrow, Page and Home/End keys.',
    exports: ['Slider', 'snapValue'],
    keywords: ['range', 'knob', 'volume', 'drag', 'panresponder', 'adjustable', ...RN_KEYWORDS],
    props: [
      {
        name: 'value',
        type: 'number',
        description: 'Controlled value. Omit it (and pass `defaultValue`) for uncontrolled.',
      },
      { name: 'defaultValue', type: 'number', default: 'min', description: 'Uncontrolled start.' },
      { name: 'min', type: 'number', default: '0', description: 'Lowest value.' },
      { name: 'max', type: 'number', default: '100', description: 'Highest value.' },
      { name: 'step', type: 'number', default: '1', description: 'Snap and key increment.' },
      {
        name: 'onValueChange',
        type: '(value: number) => void',
        description: 'Called with each new value while dragging or stepping.',
      },
      {
        name: 'onSlidingComplete',
        type: '(value: number) => void',
        description: 'Called once when a drag ends.',
      },
      {
        name: 'color',
        type: 'string',
        default: 'primary token',
        description:
          'Fill and knob colour. (No gradients: RN cannot paint one without a native module.)',
      },
      {
        name: 'label',
        type: 'string',
        description: 'Visible label with the value beside it; also the accessible name.',
      },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Locks and dims it.' },
    ],
  },
  {
    id: 'card',
    name: 'Card',
    category: NATIVE_CATEGORY,
    description:
      'The bordered surface, with header, title and content parts. Each part is a `View` (the title a header-role `Text`) and forwards its props.',
    exports: ['Card', 'CardHeader', 'CardTitle', 'CardContent'],
    keywords: ['panel', 'surface', 'container', ...RN_KEYWORDS],
    props: [
      {
        name: '...props',
        type: 'ViewProps | TextProps',
        description: 'Each part forwards its props and `style`, accessibility props included.',
      },
    ],
  },
  {
    id: 'accordion',
    name: 'Accordion',
    category: NATIVE_CATEGORY,
    description:
      'A titled disclosure section with an optional count and trailing action. Uncontrolled; the trigger reports `expanded`, and the body animates with LayoutAnimation on device.',
    exports: ['Accordion'],
    keywords: ['disclosure', 'expand', 'section', 'collapse', ...RN_KEYWORDS],
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
    id: 'theme-provider',
    name: 'ThemeProvider',
    category: NATIVE_CATEGORY,
    description:
      'Light and dark from the @bilo-io/ui tokens. Follows the device (`useColorScheme`) unless `scheme` pins one; `useTheme` hands any component the colours and radii.',
    exports: ['ThemeProvider', 'useTheme', 'createTheme'],
    keywords: ['theme', 'dark mode', 'tokens', 'colors', 'usecolorscheme', ...RN_KEYWORDS],
    props: [
      {
        name: 'scheme',
        type: "'light' | 'dark'",
        default: 'device',
        description: 'Pin the scheme, e.g. to an in-app theme switch.',
      },
      {
        name: 'brandFontFamily',
        type: 'string',
        description:
          'The family the app registered Damion under. Native only; the web uses brand.css.',
      },
      { name: 'children', type: 'ReactNode', description: 'The themed tree.' },
    ],
  },
  {
    id: 'wordmark',
    name: 'Wordmark',
    category: NATIVE_CATEGORY,
    description:
      'The wordmark and crescent. RN cannot clip a gradient to text, so the rainbow tone steps the ramp letter by letter; the crescent is the website mark, pre-inverted for dark.',
    exports: ['Wordmark', 'MidniteLogo'],
    keywords: ['brand', 'logo', 'crescent', 'damion', 'rainbow', ...RN_KEYWORDS],
    props: [
      {
        name: 'product',
        type: 'string',
        description: 'The second half: "UI", "Mobile UI". Omit for "Midnite" alone.',
      },
      {
        name: 'tone',
        type: "'rainbow' | 'inherit'",
        default: "'rainbow'",
        description: 'Ramp and glow, or one colour (`color`, else foreground).',
      },
      {
        name: 'size',
        type: 'number',
        default: '16',
        description:
          'Wordmark: the qualifier size in dp ("Midnite" is 1.35× it). MidniteLogo: the crescent.',
      },
      {
        name: 'textSize',
        type: 'number',
        default: '16',
        description: 'MidniteLogo only: the wordmark size beside the crescent.',
      },
      {
        name: 'markOnly',
        type: 'boolean',
        default: 'false',
        description: 'MidniteLogo only: the crescent without the wordmark.',
      },
    ],
  },
];

export function catalogFor(mode: Mode): {
  components: readonly ComponentDoc[];
  categories: readonly Category[];
} {
  return mode === 'mobile'
    ? { components: NATIVE_COMPONENTS, categories: NATIVE_CATEGORIES }
    : { components: COMPONENTS, categories: CATEGORIES };
}

export function findComponent(id: string, mode: Mode = 'web'): ComponentDoc | undefined {
  return catalogFor(mode).components.find((c) => c.id === id);
}
