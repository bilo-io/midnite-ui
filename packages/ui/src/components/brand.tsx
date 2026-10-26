import { cn } from '../lib/cn';

export type WordmarkTone =
  /** The brand ramp clipped to "Midnite", with the letterform glow behind it. */
  | 'rainbow'
  /** No fill or glow of its own; inherits whatever the parent paints. */
  | 'inherit';

export type WordmarkProps = {
  /** The second half: "Midnite **UI**", "Midnite **Studio**". Omit for "Midnite" alone. */
  product?: string;
  tone?: WordmarkTone;
  className?: string;
};

/**
 * "Midnite UI" — the brand face for the name, the UI face for the qualifier,
 * exactly as the midnite website and launcher set it. Everything is
 * `em`-relative, so one font size on the parent scales both halves. Needs
 * `@bilo-io/ui/brand.css`.
 */
export function Wordmark({ product, tone = 'rainbow', className }: WordmarkProps) {
  return (
    <span className={cn('mui-wordmark', className)}>
      <span
        className={cn(
          'mui-wordmark-brand',
          tone === 'rainbow' && 'mui-rainbow-text mui-brand-glow',
        )}
      >
        Midnite
      </span>
      {/* A real space, so the mark's text content reads "Midnite UI", not "MidniteUI". */}
      {product ? (
        <>
          {' '}
          <span className="mui-wordmark-product">{product}</span>
        </>
      ) : null}
    </span>
  );
}

export type MidniteLogoProps = {
  /** Pixel size of the crescent. */
  size?: number;
  /** Hides the wordmark, leaving the crescent alone. */
  markOnly?: boolean;
  product?: string;
  className?: string;
};

/**
 * The midnite crescent beside the wordmark — the website's nav logo. The mark
 * inverts under `.dark`, so it follows the theme. Needs
 * `@bilo-io/ui/brand.css`.
 */
export function MidniteLogo({ size = 28, markOnly = false, product, className }: MidniteLogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span aria-hidden className="mui-logo-mark" style={{ width: size, height: size }} />
      {markOnly ? null : <Wordmark product={product} />}
    </span>
  );
}
