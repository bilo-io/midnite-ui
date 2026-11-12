# @bilo-io/ui-native

The React Native companion to [`@bilo-io/ui`](../ui): the midnite primitives
drawn with `View`, `Text`, `Pressable` and `TextInput` and styled with plain
`StyleSheet`, on the **same token values** as the web library. Colours, radii
and the brand ramp are read from `@bilo-io/ui/tokens` at runtime, never copied,
so a token change reaches iOS, Android and the web together.

No native modules, no Tailwind, no NativeWind: it runs in Expo Go, a bare React
Native app, and on the web through react-native-web (which is how the
[showcase's Mobile mode](https://midnite-design.vercel.app/showcase/#/mobile)
renders it).

## Install

```bash
pnpm add @bilo-io/ui-native
```

Peers: `react` 19 and `react-native` 0.79 or later. `@bilo-io/ui` comes along as
a dependency for its tokens only; nothing that touches the DOM is imported.
Like `@bilo-io/ui`, it is published to GitHub Packages (see the
[root README](../../README.md#install) for the `.npmrc`).

## Usage

```tsx
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ThemeProvider,
} from '@bilo-io/ui-native';

export default function App() {
  return (
    <ThemeProvider>
      <Card>
        <CardHeader>
          <CardTitle>Deploy</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onPress={deploy}>Ship it</Button>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
}
```

`ThemeProvider` follows the device's light/dark setting (`useColorScheme`).
Pin it with `scheme="dark"`, and read the resolved palette anywhere with
`useTheme()`:

```tsx
const { colors, alpha, radius, scheme } = useTheme();
<View
  style={{
    backgroundColor: colors.card,
    borderColor: alpha('primary', 0.4),
    borderRadius: radius.lg,
  }}
/>;
```

`createTheme(scheme)` builds the same object outside React (e.g. for a
navigation theme).

### The brand font

`Wordmark` uses the Damion script face. On the web it defaults to
`'Damion', cursive`; on iOS and Android, an unregistered font family is an
error, so it falls back to the platform face until your app loads Damion and
names it:

```tsx
import { useFonts } from 'expo-font';

const [loaded] = useFonts({ Damion: require('./assets/Damion-Regular.ttf') });

<ThemeProvider brandFontFamily="Damion">…</ThemeProvider>;
```

## Components

| Component                                        | Notes                                                                                                                                                                      |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Button`                                         | `variant`: default, secondary, outline, ghost, destructive. `size`: default, sm, lg, icon. `loading` shows a spinner and reports busy.                                     |
| `Input`, `Textarea`                              | Labelled `TextInput`s with the web focus ring and disabled state.                                                                                                          |
| `Switch`                                         | Controlled; the switch role and an animated thumb drawn like the web Switch, not the platform control.                                                                     |
| `Tabs`                                           | A segmented control (tablist/tab roles); `stretch` fills the row.                                                                                                          |
| `Slider`                                         | A `PanResponder` over a painted track. Adjustable role with increment/decrement actions; arrow, Page and Home/End keys on the web. `snapValue` and `valueAt` are exported. |
| `Card`, `CardHeader`, `CardTitle`, `CardContent` | The web Card's surface, border and spacing.                                                                                                                                |
| `Accordion`                                      | One collapsible section (stack several), with a count badge, icon and trailing action; `LayoutAnimation` on toggle; `card` or `bare`.                                      |
| `Wordmark`, `MidniteLogo`                        | The brand mark: per-letter colours along the brand ramp with the glow.                                                                                                     |
| `ThemeProvider`, `useTheme`, `createTheme`       | The palette, `alpha()`, radii and brand ramp for a scheme.                                                                                                                 |

## What stays web-only, and why

| `@bilo-io/ui` piece                                                    | Why there is no native version                                                                |
| ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `DynamicBackground`, `NeuroCloudBackground`                            | Canvas 2D animation loops; React Native has no canvas without a native module (Skia).         |
| `Select`, `StyledSelect`                                               | A portal-positioned listbox and react-select; native apps use a sheet or the platform picker. |
| `AreaChart`, `SystemChart`, `RadialGauge`, `MetricDial`, `ContextRing` | Inline SVG; would need `react-native-svg`, a native module.                                   |
| `GradientGlow`                                                         | CSS gradients and blur filters; needs `expo-linear-gradient` or Skia.                         |
| `ReadingLayout`, `Prose`, `TableOfContents`                            | Typography for long-form HTML (scroll-spy, `prose` CSS).                                      |
| `RailShell`                                                            | A desktop navigation rail; on a phone that is a tab bar from your navigator.                  |
| `PasscodePad`, `ThemeToggle`, `Collapse`                               | DOM focus handling, menus and CSS height transitions; candidates for a later port.            |
| `AgentIcon`, brand icons, `GithubIcon`                                 | SVG marks (see `react-native-svg` above).                                                     |

The `Wordmark` differs from the web one: React Native cannot clip a gradient to
text, so each letter takes one colour along the ramp. `MidniteLogo` ships a
pre-inverted PNG for dark mode instead of a CSS filter.

## Development

```bash
moon run ui-native:build      # Vite library build (+ types)
moon run ui-native:test       # Vitest + Testing Library on react-native-web (jsdom)
moon run ui-native:typecheck
moon run ui-native:lint
```

Tests run the components through react-native-web, so they check the roles,
states and token colours a screen reader and a browser see. `src/boundary.test.ts`
keeps the shipped source native-safe: no DOM, CSS, `react-dom` or
`react-native-web` imports, and no hard-coded HSL triplets.
