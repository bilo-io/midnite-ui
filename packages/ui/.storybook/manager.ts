import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming/create';

// The sidebar's title wears the midnite wordmark: "Midnite" in the brand face
// with the rainbow ramp, "UI" in the UI face. The face is loaded by
// manager-head.html from the brand static dir.
addons.setConfig({
  theme: create({
    base: 'dark',
    brandTitle:
      '<span class="mui-sb-wordmark"><span class="mui-sb-brand">Midnite</span> <span class="mui-sb-product">UI</span></span>',
    brandUrl: 'https://github.com/bilo-io/midnite-ui',
    brandTarget: '_self',
  }),
});
