import { Prose, proseComponents } from '@bilo-io/ui';

const {
  h2: H2,
  h3: H3,
  p: P,
  a: A,
  ul: Ul,
  li: Li,
  blockquote: Blockquote,
  code: Code,
  pre: Pre,
} = proseComponents;

export default function Elements() {
  return (
    <Prose>
      <H2>Reading typography</H2>
      <P>
        One element map for MDX and react-markdown alike. Inline code like <Code>cn()</Code> reads
        as a chip, and <A href="https://github.com/bilo-io/midnite-ui">links</A> keep the accent.
      </P>
      <H3>Lists</H3>
      <Ul>
        <Li>Items share the body copy&apos;s leading.</Li>
        <Li>Headings derive their own anchor ids.</Li>
      </Ul>
      <Blockquote>A block quote recedes from the main argument.</Blockquote>
      <Pre>
        <Code>{'moon run ui:test\nmoon run showcase:dev'}</Code>
      </Pre>
    </Prose>
  );
}
