import { useId, type SVGProps } from 'react';

import { cn } from '../lib/cn';
import { BROWSER_ICON_DATA, type BrowserIconData } from './browser-icons.generated';

export type BrowserId = keyof typeof BROWSER_ICON_DATA;

/** Every browser with a logo, in alphabetical order. */
export const BROWSER_IDS = Object.keys(BROWSER_ICON_DATA) as BrowserId[];

/** The display name of a browser ("Samsung Internet" for `samsung`). */
export const browserName = (id: BrowserId): string => BROWSER_ICON_DATA[id].name;

/** A representative brand colour for a browser. */
export const browserColor = (id: BrowserId): string => BROWSER_ICON_DATA[id].color;

/** The browser's official download page. */
export const browserDownloadUrl = (id: BrowserId): string => BROWSER_ICON_DATA[id].url;

export type BrowserIconProps = Omit<SVGProps<SVGSVGElement>, 'children'> & {
  browser: BrowserId;
  /** Accessible name. Omitted, the icon is decorative (`aria-hidden`). */
  title?: string;
};

/**
 * A browser's logo — Chrome, Firefox, Safari, Edge, Opera, Brave, Samsung
 * Internet, Vivaldi, Internet Explorer — rendered from the same SVGs the sites
 * publish at `/browsers/` (MIT, alrra/browser-logos). The markup is generated
 * from `assets/browsers/` by `scripts/browser-icons.mjs`. Sized `h-4 w-4` by
 * default; override via `className`.
 */
export function BrowserIcon({ browser, title, className, ...props }: BrowserIconProps) {
  const data: BrowserIconData = BROWSER_ICON_DATA[browser];
  // Gradient and filter ids are document-global inside inline svg; scope them so
  // two logos of one browser on a page never resolve against each other.
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');

  return (
    <svg
      viewBox={data.viewBox}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable={false}
      data-browser={browser}
      className={cn('h-4 w-4 shrink-0', className)}
      {...props}
      dangerouslySetInnerHTML={{ __html: data.art.replaceAll('__UID__', uid) }}
    />
  );
}
