import type { Example } from '../examples';
import { hrefFor, inMode, type Mode } from '../router';

/** Scrolls a page's example section into view by its slug (`sizes`). */
export function scrollToExample(slug: string) {
  document.getElementById(`example-${slug}`)?.scrollIntoView({ behavior: 'smooth' });
}

/** The "On this page" links to each example of a component. */
export function ExampleToc({
  docId,
  examples,
  mode,
}: {
  docId: string;
  examples: readonly Example[];
  mode: Mode;
}) {
  return (
    <>
      {examples.map((ex) => (
        <a
          key={ex.key}
          href={hrefFor(
            inMode({ page: 'component', id: docId, example: ex.key.split('/')[1] }, mode),
          )}
          className="block text-muted-foreground hover:text-foreground"
        >
          {ex.title}
        </a>
      ))}
    </>
  );
}
